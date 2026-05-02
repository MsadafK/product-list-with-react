"use client"

import { PanelLeft, LayoutGrid } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

export function Navbar({ onToggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-border bg-card flex items-center px-4 gap-3">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground shrink-0"
        title="Toggle sidebar"
      >
        <PanelLeft className="w-4 h-4" />
      </button>

      {/* Logo + Name */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center shrink-0">
          <LayoutGrid className="w-4 h-4 text-background" />
        </div>
        <span className="font-semibold text-sm tracking-tight">Product Catalog</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User button */}
      <UserButton afterSignOutUrl="/sign-in" />
    </header>
  )
}