"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "@/components/theme-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface MarketOverviewProps {
  className?: string
}

// Define the TradingView type
declare global {
  interface Window {
    TradingView?: {
      widget: new (config: any) => any
    }
  }
}

export function MarketOverview({ className }: MarketOverviewProps) {
  const { theme } = useTheme()
  const [selectedSymbol, setSelectedSymbol] = useState<string>("NASDAQ:AAPL")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const widgetRef = useRef<any>(null)
  const chartIdRef = useRef<string>(`tradingview-widget-${Date.now()}`)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Force a refresh of the chart
  const refreshChart = () => {
    setIsLoading(true)
    setError(null)

    // Generate a new chart ID to ensure a fresh container
    chartIdRef.current = `tradingview-widget-${Date.now()}`

    // Clean up existing widget
    if (widgetRef.current) {
      try {
        widgetRef.current = null
      } catch (e) {
        console.error("Error cleaning up widget:", e)
      }
    }

    // Re-initialize the chart
    initializeChart()
  }

  // Listen for analyze asset events
  useEffect(() => {
    const handleAnalyzeAsset = (event: CustomEvent) => {
      if (!event.detail || !event.detail.symbol) return
      setSelectedSymbol(event.detail.symbol)
      setIsLoading(true)
      setError(null)

      // Generate a new chart ID to ensure a fresh container
      chartIdRef.current = `tradingview-widget-${Date.now()}`
    }

    window.addEventListener("analyzeAsset", handleAnalyzeAsset as EventListener)
    return () => {
      window.removeEventListener("analyzeAsset", handleAnalyzeAsset as EventListener)
    }
  }, [])

  // Safely remove script element
  const safeRemoveScript = () => {
    if (scriptRef.current) {
      try {
        // Check if the script is actually a child of document.head before removing
        if (scriptRef.current.parentNode === document.head) {
          document.head.removeChild(scriptRef.current)
        }
        scriptRef.current = null
      } catch (e) {
        console.error("Error removing script:", e)
      }
    }
  }

  // Initialize the chart
  const initializeChart = () => {
    if (!containerRef.current) return

    // Clear the container
    containerRef.current.innerHTML = ""
    setIsLoading(true)
    setError(null)

    // Clear any existing loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }

    // Set a timeout to detect if loading takes too long
    loadingTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setError("Chart loading timed out. Please try refreshing.")
      }
    }, 15000) // 15 seconds timeout

    const isDarkMode =
      theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    // Create a container for the widget
    const widgetContainer = document.createElement("div")
    widgetContainer.id = chartIdRef.current
    widgetContainer.style.width = "100%"
    widgetContainer.style.height = "100%"
    containerRef.current.appendChild(widgetContainer)

    // Check if TradingView is already loaded
    if (window.TradingView) {
      createWidget(widgetContainer.id, isDarkMode)
      return
    }

    // Safely remove any existing script
    safeRemoveScript()

    // Load TradingView script
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      createWidget(widgetContainer.id, isDarkMode)
    }
    script.onerror = () => {
      setError("Failed to load TradingView chart library")
      setIsLoading(false)
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }

    document.head.appendChild(script)
    scriptRef.current = script
  }

  // Create the TradingView widget
  const createWidget = (containerId: string, isDarkMode: boolean) => {
    if (!window.TradingView) {
      setError("TradingView library not loaded")
      setIsLoading(false)
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
      return
    }

    try {
      const widgetOptions = {
        autosize: true,
        symbol: selectedSymbol,
        interval: "D",
        timezone: "Etc/UTC",
        theme: isDarkMode ? "dark" : "light",
        style: "1",
        locale: "en",
        toolbar_bg: isDarkMode ? "#1e293b" : "#ffffff",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerId,
        studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
        backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
        gridColor: isDarkMode ? "#475569" : "#cbd5e1",
        overrides: {
          "mainSeriesProperties.candleStyle.upColor": "#22c55e",
          "mainSeriesProperties.candleStyle.downColor": "#ef4444",
          "mainSeriesProperties.lineStyle.color": isDarkMode ? "#60a5fa" : "#2563eb",
          "scalesProperties.textColor": isDarkMode ? "#f8fafc" : "#334155",
          "paneProperties.background": isDarkMode ? "#1e293b" : "#ffffff",
          "paneProperties.vertGridProperties.color": isDarkMode
            ? "rgba(148, 163, 184, 0.3)"
            : "rgba(100, 116, 139, 0.2)",
          "paneProperties.horzGridProperties.color": isDarkMode
            ? "rgba(148, 163, 184, 0.3)"
            : "rgba(100, 116, 139, 0.2)",
        },
        loading_screen: { backgroundColor: isDarkMode ? "#1e293b" : "#ffffff" },
        hide_side_toolbar: false,
        // Add a callback for when the widget is loaded
        saved_data: null,
        disabled_features: [],
        enabled_features: [],
      }

      const widget = new window.TradingView.widget(widgetOptions)
      widgetRef.current = widget

      // Use a timeout to set loading to false after a reasonable time
      // since onChartReady is not available
      setTimeout(() => {
        setIsLoading(false)
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current)
          loadingTimeoutRef.current = null
        }
      }, 3000) // Give it 3 seconds to load
    } catch (e) {
      console.error("Error creating TradingView widget:", e)
      setError("Failed to create chart")
      setIsLoading(false)
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }
  }

  // Initialize chart when component mounts or when symbol/theme changes
  useEffect(() => {
    initializeChart()

    // Cleanup function
    return () => {
      // Clear any loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }

      // Safely remove script
      safeRemoveScript()

      // Clear widget reference
      widgetRef.current = null

      // Clear container
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [selectedSymbol, theme])

  return (
    <Card className={`${className} overflow-hidden`} id="market-overview">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>
              {selectedSymbol.includes(":")
                ? `Analyzing ${selectedSymbol.split(":")[1]}`
                : `Analyzing ${selectedSymbol}`}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshChart} className="ml-auto">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Chart
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Loading chart data...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
              <div className="text-center max-w-md p-4">
                <p className="text-sm text-destructive font-medium mb-2">{error}</p>
                <p className="text-xs text-muted-foreground">
                  Try refreshing the chart or selecting a different asset.
                </p>
                <Button className="mt-4" onClick={refreshChart}>
                  Retry
                </Button>
              </div>
            </div>
          )}
          <div
            ref={containerRef}
            style={{
              height: "500px",
              width: "100%",
              backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
