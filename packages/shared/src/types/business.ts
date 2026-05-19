export type BusinessNiche =
  | "BARBER_SHOP"
  | "HAIR_SALON"
  | "RESTAURANT"
  | "DENTAL_CLINIC"
  | "REAL_ESTATE"
  | "GYM"
  | "CAR_WORKSHOP"
  | "BEAUTY_CENTER"
  | "HOTEL"
  | "OTHER"

export const NICHE_LABELS: Record<BusinessNiche, string> = {
  BARBER_SHOP: "Barbería",
  HAIR_SALON: "Salón de Belleza",
  RESTAURANT: "Restaurante",
  DENTAL_CLINIC: "Clínica Dental",
  REAL_ESTATE: "Inmobiliaria",
  GYM: "Gimnasio",
  CAR_WORKSHOP: "Taller de Coches",
  BEAUTY_CENTER: "Centro de Estética",
  HOTEL: "Hotel",
  OTHER: "Otro",
}

export interface Business {
  id: string
  name: string
  slug: string
  niche: BusinessNiche
  phone?: string
  email?: string
  website?: string
  address?: string
  city?: string
  country: string
  timezone: string
  logoUrl?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  businessId: string
  name: string
  description?: string
  duration: number
  price: number
  currency: string
  color?: string
  isActive: boolean
}

export interface Staff {
  id: string
  businessId: string
  name: string
  email?: string
  phone?: string
  role?: string
  avatarUrl?: string
  bio?: string
  isActive: boolean
}
