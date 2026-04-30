import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

// GET /api/products — fetch all products
export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/products — create new product
export async function POST(request) {
  const body = await request.json()

  const { name, price, category, stock, description, image_url } = body

  // Basic validation
  if (!name || !price || !category) {
    return NextResponse.json(
      { error: "Name, price, and category are required" },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("products")
    .insert([{ name, price, category, stock: stock ?? 0, description, image_url }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}