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

    // Fetch growth metrics for revenue data
    const { data: growthMetrics, error: growthError } = await supabase
      .from("growth_metrics")
      .select("*")
      .eq("user_id", user.id)
      .order("metric_date", { ascending: true })

    // Fetch ads data for platform and conversion metrics
    const { data: ads, error: adsError } = await supabase.from("ads").select("*").eq("user_id", user.id)

    if (growthError || adsError) {
      console.error("Error fetching analytics data:", growthError || adsError)
    }

    // Process revenue data by month
    const revenueData = []
    const monthlyRevenue: { [key: string]: number } = {}

    if (growthMetrics && growthMetrics.length > 0) {
      growthMetrics.forEach((metric) => {
        const month = new Date(metric.metric_date).toLocaleDateString("en-US", { month: "short" })
        if (metric.metric_name === "revenue") {
          monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(metric.metric_value || 0)
        }
      })

      Object.entries(monthlyRevenue).forEach(([month, revenue]) => {
        revenueData.push({
          month,
          revenue,
          target: revenue * 1.2, // Set target as 20% higher than actual
        })
      })
    }

    // Process platform data
    const platformCounts: { [key: string]: number } = {}
    let totalAds = 0

    if (ads && ads.length > 0) {
      ads.forEach((ad) => {
        platformCounts[ad.platform] = (platformCounts[ad.platform] || 0) + 1
        totalAds++
      })
    }

    const platformColors = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"]
    const platforms = Object.entries(platformCounts).map(([name, count], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round((count / totalAds) * 100),
      color: platformColors[index % platformColors.length],
    }))

    // Process conversion data
    const conversions = Object.entries(platformCounts).map(([platform, count]) => {
      const platformAds = ads?.filter((ad) => ad.platform === platform) || []
      const totalConversions = platformAds.reduce((sum, ad) => sum + (ad.conversions || 0), 0)
      const totalClicks = platformAds.reduce((sum, ad) => sum + (ad.clicks || 0), 0)
      const rate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

      return {
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        conversions: totalConversions,
        rate: Number(rate.toFixed(1)),
      }
    })

    // Calculate KPIs
    const totalRevenue =
      growthMetrics?.reduce((sum, metric) => {
        return metric.metric_name === "revenue" ? sum + Number(metric.metric_value || 0) : sum
      }, 0) || 0
    const totalConversions = ads?.reduce((sum, ad) => sum + (ad.conversions || 0), 0) || 0
    const totalClicks = ads?.reduce((sum, ad) => sum + (ad.clicks || 0), 0) || 0
    const totalImpressions = ads?.reduce((sum, ad) => sum + (ad.impressions || 0), 0) || 0
    const clickThroughRate = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

    return NextResponse.json({
      revenue: revenueData,
      traffic: [], // Can be populated with actual traffic data if available
      conversions,
      platforms,
      kpis: {
        totalRevenue,
        totalConversions,
        clickThroughRate,
        impressions: totalImpressions,
      },
    })
  } catch (error) {
    console.error("Error in analytics API:", error)
    return NextResponse.json({
      revenue: [],
      traffic: [],
      conversions: [],
      platforms: [],
      kpis: {
        totalRevenue: 0,
        totalConversions: 0,
        clickThroughRate: 0,
        impressions: 0,
      },
    })
  }
}
