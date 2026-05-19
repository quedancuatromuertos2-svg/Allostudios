export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED"
  | "NO_SHOW"
  | "RESCHEDULED"

export interface Appointment {
  id: string
  businessId: string
  serviceId?: string
  staffId?: string
  callId?: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  notes?: string
  status: AppointmentStatus
  scheduledAt: string
  endsAt: string
  createdAt: string
  updatedAt: string
  service?: { name: string; duration: number; price: number }
  staff?: { name: string; avatarUrl?: string }
}
