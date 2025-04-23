"use client"

import type React from "react"

import { useState } from "react"
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export function WalletActions() {
  const { addFunds, withdrawFunds, balance } = useWallet()
  const [amount, setAmount] = useState("")
  const [activeTab, setActiveTab] = useState("deposit")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "deposit") {
      addFunds(numAmount)
      toast({
        title: "Funds added",
        description: `$${numAmount.toFixed(2)} has been added to your wallet`,
      })
    } else {
      if (numAmount > balance) {
        toast({
          title: "Insufficient funds",
          description: "You don't have enough funds to withdraw this amount",
          variant: "destructive",
        })
        return
      }

      withdrawFunds(numAmount)
      toast({
        title: "Funds withdrawn",
        description: `$${numAmount.toFixed(2)} has been withdrawn from your wallet`,
      })
    }

    setAmount("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Funds</CardTitle>
        <CardDescription>Add or withdraw funds from your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          <TabsContent value="deposit" className="pt-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="deposit-amount" className="text-sm font-medium">
                    Amount to deposit
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-7"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Deposit Funds
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="withdraw" className="pt-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="withdraw-amount" className="text-sm font-medium">
                    Amount to withdraw
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-7"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0.01"
                      step="0.01"
                      max={balance.toString()}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  Withdraw Funds
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {activeTab === "deposit"
          ? "Funds will be added to your simulation wallet immediately."
          : "Withdrawals from your simulation wallet are processed instantly."}
      </CardFooter>
    </Card>
  )
}
