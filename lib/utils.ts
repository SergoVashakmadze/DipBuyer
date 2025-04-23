import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

/**
 * Calculates the undervaluation score for an asset based on its current price and historical prices.
 *
 * The algorithm works as follows:
 * 1. Calculate the moving average of the historical prices
 * 2. Calculate the standard deviation of the historical prices
 * 3. Calculate the z-score (how many standard deviations the current price is below the mean)
 * 4. Convert the z-score to an undervaluation percentage
 *
 * A higher score indicates a potentially more undervalued asset.
 *
 * @param currentPrice - The current price of the asset
 * @param historicalPrices - An array of historical prices
 * @param movingAveragePeriod - The period for calculating the moving average (default: 50)
 * @returns The undervaluation score as a percentage (0-100)
 */
export function calculateUndervaluation(
  currentPrice: number,
  historicalPrices: number[],
  movingAveragePeriod = 50,
): number {
  // Calculate moving average
  if (historicalPrices.length < movingAveragePeriod) {
    return 0
  }

  const recentPrices = historicalPrices.slice(-movingAveragePeriod)
  const movingAverage = recentPrices.reduce((sum, price) => sum + price, 0) / movingAveragePeriod

  // Calculate standard deviation
  const squaredDifferences = recentPrices.map((price) => Math.pow(price - movingAverage, 2))
  const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / movingAveragePeriod
  const standardDeviation = Math.sqrt(variance)

  // Calculate z-score (how many standard deviations below the mean)
  const zScore = (currentPrice - movingAverage) / standardDeviation

  // Convert to undervaluation percentage (negative z-score means undervalued)
  // Scale to a percentage where -2 standard deviations = 100% undervalued
  const undervaluationPercentage = Math.min(Math.max(-zScore * 50, 0), 100)

  return undervaluationPercentage
}

// Generate simulated historical price data
export function generateHistoricalPrices(currentPrice: number, days: number, volatility = 0.02): number[] {
  const prices: number[] = [currentPrice]

  for (let i = 1; i < days; i++) {
    const previousPrice = prices[i - 1]
    const change = previousPrice * volatility * (Math.random() * 2 - 1)
    const newPrice = previousPrice + change
    prices.unshift(Math.max(newPrice, 0.01)) // Ensure price doesn't go below 0.01
  }

  return prices
}
