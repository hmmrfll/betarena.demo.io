"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/lib/auth-store"
import { useFinanceStore } from "@/lib/finance-store"
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Minus, CreditCard } from "lucide-react"
import { DepositForm } from "@/components/deposit-form"
import { WithdrawalForm } from "@/components/withdrawal-form"

export default function BalancePage() {
  const { user } = useAuthStore()
  const { transactions } = useFinanceStore()

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance)
  }

  // Calculate stats
  const recentTransactions = transactions.slice(0, 5)
  const totalDeposits = transactions
    .filter((t) => t.type === "deposit" && t.status === "confirmed")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalWithdrawals = Math.abs(
    transactions
      .filter((t) => t.type === "withdrawal" && t.status === "confirmed")
      .reduce((sum, t) => sum + t.amount, 0),
  )
  const monthlyProfit = transactions
    .filter((t) => {
      const transactionDate = new Date(t.date)
      const now = new Date()
      return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-balance">Balance & Finance</h1>
          <p className="text-green-100">Manage your deposits, withdrawals, and view transaction history</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="h-32">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full pb-4">
              <div className="flex-1" />
              <div>
                <div className="text-2xl font-bold">{formatBalance(user?.balance || 0)}</div>
                <p className="text-xs text-muted-foreground">Available for tournaments</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-32">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full pb-4">
              <div className="flex-1" />
              <div>
                <div className="text-2xl font-bold">{formatBalance(totalDeposits)}</div>
                <p className="text-xs text-muted-foreground">All time deposits</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-32">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full pb-4">
              <div className="flex-1" />
              <div>
                <div className="text-2xl font-bold">{formatBalance(totalWithdrawals)}</div>
                <p className="text-xs text-muted-foreground">All time withdrawals</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-32">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full pb-4">
              <div className="flex-1" />
              <div>
                <div className={`text-2xl font-bold ${monthlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {monthlyProfit >= 0 ? "+" : ""}
                  {formatBalance(monthlyProfit)}
                </div>
                <p className="text-xs text-muted-foreground">Net profit/loss</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="deposit" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deposit" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex items-center gap-2">
              <Minus className="h-4 w-4" />
              Withdraw
            </TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <DepositForm />
          </TabsContent>

          <TabsContent value="withdraw">
            <WithdrawalForm />
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-3 rounded-full ${
                            transaction.amount > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? (
                            <ArrowUpRight className="h-5 w-5" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium capitalize">{transaction.type.replace("_", " ")}</div>
                          <div className="text-sm text-muted-foreground">{transaction.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-semibold text-lg ${
                            transaction.amount > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {formatBalance(transaction.amount)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href="/dashboard/transactions">
                      <CreditCard className="h-4 w-4 mr-2" />
                      View All Transactions
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
