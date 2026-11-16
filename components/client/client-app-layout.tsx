import { redirect } from "next/navigation"

import { ClientAppShell } from "@/components/client/client-app-shell"
import {
  getAuthUser,
  getCachedClientNavContext,
  getEspaceProfile,
} from "@/lib/auth/espace-session"
import { buildClientNavItems } from "@/lib/client/nav-items"

type Props = {
  children: React.ReactNode
  loginNext?: string
}

export async function ClientAppLayout({ children, loginNext = "/espace" }: Props) {
  const user = await getAuthUser()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(loginNext)}`)
  }

  const [profile, ctx] = await Promise.all([
    getEspaceProfile(user.id),
    getCachedClientNavContext(user.id),
  ])

  if (profile?.role === "admin") {
    redirect("/admin/interventions")
  }

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
