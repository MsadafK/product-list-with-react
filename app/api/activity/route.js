import { supabase } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// GET /api/activity — fetch recent activity logs
export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/activity — create a log entry
export async function POST(request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { action, product_name, details } = await request.json()

  const { data, error } = await supabase
    .from("activity_logs")
    .insert([{ action, product_name, details }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}