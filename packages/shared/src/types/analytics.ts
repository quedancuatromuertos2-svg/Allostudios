export interface DashboardStats {
  totalCalls: number
  answeredCalls: number
  missedCalls: number
  appointmentsBooked: number
  leadsGenerated: number
  avgCallDuration: number
  conversionRate: number
  callsChangePercent: number
  appointmentsChangePercent: number
  leadsChangePercent: number
}

export interface CallVolumeData {
  date: string
  total: number
  answered: number
  missed: number
}

export interface HourlyData {
  hour: number
  calls: number
}
