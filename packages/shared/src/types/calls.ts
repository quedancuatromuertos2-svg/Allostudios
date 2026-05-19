export type CallStatus =
  | "RINGING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "MISSED"
  | "FAILED"
  | "TRANSFERRED"

export type CallDirection = "INBOUND" | "OUTBOUND"

export interface Call {
  id: string
  businessId: string
  twilioCallSid?: string
  direction: CallDirection
  status: CallStatus
  callerNumber?: string
  callerName?: string
  duration?: number
  recordingUrl?: string
  transcript?: string
  aiSummary?: string
  sentiment?: string
  transferredTo?: string
  startedAt?: string
  endedAt?: string
  createdAt: string
}
