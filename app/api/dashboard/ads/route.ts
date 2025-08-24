import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch ads data
    const { data: ads, error: adsError } = await supabase
      .from("ads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (adsError) {
      console.error("Error fetching ads:", adsError)
      return NextResponse.json({ ads: [] })
    }

    // Calculate stats
    const totalAds = ads?.length || 0
    const activeAds = ads?.filter((ad) => ad.status === "active").length || 0
    const totalSpent = ads?.reduce((sum, ad) => sum + (ad.budget || 0), 0) || 0
    const totalClicks = ads?.reduce((sum, ad) => sum + (ad.clicks || 0), 0) || 0

    return NextResponse.json({
      ads: ads || [],
      stats: {
        totalAds,
        activeAds,
        totalSpent,
        totalClicks,
      },
    })
  } catch (error) {
    console.error("Error in ads API:", error)
    return NextResponse.json({
      ads: [],
      stats: {
        totalAds: 0,
        activeAds: 0,
        totalSpent: 0,
        totalClicks: 0,
      },
    })
  }
}
