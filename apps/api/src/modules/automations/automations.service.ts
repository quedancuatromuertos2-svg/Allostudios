import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { PrismaService } from "../../common/prisma/prisma.service"
import { TwilioService } from "../voice/twilio.service"
import { addHours, subHours, format } from "date-fns"
import { es } from "date-fns/locale"

@Injectable()
export class AutomationsService {
  private readonly logger = new Logger(AutomationsService.name)

  constructor(
    private prisma: PrismaService,
    private twilio: TwilioService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendAppointmentReminders() {
    const in24Hours = addHours(new Date(), 24)
    const in23Hours = addHours(new Date(), 23)

    const appointments = await this.prisma.appointment.findMany({
      where: {
        status: "CONFIRMED",
        reminderSent: false,
        scheduledAt: {
          gte: in23Hours,
          lte: in24Hours,
        },
      },
      include: {
        business: true,
        service: true,
        staff: true,
      },
    })

    for (const appointment of appointments) {
      try {
        await this.sendAppointmentReminder(appointment)
        await this.prisma.appointment.update({
          where: { id: appointment.id },
          data: { reminderSent: true },
        })
      } catch (error) {
        this.logger.error(`Failed to send reminder for ${appointment.id}: ${error.message}`)
      }
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleMissedCallFollowUps() {
    const thirtyMinutesAgo = subHours(new Date(), 0.5)
    const oneHourAgo = subHours(new Date(), 1)

    const missedCalls = await this.prisma.call.findMany({
      where: {
        status: "MISSED",
        createdAt: {
          gte: oneHourAgo,
          lte: thirtyMinutesAgo,
        },
      },
      include: { business: true },
    })

    for (const call of missedCalls) {
      if (!call.callerNumber) continue

      try {
        const message = `Hola, has llamado a ${call.business.name} y no pudimos atenderte. ¿En qué podemos ayudarte? Responde a este mensaje o llámanos de nuevo.`

        await this.twilio.sendWhatsApp({
          to: call.callerNumber,
          body: message,
        })
      } catch (error) {
        this.logger.error(`Failed to send missed call followup: ${error.message}`)
      }
    }
  }

  async sendAppointmentConfirmation(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { business: true, service: true, staff: true },
    })

    if (!appointment || appointment.confirmationSent) return

    const dateStr = format(appointment.scheduledAt, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es })
    const serviceStr = appointment.service?.name || "su cita"
    const staffStr = appointment.staff ? ` con ${appointment.staff.name}` : ""

    const message = `✅ *Cita confirmada en ${appointment.business.name}*\n\n📅 ${dateStr}\n💈 ${serviceStr}${staffStr}\n\nSi necesitas cancelar o modificar tu cita, llámanos directamente. ¡Hasta pronto!`

    if (appointment.customerPhone) {
      try {
        await this.twilio.sendWhatsApp({
          to: appointment.customerPhone,
          body: message,
        })

        await this.prisma.appointment.update({
          where: { id: appointmentId },
          data: { confirmationSent: true },
        })
      } catch (error) {
        this.logger.error(`Failed to send confirmation: ${error.message}`)
      }
    }
  }

  private async sendAppointmentReminder(appointment: any) {
    const dateStr = format(appointment.scheduledAt, "HH:mm", { locale: es })
    const serviceStr = appointment.service?.name || "su cita"

    const message = `⏰ *Recordatorio de cita - ${appointment.business.name}*\n\nTienes ${serviceStr} mañana a las ${dateStr}.\n\nSi no puedes asistir, por favor cancela con antelación. ¡Te esperamos!`

    await this.twilio.sendWhatsApp({
      to: appointment.customerPhone,
      body: message,
    })
  }

  async sendPostCallSummary(callId: string, ownerEmail: string) {
    const call = await this.prisma.call.findUnique({
      where: { id: callId },
      include: { business: true, appointment: true, lead: true },
    })

    if (!call?.aiSummary) return

    this.logger.log(`Post-call summary for ${callId} ready for ${ownerEmail}`)
    // In production: send via SendGrid/Resend
  }
}
