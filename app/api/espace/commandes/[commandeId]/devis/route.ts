import { NextResponse } from "next/server"

import { isResumableParticulierBrouillon } from "@/lib/espace/particulier-brouillon-shared"
import { buildCommandeDevisPdfBytes } from "@/lib/order/devis-pdf-from-commande-row"
import { createClient } from "@/lib/supabase/server"

type Params = { params: Promise<{ commandeId: string }> }

/** PDF devis pour le client connecté (brouillon particulier avec devis envoyé). */
export async function GET(_request: Request, { params }: Params) {
  const { commandeId } = await params
  const id = commandeId.trim()
  if (!id) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
  }

  const { data: row } = await supabase
    .from("commandes")
    .select(
      "id, audience, statut, payment_status, devis_sent_at, prestation_id, prestation_label, price_ht, date_livraison, date_enlevement, adresse_complete, contact_nom, contact_email, contact_telephone"
    )
    .eq("id", id)
    .eq("client_id", user.id)
    .maybeSingle()

  if (!row || !isResumableParticulierBrouillon(row)) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 })
  }

  if (!row.devis_sent_at) {
    return NextResponse.json(
      { error: "Le devis n’a pas encore été envoyé pour cette commande." },
      { status: 404 }
    )
  }

  const built = buildCommandeDevisPdfBytes(row)
  if (!built) {
    return NextResponse.json(
      { error: "Impossible de générer le devis pour le moment." },
      { status: 422 }
    )
  }

  return new NextResponse(Buffer.from(built.bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${built.filename}"`,
      "Cache-Control": "private, no-store",
    },
  })
}