"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ExternalLink, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react"
import { useCoinbase } from "@/components/coinbase-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export function CoinbaseTransactions() {
  const { isConnected, wallet, transactions, getTransactions, isLoading } = useCoinbase()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const refreshTransactions = async () => {
    if (!isConnected || !wallet) return

    setIsRefreshing(true)
    try {
      await getTransactions()
    } catch (error) {
      toast({
        title: "Failed to load transactions",
        description: "Could not retrieve transaction history",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  if (!isConnected || !wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Coinbase Transactions</CardTitle>
          <CardDescription>Connect your wallet to view transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">No wallet connected</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Coinbase Transactions</CardTitle>
            <CardDescription>Recent transactions from your Coinbase wallet</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshTransactions} disabled={isRefreshing || isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || isRefreshing ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <Skeleton className="h-4 w-[100px]" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => {
              const isIncoming = tx.to.toLowerCase() === wallet.address.toLowerCase()

              return (
                <div key={tx.hash} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`rounded-full p-2 ${
                        isIncoming
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {isIncoming ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {isIncoming ? "Received" : "Sent"} {tx.asset}
                        </p>
                        <Badge
                          variant={
                            tx.status === "confirmed" ? "default" : tx.status === "pending" ? "outline" : "destructive"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{format(tx.timestamp, "MMM d, yyyy 'at' h:mm a")}</span>
                        <span>•</span>
                        <span>
                          {isIncoming ? "From: " : "To: "}
                          {formatAddress(isIncoming ? tx.from : tx.to)}
                        </span>
                        <a
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 inline-flex"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${isIncoming ? "text-green-500" : "text-blue-500"}`}>
                    {isIncoming ? "+" : "-"}
                    {tx.value} {tx.asset}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
