"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, MousePointer, Eye, Download } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useEffect, useState } from "react"

interface AnalyticsData {
  revenue: Array<{ month: string; revenue: number; target: number }>
  traffic: Array<{ date: string; organic: number; paid: number; social: number }>
  conversions: Array<{ platform: string; conversions: number; rate: number }>
  platforms: Array<{ name: string; value: number; color: string }>
  kpis: {
    totalRevenue: number
    totalConversions: number
    clickThroughRate: number
    impressions: number
  }
}

const formatNaira = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function AnalyticsOverview() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch("/api/dashboard/analytics")
        if (response.ok) {
          const data = await response.json()
          setAnalyticsData(data)
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error)
        setAnalyticsData({
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
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!analyticsData) return null

  const kpiData = [
    {
      title: "Total Revenue",
      value: formatNaira(analyticsData.kpis.totalRevenue),
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      description: "vs last month",
    },
    {
      title: "Total Conversions",
      value: analyticsData.kpis.totalConversions.toLocaleString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: Users,
      description: "vs last month",
    },
    {
      title: "Click-through Rate",
      value: `${analyticsData.kpis.clickThroughRate.toFixed(2)}%`,
      change: "-0.3%",
      trend: "down" as const,
      icon: MousePointer,
      description: "vs last month",
    },
    {
      title: "Impressions",
      value:
        analyticsData.kpis.impressions > 1000000
          ? `${(analyticsData.kpis.impressions / 1000000).toFixed(1)}M`
          : analyticsData.kpis.impressions.toLocaleString(),
      change: "+15.7%",
      trend: "up" as const,
      icon: Eye,
      description: "vs last month",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Overview</h1>
          <p className="text-muted-foreground mt-2">Comprehensive insights into your campaign performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-32 bg-background border-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="bg-background border-input hover:bg-accent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card
            key={index}
            className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground/80">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{kpi.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs font-medium ${kpi.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                  {kpi.change}
                </span>
                <span className="text-xs text-card-foreground/60">{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <BarChart3 className="h-5 w-5 text-primary" />
              Revenue vs Target
            </CardTitle>
            <CardDescription className="text-card-foreground/70">
              Monthly revenue performance against targets (₦)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={
                  analyticsData.revenue.length > 0
                    ? analyticsData.revenue
                    : [
                        { month: "Jan", revenue: 0, target: 0 },
                        { month: "Feb", revenue: 0, target: 0 },
                        { month: "Mar", revenue: 0, target: 0 },
                      ]
                }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" opacity={0.9} />
                <YAxis stroke="hsl(var(--foreground))" opacity={0.9} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                  formatter={(value: number) => [formatNaira(value), ""]}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stackId="1"
                  stroke="hsl(var(--muted-foreground))"
                  fill="hsl(var(--muted-foreground))"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="2"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <BarChart3 className="h-5 w-5 text-primary" />
              Traffic by Platform
            </CardTitle>
            <CardDescription className="text-card-foreground/70">
              Distribution of traffic across platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={
                    analyticsData.platforms.length > 0
                      ? analyticsData.platforms
                      : [{ name: "No Data", value: 100, color: "#6b7280" }]
                  }
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(analyticsData.platforms.length > 0
                    ? analyticsData.platforms
                    : [{ name: "No Data", value: 100, color: "#6b7280" }]
                  ).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {(analyticsData.platforms.length > 0
                ? analyticsData.platforms
                : [{ name: "No Data", value: 100, color: "#6b7280" }]
              ).map((platform, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                  <span className="text-sm text-muted-foreground">{platform.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Trends */}
      <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Traffic Trends
          </CardTitle>
          <CardDescription className="text-card-foreground/70">Daily traffic breakdown by source</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={analyticsData.traffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--card-foreground))"
                opacity={0.8}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis stroke="hsl(var(--card-foreground))" opacity={0.8} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }
              />
              <Line
                type="monotone"
                dataKey="organic"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="paid"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="social"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Organic Traffic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Paid Traffic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-3" />
              <span className="text-sm text-muted-foreground">Social Traffic</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Performance */}
      <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Users className="h-5 w-5 text-primary" />
            Conversion Performance by Platform
          </CardTitle>
          <CardDescription className="text-card-foreground/70">
            Conversion rates and volumes across different platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.conversions.length > 0 ? (
              analyticsData.conversions.map((platform, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-accent/5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-primary rounded-full" />
                    <div>
                      <p className="font-medium text-foreground">{platform.platform}</p>
                      <p className="text-sm text-muted-foreground">{platform.conversions} conversions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {platform.rate}% CVR
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No conversion data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
