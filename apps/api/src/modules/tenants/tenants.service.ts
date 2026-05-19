import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common"
import { PrismaService } from "../../common/prisma/prisma.service"
import { TemplatesService } from "../templates/templates.service"
import { CreateBusinessDto } from "./dto/create-business.dto"

@Injectable()
export class TenantsService {
  constructor(
    private prisma: PrismaService,
    private templates: TemplatesService,
  ) {}

  async create(userId: string, dto: CreateBusinessDto) {
    const slug = this.generateSlug(dto.name)

    const existing = await this.prisma.business.findUnique({ where: { slug } })
    if (existing) throw new ConflictException("Business slug already exists")

    // Create business
    const business = await this.prisma.business.create({
      data: {
        name: dto.name,
        slug,
        niche: dto.niche as any,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        city: dto.city,
        timezone: dto.timezone || "Europe/Madrid",
        users: {
          create: { userId, role: "OWNER" },
        },
      },
    })

    // Create default AI config from template
    const aiConfigData = this.templates.buildInitialAIConfig(dto.niche, dto.name)
    if (aiConfigData) {
      await this.prisma.aIConfig.create({
        data: {
          businessId: business.id,
          ...aiConfigData,
          faqs: aiConfigData.faqs as any,
        },
      })
    }

    // Create default services from template
    const template = this.templates.getTemplate(dto.niche)
    if (template?.defaultServices.length) {
      await this.prisma.service.createMany({
        data: template.defaultServices.map((s) => ({
          businessId: business.id,
          name: s.name,
          duration: s.duration,
          price: s.price,
          currency: "EUR",
        })),
      })
    }

    // Create default business schedule (Mon-Fri 9-18, Sat 10-14)
    const defaultSchedule = [
      { dayOfWeek: "MONDAY", startTime: "09:00", endTime: "18:00", isOpen: true },
      { dayOfWeek: "TUESDAY", startTime: "09:00", endTime: "18:00", isOpen: true },
      { dayOfWeek: "WEDNESDAY", startTime: "09:00", endTime: "18:00", isOpen: true },
      { dayOfWeek: "THURSDAY", startTime: "09:00", endTime: "18:00", isOpen: true },
      { dayOfWeek: "FRIDAY", startTime: "09:00", endTime: "18:00", isOpen: true },
      { dayOfWeek: "SATURDAY", startTime: "10:00", endTime: "14:00", isOpen: true },
      { dayOfWeek: "SUNDAY", startTime: "09:00", endTime: "14:00", isOpen: false },
    ]

    await this.prisma.businessSchedule.createMany({
      data: defaultSchedule.map((s) => ({
        businessId: business.id,
        ...s,
        dayOfWeek: s.dayOfWeek as any,
      })),
    })

    // Create trial subscription
    await this.prisma.subscription.create({
      data: {
        businessId: business.id,
        plan: "STARTER",
        status: "TRIALING",
        callsLimit: 50,
        minutesLimit: 150,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    })

    return business
  }

  async findAllForUser(userId: string) {
    return this.prisma.businessUser.findMany({
      where: { userId },
      include: {
        business: {
          include: {
            subscription: true,
            _count: {
              select: { calls: true, appointments: true },
            },
          },
        },
      },
    })
  }

  async findOne(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        aiConfig: true,
        subscription: true,
        phoneNumbers: true,
        _count: {
          select: { calls: true, appointments: true, leads: true },
        },
      },
    })
    if (!business) throw new NotFoundException("Business not found")
    return business
  }

  async update(businessId: string, data: Partial<CreateBusinessDto>) {
    return this.prisma.business.update({
      where: { id: businessId },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        website: data.website,
        description: data.description,
        timezone: data.timezone,
      },
    })
  }

  async updateAIConfig(businessId: string, data: any) {
    return this.prisma.aIConfig.upsert({
      where: { businessId },
      update: data,
      create: { businessId, ...data },
    })
  }

  async getServices(businessId: string) {
    return this.prisma.service.findMany({
      where: { businessId, isActive: true },
      orderBy: { name: "asc" },
    })
  }

  async getStaff(businessId: string) {
    return this.prisma.staff.findMany({
      where: { businessId, isActive: true },
      include: { services: { include: { service: true } } },
    })
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50)
  }
}
