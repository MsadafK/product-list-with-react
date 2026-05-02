"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"

export function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <Navbar onToggleSidebar={() => setCollapsed((c) => !c)} />
      <div className="flex min-h-screen pt-14">
        <Sidebar collapsed={collapsed} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </>
  )
}