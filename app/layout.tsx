import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TradingViewTickerTape } from "@/components/trading-view-ticker-tape"
import { CoinbaseProvider } from "@/components/coinbase-provider"
import { WalletProvider } from "@/context/wallet-context"
import { PortfolioProvider } from "@/context/portfolio-context"
import { SettingsProvider } from "@/context/settings-context"
import { Navbar } from "@/components/navbar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DipBuyer - AI-Powered Undervalued Asset Buying Agent",
  description: "Identify and invest in undervalued financial assets with AI-powered analysis",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
        <link rel="stylesheet" href="/tradingview-fix.css" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SettingsProvider>
            <CoinbaseProvider>
              <WalletProvider>
                <PortfolioProvider>
                  <div className="flex min-h-screen flex-col">
                    <TradingViewTickerTape />
                    <Navbar />
                    <main className="flex-1">{children}</main>
                  </div>
                  <Toaster />
                </PortfolioProvider>
              </WalletProvider>
            </CoinbaseProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
