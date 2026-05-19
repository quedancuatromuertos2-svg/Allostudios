import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Business {
  id: string
  name: string
  niche: string
  phone?: string | null
  address?: string | null
  vapi_assistant_id?: string | null
}

interface BusinessStore {
  currentBusinessId: string | null
  businesses: Business[]
  setCurrentBusiness: (business: Business | string) => void
  setBusinesses: (businesses: Business[]) => void
  getCurrentBusiness: () => Business | null
}

export const useBusinessStore = create<BusinessStore>()(
  persist(
    (set, get) => ({
      currentBusinessId: null,
      businesses: [],
      setCurrentBusiness: (business) => {
        if (typeof business === "string") {
          set({ currentBusinessId: business })
        } else {
          const businesses = get().businesses
          const existing = businesses.find((b) => b.id === business.id)
          set({
            currentBusinessId: business.id,
            businesses: existing
              ? businesses.map((b) => (b.id === business.id ? business : b))
              : [...businesses, business],
          })
        }
      },
      setBusinesses: (businesses) => set({ businesses }),
      getCurrentBusiness: () => {
        const { currentBusinessId, businesses } = get()
        return businesses.find((b) => b.id === currentBusinessId) ?? null
      },
    }),
    { name: "voiceflow-business" },
  ),
)
