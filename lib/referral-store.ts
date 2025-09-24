import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mockReferrals, type Referral } from "./mock-data"

interface ReferralStats {
  totalInvited: number
  activeUsers: number
  totalEarnings: number
  thisMonthEarnings: number
  conversionRate: number
}

interface ReferralState {
  referrals: Referral[]
  referralCode: string
  stats: ReferralStats
  generateReferralLink: () => string
  copyReferralLink: () => Promise<boolean>
  getReferralStats: () => ReferralStats
  addReferral: (email: string, name: string) => void
}

export const useReferralStore = create<ReferralState>()(
  persist(
    (set, get) => ({
      referrals: mockReferrals,
      referralCode: "BETARENA_USER123",
      stats: {
        totalInvited: mockReferrals.length,
        activeUsers: mockReferrals.filter((r) => r.isActive).length,
        totalEarnings: mockReferrals.reduce((sum, r) => sum + r.totalSpent * 0.1, 0), // 10% commission
        thisMonthEarnings: 45.5, // Mock this month earnings
        conversionRate: (mockReferrals.filter((r) => r.isActive).length / mockReferrals.length) * 100,
      },

      generateReferralLink: () => {
        const code = get().referralCode
        return `${window.location.origin}/auth/register?ref=${code}`
      },

      copyReferralLink: async () => {
        try {
          const link = get().generateReferralLink()
          await navigator.clipboard.writeText(link)
          return true
        } catch (error) {
          return false
        }
      },

      getReferralStats: () => {
        const referrals = get().referrals
        return {
          totalInvited: referrals.length,
          activeUsers: referrals.filter((r) => r.isActive).length,
          totalEarnings: referrals.reduce((sum, r) => sum + r.totalSpent * 0.1, 0),
          thisMonthEarnings: 45.5,
          conversionRate:
            referrals.length > 0 ? (referrals.filter((r) => r.isActive).length / referrals.length) * 100 : 0,
        }
      },

      addReferral: (email: string, name: string) => {
        const newReferral: Referral = {
          id: Date.now().toString(),
          email,
          name,
          registrationDate: new Date().toISOString(),
          isActive: false,
          totalTournaments: 0,
          totalSpent: 0,
        }

        set((state) => ({
          referrals: [newReferral, ...state.referrals],
          stats: state.getReferralStats(),
        }))
      },
    }),
    {
      name: "referral-storage",
    },
  ),
)
