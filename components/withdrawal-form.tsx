"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/auth-store"
import { useFinanceStore } from "@/lib/finance-store"
import { ArrowDownRight, AlertCircle } from "lucide-react"

export function WithdrawalForm() {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<"USDT" | "USDC">("USDT")
  const [network, setNetwork] = useState<"ERC-20" | "TRC-20" | "BEP-20">("TRC-20")
  const [walletAddress, setWalletAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const { user } = useAuthStore()
  const { submitWithdrawal } = useFinanceStore()

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance)
  }

  const handleWithdrawal = async () => {
    const withdrawAmount = Number.parseFloat(amount)

    if (!amount || withdrawAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      })
      return
    }

    if (withdrawAmount < 20) {
      toast({
        title: "Minimum withdrawal",
        description: "Minimum withdrawal amount is $20",
        variant: "destructive",
      })
      return
    }

    if (!user || withdrawAmount > user.balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      })
      return
    }

    if (!walletAddress) {
      toast({
        title: "Wallet address required",
        description: "Please enter your wallet address",
        variant: "destructive",
      })
      return
    }

    // Basic wallet address validation
    if (network === "TRC-20" && !walletAddress.startsWith("T")) {
      toast({
        title: "Invalid address",
        description: "TRC-20 addresses should start with 'T'",
        variant: "destructive",
      })
      return
    }

    if ((network === "ERC-20" || network === "BEP-20") && !walletAddress.startsWith("0x")) {
      toast({
        title: "Invalid address",
        description: `${network} addresses should start with '0x'`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const success = await submitWithdrawal({
        amount: withdrawAmount,
        currency,
        network,
        walletAddress,
      })

      if (success) {
        toast({
          title: "Withdrawal submitted",
          description: "Your withdrawal request has been submitted for review",
        })

        // Reset form
        setAmount("")
        setWalletAddress("")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit withdrawal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const networkFees = {
    "ERC-20": "$5-20",
    "TRC-20": "$1-3",
    "BEP-20": "$0.50-2",
  }

  const maxWithdrawal = user ? user.balance : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowDownRight className="h-5 w-5" />
          Withdraw Funds
        </CardTitle>
        <CardDescription>Withdraw funds from your account to your crypto wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">Available Balance:</span>
            <span className="text-lg font-bold text-blue-900">{formatBalance(maxWithdrawal)}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Amount (USD)</Label>
            <Input
              id="withdraw-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="20"
              max={maxWithdrawal}
              step="0.01"
            />
            <p className="text-xs text-muted-foreground">Min: $20 | Max: {formatBalance(maxWithdrawal)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdraw-currency">Currency</Label>
            <Select value={currency} onValueChange={(value: "USDT" | "USDC") => setCurrency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDT">USDT (Tether)</SelectItem>
                <SelectItem value="USDC">USDC (USD Coin)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="withdraw-network">Network</Label>
          <Select value={network} onValueChange={(value: "ERC-20" | "TRC-20" | "BEP-20") => setNetwork(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRC-20">TRC-20 (Tron) - Low fees</SelectItem>
              <SelectItem value="BEP-20">BEP-20 (BSC) - Low fees</SelectItem>
              <SelectItem value="ERC-20">ERC-20 (Ethereum) - High fees</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Network fee: {networkFees[network]}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wallet-address">Wallet Address</Label>
          <Input
            id="wallet-address"
            placeholder={`Enter your ${network} wallet address`}
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {network === "TRC-20" ? 'Should start with "T"' : 'Should start with "0x"'}
          </p>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="space-y-2 text-sm">
              <div className="font-semibold text-yellow-800">Important:</div>
              <ul className="space-y-1 text-yellow-700">
                <li>• Double-check your wallet address - transactions cannot be reversed</li>
                <li>• Withdrawals are processed within 24 hours</li>
                <li>• Network fees will be deducted from your withdrawal</li>
                <li>• Minimum withdrawal: $20</li>
              </ul>
            </div>
          </div>
        </div>

        <Button onClick={handleWithdrawal} disabled={isSubmitting || !amount || !walletAddress} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit Withdrawal"}
        </Button>
      </CardContent>
    </Card>
  )
}
