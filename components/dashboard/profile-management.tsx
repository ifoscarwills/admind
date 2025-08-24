"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { User, Mail, Phone, Building, Briefcase, Camera, Save, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ProfileData {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  company: string | null
  position: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface ProfileManagementProps {
  user: any
  profile: ProfileData | null
}

export function ProfileManagement({ user, profile }: ProfileManagementProps) {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    company: profile?.company || "",
    position: profile?.position || "",
    avatar_url: profile?.avatar_url || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setMessage({ type: "success", text: "Profile updated successfully!" })
      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({ type: "error", text: "Failed to update profile. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Management</h1>
        <p className="text-muted-foreground mt-2">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.avatar_url || "/placeholder.svg"} alt={formData.full_name || "User"} />
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {formData.full_name ? getInitials(formData.full_name) : <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-xl text-card-foreground">
                {formData.full_name || "Complete your profile"}
              </CardTitle>
              <CardDescription>
                {formData.position && formData.company
                  ? `${formData.position} at ${formData.company}`
                  : "Add your professional details"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{formData.email}</span>
              </div>
              {formData.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{formData.phone}</span>
                </div>
              )}
              {formData.company && (
                <div className="flex items-center gap-3 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{formData.company}</span>
                </div>
              )}
              {formData.position && (
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{formData.position}</span>
                </div>
              )}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Status</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Member since</span>
                  <span className="text-sm text-foreground">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Today"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="full_name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="mt-1"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position" className="text-sm font-medium">
                      Position
                    </Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="Enter your job title"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="avatar_url" className="text-sm font-medium">
                    Avatar URL
                  </Label>
                  <Input
                    id="avatar_url"
                    name="avatar_url"
                    type="url"
                    value={formData.avatar_url}
                    onChange={handleInputChange}
                    placeholder="Enter avatar image URL"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Provide a URL to your profile picture</p>
                </div>

                {message && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-md ${
                      message.type === "success"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{message.text}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                    {isLoading ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Account Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Account Settings</CardTitle>
          <CardDescription>Manage your account preferences and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Email notifications</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Marketing emails</span>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Two-factor authentication</span>
                  <Badge variant="outline">Not configured</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Account Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Download Data
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
