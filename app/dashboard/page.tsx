"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuthStore } from "@/lib/auth-store"
import { mockTransactions, mockTournaments, mockReferrals } from "@/lib/mock-data"
import { DollarSign, TrendingUp, Users, Trophy, Plus, ArrowUpRight, ArrowDownRight, Target } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuthStore()

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "tournament_win":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case "withdrawal":
      case "tournament_entry":
        return <ArrowDownRight className="h-4 w-4 text-red-600" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const activeTournaments = mockTournaments.filter((t) => t.status === "active")
  const recentTransactions = mockTransactions.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-balance">Welcome back, {user?.name}!</h1>
          <p className="text-blue-100">Ready to dominate today's tournaments?</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="h-36">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-end h-full pb-6">
              <div className="space-y-3">
                <div className="text-2xl font-bold">{formatBalance(user?.balance || 0)}</div>
                <Button size="sm" asChild>
                  <Link href="/dashboard/balance">
                    <Plus className="h-4 w-4 mr-1" />
                    Deposit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="h-36">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Active Tournaments</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-end h-full pb-6">
              <div className="space-y-1">
                <div className="text-2xl font-bold">{activeTournaments.length}</div>
                <p className="text-xs text-muted-foreground">Tournaments you can join</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-36">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-end h-full pb-6">
              <div className="space-y-1">
                <div className="text-2xl font-bold">{mockReferrals.length}</div>
                <p className="text-xs text-muted-foreground">Friends invited</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-36">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-end h-full pb-6">
              <div className="space-y-1">
                <div className="text-2xl font-bold">+$125</div>
                <p className="text-xs text-muted-foreground">Net profit this month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest account activity</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        <span className="capitalize">{transaction.type.replace("_", " ")}</span>
                      </TableCell>
                      <TableCell
                        className={
                          transaction.amount > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                        }
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {formatBalance(transaction.amount)}
                      </TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "confirmed"
                              ? "default"
                              : transaction.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4">
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/dashboard/transactions">View All Transactions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Tournaments</CardTitle>
              <CardDescription>Tournaments you can join right now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTournaments.map((tournament) => (
                <div key={tournament.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      {tournament.name}
                    </h3>
                    <Badge variant="secondary">{tournament.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{tournament.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="space-y-1">
                      <div>Buy-in: {formatBalance(tournament.buyIn)}</div>
                      <div>Prize: {formatBalance(tournament.prizePool)}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div>
                        {tournament.participants}/{tournament.maxParticipants} players
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/tournaments/${tournament.id}`}>Join Tournament</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/dashboard/tournaments">View All Tournaments</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Referral Activity</CardTitle>
            <CardDescription>Track your referral performance and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-blue-600">{mockReferrals.length}</div>
                <p className="text-sm text-muted-foreground">Total Invited</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-green-600">
                  {mockReferrals.filter((r) => r.isActive).length}
                </div>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-purple-600">
                  {formatBalance(mockReferrals.reduce((sum, r) => sum + r.totalSpent, 0))}
                </div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
              </div>
            </div>
            <div className="mt-6">
              <Button asChild className="w-full">
                <Link href="/dashboard/referrals">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Referrals
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
