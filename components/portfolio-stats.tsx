"use client"

import { usePortfolio } from "@/context/portfolio-context"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatPercentage } from "@/lib/utils"

export function PortfolioStats() {
  const { assets, totalValue, totalProfitLoss, totalProfitLossPercentage } = usePortfolio()

  // Calculate asset type distribution
  const stocksValue = assets.filter((asset) => asset.type === "stock").reduce((sum, asset) => sum + asset.value, 0)

  const etfsValue = assets.filter((asset) => asset.type === "etf").reduce((sum, asset) => sum + asset.value, 0)

  const cryptoValue = assets.filter((asset) => asset.type === "crypto").reduce((sum, asset) => sum + asset.value, 0)

  const stocksPercentage = totalValue > 0 ? (stocksValue / totalValue) * 100 : 0
  const etfsPercentage = totalValue > 0 ? (etfsValue / totalValue) * 100 : 0
  const cryptoPercentage = totalValue > 0 ? (cryptoValue / totalValue) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Total Value</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totalValue)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Total Profit/Loss</h3>
            <p className={`text-2xl font-bold mt-2 ${totalProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(totalProfitLoss)} ({formatPercentage(totalProfitLossPercentage)})
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Asset Count</h3>
            <p className="text-2xl font-bold mt-2">{assets.length}</p>
            <div className="flex justify-center gap-2 mt-2 text-sm">
              <span>{assets.filter((a) => a.type === "stock").length} Stocks</span>
              <span>•</span>
              <span>{assets.filter((a) => a.type === "etf").length} ETFs</span>
              <span>•</span>
              <span>{assets.filter((a) => a.type === "crypto").length} Crypto</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Asset Allocation</h3>
            <div className="flex justify-center gap-2 mt-2">
              {totalValue > 0 ? (
                <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div className="bg-blue-500" style={{ width: `${stocksPercentage}%` }} />
                    <div className="bg-green-500" style={{ width: `${etfsPercentage}%` }} />
                    <div className="bg-purple-500" style={{ width: `${cryptoPercentage}%` }} />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No assets</div>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1" />
                <span>Stocks</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1" />
                <span>ETFs</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-1" />
                <span>Crypto</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
