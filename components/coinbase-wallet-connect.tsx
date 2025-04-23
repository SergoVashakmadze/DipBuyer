"use client"

import { useState } from "react"
import { Wallet } from "lucide-react"
import { useCoinbase } from "@/components/coinbase-provider"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function CoinbaseWalletConnect() {
  const { isInitialized, connect } = useCoinbase()
  const { isCoinbaseConnected, connectCoinbaseWallet, disconnectCoinbaseWallet } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const handleConnect = async () => {
    if (!isInitialized) {
      toast({
        title: "Coinbase SDK not initialized",
        description: "Please try again later",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      await connect()
      await connectCoinbaseWallet()
      toast({
        title: "Wallet connected",
        description: "Your Coinbase wallet has been connected successfully",
      })
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to Coinbase wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnectCoinbaseWallet()
    toast({
      title: "Wallet disconnected",
      description: "Your Coinbase wallet has been disconnected",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Coinbase Wallet
        </CardTitle>
        <CardDescription>Connect your Coinbase wallet to enable crypto transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {isCoinbaseConnected ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-500">Connected</span>
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Connect your wallet to buy and sell crypto assets directly from the app.
          </p>
        )}
      </CardContent>
      <CardFooter>
        {!isCoinbaseConnected && (
          <Button className="w-full" onClick={handleConnect} disabled={isConnecting || !isInitialized}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
