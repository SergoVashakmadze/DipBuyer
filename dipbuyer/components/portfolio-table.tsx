"use client"

import type React from "react"

import { useState } from "react"
import { ArrowUpDown } from "lucide-react"
import { usePortfolio } from "@/context/portfolio-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Update the component to include sell functionality
export function PortfolioTable() {
  const { assets, sellAsset } = usePortfolio()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAsset, setSelectedAsset] = useState<(typeof assets)[0] | null>(null)
  const [sellQuantity, setSellQuantity] = useState<number>(0)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)

  const filteredAssets = assets.filter(
    (asset) =>
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSell = (asset: (typeof assets)[0]) => {
    setSelectedAsset(asset)
    setSellQuantity(asset.quantity)
    setIsSellModalOpen(true)
  }

  const handleSellQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAsset) return

    const quantity = Number.parseFloat(e.target.value)
    if (isNaN(quantity) || quantity <= 0) {
      setSellQuantity(0)
      return
    }

    setSellQuantity(Math.min(quantity, selectedAsset.quantity))
  }

  const handleConfirmSell = () => {
    if (!selectedAsset || sellQuantity <= 0 || sellQuantity > selectedAsset.quantity) return

    sellAsset(selectedAsset.id, sellQuantity)

    toast({
      title: "Sale successful",
      description: `You have sold ${sellQuantity.toFixed(6)} ${selectedAsset.symbol} for ${formatCurrency(sellQuantity * selectedAsset.price)}`,
    })

    setSelectedAsset(null)
    setSellQuantity(0)
    setIsSellModalOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Assets</CardTitle>
        <CardDescription>Manage your portfolio holdings</CardDescription>
        <div className="mt-2">
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredAssets.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-center">
            <div className="text-muted-foreground">
              <p>No assets in your portfolio</p>
              <p className="text-sm">Start investing to build your portfolio</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">
                    <Button variant="ghost" size="sm">
                      Asset
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="text-right py-2">
                    <Button variant="ghost" size="sm">
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">
                    <Button variant="ghost" size="sm">
                      Value
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="text-right py-2">
                    <Button variant="ghost" size="sm">
                      P/L
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </th>
                  <th className="text-right py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b hover:bg-muted/50">
                    <td className="py-2">
                      <div>
                        <p className="font-medium">{asset.symbol}</p>
                        <p className="text-xs text-muted-foreground">{asset.name}</p>
                      </div>
                    </td>
                    <td className="text-right py-2">{formatCurrency(asset.price)}</td>
                    <td className="text-right py-2">{asset.quantity.toFixed(6)}</td>
                    <td className="text-right py-2">{formatCurrency(asset.value)}</td>
                    <td className={`text-right py-2 ${asset.profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {formatCurrency(asset.profitLoss)}
                    </td>
                    <td className="text-right py-2">
                      <Button variant="outline" size="sm" onClick={() => handleSell(asset)}>
                        Sell
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sell Modal */}
        {selectedAsset && isSellModalOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Sell {selectedAsset.symbol}</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Current Price:</span>
                  <span className="font-medium">{formatCurrency(selectedAsset.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Your Holdings:</span>
                  <span className="font-medium">
                    {selectedAsset.quantity.toFixed(6)} {selectedAsset.symbol}
                  </span>
                </div>
                <div className="space-y-2">
                  <label htmlFor="sell-quantity" className="text-sm font-medium">
                    Quantity to sell
                  </label>
                  <input
                    id="sell-quantity"
                    type="number"
                    className="w-full py-2 px-3 border rounded-md"
                    value={sellQuantity}
                    onChange={handleSellQuantityChange}
                    min="0.000001"
                    step="0.000001"
                    max={selectedAsset.quantity}
                  />
                </div>
                <div className="flex justify-between">
                  <span>Value:</span>
                  <span className="font-medium">{formatCurrency(sellQuantity * selectedAsset.price)}</span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedAsset(null)
                      setIsSellModalOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleConfirmSell}
                    disabled={sellQuantity <= 0 || sellQuantity > selectedAsset.quantity}
                  >
                    Confirm Sale
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
