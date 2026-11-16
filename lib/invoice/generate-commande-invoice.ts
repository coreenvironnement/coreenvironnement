import { buildFactureCommandePdfBytes } from "@/lib/documents/facture-commande-pdf"
import { formatOrderReference } from "@/lib/commande/reference"
import { createServiceClient } from "@/lib/supabase/service"
import type { SupabaseClient } from "@supabase/supabase-js"

const BUCKET = "commande-documents"

export async function ensureCommandeInvoicePdf(
  supabase: SupabaseClient,
  commandeId: string
): Promise<{ path: string } | { error: string }> {
  const { data: commande, error } = await supabase
    .from("commandes")
    .select(
      "id, client_id, statut, livree_at, invoice_storage_path, invoice_number, contact_nom, contact_email, prestation_label, adresse_complete, date_livraison, price_ht, payment_status, date_creation"
    )
    .eq("id", commandeId)
    .maybeSingle()

  if (error || !commande) {
    return { error: "Commande introuvable." }
  }

  if (commande.invoice_storage_path) {
    return { path: commande.invoice_storage_path }
  }

  if (commande.statut !== "livree" || !commande.livree_at) {
    return { error: "Facture non disponible pour cette commande." }
  }

  const invoiceNumber =
    commande.invoice_number ??
    `FAC-${formatOrderReference(commande.id).replace(/\s/g, "")}`

  const pdf = buildFactureCommandePdfBytes({
    commandeId: commande.id,
    invoiceNumber,
    contactName: commande.contact_nom,
    contactEmail: commande.contact_email,
    prestationLabel: commande.prestation_label,
    address: commande.adresse_complete,
    deliveryDate: commande.date_livraison,
    priceHt: commande.price_ht,
    paidAt: commande.date_creation,
  })

  const storagePath = `${commande.client_id ?? "anon"}/${commande.id}/facture.pdf`

  const service = createServiceClient()
  const { error: upErr } = await service.storage.from(BUCKET).upload(storagePath, pdf, {
    contentType: "application/pdf",
    upsert: true,
  })

  if (upErr) {
    console.error("[invoice] upload", upErr.message)
    return { error: "Impossible d'enregistrer la facture." }
  }

  const now = new Date().toISOString()
  await supabase
    .from("commandes")
    .update({
      invoice_storage_path: storagePath,
      invoice_generated_at: now,
      invoice_number: invoiceNumber,
    })
    .eq("id", commandeId)

  return { path: storagePath }
}