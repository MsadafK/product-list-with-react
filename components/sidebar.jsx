"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Package } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Products", icon: Package },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
]

export function Sidebar({ collapsed }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-border bg-card transition-all duration-300 overflow-hidden",
        collapsed ? "w-14" : "w-56"
      )}
    >
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors",
              pathname === href
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap transition-all duration-300",
                collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              )}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}