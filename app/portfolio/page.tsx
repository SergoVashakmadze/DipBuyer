import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { PortfolioTable } from "@/components/portfolio-table"
import { PortfolioChart } from "@/components/portfolio-chart"
import { PortfolioStats } from "@/components/portfolio-stats"

export default function PortfolioPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Portfolio" description="Manage and track your investment portfolio." />
      <div className="grid gap-4">
        <PortfolioStats />
        <div className="grid gap-4 md:grid-cols-2">
          <PortfolioChart />
          <PortfolioTable />
        </div>
      </div>
    </DashboardShell>
  )
}
