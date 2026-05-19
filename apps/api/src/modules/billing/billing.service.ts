import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "../../common/prisma/prisma.service"
import Stripe from "stripe"

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name)
  private stripe: Stripe

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(config.get("STRIPE_SECRET_KEY", ""), {
      apiVersion: "2024-11-20.acacia",
    })
  }

  async createCheckoutSession(params: {
    businessId: string
    priceId: string
    successUrl: string
    cancelUrl: string
  }) {
    const business = await this.prisma.business.findUnique({
      where: { id: params.businessId },
      include: { subscription: true },
    })

    if (!business) throw new NotFoundException("Business not found")

    let customerId = business.subscription?.stripeCustomerId

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: business.email || undefined,
        name: business.name,
        metadata: { businessId: business.id },
      })
      customerId = customer.id
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: params.priceId, quantity: 1 }],
      mode: "subscription",
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: { businessId: business.id },
      subscription_data: {
        trial_period_days: 14,
        metadata: { businessId: business.id },
      },
    })

    return { url: session.url, sessionId: session.id }
  }

  async createPortalSession(businessId: string, returnUrl: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { businessId },
    })

    if (!subscription?.stripeCustomerId) {
      throw new NotFoundException("No billing account found")
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: returnUrl,
    })

    return { url: session.url }
  }

  async handleWebhook(payload: Buffer, signature: string): Promise<void> {
    const webhookSecret = this.config.get("STRIPE_WEBHOOK_SECRET", "")
    let event: Stripe.Event

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`)
      throw err
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.deleted":
        await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
        break

      case "invoice.payment_succeeded":
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case "invoice.payment_failed":
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
    }
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const businessId = subscription.metadata?.businessId
    if (!businessId) return

    const planMap: Record<string, string> = {
      [this.config.get("STRIPE_STARTER_PRICE_ID", "")]: "STARTER",
      [this.config.get("STRIPE_PROFESSIONAL_PRICE_ID", "")]: "PROFESSIONAL",
      [this.config.get("STRIPE_ENTERPRISE_PRICE_ID", "")]: "ENTERPRISE",
    }

    const priceId = subscription.items.data[0]?.price.id
    const plan = planMap[priceId] || "STARTER"

    const limitsMap: Record<string, { calls: number; minutes: number }> = {
      STARTER: { calls: 200, minutes: 600 },
      PROFESSIONAL: { calls: 1000, minutes: 3000 },
      ENTERPRISE: { calls: 999999, minutes: 999999 },
    }

    const limits = limitsMap[plan]

    await this.prisma.subscription.upsert({
      where: { businessId },
      update: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        plan: plan as any,
        status: this.mapStripeStatus(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        callsLimit: limits.calls,
        minutesLimit: limits.minutes,
      },
      create: {
        businessId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        plan: plan as any,
        status: this.mapStripeStatus(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        callsLimit: limits.calls,
        minutesLimit: limits.minutes,
      },
    })
  }

  private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    const businessId = subscription.metadata?.businessId
    if (!businessId) return

    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: "CANCELED" },
    })
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string
    if (!subscriptionId) return

    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscriptionId },
      data: { status: "ACTIVE", callsUsed: 0, minutesUsed: 0 },
    })
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string
    if (!subscriptionId) return

    await this.prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscriptionId },
      data: { status: "PAST_DUE" },
    })
  }

  private mapStripeStatus(status: string): string {
    const map: Record<string, string> = {
      trialing: "TRIALING",
      active: "ACTIVE",
      past_due: "PAST_DUE",
      canceled: "CANCELED",
      incomplete: "INCOMPLETE",
    }
    return map[status] || "ACTIVE"
  }

  async getSubscription(businessId: string) {
    return this.prisma.subscription.findUnique({ where: { businessId } })
  }
}
