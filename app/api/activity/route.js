import { supabase } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// GET — public (demo mode)
export async function GET() {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — auth required
export async function POST(request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { action, product_name, details } = await request.json()

  const { data, error } = await supabase
    .from("activity_logs")
    .insert([{ action, product_name, details }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}