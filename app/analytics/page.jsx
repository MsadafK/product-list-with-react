"use client"

import { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area, CartesianGrid,
} from "recharts"
import { Package, DollarSign, AlertTriangle, Activity, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const COLORS = ["#18181b", "#52525b", "#a1a1aa", "#d4d4d8", "#e4e4e7"]

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const ACTION_STYLES = {
  created: "text-emerald-500",
  updated: "text-blue-500",
  deleted: "text-red-500",
}

export default function AnalyticsPage() {
  const [products, setProducts] = useState([])
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, lRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/activity"),
        ])

        if (!pRes.ok) throw new Error(`Products API error: ${pRes.status}`)
        if (!lRes.ok) throw new Error(`Activity API error: ${lRes.status}`)

        const [pData, lData] = await Promise.all([pRes.json(), lRes.json()])
        setProducts(Array.isArray(pData) ? pData : [])
        setLogs(Array.isArray(lData) ? lData : [])
      } catch (err) {
        console.error("Analytics fetch error:", err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Stats
  const totalProducts = products.length
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0)
  const lowStockCount = products.filter((p) => p.stock <= 10).length
  const avgPrice = totalProducts > 0
    ? products.reduce((s, p) => s + p.price, 0) / totalProducts
    : 0

  // Chart data — stock by category
  const categoryMap = {}
  products.forEach((p) => {
    if (!categoryMap[p.category]) categoryMap[p.category] = { category: p.category, stock: 0, value: 0, count: 0 }
    categoryMap[p.category].stock += p.stock
    categoryMap[p.category].value += p.price * p.stock
    categoryMap[p.category].count += 1
  })
  const categoryData = Object.values(categoryMap)

  // Price distribution buckets
  const priceBuckets = [
    { range: "$0–25", min: 0, max: 25 },
    { range: "$25–100", min: 25, max: 100 },
    { range: "$100–250", min: 100, max: 250 },
    { range: "$250–500", min: 250, max: 500 },
    { range: "$500+", min: 500, max: Infinity },
  ].map((b) => ({
    range: b.range,
    count: products.filter((p) => p.price >= b.min && p.price < b.max).length,
  }))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-5 md:space-y-8">

        {/* Header */}
        <header>
          <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm mb-1">
            <span>Dashboard</span>
            <span className="text-foreground font-medium">/ Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Analytics</h1>
        </header>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border border border-border rounded-xl overflow-hidden bg-card">
          <div className="px-3 sm:px-6 py-4 sm:py-5">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Total Products</p>
            <div className="flex items-end justify-between">
              <p className="text-xl sm:text-3xl font-semibold tracking-tight">{totalProducts}</p>
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/40 mb-0.5" />
            </div>
          </div>
          <div className="px-3 sm:px-6 py-4 sm:py-5">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
              <span className="hidden sm:inline">Inventory Value</span>
              <span className="sm:hidden">Value</span>
            </p>
            <div className="flex items-end justify-between">
              <p className="text-xl sm:text-3xl font-semibold tracking-tight">
                ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/40 mb-0.5" />
            </div>
          </div>
          <div className="px-3 sm:px-6 py-4 sm:py-5">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Avg. Price</p>
            <div className="flex items-end justify-between">
              <p className="text-xl sm:text-3xl font-semibold tracking-tight">${avgPrice.toFixed(0)}</p>
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/40 mb-0.5" />
            </div>
          </div>
          <div className="px-3 sm:px-6 py-4 sm:py-5">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Low Stock</p>
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-1.5">
                <p className="text-xl sm:text-3xl font-semibold tracking-tight">{lowStockCount}</p>
                {lowStockCount > 0 && <span className="hidden sm:inline text-xs font-medium text-orange-500">needs attention</span>}
                {lowStockCount === 0 && <span className="hidden sm:inline text-xs font-medium text-emerald-500">all good</span>}
              </div>
              <AlertTriangle className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5", lowStockCount > 0 ? "text-orange-400/60" : "text-muted-foreground/40")} />
            </div>
          </div>
        </div>

        {/* Charts — single column on mobile, 2 col on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

          {/* Stock by Category — Bar Chart */}
          <div className="border border-border rounded-xl bg-card p-6">
            <p className="text-sm font-medium mb-1">Stock by Category</p>
            <p className="text-xs text-muted-foreground mb-6">Total units available per category</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} barSize={32}>
                <XAxis dataKey="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }}
                  cursor={{ fill: "var(--secondary)" }}
                />
                <Bar dataKey="stock" fill="#18181b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Products by Category — Pie Chart */}
          <div className="border border-border rounded-xl bg-card p-6">
            <p className="text-sm font-medium mb-1">Products by Category</p>
            <p className="text-xs text-muted-foreground mb-6">Distribution of product count</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Price Distribution — Area Chart */}
          <div className="border border-border rounded-xl bg-card p-6">
            <p className="text-sm font-medium mb-1">Price Distribution</p>
            <p className="text-xs text-muted-foreground mb-6">Number of products in each price range</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={priceBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={35} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
                <Area type="monotone" dataKey="count" stroke="#18181b" fill="#18181b" fillOpacity={0.08} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Inventory Value by Category — Bar Chart */}
          <div className="border border-border rounded-xl bg-card p-6">
            <p className="text-sm font-medium mb-1">Inventory Value by Category</p>
            <p className="text-xs text-muted-foreground mb-6">Total value (price × stock) per category</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} barSize={32}>
                <XAxis dataKey="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={55}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }}
                  formatter={(v) => [`$${v.toLocaleString()}`, "Value"]}
                  cursor={{ fill: "var(--secondary)" }}
                />
                <Bar dataKey="value" fill="#52525b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Log */}
        <div className="border border-border rounded-xl bg-card">
          <div className="px-6 py-5 border-b border-border flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-medium">Recent Activity</p>
            <span className="ml-auto text-xs text-muted-foreground">Last 20 actions</span>
          </div>
          {logs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">No activity yet. Create, edit, or delete a product to see logs here.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {logs.map((log) => (
                <div key={log.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" />
                    <div>
                      <p className="text-sm">
                        <span className={cn("font-medium capitalize", ACTION_STYLES[log.action] || "text-foreground")}>
                          {log.action}
                        </span>
                        {" "}
                        <span className="text-foreground font-medium">{log.product_name}</span>
                      </p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{timeAgo(log.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
