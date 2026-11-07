import { redirect } from "next/navigation"

import { EspaceProNouvelleCommande } from "@/components/espace/espace-pro-nouvelle-commande"
import { loadProReorderPrefill } from "@/lib/espace/pro-reorder-prefill"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Nouvelle benne · Mon espace",
  robots: { index: false, follow: false },
}

export default async function EspaceNouvelleCommandePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace/commandes/nouvelle")
  }

  const prefill = await loadProReorderPrefill(supabase, user.id, user.email)

  return <EspaceProNouvelleCommande prefill={prefill} />
}
