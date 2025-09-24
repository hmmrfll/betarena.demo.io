"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFinanceStore } from "@/lib/finance-store"
import { useState } from "react"
import { ArrowUpRight, ArrowDownRight, Search, Filter, Download } from "lucide-react"

export default function TransactionsPage() {
  const { getTransactionHistory } = useFinanceStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const allTransactions = getTransactionHistory()

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
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      case "canceled":
        return "outline"
      default:
        return "secondary"
    }
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
        return <ArrowUpRight className="h-4 w-4" />
    }
  }

  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ["Date", "Type", "Description", "Amount", "Status"],
      ...filteredTransactions.map((t) => [
        formatDate(t.date),
        t.type.replace("_", " "),
        t.description,
        formatBalance(t.amount),
        t.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transactions.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">Transaction History</h1>
            <p className="text-muted-foreground">View and manage all your financial transactions</p>
          </div>
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter transactions by type, status, or search terms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="tournament_entry">Tournament Entries</SelectItem>
                  <SelectItem value="tournament_win">Tournament Wins</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          <span className="capitalize font-medium text-xs sm:text-sm">
                            {transaction.type.replace("_", " ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-[120px] sm:max-w-xs truncate text-xs sm:text-sm"
                          title={transaction.description}
                        >
                          {transaction.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold text-xs sm:text-sm ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {formatBalance(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(transaction.status)} className="text-xs">
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs hidden sm:table-cell">
                        {formatDate(transaction.date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                    ? "No transactions match your filters"
                    : "No transactions found"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
