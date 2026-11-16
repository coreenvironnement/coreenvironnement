import { redirect } from "next/navigation"

import { EspaceParticulierNouvelleCommande } from "@/components/espace/espace-particulier-nouvelle-commande"
import { EspaceProNouvelleCommande } from "@/components/espace/espace-pro-nouvelle-commande"
import { loadParticulierReorderPrefill } from "@/lib/espace/particulier-reorder-prefill"
import { loadProReorderPrefill } from "@/lib/espace/pro-reorder-prefill"
import { getAuthUser, getSupabaseServerClient } from "@/lib/auth/espace-session"

export const metadata = {
  title: "Nouvelle commande · Mon espace",
  robots: { index: false, follow: false },
}

async function userHasProProfile(
  supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>,
  userId: string
) {
  const [{ data: comptePro }, { count }] = await Promise.all([
    supabase.from("comptes_pro").select("status").eq("profile_id", userId).maybeSingle(),
    supabase
      .from("commandes")
      .select("id", { count: "exact", head: true })
      .eq("client_id", userId)
      .eq("audience", "professionnel"),
  ])

  return Boolean(comptePro) || (count ?? 0) > 0
}

export default async function EspaceNouvelleCommandePage() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/login?next=/espace/commandes/nouvelle")
  }

  const supabase = await getSupabaseServerClient()

  const isPro = await userHasProProfile(supabase, user.id)

  if (isPro) {
    const prefill = await loadProReorderPrefill(supabase, user.id, user.email)
    return <EspaceProNouvelleCommande prefill={prefill} />
  }

  const particulierPrefill = await loadParticulierReorderPrefill(
    supabase,
    user.id,
    user.email
  )

  return <EspaceParticulierNouvelleCommande prefill={particulierPrefill} />
}