"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Package,
  Pencil,
  Trash2,
  ArrowUpDown,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"
import { ProductForm } from "@/components/product-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { CATEGORIES, ALL_FILTER_LABEL } from "@/lib/categories"

export default function ProductDashboardPage() {
  return (
    <Suspense fallback={null}>
      <ProductDashboard />
    </Suspense>
  )
}

function ProductDashboard() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [view, setView] = useState("card")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState(ALL_FILTER_LABEL)
  const [sortBy, setSortBy] = useState("default")
  const [selectedIds, setSelectedIds] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null) // { id, name }

  const itemsPerPage = 6
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Fetch all products from API on mount
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch("/api/products")
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      const normalized = data.map((p) => ({ ...p, image: p.image_url || "" }))
      setProducts(normalized)

      // Low stock alerts
      const lowStock = normalized.filter((p) => p.stock <= 10)
      if (lowStock.length > 0) {
        toast.warning(
          `${lowStock.length} product${lowStock.length > 1 ? "s" : ""} running low on stock`,
          {
            description: lowStock.map((p) => `${p.name} (${p.stock} left)`).join(", "),
            duration: 6000,
          }
        )
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useMemo(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, selectedCategory])

  // Filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === ALL_FILTER_LABEL || p.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, debouncedSearchTerm, selectedCategory])

  // Sorting
  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts]
    switch (sortBy) {
      case "name-asc":   return arr.sort((a, b) => a.name.localeCompare(b.name))
      case "name-desc":  return arr.sort((a, b) => b.name.localeCompare(a.name))
      case "price-asc":  return arr.sort((a, b) => a.price - b.price)
      case "price-desc": return arr.sort((a, b) => b.price - a.price)
      case "stock-asc":  return arr.sort((a, b) => a.stock - b.stock)
      case "stock-desc": return arr.sort((a, b) => b.stock - a.stock)
      default:           return arr
    }
  }, [filteredProducts, sortBy])

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedProducts.slice(start, start + itemsPerPage)
  }, [sortedProducts, currentPage])

  // Log activity helper
  const logActivity = async (action, product_name, details = "") => {
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, product_name, details }),
      })
    } catch (_) {}
  }

  // CREATE or UPDATE
  const handleAddOrEdit = async (productData) => {
    setIsSubmitting(true)
    try {
      const payload = {
        name: productData.name,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
        description: productData.description,
        image_url: productData.image || "",
      }

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || "Failed to update product")
        }
        const updated = await res.json()
        setProducts(products.map((p) =>
          p.id === updated.id ? { ...updated, image: updated.image_url || "" } : p
        ))
        await logActivity("updated", updated.name, `Price: $${updated.price}, Stock: ${updated.stock}`)
        toast.success(`"${updated.name}" updated successfully`)
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to create product")
        const created = await res.json()
        setProducts([{ ...created, image: created.image_url || "" }, ...products])
        await logActivity("created", created.name, `Category: ${created.category}, Price: $${created.price}`)
        toast.success(`"${created.name}" added to catalog`)
      }

      setIsFormOpen(false)
      setEditingProduct(null)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // DELETE — open confirm dialog first
  const handleDelete = (id) => {
    const product = products.find((p) => p.id === id)
    setDeleteTarget({ id, name: product?.name || "this product" })
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete product")
      setProducts(products.filter((p) => p.id !== deleteTarget.id))
      await logActivity("deleted", deleteTarget.name, `ID: ${deleteTarget.id}`)
      toast.success(`"${deleteTarget.name}" removed from catalog`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleteTarget(null)
    }
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  // Bulk selection helpers
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === currentProducts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(currentProducts.map((p) => p.id))
    }
  }

  const clearSelection = () => setSelectedIds([])

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    const count = selectedIds.length
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/products/${id}`, { method: "DELETE" })
        )
      )
      // Log each deletion
      await Promise.all(
        selectedIds.map((id) => {
          const product = products.find((p) => p.id === id)
          return logActivity("deleted", product?.name || "Unknown", `Bulk delete`)
        })
      )
      setProducts(products.filter((p) => !selectedIds.includes(p.id)))
      setSelectedIds([])
      toast.success(`${count} product${count > 1 ? "s" : ""} deleted`)
    } catch (err) {
      toast.error("Bulk delete failed")
    }
  }

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Category", "Price", "Stock", "Description", "Image URL"]
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.price.toFixed(2),
      p.stock,
      `"${(p.description || "").replace(/"/g, '""')}"`,
      p.image_url || p.image || "",
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `products_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Stats
  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
    const lowStockCount = products.filter((p) => p.stock <= 10).length
    return { totalProducts, totalValue, lowStockCount }
  }, [products])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>Inventory</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Product Catalog</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Products</h1>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProducts}
              disabled={isLoading}
              className="text-muted-foreground"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isLoading || products.length === 0}
              className="text-muted-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button
              onClick={() => {
                setEditingProduct(null)
                setIsFormOpen(true)
              }}
              className="flex-1 md:flex-none"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" /> Create Product
            </Button>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border border-border rounded-xl overflow-hidden bg-card">

          {/* Total Products */}
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-3">Total Products</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-semibold tracking-tight">{stats.totalProducts}</p>
              <Package className="w-4 h-4 text-muted-foreground/40 mb-1" />
            </div>
          </div>

          {/* Inventory Value */}
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-3">Inventory Value</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-semibold tracking-tight">
                ${stats.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <DollarSign className="w-4 h-4 text-muted-foreground/40 mb-1" />
            </div>
          </div>

          {/* Low Stock */}
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-3">Low Stock Alerts</p>
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-semibold tracking-tight">{stats.lowStockCount}</p>
                {stats.lowStockCount > 0 && (
                  <span className="text-xs font-medium text-orange-500 mb-0.5">needs attention</span>
                )}
                {stats.lowStockCount === 0 && (
                  <span className="text-xs font-medium text-emerald-500 mb-0.5">all good</span>
                )}
              </div>
              <AlertTriangle className={cn("w-4 h-4 mb-1", stats.lowStockCount > 0 ? "text-orange-400/60" : "text-muted-foreground/40")} />
            </div>
          </div>

        </div>

        {/* Toolbar Section */}
        <div className="flex flex-col gap-3 border-y border-border py-4">

          {/* Row 1 — Search + Sort + View Toggle */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 bg-secondary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    {sortBy === "default"    ? "Sort"           :
                     sortBy === "name-asc"   ? "Name A→Z"       :
                     sortBy === "name-desc"  ? "Name Z→A"       :
                     sortBy === "price-asc"  ? "Price Low→High" :
                     sortBy === "price-desc" ? "Price High→Low" :
                     sortBy === "stock-asc"  ? "Stock Low→High" :
                                              "Stock High→Low"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => setSortBy("default")}    className={cn(sortBy === "default"    && "bg-accent")}>Default</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name-asc")}   className={cn(sortBy === "name-asc"   && "bg-accent")}>Name A→Z</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name-desc")}  className={cn(sortBy === "name-desc"  && "bg-accent")}>Name Z→A</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-asc")}  className={cn(sortBy === "price-asc"  && "bg-accent")}>Price Low→High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-desc")} className={cn(sortBy === "price-desc" && "bg-accent")}>Price High→Low</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("stock-asc")}  className={cn(sortBy === "stock-asc"  && "bg-accent")}>Stock Low→High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("stock-desc")} className={cn(sortBy === "stock-desc" && "bg-accent")}>Stock High→Low</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
                <Button
                  variant={view === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setView("list")}
                  className={cn("px-3", view === "list" && "bg-background shadow-sm")}
                >
                  <List className="w-4 h-4 mr-2" /> List
                </Button>
                <Button
                  variant={view === "card" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setView("card")}
                  className={cn("px-3", view === "card" && "bg-background shadow-sm")}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" /> Card
                </Button>
              </div>
            </div>
          </div>

          {/* Row 2 — Category Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {[ALL_FILTER_LABEL, ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                  selectedCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Bulk Action Bar — only in list view with selections */}
        {view === "list" && selectedIds.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-secondary border border-border">
            <p className="text-sm font-medium">
              {selectedIds.length} product{selectedIds.length > 1 ? "s" : ""} selected
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearSelection} className="text-muted-foreground">
                Deselect all
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete {selectedIds.length} selected
              </Button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main>
          {isLoading ? (
            <div className={view === "card"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "border border-border rounded-xl overflow-hidden bg-card divide-y divide-border"
            }>
              {Array.from({ length: 6 }).map((_, i) => (
                view === "card" ? (
                  <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                    <div className="aspect-square bg-secondary/60" />
                    <div className="p-5 space-y-3">
                      <div className="h-2.5 w-16 bg-secondary rounded-full" />
                      <div className="h-4 w-3/4 bg-secondary rounded-full" />
                      <div className="h-3 w-full bg-secondary rounded-full" />
                      <div className="h-3 w-2/3 bg-secondary rounded-full" />
                      <div className="flex justify-between pt-2">
                        <div className="h-5 w-20 bg-secondary rounded-full" />
                        <div className="h-5 w-16 bg-secondary rounded-full" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                    <div className="h-10 w-10 rounded bg-secondary shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 bg-secondary rounded-full" />
                      <div className="h-2.5 w-1/2 bg-secondary rounded-full" />
                    </div>
                    <div className="h-3 w-16 bg-secondary rounded-full" />
                    <div className="h-3 w-12 bg-secondary rounded-full" />
                    <div className="h-3 w-10 bg-secondary rounded-full" />
                  </div>
                )
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-xl border-destructive/30">
              <p className="text-sm font-medium text-destructive mb-2">Failed to load products</p>
              <p className="text-xs text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchProducts}>Try again</Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-xl border-border">
              <Package className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or add a new product.</p>
            </div>
          ) : view === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-border bg-card transition-all hover:border-muted-foreground/50 flex flex-col"
                >
                  <div className="aspect-square overflow-hidden bg-secondary/30 relative">
                    <img
                      src={product.image || "/placeholder.svg?height=400&width=400&query=product+box"}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => openEditModal(product)}>
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                        {product.category}
                      </span>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                      {product.description || "No description provided."}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
                      <div
                        className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium",
                          product.stock > 10
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-orange-500/10 text-orange-500",
                        )}
                      >
                        {product.stock} in stock
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/30 border-b border-border">
                    <tr>
                      <th className="px-4 py-4 w-10">
                        <input
                          type="checkbox"
                          className="rounded border-border cursor-pointer"
                          checked={selectedIds.length === currentProducts.length && currentProducts.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th className="px-4 py-4 font-medium text-muted-foreground">Product</th>
                      <th className="px-4 py-4 font-medium text-muted-foreground">Category</th>
                      <th className="px-4 py-4 font-medium text-muted-foreground">Price</th>
                      <th className="px-4 py-4 font-medium text-muted-foreground">Stock</th>
                      <th className="px-4 py-4 font-medium text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {currentProducts.map((product) => (
                      <tr
                        key={product.id}
                        className={cn(
                          "hover:bg-secondary/20 transition-colors",
                          selectedIds.includes(product.id) && "bg-secondary/30"
                        )}
                      >
                        <td className="px-4 py-4 w-10">
                          <input
                            type="checkbox"
                            className="rounded border-border cursor-pointer"
                            checked={selectedIds.includes(product.id)}
                            onChange={() => toggleSelect(product.id)}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded border border-border overflow-hidden bg-secondary/50 shrink-0">
                              <img
                                src={product.image || "/placeholder.svg?height=80&width=80&query=thumbnail"}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{product.name}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium border border-border">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-medium">${product.price.toFixed(2)}</td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "text-xs font-medium",
                              product.stock > 10 ? "text-emerald-500" : "text-orange-500",
                            )}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditModal(product)}>
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-4 border-t border-border mt-8">
            <p className="text-sm text-muted-foreground order-2 md:order-1">
              Showing <span className="text-foreground font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="text-foreground font-medium">
                {Math.min(currentPage * itemsPerPage, sortedProducts.length)}
              </span>{" "}
              of <span className="text-foreground font-medium">{sortedProducts.length}</span> products
            </p>
            <div className="flex items-center gap-2 order-1 md:order-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-transparent"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-transparent"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Create New Product"}</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleAddOrEdit}
            initialData={editingProduct}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">"{deleteTarget?.name}"</span> will be permanently removed. This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="destructive" onClick={confirmDelete} className="flex-1">
              Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="flex-1">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}