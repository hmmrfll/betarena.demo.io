import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mockTransactions, type Transaction } from "./mock-data"

interface DepositRequest {
  amount: number
  currency: "USDT" | "USDC"
  network: "ERC-20" | "TRC-20" | "BEP-20"
  walletAddress?: string
  qrCode?: string
}

interface WithdrawalRequest {
  amount: number
  currency: "USDT" | "USDC"
  network: "ERC-20" | "TRC-20" | "BEP-20"
  walletAddress: string
}

interface FinanceState {
  transactions: Transaction[]
  pendingDeposits: DepositRequest[]
  pendingWithdrawals: WithdrawalRequest[]
  generateDepositAddress: (request: DepositRequest) => Promise<{ address: string; qrCode: string }>
  submitWithdrawal: (request: WithdrawalRequest) => Promise<boolean>
  getTransactionHistory: (filter?: string) => Transaction[]
}

// Mock wallet addresses for different networks
const mockWalletAddresses = {
  "USDT-ERC-20": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
  "USDT-TRC-20": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
  "USDT-BEP-20": "0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681",
  "USDC-ERC-20": "0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681",
  "USDC-TRC-20": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
  "USDC-BEP-20": "0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681",
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      pendingDeposits: [],
      pendingWithdrawals: [],

      generateDepositAddress: async (request: DepositRequest) => {
        const key = `${request.currency}-${request.network}` as keyof typeof mockWalletAddresses
        const address = mockWalletAddresses[key]
        const qrCode = `/placeholder.svg?height=200&width=200&query=QR code for ${address}`

        // Add to pending deposits
        const depositWithAddress = { ...request, walletAddress: address, qrCode }
        set((state) => ({
          pendingDeposits: [...state.pendingDeposits, depositWithAddress],
        }))

        return { address, qrCode }
      },

      submitWithdrawal: async (request: WithdrawalRequest) => {
        // Add to pending withdrawals
        set((state) => ({
          pendingWithdrawals: [...state.pendingWithdrawals, request],
        }))

        // Create a pending transaction
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: "withdrawal",
          amount: -request.amount,
          status: "pending",
          date: new Date().toISOString(),
          description: `${request.currency} Withdrawal to ${request.walletAddress.slice(0, 6)}...${request.walletAddress.slice(-4)}`,
        }

        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }))

        return true
      },

      getTransactionHistory: (filter?: string) => {
        const transactions = get().transactions
        if (!filter || filter === "all") {
          return transactions
        }
        return transactions.filter((t) => t.type === filter)
      },
    }),
    {
      name: "finance-storage",
    },
  ),
)
