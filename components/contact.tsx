"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Mail, MessageSquare, Phone } from "lucide-react"
import { useState } from "react"
import { MeetingBookingModal } from "./meeting-booking-modal"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ name: "", email: "", company: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleBookConsultation = () => {
    setIsMeetingModalOpen(true)
  }

  return (
    <>
      <section id="contact" className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Ready to <span className="text-primary">Transform</span> Your Business?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get in touch with our AI experts and discover how ADMIND can accelerate your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-card-foreground">Send us a message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info & Meeting Scheduler */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-2xl text-card-foreground">Get in touch</CardTitle>
                  <CardDescription>Prefer to reach out directly? Here are our contact details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="text-foreground">ifoscarwils@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="text-foreground">+234 8145908744 or +234 7011226939</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Live chat available 24/7</span>
                  </div>
                </CardContent>
              </Card>

              {/* Meeting Scheduler */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-2xl text-card-foreground">Schedule a consultation</CardTitle>
                  <CardDescription>Book a free 30-minute strategy session with our AI experts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-accent hover:bg-accent/90" size="lg" onClick={handleBookConsultation}>
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Free Consultation
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    No commitment required • 30-minute session • Expert insights
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Meeting Booking Modal */}
      <MeetingBookingModal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} />
    </>
  )
}
