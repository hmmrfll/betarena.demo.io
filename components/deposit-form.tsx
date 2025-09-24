"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useFinanceStore } from "@/lib/finance-store"
import { Copy, Wallet, AlertCircle } from "lucide-react"
import Image from "next/image"

export function DepositForm() {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<"USDT" | "USDC">("USDT")
  const [network, setNetwork] = useState<"ERC-20" | "TRC-20" | "BEP-20">("TRC-20")
  const [depositAddress, setDepositAddress] = useState<string>("")
  const [qrCode, setQrCode] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [step, setStep] = useState<"form" | "address">("form")

  const { toast } = useToast()
  const { generateDepositAddress } = useFinanceStore()

  const handleGenerateAddress = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const result = await generateDepositAddress({
        amount: Number.parseFloat(amount),
        currency,
        network,
      })

      setDepositAddress(result.address)
      setQrCode(result.qrCode)
      setStep("address")

      toast({
        title: "Deposit address generated",
        description: "Send your funds to the address below",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate deposit address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the address manually",
        variant: "destructive",
      })
    }
  }

  const handleNewDeposit = () => {
    setStep("form")
    setAmount("")
    setDepositAddress("")
    setQrCode("")
  }

  const networkFees = {
    "ERC-20": "$5-20",
    "TRC-20": "$1-3",
    "BEP-20": "$0.50-2",
  }

  if (step === "address") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Deposit Address Generated
            </CardTitle>
            <CardDescription>
              Send exactly {amount} {currency} to the address below using {network} network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg border">
                <Image
                  src={qrCode || "/placeholder.svg"}
                  alt="Deposit QR Code"
                  width={200}
                  height={200}
                  className="rounded"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Deposit Address ({network})</Label>
              <div className="flex gap-2">
                <Input value={depositAddress} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(depositAddress)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-yellow-800">Important Notes:</div>
                  <ul className="space-y-1 text-yellow-700">
                    <li>
                      • Only send {currency} using {network} network
                    </li>
                    <li>• Minimum deposit: $10 USD</li>
                    <li>• Network fee: {networkFees[network]}</li>
                    <li>• Funds will be credited after 1-3 confirmations</li>
                    <li>• Do not send from exchange accounts</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleNewDeposit} variant="outline" className="flex-1 bg-transparent">
                New Deposit
              </Button>
              <Button className="flex-1">I've Sent the Funds</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Deposit Funds
        </CardTitle>
        <CardDescription>Add funds to your account using cryptocurrency</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
              step="0.01"
            />
            <p className="text-xs text-muted-foreground">Minimum deposit: $10</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
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
          <Label htmlFor="network">Network</Label>
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

        <Button onClick={handleGenerateAddress} disabled={isGenerating || !amount} className="w-full">
          {isGenerating ? "Generating Address..." : "Generate Deposit Address"}
        </Button>
      </CardContent>
    </Card>
  )
}
