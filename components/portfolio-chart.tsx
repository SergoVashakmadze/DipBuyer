"use client"

import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { usePortfolio } from "@/context/portfolio-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/utils"

// Sample historical portfolio data
const samplePortfolioHistory = [
  { date: "2023-01-01", value: 10000 },
  { date: "2023-02-01", value: 10200 },
  { date: "2023-03-01", value: 10150 },
  { date: "2023-04-01", value: 10400 },
  { date: "2023-05-01", value: 10600 },
  { date: "2023-06-01", value: 10550 },
  { date: "2023-07-01", value: 10800 },
  { date: "2023-08-01", value: 11000 },
  { date: "2023-09-01", value: 10900 },
  { date: "2023-10-01", value: 11200 },
  { date: "2023-11-01", value: 11500 },
  { date: "2023-12-01", value: 11800 },
]

export function PortfolioChart() {
  const { totalValue } = usePortfolio()
  const [timeRange, setTimeRange] = useState("1d")

  // Add current value to the chart data
  const chartData = [...samplePortfolioHistory, { date: new Date().toISOString().split("T")[0], value: totalValue }]

  // Filter data based on selected time range
  const getFilteredData = () => {
    const now = new Date()
    const cutoffDate = new Date()

    if (timeRange === "1d") {
      cutoffDate.setDate(now.getDate() - 1)
    } else if (timeRange === "1m") {
      cutoffDate.setMonth(now.getMonth() - 1)
    } else if (timeRange === "3m") {
      cutoffDate.setMonth(now.getMonth() - 3)
    } else if (timeRange === "6m") {
      cutoffDate.setMonth(now.getMonth() - 6)
    } else {
      cutoffDate.setFullYear(now.getFullYear() - 1)
    }

    return chartData.filter((item) => new Date(item.date) >= cutoffDate)
  }

  const filteredData = getFilteredData()

  const formatXAxis = (date: string) => {
    const d = new Date(date)
    if (timeRange === "1d") {
      return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`
    }
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  const formatYAxis = (value: number) => {
    return formatCurrency(value).replace(".00", "")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Track your portfolio value over time</CardDescription>
          </div>
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="1d">1D</TabsTrigger>
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="3m">3M</TabsTrigger>
              <TabsTrigger value="6m">6M</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="h-[300px]"
          config={{
            value: {
              label: "Portfolio Value",
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatXAxis} />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                name="Portfolio Value"
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
