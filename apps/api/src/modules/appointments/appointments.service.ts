import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common"
import { PrismaService } from "../../common/prisma/prisma.service"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"
import { addMinutes, format, parseISO, isWithinInterval } from "date-fns"

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(businessId: string, dto: CreateAppointmentDto) {
    const service = dto.serviceId
      ? await this.prisma.service.findFirst({
          where: { id: dto.serviceId, businessId },
        })
      : null

    const scheduledAt = parseISO(dto.scheduledAt)
    const duration = service?.duration || 60
    const endsAt = addMinutes(scheduledAt, duration)

    // Check for conflicts
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        businessId,
        staffId: dto.staffId,
        status: { in: ["PENDING", "CONFIRMED"] },
        OR: [
          {
            scheduledAt: { gte: scheduledAt, lt: endsAt },
          },
          {
            endsAt: { gt: scheduledAt, lte: endsAt },
          },
        ],
      },
    })

    if (conflict) {
      throw new ConflictException("Time slot is already booked")
    }

    return this.prisma.appointment.create({
      data: {
        businessId,
        serviceId: dto.serviceId,
        staffId: dto.staffId,
        callId: dto.callId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        customerEmail: dto.customerEmail,
        notes: dto.notes,
        scheduledAt,
        endsAt,
        status: "CONFIRMED",
      },
      include: {
        service: true,
        staff: true,
      },
    })
  }

  async findAll(businessId: string, params: {
    status?: string
    from?: string
    to?: string
    page?: number
    limit?: number
  }) {
    const { status, from, to, page = 1, limit = 20 } = params
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { businessId }
    if (status) where.status = status
    if (from || to) {
      where.scheduledAt = {}
      if (from) (where.scheduledAt as Record<string, unknown>).gte = parseISO(from)
      if (to) (where.scheduledAt as Record<string, unknown>).lte = parseISO(to)
    }

    const [data, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        include: { service: true, staff: true },
        orderBy: { scheduledAt: "asc" },
        skip,
        take: limit,
      }),
      this.prisma.appointment.count({ where }),
    ])

    return { data, total, page, limit, pages: Math.ceil(total / limit) }
  }

  async findOne(businessId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, businessId },
      include: { service: true, staff: true, call: true },
    })
    if (!appointment) throw new NotFoundException("Appointment not found")
    return appointment
  }

  async updateStatus(businessId: string, id: string, status: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, businessId },
    })
    if (!appointment) throw new NotFoundException("Appointment not found")

    return this.prisma.appointment.update({
      where: { id },
      data: { status: status as any },
    })
  }

  async getAvailableSlots(businessId: string, params: {
    serviceId: string
    staffId?: string
    date: string
  }) {
    const service = await this.prisma.service.findFirst({
      where: { id: params.serviceId, businessId },
    })
    if (!service) throw new NotFoundException("Service not found")

    const date = parseISO(params.date)
    const dayOfWeek = format(date, "EEEE").toUpperCase()

    // Get business schedule for that day
    const schedule = await this.prisma.businessSchedule.findFirst({
      where: { businessId, dayOfWeek: dayOfWeek as any, isOpen: true },
    })

    if (!schedule) return []

    // Generate slots
    const slots = this.generateTimeSlots(
      schedule.startTime,
      schedule.endTime,
      service.duration,
    )

    // Get existing appointments
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const booked = await this.prisma.appointment.findMany({
      where: {
        businessId,
        staffId: params.staffId,
        status: { in: ["PENDING", "CONFIRMED"] },
        scheduledAt: { gte: startOfDay, lte: endOfDay },
      },
      select: { scheduledAt: true, endsAt: true },
    })

    // Filter out booked slots
    return slots.filter((slot) => {
      const slotStart = parseISO(`${params.date}T${slot}`)
      const slotEnd = addMinutes(slotStart, service.duration)
      return !booked.some((b) =>
        isWithinInterval(slotStart, { start: b.scheduledAt, end: b.endsAt }) ||
        isWithinInterval(slotEnd, { start: b.scheduledAt, end: b.endsAt }),
      )
    })
  }

  private generateTimeSlots(start: string, end: string, durationMin: number): string[] {
    const slots: string[] = []
    const [startH, startM] = start.split(":").map(Number)
    const [endH, endM] = end.split(":").map(Number)
    let currentMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM

    while (currentMinutes + durationMin <= endMinutes) {
      const h = Math.floor(currentMinutes / 60)
      const m = currentMinutes % 60
      slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`)
      currentMinutes += durationMin
    }

    return slots
  }
}
