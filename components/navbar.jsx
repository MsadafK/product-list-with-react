"use client"

import { usePathname } from "next/navigation"
import { PanelLeft } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

const routeNames = {
  "/dashboard": "Products",
  "/analytics": "Analytics",
}

export function Navbar({ onToggleSidebar }) {
  const pathname = usePathname()
  const routeName = routeNames[pathname] || "Products"

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3 shrink-0">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground shrink-0"
        title="Toggle sidebar"
      >
        <PanelLeft className="w-4 h-4" />
      </button>

      {/* Current route name */}
      <span className="font-medium text-sm">{routeName}</span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User button */}
      <UserButton
        afterSignOutUrl="/sign-in"
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
            avatarImage: "w-8 h-8",
            avatarInitials: "text-xs font-medium",
            userButtonTrigger: "focus:shadow-none rounded-lg p-0.5 hover:bg-secondary transition-colors",
          },
        }}
      />
    </header>
  )
}