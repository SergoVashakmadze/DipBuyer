import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { LearnSearch } from "@/components/learn-search"
import { LearnResources } from "@/components/learn-resources"

export default function LearnPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Learn" description="Expand your knowledge about investing and financial markets." />
      <div className="space-y-4">
        <LearnSearch />
        <LearnResources />
      </div>
    </DashboardShell>
  )
}
