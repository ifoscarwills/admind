"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Video, Plus, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

interface Meeting {
  id: string
  title: string
  description: string
  scheduled_date: string
  meeting_type: string
  status: string
  jitsi_room_id: string
  attendee_name: string
  attendee_email: string
  notes: string
  invite_code: string
}

export function MeetingManagement() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    attendee_name: "",
    attendee_email: "",
    notes: "",
    meeting_type: "consultation",
  })

  const supabase = createBrowserClient()

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    const { data, error } = await supabase.from("meetings").select("*").order("scheduled_date", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching meetings:", error)
    } else {
      setMeetings(data || [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setFormData({
          title: "",
          description: "",
          attendee_name: "",
          attendee_email: "",
          notes: "",
          meeting_type: "consultation",
        })
        setIsDialogOpen(false)
        fetchMeetings() // Refresh the meetings list

        if (!result.emailSent) {
          console.warn("[v0] Meeting created but email notifications failed")
        }
      } else {
        console.error("[v0] Failed to create meeting:", result.error)
      }
    } catch (error) {
      console.error("[v0] Error creating meeting:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      scheduled: "default",
      completed: "secondary",
      cancelled: "destructive",
      "no-show": "outline",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const getMeetingTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      consultation: "text-blue-600",
      strategy: "text-green-600",
      review: "text-purple-600",
    }
    return colors[type] || "text-gray-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Meeting Management</h2>
          <p className="text-muted-foreground">Schedule and manage virtual meetings with clients.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Stage Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Stage New Meeting</DialogTitle>
              <DialogDescription>
                Create a new meeting. It will be automatically scheduled based on current time.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Strategy Session"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="meeting_type">Meeting Type</Label>
                  <Select value={formData.meeting_type} onValueChange={(value) => handleChange("meeting_type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="strategy">Strategy</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Brief description of the meeting purpose"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="attendee_name">Attendee Name</Label>
                  <Input
                    id="attendee_name"
                    value={formData.attendee_name}
                    onChange={(e) => handleChange("attendee_name", e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="attendee_email">Attendee Email</Label>
                  <Input
                    id="attendee_email"
                    type="email"
                    value={formData.attendee_email}
                    onChange={(e) => handleChange("attendee_email", e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Any additional notes or requirements"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Stage Meeting"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {meetings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No meetings scheduled</h3>
              <p className="text-muted-foreground text-center mb-4">
                Stage your first meeting to get started with client consultations.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Stage Meeting
              </Button>
            </CardContent>
          </Card>
        ) : (
          meetings.map((meeting) => (
            <Card key={meeting.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {meeting.title}
                      <span className={`text-sm font-medium ${getMeetingTypeColor(meeting.meeting_type)}`}>
                        ({meeting.meeting_type})
                      </span>
                    </CardTitle>
                    <CardDescription>{meeting.description}</CardDescription>
                  </div>
                  {getStatusBadge(meeting.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(meeting.scheduled_date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {meeting.attendee_name} ({meeting.attendee_email})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-xs">
                        Code: {meeting.invite_code}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://meet.jit.si/${meeting.jitsi_room_id}`, "_blank")}
                      className="w-full"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Join Meeting
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                    {meeting.notes && (
                      <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        <strong>Notes:</strong> {meeting.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
