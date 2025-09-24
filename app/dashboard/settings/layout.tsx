"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/auth-store"
import { useTheme } from "next-themes"
import {
  Home,
  Trophy,
  Wallet,
  Users,
  History,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  DollarSign,
  Shield,
  Bell,
  ChevronLeft,
  ChevronRight,
  User,
  Eye,
} from "lucide-react"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const mainSidebarItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Trophy, label: "Tournaments", href: "/dashboard/tournaments" },
    { icon: Wallet, label: "Balance", href: "/dashboard/balance" },
    { icon: Users, label: "Referrals", href: "/dashboard/referrals" },
    { icon: History, label: "Transactions", href: "/dashboard/transactions" },
    { icon: HelpCircle, label: "Support", href: "/dashboard/support" },
    ...(user?.role === "admin" ? [{ icon: Shield, label: "Admin Panel", href: "/admin" }] : []),
  ]

  const settingsSidebarItems = [
    { icon: User, label: "Profile", href: "/dashboard/settings/profile" },
    { icon: Bell, label: "Notifications", href: "/dashboard/settings/notifications" },
    { icon: Eye, label: "Privacy", href: "/dashboard/settings/privacy" },
    { icon: Shield, label: "Security", href: "/dashboard/settings/security" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">BetArena</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Balance Display */}
            <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-600">{formatBalance(user?.balance || 0)}</span>
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <div className="p-3 border-b">
                  <h4 className="font-semibold">Notifications</h4>
                </div>
                <div className="p-2 space-y-2">
                  <div className="p-2 hover:bg-muted rounded-lg cursor-pointer">
                    <p className="text-sm font-medium">Tournament Started</p>
                    <p className="text-xs text-muted-foreground">Premier League predictions are now open</p>
                  </div>
                  <div className="p-2 hover:bg-muted rounded-lg cursor-pointer">
                    <p className="text-sm font-medium">Referral Bonus</p>
                    <p className="text-xs text-muted-foreground">You earned $5 from a referral</p>
                  </div>
                  <div className="p-2 hover:bg-muted rounded-lg cursor-pointer">
                    <p className="text-sm font-medium">Withdrawal Processed</p>
                    <p className="text-xs text-muted-foreground">Your withdrawal of $100 has been completed</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 bg-sidebar border-r transform transition-all duration-200 ease-in-out
          md:relative md:translate-x-0 md:z-0
          ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          ${sidebarCollapsed ? "md:w-16" : "md:w-64"}
        `}
        >
          <div className="flex flex-col h-full pt-16 md:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {mainSidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className={`${sidebarCollapsed ? "md:hidden" : ""} transition-opacity`}>{item.label}</span>
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 hidden md:block">
                      {item.label}
                    </div>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Settings Sidebar */}
        <aside className="w-64 bg-muted/30 border-r min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your preferences</p>
              </div>
            </div>
            <nav className="space-y-1">
              {settingsSidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted hover:text-foreground text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
