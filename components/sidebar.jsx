"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Package, LayoutGrid, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Products", icon: Package },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
]

export function Sidebar({ collapsed, mobile = false, mobileOpen = false, onMobileClose }) {
  const pathname = usePathname()

  const content = (
    <>
      {/* Project logo + name */}
      <Link href="/" className="h-14 border-b border-border flex items-center gap-2.5 px-3 shrink-0 hover:bg-secondary/50 transition-colors">
        <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center shrink-0">
          <LayoutGrid className="w-4 h-4 text-background" />
        </div>
        {(!collapsed || mobile) && (
          <span className="font-semibold text-sm tracking-tight whitespace-nowrap flex-1">
            Product Catalog
          </span>
        )}
        {/* Close button — mobile only */}
        {mobile && (
          <button
            onClick={onMobileClose}
            className="p-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </Link>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={mobile ? onMobileClose : undefined}
            title={collapsed && !mobile ? label : undefined}
            className={cn(
              "flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors",
              pathname === href
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {(!collapsed || mobile) && (
              <span className="whitespace-nowrap">{label}</span>
            )}
          </Link>
        ))}
      </nav>
    </>
  )

  // Mobile drawer
  if (mobile) {
    return (
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>
    )
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-border bg-card transition-all duration-300 overflow-hidden",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {content}
    </aside>
  )
}