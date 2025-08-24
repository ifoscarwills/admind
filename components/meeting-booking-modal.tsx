"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar, Clock, User, Mail, MessageSquare, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MeetingBookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MeetingBookingModal({ isOpen, onClose }: MeetingBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    preferredTime: "",
    message: "",
    meetingType: "consultation",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
        toast({
          title: "Meeting Scheduled!",
          description: "We'll send you a confirmation email with the meeting details.",
        })
        // Reset form after 3 seconds and close modal
        setTimeout(() => {
          setIsSuccess(false)
          setFormData({
            name: "",
            email: "",
            company: "",
            phone: "",
            preferredTime: "",
            message: "",
            meetingType: "consultation",
          })
          onClose()
        }, 3000)
      } else {
        throw new Error("Failed to schedule meeting")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Meeting Scheduled!</h3>
            <p className="text-muted-foreground mb-4">
              We've sent you a confirmation email with the meeting details and Jitsi link.
            </p>
            <p className="text-sm text-muted-foreground">This window will close automatically...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-[95vw] sm:w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">Book Free Consultation</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm sm:text-base">
            Schedule a free consultation with our AI experts to discuss your business needs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm sm:text-base">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className="text-sm sm:text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm sm:text-base">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                className="text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm sm:text-base">
                Company Name
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Enter your company name"
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm sm:text-base">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                Meeting Type
              </Label>
              <Select value={formData.meetingType} onValueChange={(value) => handleInputChange("meetingType", value)}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Free Consultation</SelectItem>
                  <SelectItem value="strategy">Strategy Session</SelectItem>
                  <SelectItem value="demo">Product Demo</SelectItem>
                  <SelectItem value="followup">Follow-up Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm sm:text-base">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                Preferred Time
              </Label>
              <Select
                value={formData.preferredTime}
                onValueChange={(value) => handleInputChange("preferredTime", value)}
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select preferred time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                  <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2 text-sm sm:text-base">
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Tell us about your business goals and what you'd like to discuss..."
              rows={3}
              className="text-sm sm:text-base resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:flex-1 bg-transparent text-sm sm:text-base"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-sm sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
