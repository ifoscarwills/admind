import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function generateMeetingCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function generateJitsiRoomId(): string {
  return `admind-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
}

function calculateScheduledTime(): Date {
  const now = new Date()
  const currentHour = now.getHours()
  const scheduledTime = new Date(now)

  // If staged in AM (before 12 PM) → schedule 5 hours later
  // If staged in PM (12 PM or after) → schedule 10 hours later
  if (currentHour < 12) {
    scheduledTime.setHours(scheduledTime.getHours() + 5)
  } else {
    scheduledTime.setHours(scheduledTime.getHours() + 10)
  }

  return scheduledTime
}

async function sendMeetingEmails(meetingData: any) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    console.error("[v0] ADMIN_EMAIL environment variable not set")
    return false
  }

  const emailContent = {
    inviteCode: meetingData.invite_code,
    scheduledDateTime: new Date(meetingData.scheduled_date).toLocaleString(),
    userName: meetingData.attendee_name,
    userEmail: meetingData.attendee_email,
    meetingLink: `https://meet.jit.si/${meetingData.jitsi_room_id}`,
    notes: meetingData.notes || "No additional notes",
  }

  try {
    // Send email to admin
    await resend.emails.send({
      from: "ADMIND <noreply@admind.ai>",
      to: [adminEmail],
      subject: `New Meeting Scheduled - ${meetingData.title}`,
      html: `
        <h2>New Meeting Scheduled</h2>
        <p><strong>Invite Code:</strong> ${emailContent.inviteCode}</p>
        <p><strong>Scheduled Date & Time:</strong> ${emailContent.scheduledDateTime}</p>
        <p><strong>User Name:</strong> ${emailContent.userName}</p>
        <p><strong>User Email:</strong> ${emailContent.userEmail}</p>
        <p><strong>Meeting Link:</strong> <a href="${emailContent.meetingLink}">${emailContent.meetingLink}</a></p>
        <p><strong>Notes:</strong> ${emailContent.notes}</p>
      `,
    })

    // Send email to user
    await resend.emails.send({
      from: "ADMIND <noreply@admind.ai>",
      to: [meetingData.attendee_email],
      subject: `Meeting Confirmation - ${meetingData.title}`,
      html: `
        <h2>Meeting Confirmation</h2>
        <p>Dear ${emailContent.userName},</p>
        <p>Your meeting has been successfully scheduled!</p>
        <p><strong>Invite Code:</strong> ${emailContent.inviteCode}</p>
        <p><strong>Scheduled Date & Time:</strong> ${emailContent.scheduledDateTime}</p>
        <p><strong>Meeting Link:</strong> <a href="${emailContent.meetingLink}">Join Meeting</a></p>
        <p><strong>Notes:</strong> ${emailContent.notes}</p>
        <p>We look forward to speaking with you!</p>
        <p>Best regards,<br>The ADMIND Team</p>
      `,
    })

    return true
  } catch (error) {
    console.error("[v0] Failed to send meeting emails:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const body = await request.json()
    const { title, description, attendee_name, attendee_email, notes, meeting_type = "consultation" } = body

    // Generate meeting details
    const inviteCode = generateMeetingCode()
    const jitsiRoomId = generateJitsiRoomId()
    const scheduledDate = calculateScheduledTime()

    // Create meeting in database
    const { data: meeting, error } = await supabase
      .from("meetings")
      .insert({
        user_id: user?.id,
        title,
        description,
        scheduled_date: scheduledDate.toISOString(),
        meeting_type,
        jitsi_room_id: jitsiRoomId,
        attendee_name,
        attendee_email,
        notes,
        invite_code: inviteCode,
        status: "scheduled",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 })
    }

    // Send email notifications (don't fail if this fails)
    const emailSent = await sendMeetingEmails(meeting)
    if (!emailSent) {
      console.error("[v0] Email notifications failed, but meeting was created successfully")
    }

    return NextResponse.json({
      success: true,
      meeting,
      emailSent,
      message: "Meeting created successfully",
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
