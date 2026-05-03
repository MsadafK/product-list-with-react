"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Package, BarChart2, Shield, Upload, Download,
  ArrowRight, LayoutGrid, Search, SlidersHorizontal,
  Bell, Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const features = [
  { icon: Package, title: "Product Management", description: "Add, edit, and delete products with rich details including images, pricing, and stock levels." },
  { icon: BarChart2, title: "Analytics Dashboard", description: "Visual insights into your inventory — stock distribution, price ranges, and category breakdowns." },
  { icon: Upload, title: "Image Upload", description: "Drag and drop product images directly. Powered by Cloudinary for fast, optimized delivery." },
  { icon: Search, title: "Search & Filter", description: "Instantly search products by name or category. Filter chips and sorting keep things organized." },
  { icon: Bell, title: "Low Stock Alerts", description: "Get notified automatically when any product's stock drops below threshold." },
  { icon: Layers, title: "Bulk Actions", description: "Select multiple products and delete them in one go. CSV export for offline use." },
  { icon: Shield, title: "Authentication", description: "Secure login with Clerk. Your data is protected and only accessible to you." },
  { icon: SlidersHorizontal, title: "Activity Log", description: "Every create, update, and delete action is tracked with timestamps in the analytics view." },
]

const techStack = [
  { name: "Next.js 16", color: "bg-foreground text-background" },
  { name: "Supabase", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900" },
  { name: "Clerk Auth", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-900" },
  { name: "Cloudinary", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900" },
  { name: "Tailwind CSS", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900" },
  { name: "shadcn/ui", color: "bg-secondary text-foreground" },
  { name: "Recharts", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900" },
  { name: "TypeScript", color: "bg-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900" },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Navbar */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-md" : "bg-transparent"
      )}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-sm tracking-tight">Product Catalog</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hidden sm:flex">
                View Demo
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="sm">
                Sign In <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary text-xs font-medium text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Full-stack portfolio project
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Manage your inventory
            <br className="hidden sm:block" />
            <span className="text-muted-foreground"> with confidence</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A full-stack product catalog dashboard built with Next.js, Supabase, and Clerk.
            Real-time data, analytics, image uploads, and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                View Demo <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">No account needed to explore the demo</p>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground border border-border max-w-xs mx-auto text-center">
                  product-catalog.vercel.app/dashboard
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4 bg-background">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-2 w-16 bg-secondary rounded-full" />
                  <div className="h-5 w-28 bg-foreground/10 rounded-md" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-secondary rounded-md hidden sm:block" />
                  <div className="h-8 w-24 bg-foreground rounded-md" />
                </div>
              </div>
              <div className="grid grid-cols-3 border border-border rounded-xl overflow-hidden">
                {["Total Products", "Inventory Value", "Low Stock"].map((label, i) => (
                  <div key={i} className={cn("px-3 sm:px-4 py-3", i < 2 && "border-r border-border")}>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">{label}</p>
                    <div className="h-5 w-10 bg-foreground/10 rounded-md" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-border overflow-hidden bg-card">
                    <div className="aspect-square bg-secondary/60" />
                    <div className="p-3 space-y-2">
                      <div className="h-2 w-12 bg-secondary rounded-full" />
                      <div className="h-3 w-3/4 bg-foreground/10 rounded-full" />
                      <div className="flex justify-between pt-1">
                        <div className="h-4 w-10 bg-foreground/10 rounded-full" />
                        <div className="h-4 w-12 bg-emerald-500/20 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14 space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Everything you need</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">Built with modern tools and best practices</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="p-5 rounded-xl border border-border bg-card hover:border-muted-foreground/40 transition-colors space-y-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Tech Stack</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Built with production-grade tools</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {techStack.map(({ name, color }) => (
              <span key={name} className={cn("px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-border", color)}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ready to explore?</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Try the demo without signing up, or create an account to manage your own products.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  View Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 sm:px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-foreground flex items-center justify-center">
              <LayoutGrid className="w-3 h-3 text-background" />
            </div>
            <span className="text-sm font-medium">Product Catalog</span>
          </div>
          <p className="text-xs text-muted-foreground">Built with Next.js · Supabase · Clerk · Cloudinary</p>
        </div>
      </footer>
    </div>
  )
}