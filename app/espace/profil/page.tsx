import { EspaceProfilView } from "@/components/espace/espace-profil-view"
import type { ProfilFormInitial } from "@/components/espace/espace-profil-form"
import { getAuthUser, getSupabaseServerClient } from "@/lib/auth/espace-session"
import { loadProfilPrefill } from "@/lib/espace/profil-prefill"
import { isStripeConfigured } from "@/lib/stripe/server"

export const metadata = {
  title: "Mon compte · Mon espace",
  robots: { index: false, follow: false },
}

export default async function EspaceProfilPage() {
  const user = await getAuthUser()

  if (!user) return null

  const supabase = await getSupabaseServerClient()

  const [prefill, { data: compte }, { data: chantierLinks }] = await Promise.all([
    loadProfilPrefill(supabase, user),
    supabase
      .from("comptes_pro")
      .select(
        "raison_sociale, siret, status, contact_nom, contact_fonction, contact_telephone, contact_email, adresse_siege, stripe_customer_id"
      )
      .eq("profile_id", user.id)
      .maybeSingle(),
    supabase.from("chantier_membres").select("id").eq("profile_id", user.id).limit(1),
  ])

  const hasComptePro = Boolean(compte)
  const hasChantier = (chantierLinks?.length ?? 0) > 0

  const formInitial: ProfilFormInitial = {
    ...prefill,
    compte: compte
      ? {
          raison_sociale: compte.raison_sociale,
          siret: compte.siret,
          status: compte.status,
          contact_nom: compte.contact_nom,
          contact_fonction: compte.contact_fonction,
          contact_telephone: compte.contact_telephone,
          contact_email: compte.contact_email,
          adresse_siege: compte.adresse_siege,
        }
      : null,
  }

  const isParticulier = !compte
  const hasStripeCustomer = Boolean(compte?.stripe_customer_id?.trim())

  return (
    <EspaceProfilView
      formInitial={formInitial}
      hasComptePro={hasComptePro}
      hasChantier={hasChantier}
      stripeBillingAvailable={isStripeConfigured()}
      hasStripeCustomer={hasStripeCustomer}
      isParticulier={isParticulier}
    />
  )
}