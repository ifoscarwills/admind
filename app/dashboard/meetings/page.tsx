import { MeetingManagement } from "@/components/dashboard/meeting-management"

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Meetings</h1>
        <p className="text-muted-foreground">Manage your scheduled meetings and consultations.</p>
      </div>
      <MeetingManagement />
    </div>
  )
}
