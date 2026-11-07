import { FacturesView } from "@/components/espace/factures-view"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Factures · Mon espace",
  robots: { index: false, follow: false },
}

export default async function EspaceFacturesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const [{ data: rows }, { data: compte }] = await Promise.all([
    supabase
      .from("commandes")
      .select(
        "id, date_creation, prestation_label, price_ht, payment_status, audience, stripe_payment_intent_id, statut"
      )
      .eq("client_id", user.id)
      .in("payment_status", ["paid", "waived", "pending"])
      .order("date_creation", { ascending: false }),
    supabase
      .from("comptes_pro")
      .select("subscription_active")
      .eq("profile_id", user.id)
      .maybeSingle(),
  ])

  return (
    <FacturesView
      rows={rows ?? []}
      showBillingPortal={Boolean(compte?.subscription_active)}
    />
  )
}
