"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LearnSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [source, setSource] = useState("all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    let baseUrl = ""
    switch (source) {
      case "investopedia":
        baseUrl = "https://www.investopedia.com/search?q="
        break
      case "investing":
        baseUrl = "https://www.investing.com/search/?q="
        break
      case "cointelegraph":
        baseUrl = "https://cointelegraph.com/search?query="
        break
      case "yahoo":
        baseUrl = "https://finance.yahoo.com/lookup?s="
        break
      default:
        baseUrl = "https://www.google.com/search?q=finance+"
        break
    }

    window.open(`${baseUrl}${encodeURIComponent(searchQuery)}`, "_blank")
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for financial terms, concepts, or assets..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Select value={source} onValueChange={setSource}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="investopedia">Investopedia</SelectItem>
          <SelectItem value="investing">Investing.com</SelectItem>
          <SelectItem value="cointelegraph">Cointelegraph</SelectItem>
          <SelectItem value="yahoo">Yahoo Finance</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Search</Button>
    </form>
  )
}
