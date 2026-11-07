import { redirect } from "next/navigation"

import { ClientAppShell } from "@/components/client/client-app-shell"
import { getClientNavContext } from "@/lib/auth/client-nav-context"
import { buildClientNavItems } from "@/lib/client/nav-items"
import { createClient } from "@/lib/supabase/server"

type Props = {
  children: React.ReactNode
  loginNext?: string
}

export async function ClientAppLayout({ children, loginNext = "/espace" }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(loginNext)}`)
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role === "admin") {
    redirect("/admin/commandes")
  }

  const ctx = await getClientNavContext(supabase, user.id)

  const userLabel =
    profile?.full_name?.trim() ||
    profile?.email ||
    user.email ||
    "Mon compte"

  return (
    <ClientAppShell navItems={buildClientNavItems(ctx)} userLabel={userLabel}>
      {children}
    </ClientAppShell>
  )
}
