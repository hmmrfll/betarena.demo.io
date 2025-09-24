import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  balance: number
  role: "user" | "admin"
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  loginWithTelegram: () => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  resetPassword: (email: string) => Promise<boolean>
}

// Mock user data
const mockUsers = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123",
    name: "John Doe",
    balance: 1250.5,
    role: "user" as const,
  },
  {
    id: "2",
    email: "admin@betarena.com",
    password: "admin123",
    name: "Admin User",
    balance: 5000.0,
    role: "admin" as const,
  },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock authentication
        const user = mockUsers.find((u) => u.email === email && u.password === password)
        if (user) {
          const { password: _, ...userWithoutPassword } = user
          set({ user: userWithoutPassword, isAuthenticated: true })
          return true
        }
        return false
      },

      loginWithGoogle: async () => {
        // Mock Google auth
        const mockGoogleUser = {
          id: "google_" + Date.now(),
          email: "google.user@gmail.com",
          name: "Google User",
          balance: 0,
          role: "user" as const,
        }
        set({ user: mockGoogleUser, isAuthenticated: true })
        return true
      },

      loginWithTelegram: async () => {
        // Mock Telegram auth
        const mockTelegramUser = {
          id: "telegram_" + Date.now(),
          email: "telegram.user@example.com",
          name: "Telegram User",
          balance: 0,
          role: "user" as const,
        }
        set({ user: mockTelegramUser, isAuthenticated: true })
        return true
      },

      register: async (email: string, password: string, name: string) => {
        // Mock registration
        const newUser = {
          id: "user_" + Date.now(),
          email,
          name,
          balance: 0,
          role: "user" as const,
        }
        set({ user: newUser, isAuthenticated: true })
        return true
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      resetPassword: async (email: string) => {
        // Mock password reset
        return mockUsers.some((u) => u.email === email)
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
