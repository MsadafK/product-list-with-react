"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"

export function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <Sidebar
        collapsed={false}
        mobile
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Right side */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Navbar
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              setMobileOpen((o) => !o)
            } else {
              setCollapsed((c) => !c)
            }
          }}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}