"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/components/theme-provider"

export function TradingViewTickerTape() {
  const { theme } = useTheme()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const colorTheme =
      theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? "dark"
        : "light"

    const container = document.getElementById("tradingview-ticker-tape")
    if (container) {
      container.innerHTML = ""

      const widget = document.createElement("div")
      widget.className = "tradingview-widget-container"

      const widgetDiv = document.createElement("div")
      widgetDiv.className = "tradingview-widget-container__widget"
      widget.appendChild(widgetDiv)

      const script = document.createElement("script")
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
      script.async = true
      script.innerHTML = JSON.stringify({
        symbols: [
          {
            proName: "FOREXCOM:SPXUSD",
            title: "S&P 500",
          },
          {
            proName: "FOREXCOM:NSXUSD",
            title: "Nasdaq 100",
          },
          {
            proName: "FX_IDC:EURUSD",
            title: "EUR/USD",
          },
          {
            proName: "BITSTAMP:BTCUSD",
            title: "BTC/USD",
          },
          {
            proName: "BITSTAMP:ETHUSD",
            title: "ETH/USD",
          },
        ],
        colorTheme,
        isTransparent: false,
        displayMode: "adaptive",
        locale: "en",
      })

      widget.appendChild(script)
      container.appendChild(widget)
    }

    return () => {
      const container = document.getElementById("tradingview-ticker-tape")
      if (container) {
        container.innerHTML = ""
      }
    }
  }, [isClient, theme])

  return <div id="tradingview-ticker-tape" className="w-full h-[46px]" />
}
