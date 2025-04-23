"use client"

import { useState } from "react"
import { Copy, ExternalLink, RefreshCw } from "lucide-react"
import { useCoinbase } from "@/components/coinbase-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function CoinbaseWalletDetails() {
  const { isConnected, wallet, getBalance, isLoading } = useCoinbase()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  if (!isConnected || !wallet) {
    return null
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address)
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const refreshBalance = async () => {
    setIsRefreshing(true)
    try {
      await getBalance()
    } catch (error) {
      toast({
        title: "Failed to refresh balance",
        description: "Could not retrieve the latest balance",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Wallet</CardTitle>
        <CardDescription>Your Coinbase wallet details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Address</div>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-xs bg-muted p-1 rounded">{wallet.address}</code>
              <Button variant="ghost" size="icon" onClick={copyAddress} title="Copy address">
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(`https://etherscan.io/address/${wallet.address}`, "_blank")}
                title="View on Etherscan"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">Network</div>
            <div className="mt-1">{wallet.network}</div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">Balance</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshBalance}
                disabled={isRefreshing || isLoading}
                className="h-6 px-2"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
            <div className="mt-1 text-xl font-bold">{wallet.balance} ETH</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
