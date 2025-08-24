import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AdsManagement } from "@/components/dashboard/ads-management"

export default async function AdsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's ads
  const { data: ads } = await supabase
    .from("ads")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardShell>
      <AdsManagement ads={ads || []} userId={user.id} />
    </DashboardShell>
  )
}
