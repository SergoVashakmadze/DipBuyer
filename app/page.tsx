import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AssetOpportunities } from "@/components/asset-opportunities"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { MarketOverview } from "@/components/market-overview"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" description="Monitor undervalued assets and your portfolio performance." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MarketOverview className="col-span-full market-overview" />
        <AssetOpportunities className="md:col-span-2" />
        <PortfolioSummary />
      </div>
    </DashboardShell>
  )
}
