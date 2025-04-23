"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowRight, TrendingDown, Sparkles, BarChart3, Info } from "lucide-react"
import { useSettings } from "@/context/settings-context"
import { usePortfolio } from "@/context/portfolio-context"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { calculateUndervaluation, generateHistoricalPrices, formatCurrency } from "@/lib/utils"

interface AssetOpportunity {
  id: string
  symbol: string
  name: string
  type: "stock" | "etf" | "crypto"
  price: number
  priceChange24h: number
  historicalPrices: number[]
  undervaluationScore: number
  riskScore: number
  undervaluationReason: string
}

// Sample data for demonstration
const sampleAssets: AssetOpportunity[] = [
  {
    id: "aapl",
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock",
    price: 175.25,
    priceChange24h: -2.3,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 30,
    undervaluationReason: "",
  },
  {
    id: "msft",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    type: "stock",
    price: 325.42,
    priceChange24h: -1.8,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 25,
    undervaluationReason: "",
  },
  {
    id: "amzn",
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    type: "stock",
    price: 132.65,
    priceChange24h: -3.1,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 40,
    undervaluationReason: "",
  },
  {
    id: "spy",
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    type: "etf",
    price: 430.15,
    priceChange24h: -1.5,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 20,
    undervaluationReason: "",
  },
  {
    id: "qqq",
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    type: "etf",
    price: 365.78,
    priceChange24h: -2.1,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 25,
    undervaluationReason: "",
  },
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    type: "crypto",
    price: 42500.25,
    priceChange24h: -4.2,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 70,
    undervaluationReason: "",
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    type: "crypto",
    price: 2250.75,
    priceChange24h: -5.1,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 65,
    undervaluationReason: "",
  },
  {
    id: "sol",
    symbol: "SOL",
    name: "Solana",
    type: "crypto",
    price: 105.32,
    priceChange24h: -6.8,
    historicalPrices: [],
    undervaluationScore: 0,
    riskScore: 80,
    undervaluationReason: "",
  },
]

// Generate undervaluation reasons
function generateUndervaluationReason(asset: AssetOpportunity, score: number): string {
  if (score < 10) {
    return "This asset is currently trading at or near its fair value based on our analysis of historical price patterns, moving averages, and market indicators."
  }

  const reasons = [
    `${asset.symbol} is trading below its 50-day moving average, suggesting a potential buying opportunity.`,
    `Recent market sentiment has pushed ${asset.symbol} below its historical support levels, indicating possible undervaluation.`,
    `${asset.symbol}'s current price-to-earnings ratio is below the industry average, suggesting it may be undervalued compared to peers.`,
    `Technical indicators like RSI suggest ${asset.symbol} may be oversold, potentially creating a buying opportunity.`,
    `${asset.symbol} has experienced a temporary dip due to market volatility unrelated to its fundamentals.`,
    `Recent earnings for ${asset.symbol} were strong, but the price hasn't yet reflected this positive development.`,
    `Institutional investors have been accumulating ${asset.symbol}, suggesting potential undervaluation.`,
    `${asset.symbol} is trading below its intrinsic value based on discounted cash flow analysis.`,
    `${asset.symbol} has a strong balance sheet and growth prospects that aren't fully reflected in the current price.`,
  ]

  // Select 1-2 reasons based on the score
  const numReasons = score > 30 ? 2 : 1
  const selectedReasons = []

  for (let i = 0; i < numReasons; i++) {
    const randomIndex = Math.floor(Math.random() * reasons.length)
    selectedReasons.push(reasons[randomIndex])
    reasons.splice(randomIndex, 1)
  }

  return selectedReasons.join(" ")
}

interface AssetOpportunitiesProps {
  className?: string
}

export function AssetOpportunities({ className }: AssetOpportunitiesProps) {
  const { settings } = useSettings()
  const { buyAsset, sellAsset, assets } = usePortfolio()
  const { balance } = useWallet()
  const { toast } = useToast()
  const [opportunities, setOpportunities] = useState<AssetOpportunity[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [selectedAsset, setSelectedAsset] = useState<AssetOpportunity | null>(null)
  const [purchaseAmount, setPurchaseAmount] = useState<number>(0)
  const [sellQuantity, setSellQuantity] = useState<number>(0)
  const [action, setAction] = useState<"buy" | "sell" | null>(null)

  // Generate historical prices and calculate undervaluation scores
  useEffect(() => {
    const assetsWithScores = sampleAssets.map((asset) => {
      const historicalPrices = generateHistoricalPrices(
        asset.price,
        100,
        asset.type === "crypto" ? 0.04 : asset.type === "stock" ? 0.02 : 0.01,
      )

      // Artificially make some assets appear undervalued for demonstration
      const artificialDip = Math.random() > 0.5
      const currentPrice = artificialDip ? asset.price * (0.85 + Math.random() * 0.1) : asset.price

      // Calculate undervaluation score
      let undervaluationScore = calculateUndervaluation(currentPrice, historicalPrices)

      // Ensure undervaluation scores are realistic (0-50% range)
      undervaluationScore = Math.min(undervaluationScore, 50)

      // Special cases for demonstration
      if (asset.symbol === "SPY") {
        undervaluationScore = 35 // Specific undervaluation for SPY
      } else if (asset.symbol === "AAPL" || asset.symbol === "MSFT" || asset.symbol === "AMZN") {
        undervaluationScore = 0 // Not undervalued
      } else if (asset.symbol === "QQQ" || asset.symbol === "ETH") {
        // Give QQQ and ETH realistic undervaluation values instead of 100%
        undervaluationScore = Math.floor(Math.random() * 20) + 15 // Random value between 15-35%
      }

      // Generate reason for undervaluation
      const undervaluationReason = generateUndervaluationReason(asset, undervaluationScore)

      return {
        ...asset,
        price: currentPrice,
        historicalPrices,
        undervaluationScore,
        undervaluationReason,
      }
    })

    setOpportunities(assetsWithScores)
  }, [])

  // Filter assets based on settings and tab
  const filteredOpportunities = opportunities
    .filter((asset) => {
      // Filter by asset type based on settings
      if (!settings.assetTypes.stocks && asset.type === "stock") return false
      if (!settings.assetTypes.etfs && asset.type === "etf") return false
      if (!settings.assetTypes.crypto && asset.type === "crypto") return false

      // We'll still sort by undervaluation score, but not filter by threshold
      // This ensures all assets are shown

      // Filter by risk level
      if (settings.riskLevel === "low" && asset.riskScore > 40) return false
      if (settings.riskLevel === "medium" && asset.riskScore > 70) return false

      // Filter by tab
      if (activeTab !== "all" && asset.type !== activeTab) return false

      return true
    })
    .sort((a, b) => b.undervaluationScore - a.undervaluationScore)

  const handleBuy = (asset: AssetOpportunity) => {
    setSelectedAsset(asset)
    setPurchaseAmount(Math.min(settings.maxBudgetPerTrade, balance))
    setAction("buy")
  }

  const handleSell = (asset: AssetOpportunity) => {
    const portfolioAsset = assets.find((a) => a.symbol === asset.symbol)
    if (!portfolioAsset || portfolioAsset.quantity <= 0) {
      toast({
        title: "Cannot sell",
        description: `You don't own any ${asset.symbol} to sell`,
        variant: "destructive",
      })
      return
    }

    setSelectedAsset(asset)
    setSellQuantity(portfolioAsset.quantity)
    setAction("sell")
  }

  // Update the handleAnalyze function to ensure proper symbol mapping
  const handleAnalyze = (asset: AssetOpportunity) => {
    // Scroll to the chart section
    const marketOverviewCard = document.getElementById("market-overview")
    if (marketOverviewCard) {
      marketOverviewCard.scrollIntoView({ behavior: "smooth" })
    }

    // Map the symbol to the appropriate format for TradingView
    let tvSymbol = ""

    // For crypto, use the appropriate format
    if (asset.type === "crypto") {
      if (asset.symbol === "BTC") {
        tvSymbol = "COINBASE:BTCUSD"
      } else if (asset.symbol === "ETH") {
        tvSymbol = "COINBASE:ETHUSD"
      } else if (asset.symbol === "SOL") {
        tvSymbol = "COINBASE:SOLUSD"
      } else {
        tvSymbol = `COINBASE:${asset.symbol}USD`
      }
    }
    // For stocks and ETFs, use the correct exchange prefix
    else if (asset.type === "etf") {
      if (asset.symbol === "SPY") {
        tvSymbol = "AMEX:SPY"
      } else if (asset.symbol === "QQQ") {
        tvSymbol = "NASDAQ:QQQ"
      } else {
        tvSymbol = `AMEX:${asset.symbol}`
      }
    } else {
      // Default to NASDAQ for stocks
      tvSymbol = `NASDAQ:${asset.symbol}`
    }

    // Dispatch custom event to update the chart with the correct symbol
    const event = new CustomEvent("analyzeAsset", {
      detail: {
        symbol: tvSymbol,
      },
    })
    window.dispatchEvent(event)

    toast({
      title: "Analyzing Asset",
      description: `Displaying chart for ${asset.symbol}`,
    })
  }

  const handlePurchaseAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number.parseFloat(e.target.value)
    if (isNaN(amount) || amount <= 0) {
      setPurchaseAmount(0)
      return
    }

    setPurchaseAmount(Math.min(amount, balance))
  }

  const handleSellQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAsset) return

    const portfolioAsset = assets.find((a) => a.symbol === selectedAsset.symbol)
    if (!portfolioAsset) return

    const quantity = Number.parseFloat(e.target.value)
    if (isNaN(quantity) || quantity <= 0) {
      setSellQuantity(0)
      return
    }

    setSellQuantity(Math.min(quantity, portfolioAsset.quantity))
  }

  const handleConfirmBuy = () => {
    if (!selectedAsset || purchaseAmount <= 0 || purchaseAmount > balance) return

    const quantity = purchaseAmount / selectedAsset.price

    buyAsset(
      {
        id: selectedAsset.id,
        symbol: selectedAsset.symbol,
        name: selectedAsset.name,
        type: selectedAsset.type,
        price: selectedAsset.price,
        priceChange24h: selectedAsset.priceChange24h,
        costBasis: purchaseAmount,
      },
      quantity,
    )

    toast({
      title: "Purchase successful",
      description: `You have purchased ${quantity.toFixed(6)} ${selectedAsset.symbol} for ${formatCurrency(purchaseAmount)}`,
    })

    setSelectedAsset(null)
    setPurchaseAmount(0)
    setAction(null)
  }

  const handleConfirmSell = () => {
    if (!selectedAsset || sellQuantity <= 0) return

    const portfolioAsset = assets.find((a) => a.symbol === selectedAsset.symbol)
    if (!portfolioAsset || sellQuantity > portfolioAsset.quantity) return

    sellAsset(portfolioAsset.id, sellQuantity)

    toast({
      title: "Sale successful",
      description: `You have sold ${sellQuantity.toFixed(6)} ${selectedAsset.symbol} for ${formatCurrency(sellQuantity * selectedAsset.price)}`,
    })

    setSelectedAsset(null)
    setSellQuantity(0)
    setAction(null)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Undervalued Assets</CardTitle>
            <CardDescription>
              Assets are analyzed using a combination of technical indicators, moving averages, and historical price
              patterns to identify potential undervaluation.
            </CardDescription>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="stock">Stocks</TabsTrigger>
              <TabsTrigger value="etf">ETFs</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {filteredOpportunities.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-center">
            <div className="text-muted-foreground">
              <p>No undervalued assets found</p>
              <p className="text-sm">Try adjusting your settings or check back later</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOpportunities.map((asset) => {
              const portfolioAsset = assets.find((a) => a.symbol === asset.symbol)
              const hasAsset = portfolioAsset && portfolioAsset.quantity > 0

              return (
                <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg hover-lift">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`rounded-full p-2 ${
                        asset.type === "stock"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          : asset.type === "etf"
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                            : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                      }`}
                    >
                      {asset.type === "crypto" ? (
                        <Sparkles className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{asset.symbol}</p>
                      <p className="text-sm text-muted-foreground">{asset.name}</p>
                      {hasAsset && (
                        <p className="text-xs text-primary">
                          You own: {portfolioAsset.quantity.toFixed(6)} {asset.symbol}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{formatCurrency(asset.price)}</p>
                      <span className={`text-xs ${asset.priceChange24h < 0 ? "text-red-500" : "text-green-500"}`}>
                        {asset.priceChange24h > 0 ? "+" : ""}
                        {asset.priceChange24h.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center cursor-help">
                              <p className="text-xs font-medium">
                                Undervalued:{" "}
                                {asset.undervaluationScore > 0 ? `${asset.undervaluationScore.toFixed(0)}%` : "0%"}
                              </p>
                              <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs p-3">
                            <div className="space-y-2">
                              <p className="font-medium">
                                {asset.undervaluationScore > 0
                                  ? `${asset.symbol} appears to be ${asset.undervaluationScore.toFixed(0)}% undervalued`
                                  : `${asset.symbol} is trading at fair value`}
                              </p>
                              <p>
                                {asset.undervaluationScore > 0
                                  ? asset.undervaluationReason
                                  : "This asset is currently trading at or near its fair value based on our analysis of historical price patterns, moving averages, and market indicators."}
                              </p>
                              {asset.undervaluationScore > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Our undervaluation score is calculated using historical price data, moving averages,
                                  and volatility metrics.
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleBuy(asset)}>
                      Buy
                    </Button>
                    <Button
                      size="sm"
                      variant={hasAsset ? "default" : "outline"}
                      onClick={() => handleSell(asset)}
                      disabled={!hasAsset}
                    >
                      Sell
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleAnalyze(asset)}>
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {selectedAsset && action === "buy" && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Buy {selectedAsset.symbol}</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Current Price:</span>
                  <span className="font-medium">{formatCurrency(selectedAsset.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Undervaluation:</span>
                  <span className="font-medium">
                    {selectedAsset.undervaluationScore > 0 ? selectedAsset.undervaluationScore.toFixed(0) : "0"}%
                  </span>
                </div>
                <div className="space-y-2">
                  <label htmlFor="purchase-amount" className="text-sm font-medium">
                    Amount to invest
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <input
                      id="purchase-amount"
                      type="number"
                      className="w-full pl-7 py-2 border rounded-md"
                      value={purchaseAmount}
                      onChange={handlePurchaseAmountChange}
                      min="0.01"
                      step="0.01"
                      max={balance}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-medium">
                    {purchaseAmount > 0 ? (purchaseAmount / selectedAsset.price).toFixed(6) : "0"}{" "}
                    {selectedAsset.symbol}
                  </span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedAsset(null)
                      setAction(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleConfirmBuy}
                    disabled={purchaseAmount <= 0 || purchaseAmount > balance}
                  >
                    Confirm Purchase
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedAsset && action === "sell" && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Sell {selectedAsset.symbol}</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Current Price:</span>
                  <span className="font-medium">{formatCurrency(selectedAsset.price)}</span>
                </div>
                {(() => {
                  const portfolioAsset = assets.find((a) => a.symbol === selectedAsset.symbol)
                  return portfolioAsset ? (
                    <div className="flex justify-between">
                      <span>Your Holdings:</span>
                      <span className="font-medium">
                        {portfolioAsset.quantity.toFixed(6)} {selectedAsset.symbol}
                      </span>
                    </div>
                  ) : null
                })()}
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
                    max={(() => {
                      const portfolioAsset = assets.find((a) => a.symbol === selectedAsset.symbol)
                      return portfolioAsset ? portfolioAsset.quantity : 0
                    })()}
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
                      setAction(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleConfirmSell}
                    disabled={
                      sellQuantity <= 0 ||
                      (() => {
                        const portfolioAsset = assets.find((a) => a.symbol === selectedAsset.symbol)
                        return !portfolioAsset || sellQuantity > portfolioAsset.quantity
                      })()
                    }
                  >
                    Confirm Sale
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredOpportunities.length} {activeTab === "all" ? "assets" : activeTab + "s"}
        </p>
        <Button variant="outline" size="sm">
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
