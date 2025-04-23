"use client"

import { ArrowUpRight, ArrowDownRight, DollarSign, PercentIcon } from "lucide-react"
import { usePortfolio } from "@/context/portfolio-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatPercentage } from "@/lib/utils"

export function PortfolioSummary() {
  const { totalValue, totalProfitLoss, totalProfitLossPercentage, assets } = usePortfolio()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Portfolio Summary</CardTitle>
        <CardDescription>Your investment portfolio overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Value</p>
            <div className="flex items-center">
              <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{formatCurrency(totalValue)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Profit/Loss</p>
            <div className="flex items-center">
              {totalProfitLoss >= 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={`text-xl font-bold ${totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatCurrency(totalProfitLoss)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Return</p>
            <div className="flex items-center">
              <PercentIcon className="mr-1 h-4 w-4 text-muted-foreground" />
              <span
                className={`text-xl font-bold ${totalProfitLossPercentage >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {totalProfitLossPercentage >= 0 ? "+" : ""}
                {formatPercentage(totalProfitLossPercentage)}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-muted-foreground">Assets</p>
            <p className="text-xl font-bold">{assets.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
