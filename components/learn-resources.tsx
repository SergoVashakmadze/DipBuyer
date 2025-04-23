"use client"

import { Book, DollarSign, LineChart, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const resources = {
  basics: [
    {
      title: "Introduction to Investing",
      description: "Learn the fundamentals of investing and building wealth",
      url: "https://www.investopedia.com/articles/basics/06/invest1000.asp",
      icon: DollarSign,
    },
    {
      title: "Understanding Risk and Return",
      description: "How to balance risk and potential returns in your portfolio",
      url: "https://www.investopedia.com/terms/r/riskreturntradeoff.asp",
      icon: LineChart,
    },
    {
      title: "Asset Allocation Guide",
      description: "Strategies for diversifying your investments across asset classes",
      url: "https://www.investopedia.com/managing-wealth/achieve-optimal-asset-allocation/",
      icon: Book,
    },
  ],
  stocks: [
    {
      title: "Stock Market Basics",
      description: "Understanding how stocks work and how to analyze them",
      url: "https://www.investopedia.com/articles/investing/082614/how-stock-market-works.asp",
      icon: LineChart,
    },
    {
      title: "Value Investing",
      description: "Learn how to identify undervalued stocks using fundamental analysis",
      url: "https://www.investopedia.com/terms/v/valueinvesting.asp",
      icon: DollarSign,
    },
    {
      title: "Technical Analysis",
      description: "Using charts and patterns to make trading decisions",
      url: "https://www.investopedia.com/terms/t/technicalanalysis.asp",
      icon: LineChart,
    },
  ],
  crypto: [
    {
      title: "Cryptocurrency Basics",
      description: "Understanding blockchain technology and digital assets",
      url: "https://www.investopedia.com/terms/c/cryptocurrency.asp",
      icon: Sparkles,
    },
    {
      title: "Bitcoin Explained",
      description: "Learn about the first and most valuable cryptocurrency",
      url: "https://www.investopedia.com/terms/b/bitcoin.asp",
      icon: Sparkles,
    },
    {
      title: "DeFi (Decentralized Finance)",
      description: "Exploring the world of decentralized financial applications",
      url: "https://www.investopedia.com/decentralized-finance-defi-5113835",
      icon: Sparkles,
    },
  ],
}

export function LearnResources() {
  return (
    <Tabs defaultValue="basics">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basics">Investment Basics</TabsTrigger>
        <TabsTrigger value="stocks">Stocks & ETFs</TabsTrigger>
        <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
      </TabsList>

      {Object.entries(resources).map(([category, items]) => (
        <TabsContent key={category} value={category} className="pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((resource, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <resource.icon className="h-5 w-5" />
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Click to learn more about this topic on Investopedia.</p>
                </CardContent>
                <CardFooter>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Read Article →
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
