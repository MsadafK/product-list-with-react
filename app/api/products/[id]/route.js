import { supabase } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// PUT — auth required
export async function PUT(request, { params }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { name, price, category, stock, description, image_url } = body

  if (!name || !price || !category) {
    return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("products")
    .update({ name, price, category, stock: stock ?? 0, description, image_url })
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE — auth required
export async function DELETE(request, { params }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}