"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, PieChart, Wallet, BookOpen, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/portfolio",
      label: "Portfolio",
      icon: PieChart,
      active: pathname === "/portfolio",
    },
    {
      href: "/wallet",
      label: "Wallet",
      icon: Wallet,
      active: pathname === "/wallet",
    },
    {
      href: "/learn",
      label: "Learn",
      icon: BookOpen,
      active: pathname === "/learn",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-14 w-14 relative">
            <Image src="/images/bull-logo.png" alt="DipBuyer Logo" width={56} height={56} className="object-contain" />
          </div>
          <span className="text-xl font-bold">DipBuyer</span>
          <span className="hidden md:inline-block text-sm text-muted-foreground ml-2">
            - AI Agent for Buying Undervalued Assets
          </span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            {routes.map((route) => (
              <Button key={route.href} variant={route.active ? "default" : "ghost"} asChild>
                <Link href={route.href} className="flex items-center gap-2">
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
      <div className="md:hidden flex justify-between px-2 pb-2">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant={route.active ? "default" : "ghost"}
            size="sm"
            asChild
            className={cn("flex-1 justify-center", route.active ? "bg-primary text-primary-foreground" : "")}
          >
            <Link href={route.href} className="flex flex-col items-center gap-1 py-1">
              <route.icon className="h-4 w-4" />
              <span className="text-xs">{route.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}
