"use client"

import { DollarSign } from "lucide-react"
import { useWallet } from "@/context/wallet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export function WalletBalance() {
  const { balance } = useWallet()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
        <CardDescription>Your current available funds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <span className="text-2xl font-bold">{formatCurrency(balance)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
