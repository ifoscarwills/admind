"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import {
  Plus,
  Search,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2,
  DollarSign,
  MousePointer,
  Eye,
  Target,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Ad {
  id: string
  user_id: string
  title: string
  description: string | null
  platform: string
  status: string
  budget: number | null
  spent: number | null
  impressions: number | null
  clicks: number | null
  conversions: number | null
  ctr: number | null
  cpc: number | null
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

interface AdsManagementProps {
  ads: Ad[]
  userId: string
}

const platformOptions = [
  { value: "facebook", label: "Facebook" },
  { value: "google", label: "Google Ads" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter" },
]

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
]

export function AdsManagement({ ads, userId }: AdsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    platform: "",
    status: "draft",
    budget: "",
    start_date: "",
    end_date: "",
  })

  // Filter ads based on search and filters
  const filteredAds = ads.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ad.status === statusFilter
    const matchesPlatform = platformFilter === "all" || ad.platform === platformFilter
    return matchesSearch && matchesStatus && matchesPlatform
  })

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("ads").insert({
        user_id: userId,
        title: newAd.title,
        description: newAd.description,
        platform: newAd.platform,
        status: newAd.status,
        budget: newAd.budget ? Number.parseFloat(newAd.budget) : null,
        start_date: newAd.start_date || null,
        end_date: newAd.end_date || null,
      })

      if (error) throw error

      setIsCreateDialogOpen(false)
      setNewAd({
        title: "",
        description: "",
        platform: "",
        status: "draft",
        budget: "",
        start_date: "",
        end_date: "",
      })
      router.refresh()
    } catch (error) {
      console.error("Error creating ad:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditAd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAd) return

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("ads")
        .update({
          title: editingAd.title,
          description: editingAd.description,
          platform: editingAd.platform,
          status: editingAd.status,
          budget: editingAd.budget,
          start_date: editingAd.start_date,
          end_date: editingAd.end_date,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingAd.id)

      if (error) throw error

      setIsEditDialogOpen(false)
      setEditingAd(null)
      router.refresh()
    } catch (error) {
      console.error("Error updating ad:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAd = async (adId: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("ads").delete().eq("id", adId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting ad:", error)
    }
  }

  const handleStatusChange = async (adId: string, newStatus: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("ads")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", adId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error updating ad status:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "outline",
      active: "default",
      paused: "secondary",
      completed: "secondary",
    } as const

    const colors = {
      draft: "text-muted-foreground",
      active: "text-primary",
      paused: "text-orange-600",
      completed: "text-green-600",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const calculateCTR = (clicks: number | null, impressions: number | null) => {
    if (!clicks || !impressions || impressions === 0) return 0
    return ((clicks / impressions) * 100).toFixed(2)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ads Management</h1>
          <p className="text-muted-foreground mt-2">Create, manage, and optimize your advertising campaigns</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Ad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Ad Campaign</DialogTitle>
              <DialogDescription>Set up a new advertising campaign with your preferred settings.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    value={newAd.title}
                    onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                    placeholder="Enter campaign title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={newAd.platform} onValueChange={(value) => setNewAd({ ...newAd, platform: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAd.description}
                  onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                  placeholder="Enter campaign description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="budget">Budget (₦)</Label>
                  <Input
                    id="budget"
                    type="number"
                    step="0.01"
                    value={newAd.budget}
                    onChange={(e) => setNewAd({ ...newAd, budget: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newAd.start_date}
                    onChange={(e) => setNewAd({ ...newAd, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newAd.end_date}
                    onChange={(e) => setNewAd({ ...newAd, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Campaign"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platformOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAds.map((ad) => (
          <Card key={ad.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-card-foreground line-clamp-1">{ad.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {platformOptions.find((p) => p.value === ad.platform)?.label || ad.platform}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(ad.status)}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ad.description && <p className="text-sm text-muted-foreground line-clamp-2">{ad.description}</p>}

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Spent</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(ad.spent || 0)}
                  </p>
                  {ad.budget && (
                    <p className="text-xs text-muted-foreground">
                      of{" "}
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(ad.budget)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Conversions</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{ad.conversions || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Impressions</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{ad.impressions?.toLocaleString() || "0"}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">CTR</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{calculateCTR(ad.clicks, ad.impressions)}%</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {ad.status === "active" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(ad.id, "paused")}
                    className="flex-1"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(ad.id, "active")}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingAd(ad)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteAd(ad.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAds.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">No campaigns found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || platformFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first ad campaign to get started"}
                </p>
              </div>
              {!searchTerm && statusFilter === "all" && platformFilter === "all" && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>Update your campaign settings and information.</DialogDescription>
          </DialogHeader>
          {editingAd && (
            <form onSubmit={handleEditAd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Campaign Title</Label>
                  <Input
                    id="edit-title"
                    value={editingAd.title}
                    onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-platform">Platform</Label>
                  <Select
                    value={editingAd.platform}
                    onValueChange={(value) => setEditingAd({ ...editingAd, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingAd.description || ""}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-budget">Budget (₦)</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    step="0.01"
                    value={editingAd.budget || ""}
                    onChange={(e) =>
                      setEditingAd({ ...editingAd, budget: e.target.value ? Number.parseFloat(e.target.value) : null })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-start-date">Start Date</Label>
                  <Input
                    id="edit-start-date"
                    type="date"
                    value={editingAd.start_date || ""}
                    onChange={(e) => setEditingAd({ ...editingAd, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-end-date">End Date</Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    value={editingAd.end_date || ""}
                    onChange={(e) => setEditingAd({ ...editingAd, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingAd.status}
                  onValueChange={(value) => setEditingAd({ ...editingAd, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Campaign"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
