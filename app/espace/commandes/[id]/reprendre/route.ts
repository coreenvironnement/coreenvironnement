import { NextResponse } from "next/server"

import { getAppUrl } from "@/lib/email/config"
import { isResumableParticulierBrouillon } from "@/lib/espace/particulier-brouillon-shared"
import { mintDevisResumeHrefFromCommande } from "@/lib/order/mint-devis-resume-href"
import { createClient } from "@/lib/supabase/server"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const commandeId = id.trim()
  const appUrl = getAppUrl()

  if (!commandeId) {
    return NextResponse.redirect(new URL("/espace/commandes", appUrl))
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(
      new URL(
        `/login?next=${encodeURIComponent(`/espace/commandes/${commandeId}/reprendre`)}`,
        appUrl
      )
    )
  }

  const [{ data: row }, { data: profile }] = await Promise.all([
    supabase
      .from("commandes")
      .select(
        "id, audience, statut, payment_status, prestation_id, date_livraison, date_enlevement, adresse_complete, departement_code, contact_email, contact_nom, contact_telephone, tunnel_resume_snapshot"
      )
      .eq("id", commandeId)
      .eq("client_id", user.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("full_name, phone, email")
      .eq("id", user.id)
      .maybeSingle(),
  ])

  if (!row || !isResumableParticulierBrouillon(row)) {
    return NextResponse.redirect(new URL("/espace/commandes", appUrl))
  }

  const resumeHref = await mintDevisResumeHrefFromCommande(
    {
      adresse_complete: row.adresse_complete,
      prestation_id: row.prestation_id,
      date_livraison: row.date_livraison,
      date_enlevement: row.date_enlevement,
      contact_nom: row.contact_nom,
      contact_telephone: row.contact_telephone,
      contact_email: row.contact_email,
      departement_code: row.departement_code,
      tunnel_resume_snapshot: row.tunnel_resume_snapshot,
    },
    {
      fallbackEmail: user.email ?? profile?.email,
      fallbackContactName: profile?.full_name,
      fallbackPhone: profile?.phone,
    }
  )

  if (!resumeHref) {
    return NextResponse.redirect(new URL("/espace/commandes", appUrl))
  }

  return NextResponse.redirect(resumeHref)
}