import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../common/prisma/prisma.service"
import { subDays, format, eachDayOfInterval, parseISO } from "date-fns"

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(businessId: string) {
    const today = new Date()
    const thirtyDaysAgo = subDays(today, 30)
    const sixtyDaysAgo = subDays(today, 60)

    const [current, previous, upcomingAppointments, hotLeads] = await Promise.all([
      this.getMetrics(businessId, thirtyDaysAgo, today),
      this.getMetrics(businessId, sixtyDaysAgo, thirtyDaysAgo),
      this.prisma.appointment.count({
        where: {
          businessId,
          status: { in: ["CONFIRMED", "PENDING"] },
          scheduledAt: { gte: today },
        },
      }),
      this.prisma.lead.count({
        where: { businessId, score: "HOT", status: { not: "CONVERTED" } },
      }),
    ])

    const pct = (curr: number, prev: number) =>
      prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100)

    return {
      totalCalls: current.totalCalls,
      answeredCalls: current.answeredCalls,
      missedCalls: current.missedCalls,
      appointmentsBooked: current.appointments,
      leadsGenerated: current.leads,
      avgCallDuration: current.avgDuration,
      conversionRate: current.totalCalls > 0
        ? Math.round((current.appointments / current.totalCalls) * 100)
        : 0,
      upcomingAppointments,
      hotLeads,
      callsChangePercent: pct(current.totalCalls, previous.totalCalls),
      appointmentsChangePercent: pct(current.appointments, previous.appointments),
      leadsChangePercent: pct(current.leads, previous.leads),
    }
  }

  async getCallVolume(businessId: string, days = 30) {
    const endDate = new Date()
    const startDate = subDays(endDate, days)

    const analytics = await this.prisma.callAnalytics.findMany({
      where: {
        businessId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: "asc" },
    })

    // Fill missing days with zeros
    const allDays = eachDayOfInterval({ start: startDate, end: endDate })
    const dataMap = new Map(
      analytics.map((a) => [format(a.date, "yyyy-MM-dd"), a]),
    )

    return allDays.map((day) => {
      const key = format(day, "yyyy-MM-dd")
      const data = dataMap.get(key)
      return {
        date: key,
        total: data?.totalCalls ?? 0,
        answered: data?.answeredCalls ?? 0,
        missed: data?.missedCalls ?? 0,
        appointments: data?.appointmentsBooked ?? 0,
      }
    })
  }

  async getHourlyDistribution(businessId: string, days = 30) {
    const since = subDays(new Date(), days)

    const calls = await this.prisma.call.findMany({
      where: {
        businessId,
        startedAt: { gte: since },
        status: { in: ["COMPLETED", "TRANSFERRED"] },
      },
      select: { startedAt: true },
    })

    const hourCounts = new Array(24).fill(0)
    calls.forEach((call) => {
      if (call.startedAt) {
        hourCounts[call.startedAt.getHours()]++
      }
    })

    return hourCounts.map((count, hour) => ({ hour, calls: count }))
  }

  async getRecentCalls(businessId: string, limit = 10) {
    return this.prisma.call.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        callerNumber: true,
        callerName: true,
        status: true,
        direction: true,
        duration: true,
        aiSummary: true,
        sentiment: true,
        startedAt: true,
        createdAt: true,
      },
    })
  }

  private async getMetrics(businessId: string, from: Date, to: Date) {
    const analytics = await this.prisma.callAnalytics.findMany({
      where: { businessId, date: { gte: from, lte: to } },
    })

    const totalCalls = analytics.reduce((sum, a) => sum + a.totalCalls, 0)
    const answeredCalls = analytics.reduce((sum, a) => sum + a.answeredCalls, 0)
    const missedCalls = analytics.reduce((sum, a) => sum + a.missedCalls, 0)
    const appointments = analytics.reduce((sum, a) => sum + a.appointmentsBooked, 0)
    const leads = analytics.reduce((sum, a) => sum + a.leadsGenerated, 0)
    const totalDuration = analytics.reduce((sum, a) => sum + a.totalDuration, 0)
    const avgDuration = answeredCalls > 0 ? Math.round(totalDuration / answeredCalls) : 0

    return { totalCalls, answeredCalls, missedCalls, appointments, leads, avgDuration }
  }
}
