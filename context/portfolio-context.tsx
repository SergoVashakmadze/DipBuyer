"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useWallet } from "./wallet-context"

export interface Asset {
  id: string
  symbol: string
  name: string
  type: "stock" | "etf" | "crypto"
  price: number
  priceChange24h: number
  quantity: number
  value: number
  costBasis: number
  profitLoss: number
  profitLossPercentage: number
}

interface PortfolioContextType {
  assets: Asset[]
  totalValue: number
  totalProfitLoss: number
  totalProfitLossPercentage: number
  buyAsset: (asset: Omit<Asset, "quantity" | "value" | "profitLoss" | "profitLossPercentage">, quantity: number) => void
  sellAsset: (assetId: string, quantity: number) => void
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { executeTransaction } = useWallet()
  const [assets, setAssets] = useState<Asset[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [totalProfitLoss, setTotalProfitLoss] = useState(0)
  const [totalProfitLossPercentage, setTotalProfitLossPercentage] = useState(0)

  // Load saved portfolio data from localStorage
  useEffect(() => {
    const savedAssets = localStorage.getItem("dipbuyer-assets")
    if (savedAssets) setAssets(JSON.parse(savedAssets))
  }, [])

  // Save portfolio data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("dipbuyer-assets", JSON.stringify(assets))
  }, [assets])

  // Calculate portfolio totals when assets change
  useEffect(() => {
    const value = assets.reduce((sum, asset) => sum + asset.value, 0)
    const costBasis = assets.reduce((sum, asset) => sum + asset.costBasis, 0)
    const profitLoss = value - costBasis
    const profitLossPercentage = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0

    setTotalValue(value)
    setTotalProfitLoss(profitLoss)
    setTotalProfitLossPercentage(profitLossPercentage)
  }, [assets])

  const buyAsset = (
    asset: Omit<Asset, "quantity" | "value" | "profitLoss" | "profitLossPercentage">,
    quantity: number,
  ) => {
    if (quantity <= 0) return

    const cost = asset.price * quantity

    // Add transaction to wallet
    executeTransaction({
      type: "buy",
      amount: cost,
      asset: asset.symbol,
      price: asset.price,
      quantity,
    })

    // Update portfolio
    setAssets((prev) => {
      const existingAssetIndex = prev.findIndex((a) => a.id === asset.id)

      if (existingAssetIndex >= 0) {
        // Update existing asset
        const existingAsset = prev[existingAssetIndex]
        const newQuantity = existingAsset.quantity + quantity
        const newCostBasis = existingAsset.costBasis + cost
        const newValue = asset.price * newQuantity
        const newProfitLoss = newValue - newCostBasis
        const newProfitLossPercentage = (newProfitLoss / newCostBasis) * 100

        const updatedAsset = {
          ...existingAsset,
          price: asset.price,
          priceChange24h: asset.priceChange24h,
          quantity: newQuantity,
          value: newValue,
          costBasis: newCostBasis,
          profitLoss: newProfitLoss,
          profitLossPercentage: newProfitLossPercentage,
        }

        const newAssets = [...prev]
        newAssets[existingAssetIndex] = updatedAsset
        return newAssets
      } else {
        // Add new asset
        const newAsset: Asset = {
          ...asset,
          quantity,
          value: asset.price * quantity,
          costBasis: asset.price * quantity,
          profitLoss: 0,
          profitLossPercentage: 0,
        }

        return [...prev, newAsset]
      }
    })
  }

  const sellAsset = (assetId: string, quantity: number) => {
    if (quantity <= 0) return

    const assetIndex = assets.findIndex((a) => a.id === assetId)
    if (assetIndex < 0) return

    const asset = assets[assetIndex]
    if (quantity > asset.quantity) return

    const saleValue = asset.price * quantity
    const costBasisPerUnit = asset.costBasis / asset.quantity
    const costBasisSold = costBasisPerUnit * quantity

    // Add transaction to wallet
    executeTransaction({
      type: "sell",
      amount: saleValue,
      asset: asset.symbol,
      price: asset.price,
      quantity,
    })

    // Update portfolio
    setAssets((prev) => {
      if (quantity === asset.quantity) {
        // Remove asset if selling all
        return prev.filter((a) => a.id !== assetId)
      } else {
        // Update asset quantity
        const newQuantity = asset.quantity - quantity
        const newCostBasis = asset.costBasis - costBasisSold
        const newValue = asset.price * newQuantity
        const newProfitLoss = newValue - newCostBasis
        const newProfitLossPercentage = (newProfitLoss / newCostBasis) * 100

        const updatedAsset = {
          ...asset,
          quantity: newQuantity,
          value: newValue,
          costBasis: newCostBasis,
          profitLoss: newProfitLoss,
          profitLossPercentage: newProfitLossPercentage,
        }

        const newAssets = [...prev]
        newAssets[assetIndex] = updatedAsset
        return newAssets
      }
    })
  }

  return (
    <PortfolioContext.Provider
      value={{
        assets,
        totalValue,
        totalProfitLoss,
        totalProfitLossPercentage,
        buyAsset,
        sellAsset,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}
