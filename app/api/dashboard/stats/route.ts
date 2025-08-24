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

    // Fetch total revenue from ads
    const { data: adsData, error: adsError } = await supabase
      .from("ads")
      .select("spent, conversions, clicks, impressions")
      .eq("user_id", user.id)

    // Fetch active campaigns count
    const { data: activeCampaigns, error: campaignsError } = await supabase
      .from("ads")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")

    // Fetch upcoming meetings count
    const { data: upcomingMeetings, error: meetingsError } = await supabase
      .from("meetings")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "scheduled")
      .gte("scheduled_date", new Date().toISOString())

    // Fetch recent growth metrics for trends
    const { data: growthData, error: growthError } = await supabase
      .from("growth_metrics")
      .select("metric_value, metric_type, metric_date")
      .eq("user_id", user.id)
      .order("metric_date", { ascending: false })
      .limit(30)

    if (adsError || campaignsError || meetingsError || growthError) {
      console.error("Database error:", { adsError, campaignsError, meetingsError, growthError })
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Calculate totals with defaults
    const totalRevenue = adsData?.reduce((sum, ad) => sum + (Number(ad.spent) || 0), 0) || 0
    const totalConversions = adsData?.reduce((sum, ad) => sum + (Number(ad.conversions) || 0), 0) || 0
    const activeCampaignsCount = activeCampaigns?.length || 0
    const upcomingMeetingsCount = upcomingMeetings?.length || 0

    // Calculate revenue change (compare last 15 days vs previous 15 days)
    const revenueMetrics = growthData?.filter((m) => m.metric_type === "revenue") || []
    const recentRevenue = revenueMetrics.slice(0, 15).reduce((sum, m) => sum + (Number(m.metric_value) || 0), 0)
    const previousRevenue = revenueMetrics.slice(15, 30).reduce((sum, m) => sum + (Number(m.metric_value) || 0), 0)
    const revenueChange = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0

    // Calculate conversion change
    const conversionMetrics = growthData?.filter((m) => m.metric_type === "conversions") || []
    const recentConversions = conversionMetrics.slice(0, 15).reduce((sum, m) => sum + (Number(m.metric_value) || 0), 0)
    const previousConversions = conversionMetrics
      .slice(15, 30)
      .reduce((sum, m) => sum + (Number(m.metric_value) || 0), 0)
    const conversionChange =
      previousConversions > 0 ? ((recentConversions - previousConversions) / previousConversions) * 100 : 0

    const stats = {
      totalRevenue,
      revenueChange,
      activeCampaigns: activeCampaignsCount,
      totalConversions,
      conversionChange,
      upcomingMeetings: upcomingMeetingsCount,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
