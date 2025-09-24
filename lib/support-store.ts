import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface SupportTicket {
  id: string
  subject: string
  message: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: "technical" | "account" | "payment" | "tournament" | "other"
  createdAt: string
  updatedAt: string
  responses: SupportResponse[]
}

export interface SupportResponse {
  id: string
  message: string
  isAdmin: boolean
  createdAt: string
  attachments?: string[]
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  notHelpful: number
}

interface SupportState {
  tickets: SupportTicket[]
  faqs: FAQ[]
  createTicket: (ticket: Omit<SupportTicket, "id" | "createdAt" | "updatedAt" | "responses">) => void
  addResponse: (ticketId: string, response: Omit<SupportResponse, "id" | "createdAt">) => void
  updateTicketStatus: (ticketId: string, status: SupportTicket["status"]) => void
  rateFAQ: (faqId: string, helpful: boolean) => void
}

export const useSupportStore = create<SupportState>()(
  persist(
    (set, get) => ({
      tickets: [
        {
          id: "1",
          subject: "Cannot withdraw funds",
          message: "I have been trying to withdraw my winnings for 3 days but the transaction keeps failing.",
          status: "in-progress",
          priority: "high",
          category: "payment",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T14:20:00Z",
          responses: [
            {
              id: "1",
              message:
                "Thank you for contacting support. We are investigating the withdrawal issue. Please provide your wallet address for verification.",
              isAdmin: true,
              createdAt: "2024-01-15T11:00:00Z",
            },
            {
              id: "2",
              message: "My wallet address is: 0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
              isAdmin: false,
              createdAt: "2024-01-15T11:15:00Z",
            },
          ],
        },
        {
          id: "2",
          subject: "Tournament prediction not counted",
          message: "My prediction for the Champions League match was not counted in the tournament.",
          status: "resolved",
          priority: "medium",
          category: "tournament",
          createdAt: "2024-01-14T16:45:00Z",
          updatedAt: "2024-01-14T18:30:00Z",
          responses: [
            {
              id: "3",
              message:
                "We have reviewed your case and found that your prediction was submitted after the match started. Predictions must be made before kickoff.",
              isAdmin: true,
              createdAt: "2024-01-14T17:00:00Z",
            },
          ],
        },
      ],
      faqs: [
        {
          id: "1",
          question: "How do I make a prediction?",
          answer:
            "To make a prediction, go to the Tournaments page, select a tournament, and click on the match you want to predict. Choose your prediction and confirm.",
          category: "Tournament",
          helpful: 45,
          notHelpful: 3,
        },
        {
          id: "2",
          question: "What payment methods are supported?",
          answer:
            "We support cryptocurrency deposits and withdrawals including Bitcoin, Ethereum, USDT, and USDC. Traditional payment methods are coming soon.",
          category: "Payment",
          helpful: 32,
          notHelpful: 5,
        },
        {
          id: "3",
          question: "How does the referral program work?",
          answer:
            "Invite friends using your referral link. You earn 10% commission on their tournament entry fees and 5% on their winnings for the first 6 months.",
          category: "Referral",
          helpful: 28,
          notHelpful: 2,
        },
        {
          id: "4",
          question: "Can I change my prediction after submitting?",
          answer:
            "No, predictions cannot be changed once submitted. Make sure to double-check your prediction before confirming.",
          category: "Tournament",
          helpful: 19,
          notHelpful: 8,
        },
        {
          id: "5",
          question: "How long do withdrawals take?",
          answer:
            "Cryptocurrency withdrawals are processed within 24 hours. Processing time may vary depending on network congestion.",
          category: "Payment",
          helpful: 41,
          notHelpful: 4,
        },
      ],
      createTicket: (ticketData) => {
        const newTicket: SupportTicket = {
          ...ticketData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          responses: [],
        }
        set((state) => ({
          tickets: [newTicket, ...state.tickets],
        }))
      },
      addResponse: (ticketId, responseData) => {
        const newResponse: SupportResponse = {
          ...responseData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  responses: [...ticket.responses, newResponse],
                  updatedAt: new Date().toISOString(),
                }
              : ticket,
          ),
        }))
      },
      updateTicketStatus: (ticketId, status) => {
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId ? { ...ticket, status, updatedAt: new Date().toISOString() } : ticket,
          ),
        }))
      },
      rateFAQ: (faqId, helpful) => {
        set((state) => ({
          faqs: state.faqs.map((faq) =>
            faq.id === faqId
              ? {
                  ...faq,
                  helpful: helpful ? faq.helpful + 1 : faq.helpful,
                  notHelpful: helpful ? faq.notHelpful : faq.notHelpful + 1,
                }
              : faq,
          ),
        }))
      },
    }),
    {
      name: "support-storage",
    },
  ),
)
