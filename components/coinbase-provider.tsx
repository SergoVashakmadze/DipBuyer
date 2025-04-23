"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface WalletInfo {
  address: string
  balance: string
  network: string
}

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  asset: string
  timestamp: Date
  status: "pending" | "confirmed" | "failed"
}

interface CoinbaseContextType {
  isInitialized: boolean
  isConnected: boolean
  wallet: WalletInfo | null
  transactions: Transaction[]
  isLoading: boolean
  connect: () => Promise<void>
  disconnect: () => void
  getBalance: () => Promise<void>
  getTransactions: () => Promise<void>
  executeTransaction: (recipient: string, amount: number, asset: string) => Promise<string>
}

const CoinbaseContext = createContext<CoinbaseContextType | undefined>(undefined)

export function CoinbaseProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load saved wallet data from localStorage
  useEffect(() => {
    const savedWallet = localStorage.getItem("dipbuyer-coinbase-wallet")
    const savedConnected = localStorage.getItem("dipbuyer-coinbase-connected")
    const savedTransactions = localStorage.getItem("dipbuyer-coinbase-transactions")

    if (savedWallet) setWallet(JSON.parse(savedWallet))
    if (savedConnected) setIsConnected(savedConnected === "true")
    if (savedTransactions) {
      setTransactions(
        JSON.parse(savedTransactions).map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        })),
      )
    }

    // Simulate initializing the Coinbase SDK
    const initCoinbase = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsInitialized(true)
    }

    initCoinbase()
  }, [])

  // Save wallet data to localStorage when it changes
  useEffect(() => {
    if (wallet) localStorage.setItem("dipbuyer-coinbase-wallet", JSON.stringify(wallet))
    localStorage.setItem("dipbuyer-coinbase-connected", isConnected.toString())
    localStorage.setItem("dipbuyer-coinbase-transactions", JSON.stringify(transactions))
  }, [wallet, isConnected, transactions])

  const connect = async () => {
    if (!isInitialized) return

    setIsLoading(true)
    try {
      // Simulate connecting to Coinbase wallet
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random Ethereum address
      const address = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

      setWallet({
        address,
        balance: (Math.random() * 10).toFixed(4),
        network: "Ethereum Mainnet",
      })

      setIsConnected(true)

      // Get initial transactions
      await getTransactions()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setWallet(null)
    setTransactions([])
  }

  const getBalance = async () => {
    if (!isConnected || !wallet) return

    setIsLoading(true)
    try {
      // Simulate fetching balance
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update with a slightly different balance to simulate changes
      setWallet({
        ...wallet,
        balance: (Number.parseFloat(wallet.balance) + (Math.random() * 0.01 - 0.005)).toFixed(4),
      })
    } catch (error) {
      console.error("Failed to get balance:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTransactions = async () => {
    if (!isConnected || !wallet) return

    setIsLoading(true)
    try {
      // Simulate fetching transactions
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate some random transactions
      const newTransactions: Transaction[] = Array.from({ length: 5 }, (_, i) => {
        const isIncoming = Math.random() > 0.5
        return {
          hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          from: isIncoming
            ? `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
            : wallet.address,
          to: isIncoming
            ? wallet.address
            : `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          value: (Math.random() * 2).toFixed(4),
          asset: Math.random() > 0.3 ? "ETH" : Math.random() > 0.5 ? "USDC" : "USDT",
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          status: Math.random() > 0.8 ? "pending" : Math.random() > 0.1 ? "confirmed" : "failed",
        }
      })

      // Sort by timestamp (newest first)
      newTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      setTransactions(newTransactions)
    } catch (error) {
      console.error("Failed to get transactions:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const executeTransaction = async (recipient: string, amount: number, asset: string): Promise<string> => {
    if (!isConnected || !wallet) {
      throw new Error("Wallet not connected")
    }

    setIsLoading(true)
    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate transaction hash
      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

      // Add to transactions
      const newTransaction: Transaction = {
        hash: txHash,
        from: wallet.address,
        to: recipient,
        value: amount.toString(),
        asset,
        timestamp: new Date(),
        status: "pending",
      }

      setTransactions((prev) => [newTransaction, ...prev])

      // Update balance (for ETH only)
      if (asset === "ETH") {
        setWallet({
          ...wallet,
          balance: (Number.parseFloat(wallet.balance) - amount).toFixed(4),
        })
      }

      return txHash
    } catch (error) {
      console.error("Transaction failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CoinbaseContext.Provider
      value={{
        isInitialized,
        isConnected,
        wallet,
        transactions,
        isLoading,
        connect,
        disconnect,
        getBalance,
        getTransactions,
        executeTransaction,
      }}
    >
      {children}
    </CoinbaseContext.Provider>
  )
}

export function useCoinbase() {
  const context = useContext(CoinbaseContext)
  if (context === undefined) {
    throw new Error("useCoinbase must be used within a CoinbaseProvider")
  }
  return context
}
