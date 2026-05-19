export interface AIConfig {
  id: string
  businessId: string
  agentName: string
  systemPrompt: string
  greetingMessage: string
  language: string
  voice: string
  voiceId?: string
  temperature: number
  maxTokens: number
  enableTransfer: boolean
  transferNumber?: string
  enableBooking: boolean
  enableLeadCapture: boolean
  faqs: FAQ[]
  customInstructions?: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface NicheTemplate {
  niche: string
  agentName: string
  systemPrompt: string
  greetingMessage: string
  tone: string[]
  defaultFAQs: FAQ[]
  bookingFlow: string[]
  leadQualificationFlow: string[]
}
