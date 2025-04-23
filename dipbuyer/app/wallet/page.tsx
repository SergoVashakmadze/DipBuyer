import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { WalletBalance } from "@/components/wallet-balance"
import { TransactionHistory } from "@/components/transaction-history"
import { WalletActions } from "@/components/wallet-actions"
import { CoinbaseWalletConnect } from "@/components/coinbase-wallet-connect"
import { CoinbaseWalletDetails } from "@/components/coinbase-wallet-details"
import { CoinbaseTransactions } from "@/components/coinbase-transactions"
import { CoinbaseSend } from "@/components/coinbase-send"

export default function WalletPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Wallet" description="Manage your funds and view transaction history." />

      <Tabs defaultValue="simulation" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="simulation">Simulation Wallet</TabsTrigger>
          <TabsTrigger value="coinbase">Coinbase Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="simulation">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <WalletBalance />
              <WalletActions />
            </div>
            <TransactionHistory />
          </div>
        </TabsContent>

        <TabsContent value="coinbase">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <CoinbaseWalletConnect />
              <CoinbaseWalletDetails />
              <CoinbaseSend />
            </div>
            <CoinbaseTransactions />
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
