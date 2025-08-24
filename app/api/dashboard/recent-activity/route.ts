import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch recent ads activity
    const { data: recentAds, error: adsError } = await supabase
      .from("ads")
      .select("title, platform, spent, conversions, ctr, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(5)

    if (adsError) {
      console.error("Database error:", adsError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    return NextResponse.json(recentAds || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
