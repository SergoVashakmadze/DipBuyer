"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "buy" | "sell"
  amount: number
  asset?: string
  price?: number
  quantity?: number
  timestamp: Date
  status: "completed" | "pending" | "failed"
}

interface WalletContextType {
  balance: number
  transactions: Transaction[]
  addFunds: (amount: number) => void
  withdrawFunds: (amount: number) => void
  executeTransaction: (transaction: Omit<Transaction, "id" | "timestamp" | "status">) => void
  isCoinbaseConnected: boolean
  connectCoinbaseWallet: () => Promise<void>
  disconnectCoinbaseWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(10000) // Start with $10,000 simulation balance
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isCoinbaseConnected, setIsCoinbaseConnected] = useState(false)

  // Load saved wallet data from localStorage
  useEffect(() => {
    const savedBalance = localStorage.getItem("dipbuyer-balance")
    const savedTransactions = localStorage.getItem("dipbuyer-transactions")
    const savedConnection = localStorage.getItem("dipbuyer-coinbase-connected")

    if (savedBalance) setBalance(Number.parseFloat(savedBalance))
    if (savedTransactions)
      setTransactions(
        JSON.parse(savedTransactions).map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        })),
      )
    if (savedConnection) setIsCoinbaseConnected(savedConnection === "true")
  }, [])

  // Save wallet data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("dipbuyer-balance", balance.toString())
    localStorage.setItem("dipbuyer-transactions", JSON.stringify(transactions))
    localStorage.setItem("dipbuyer-coinbase-connected", isCoinbaseConnected.toString())
  }, [balance, transactions, isCoinbaseConnected])

  const addFunds = (amount: number) => {
    if (amount <= 0) return

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: "deposit",
      amount,
      timestamp: new Date(),
      status: "completed",
    }

    setBalance((prev) => prev + amount)
    setTransactions((prev) => [newTransaction, ...prev])
  }

  const withdrawFunds = (amount: number) => {
    if (amount <= 0 || amount > balance) return

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: "withdrawal",
      amount,
      timestamp: new Date(),
      status: "completed",
    }

    setBalance((prev) => prev - amount)
    setTransactions((prev) => [newTransaction, ...prev])
  }

  const executeTransaction = (transaction: Omit<Transaction, "id" | "timestamp" | "status">) => {
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ...transaction,
      timestamp: new Date(),
      status: "completed",
    }

    if (transaction.type === "buy") {
      const cost = transaction.amount
      if (cost > balance) return

      setBalance((prev) => prev - cost)
    } else if (transaction.type === "sell") {
      setBalance((prev) => prev + transaction.amount)
    }

    setTransactions((prev) => [newTransaction, ...prev])
  }

  const connectCoinbaseWallet = async () => {
    // Simulate connecting to Coinbase wallet
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsCoinbaseConnected(true)
        resolve()
      }, 1500)
    })
  }

  const disconnectCoinbaseWallet = () => {
    setIsCoinbaseConnected(false)
  }

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        addFunds,
        withdrawFunds,
        executeTransaction,
        isCoinbaseConnected,
        connectCoinbaseWallet,
        disconnectCoinbaseWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
