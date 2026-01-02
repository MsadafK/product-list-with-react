"use client"

import { useState, useMemo, Suspense } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"
import { ProductForm } from "@/components/product-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Neon Flux Headphones",
    price: 299.99,
    category: "Electronics",
    stock: 45,
    description: "High-fidelity audio with neon accents.",
    image: "/neon-flux-headphones-dark-sleek.jpg",
  },
  {
    id: 2,
    name: "Vercel Pro Keypad",
    price: 159.0,
    category: "Accessories",
    stock: 12,
    description: "Mechanical keyboard for lightning-fast deployments.",
    image: "/mechanical-keyboard-minimalist-black.jpg",
  },
  {
    id: 3,
    name: "Edge Runtime Mug",
    price: 24.5,
    category: "Lifestyle",
    stock: 150,
    description: "Keeps coffee hot at the edge.",
    image: "/ceramic-coffee-mug-minimalist.jpg",
  },
  {
    id: 4,
    name: "Turbopack Sticker Set",
    price: 9.99,
    category: "Lifestyle",
    stock: 500,
    description: "Make your laptop faster.",
    image: "/tech-stickers-holographic.jpg",
  },
  {
    id: 5,
    name: "Next.js 16 Hoodie",
    price: 65.0,
    category: "Apparel",
    stock: 30,
    description: "Comfortable developer wear.",
    image: "/minimalist-black-hoodie.jpg",
  },
  {
    id: 6,
    name: "AI Gateway Hub",
    price: 499.0,
    category: "Electronics",
    stock: 5,
    description: "The ultimate AI routing hardware.",
    image: "/ai-processor-hardware-server.jpg",
  },
  {
    id: 7,
    name: "Prisma Database Lens",
    price: 89.99,
    category: "Accessories",
    stock: 85,
    description: "See your data clearly.",
    image: "/camera-lens-glass-minimalist.jpg",
  },
  {
    id: 8,
    name: "Tailwind UI Kit",
    price: 249.0,
    category: "Software",
    stock: 999,
    description: "Complete design system for faster builds.",
    image: "/software-box-minimalist-blue.jpg",
  },
]

export default function ProductDashboardPage() {
  return (
    <Suspense fallback={null}>
      <ProductDashboard />
    </Suspense>
  )
}

function ProductDashboard() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [view, setView] = useState("card") // "card" or "list"
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const itemsPerPage = 6
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useMemo(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])

  // Filtering & Pagination Logic
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    )
  }, [products, debouncedSearchTerm])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(start, start + itemsPerPage)
  }, [filteredProducts, currentPage])

  // Handlers
  const handleAddOrEdit = (productData) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === productData.id ? productData : p)))
    } else {
      setProducts([...products, productData])
    }
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

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

          <Button
            onClick={() => {
              setEditingProduct(null)
              setIsFormOpen(true)
            }}
            className="w-full md:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Product
          </Button>
        </header>

        {/* Toolbar Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-y border-border py-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 bg-secondary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg self-start md:self-auto">
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

        {/* Content Area */}
        <main>
          {filteredProducts.length === 0 ? (
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
                      <th className="px-6 py-4 font-medium text-muted-foreground">Product</th>
                      <th className="px-6 py-4 font-medium text-muted-foreground">Category</th>
                      <th className="px-6 py-4 font-medium text-muted-foreground">Price</th>
                      <th className="px-6 py-4 font-medium text-muted-foreground">Stock</th>
                      <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {currentProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4">
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
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium border border-border">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "text-xs font-medium",
                              product.stock > 10 ? "text-emerald-500" : "text-orange-500",
                            )}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
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
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
              </span>{" "}
              of <span className="text-foreground font-medium">{filteredProducts.length}</span> products
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
          <ProductForm onSubmit={handleAddOrEdit} initialData={editingProduct} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
