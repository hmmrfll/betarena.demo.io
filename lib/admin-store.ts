import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AdminUser {
  id: string
  username: string
  email: string
  balance: number
  totalDeposits: number
  totalWithdrawals: number
  totalWinnings: number
  referralCount: number
  status: "active" | "suspended" | "banned"
  createdAt: string
  lastLogin: string
  kycStatus: "pending" | "verified" | "rejected"
}

export interface AdminTournament {
  id: string
  name: string
  game: string
  entryFee: number
  prizePool: number
  participants: number
  maxParticipants: number
  status: "upcoming" | "active" | "completed" | "cancelled"
  startDate: string
  endDate: string
  createdBy: string
}

export interface AdminTransaction {
  id: string
  userId: string
  username: string
  type: "deposit" | "withdrawal" | "tournament_entry" | "tournament_win" | "referral_bonus"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "cancelled"
  createdAt: string
  txHash?: string
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalTournaments: number
  activeTournaments: number
  totalVolume: number
  totalRevenue: number
  pendingWithdrawals: number
  supportTickets: number
}

interface AdminState {
  users: AdminUser[]
  tournaments: AdminTournament[]
  transactions: AdminTransaction[]
  stats: AdminStats
  updateUserStatus: (userId: string, status: AdminUser["status"]) => void
  updateTournamentStatus: (tournamentId: string, status: AdminTournament["status"]) => void
  updateTransactionStatus: (transactionId: string, status: AdminTransaction["status"]) => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: "1",
          username: "john_doe",
          email: "john@example.com",
          balance: 1250.5,
          totalDeposits: 2000,
          totalWithdrawals: 500,
          totalWinnings: 750,
          referralCount: 5,
          status: "active",
          createdAt: "2024-01-10T10:00:00Z",
          lastLogin: "2024-01-20T15:30:00Z",
          kycStatus: "verified",
        },
        {
          id: "2",
          username: "crypto_trader",
          email: "trader@example.com",
          balance: 3420.75,
          totalDeposits: 5000,
          totalWithdrawals: 1200,
          totalWinnings: 1620,
          referralCount: 12,
          status: "active",
          createdAt: "2024-01-05T14:20:00Z",
          lastLogin: "2024-01-20T12:15:00Z",
          kycStatus: "verified",
        },
        {
          id: "3",
          username: "new_player",
          email: "newbie@example.com",
          balance: 50.0,
          totalDeposits: 100,
          totalWithdrawals: 0,
          totalWinnings: 0,
          referralCount: 0,
          status: "active",
          createdAt: "2024-01-18T09:45:00Z",
          lastLogin: "2024-01-19T20:10:00Z",
          kycStatus: "pending",
        },
        {
          id: "4",
          username: "suspicious_user",
          email: "suspicious@example.com",
          balance: 0,
          totalDeposits: 10000,
          totalWithdrawals: 9500,
          totalWinnings: 500,
          referralCount: 0,
          status: "suspended",
          createdAt: "2024-01-15T16:30:00Z",
          lastLogin: "2024-01-17T11:20:00Z",
          kycStatus: "rejected",
        },
      ],
      tournaments: [
        {
          id: "1",
          name: "Champions League Predictions",
          game: "Football",
          entryFee: 50,
          prizePool: 2500,
          participants: 48,
          maxParticipants: 100,
          status: "active",
          startDate: "2024-01-20T18:00:00Z",
          endDate: "2024-01-25T22:00:00Z",
          createdBy: "admin",
        },
        {
          id: "2",
          name: "NBA Finals Showdown",
          game: "Basketball",
          entryFee: 25,
          prizePool: 1000,
          participants: 32,
          maxParticipants: 64,
          status: "upcoming",
          startDate: "2024-01-25T20:00:00Z",
          endDate: "2024-01-30T23:00:00Z",
          createdBy: "admin",
        },
        {
          id: "3",
          name: "Premier League Weekend",
          game: "Football",
          entryFee: 10,
          prizePool: 500,
          participants: 45,
          maxParticipants: 50,
          status: "completed",
          startDate: "2024-01-13T12:00:00Z",
          endDate: "2024-01-15T22:00:00Z",
          createdBy: "admin",
        },
      ],
      transactions: [
        {
          id: "1",
          userId: "1",
          username: "john_doe",
          type: "deposit",
          amount: 500,
          currency: "USDT",
          status: "completed",
          createdAt: "2024-01-20T10:30:00Z",
          txHash: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        },
        {
          id: "2",
          userId: "2",
          username: "crypto_trader",
          type: "withdrawal",
          amount: 1000,
          currency: "USDT",
          status: "pending",
          createdAt: "2024-01-20T14:15:00Z",
        },
        {
          id: "3",
          userId: "1",
          username: "john_doe",
          type: "tournament_entry",
          amount: 50,
          currency: "USDT",
          status: "completed",
          createdAt: "2024-01-20T18:00:00Z",
        },
        {
          id: "4",
          userId: "3",
          username: "new_player",
          type: "deposit",
          amount: 100,
          currency: "USDT",
          status: "completed",
          createdAt: "2024-01-18T10:00:00Z",
          txHash: "0x8f3e2b1a9c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b",
        },
        {
          id: "5",
          userId: "4",
          username: "suspicious_user",
          type: "withdrawal",
          amount: 5000,
          currency: "USDT",
          status: "cancelled",
          createdAt: "2024-01-17T16:45:00Z",
        },
      ],
      stats: {
        totalUsers: 1247,
        activeUsers: 892,
        totalTournaments: 156,
        activeTournaments: 12,
        totalVolume: 2847392.5,
        totalRevenue: 142369.63,
        pendingWithdrawals: 25430.75,
        supportTickets: 23,
      },
      updateUserStatus: (userId, status) => {
        set((state) => ({
          users: state.users.map((user) => (user.id === userId ? { ...user, status } : user)),
        }))
      },
      updateTournamentStatus: (tournamentId, status) => {
        set((state) => ({
          tournaments: state.tournaments.map((tournament) =>
            tournament.id === tournamentId ? { ...tournament, status } : tournament,
          ),
        }))
      },
      updateTransactionStatus: (transactionId, status) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === transactionId ? { ...transaction, status } : transaction,
          ),
        }))
      },
    }),
    {
      name: "admin-storage",
    },
  ),
)
