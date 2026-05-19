import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  RawBodyRequest,
  Req,
  HttpCode,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { Request } from "express"
import { BillingService } from "./billing.service"

@ApiTags("Billing")
@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post("checkout/:businessId")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create Stripe checkout session" })
  createCheckout(
    @Param("businessId") businessId: string,
    @Body() body: { priceId: string; successUrl: string; cancelUrl: string },
  ) {
    return this.billingService.createCheckoutSession({
      businessId,
      ...body,
    })
  }

  @Post("portal/:businessId")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create Stripe billing portal session" })
  createPortal(
    @Param("businessId") businessId: string,
    @Body("returnUrl") returnUrl: string,
  ) {
    return this.billingService.createPortalSession(businessId, returnUrl)
  }

  @Get("subscription/:businessId")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get subscription details" })
  getSubscription(@Param("businessId") businessId: string) {
    return this.billingService.getSubscription(businessId)
  }

  @Post("webhook")
  @HttpCode(200)
  @ApiOperation({ summary: "Stripe webhook endpoint" })
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers("stripe-signature") signature: string,
  ) {
    await this.billingService.handleWebhook(req.rawBody!, signature)
    return { received: true }
  }
}
