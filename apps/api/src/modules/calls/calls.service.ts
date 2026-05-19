import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../../common/prisma/prisma.service"

@Injectable()
export class CallsService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, params: {
    status?: string
    page?: number
    limit?: number
  }) {
    const { status, page = 1, limit = 20 } = params
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { businessId }
    if (status) where.status = status

    const [data, total] = await Promise.all([
      this.prisma.call.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.call.count({ where }),
    ])

    return { data, total, page, limit, pages: Math.ceil(total / limit) }
  }

  async findOne(businessId: string, id: string) {
    const call = await this.prisma.call.findFirst({
      where: { id, businessId },
      include: { callEvents: true, appointment: true, lead: true },
    })
    if (!call) throw new NotFoundException("Call not found")
    return call
  }
}
