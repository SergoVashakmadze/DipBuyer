"use client"

import type React from "react"

import { useState } from "react"
import { Send, AlertCircle } from "lucide-react"
import { useCoinbase } from "@/components/coinbase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export function CoinbaseSend() {
  const { isConnected, wallet, executeTransaction, isLoading } = useCoinbase()
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [asset, setAsset] = useState("ETH")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !wallet) {
      setError("Wallet not connected")
      return
    }

    if (!recipient || !amount || !asset) {
      setError("Please fill in all fields")
      return
    }

    // Basic address validation
    if (!recipient.startsWith("0x") || recipient.length !== 42) {
      setError("Invalid Ethereum address")
      return
    }

    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      setError("Invalid amount")
      return
    }

    // For ETH, check if amount is less than balance
    if (asset === "ETH" && amountValue > Number.parseFloat(wallet.balance)) {
      setError("Insufficient balance")
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const txHash = await executeTransaction(recipient, amountValue, asset)

      toast({
        title: "Transaction submitted",
        description: `Your transaction has been submitted with hash: ${txHash.substring(0, 10)}...`,
      })

      // Reset form
      setRecipient("")
      setAmount("")
    } catch (error) {
      console.error("Transaction failed:", error)
      setError("Transaction failed. Please try again.")

      toast({
        title: "Transaction failed",
        description: "Could not complete the transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected || !wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Send Crypto</CardTitle>
          <CardDescription>Send crypto assets from your Coinbase wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">Connect your wallet to send crypto</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Crypto
        </CardTitle>
        <CardDescription>Send crypto assets from your Coinbase wallet</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.000001"
                step="0.000001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Select value={asset} onValueChange={setAsset} required>
                <SelectTrigger id="asset">
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {asset === "ETH" && <div className="text-sm text-muted-foreground">Available: {wallet.balance} ETH</div>}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting || isLoading || !recipient || !amount || !asset}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </Button>
      </CardFooter>
    </Card>
  )
}
