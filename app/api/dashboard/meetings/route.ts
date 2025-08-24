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

    // Fetch meetings data
    const { data: meetings, error: meetingsError } = await supabase
      .from("meetings")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_at", { ascending: false })

    if (meetingsError) {
      console.error("Error fetching meetings:", meetingsError)
      return NextResponse.json({ meetings: [] })
    }

    // Calculate stats
    const totalMeetings = meetings?.length || 0
    const upcomingMeetings = meetings?.filter((meeting) => new Date(meeting.scheduled_at) > new Date()).length || 0
    const completedMeetings = meetings?.filter((meeting) => meeting.status === "completed").length || 0

    return NextResponse.json({
      meetings: meetings || [],
      stats: {
        totalMeetings,
        upcomingMeetings,
        completedMeetings,
      },
    })
  } catch (error) {
    console.error("Error in meetings API:", error)
    return NextResponse.json({
      meetings: [],
      stats: {
        totalMeetings: 0,
        upcomingMeetings: 0,
        completedMeetings: 0,
      },
    })
  }
}
