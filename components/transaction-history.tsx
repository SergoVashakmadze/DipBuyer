"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ArrowDownToLine, ArrowUpFromLine, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { useWallet, type Transaction } from "@/context/wallet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"

export function TransactionHistory() {
  const { transactions } = useWallet()
  const [filter, setFilter] = useState<string>("all")

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true
    return transaction.type === filter
  })

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return <ArrowDownToLine className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowUpFromLine className="h-4 w-4 text-red-500" />
      case "buy":
        return <ArrowDownLeft className="h-4 w-4 text-blue-500" />
      case "sell":
        return <ArrowUpRight className="h-4 w-4 text-purple-500" />
    }
  }

  const getTransactionLabel = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return "Deposit"
      case "withdrawal":
        return "Withdrawal"
      case "buy":
        return "Buy"
      case "sell":
        return "Sell"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="buy">Buys</SelectItem>
              <SelectItem value="sell">Sells</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-center">
              <div className="text-muted-foreground">
                <p>No transactions found</p>
                <p className="text-sm">Transactions will appear here once you make them</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full p-2 bg-muted">{getTransactionIcon(transaction.type)}</div>
                    <div>
                      <p className="text-sm font-medium">
                        {getTransactionLabel(transaction.type)}
                        {transaction.asset && ` - ${transaction.asset}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(transaction.timestamp, "MMM d, yyyy 'at' h:mm a")}
                      </p>
                      {transaction.quantity && transaction.price && (
                        <p className="text-xs text-muted-foreground">
                          {transaction.quantity} @ {formatCurrency(transaction.price)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      transaction.type === "deposit" || transaction.type === "sell" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {transaction.type === "deposit" || transaction.type === "sell" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
