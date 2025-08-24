"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Calendar, Megaphone, TrendingUp, Users, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  activeCampaigns: number
  totalConversions: number
  conversionChange: number
  upcomingMeetings: number
}

interface RecentActivity {
  title: string
  platform: string
  spent: number
  conversions: number
  ctr: number
  updated_at: string
}

const formatNaira = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatChange = (change: number) => {
  const sign = change >= 0 ? "+" : ""
  return `${sign}${change.toFixed(1)}%`
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    activeCampaigns: 0,
    totalConversions: 0,
    conversionChange: 0,
    upcomingMeetings: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activityResponse] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/recent-activity"),
        ])

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        if (activityResponse.ok) {
          const activityData = await activityResponse.json()
          setRecentActivity(activityData)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsCards = [
    {
      name: "Total Revenue",
      value: formatNaira(stats.totalRevenue),
      change: formatChange(stats.revenueChange),
      changeType: stats.revenueChange >= 0 ? ("positive" as const) : ("negative" as const),
      icon: TrendingUp,
    },
    {
      name: "Active Campaigns",
      value: stats.activeCampaigns.toString(),
      change: `${stats.activeCampaigns} active`,
      changeType: "neutral" as const,
      icon: Megaphone,
    },
    {
      name: "Total Conversions",
      value: stats.totalConversions.toLocaleString(),
      change: formatChange(stats.conversionChange),
      changeType: stats.conversionChange >= 0 ? ("positive" as const) : ("negative" as const),
      icon: Users,
    },
    {
      name: "Upcoming Meetings",
      value: stats.upcomingMeetings.toString(),
      change: `${stats.upcomingMeetings} scheduled`,
      changeType: "neutral" as const,
      icon: Calendar,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Welcome back!</h2>
        <p className="text-muted-foreground mt-2">Here's what's happening with your campaigns today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.name} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : stat.changeType === "negative"
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                <span className="font-medium">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <BarChart3 className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest campaign performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.platform} • {new Date(activity.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{formatNaira(activity.spent)}</p>
                      <p className="text-xs text-muted-foreground">{activity.conversions} conversions</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                  <p className="text-xs text-muted-foreground">Start creating campaigns to see activity here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Zap className="h-5 w-5 text-primary" />
              AI Insights
            </CardTitle>
            <CardDescription>Powered by ADMIND AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2">Optimization Opportunity</p>
                <p className="text-xs text-muted-foreground">
                  {stats.activeCampaigns > 0
                    ? "Your campaigns could benefit from A/B testing different ad creatives. Potential 15% CTR increase."
                    : "Start your first campaign to get AI-powered optimization insights."}
                </p>
              </div>
              <div className="bg-accent/10 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2">Budget Recommendation</p>
                <p className="text-xs text-muted-foreground">
                  {stats.totalRevenue > 0
                    ? "Consider increasing budget for high-performing campaigns based on current ROI trends."
                    : "Set up your first campaign budget to start tracking performance metrics."}
                </p>
              </div>
              <div className="bg-chart-3/10 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2">Meeting Reminder</p>
                <p className="text-xs text-muted-foreground">
                  {stats.upcomingMeetings > 0
                    ? `You have ${stats.upcomingMeetings} upcoming meeting${stats.upcomingMeetings > 1 ? "s" : ""} scheduled.`
                    : "Schedule a strategy session to optimize your campaigns."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
