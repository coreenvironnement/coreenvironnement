import { EspaceProfilView } from "@/components/espace/espace-profil-view"
import { getClientNavContext } from "@/lib/auth/client-nav-context"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Mon compte · Mon espace",
  robots: { index: false, follow: false },
}

export default async function EspaceProfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle()

  const ctx = await getClientNavContext(supabase, user.id)

  const displayName =
    profile?.full_name?.trim() || profile?.email || user.email || "Utilisateur"
  const email = profile?.email || user.email || ""

  const hasComptePro = ctx.isLoggedIn ? ctx.hasComptePro : false
  const hasChantier = ctx.isLoggedIn ? ctx.hasChantier : false

  return (
    <EspaceProfilView
      displayName={displayName}
      email={email}
      hasComptePro={hasComptePro}
      hasChantier={hasChantier}
    />
  )
}
