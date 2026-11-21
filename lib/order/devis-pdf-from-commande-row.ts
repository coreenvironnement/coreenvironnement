import { formatOrderReference } from "@/lib/commande/reference"
import { buildDevisPdfBytes } from "@/lib/documents/devis-pdf"
import { prestationById } from "@/lib/prestations"

export type CommandeDevisPdfSourceRow = {
  id: string
  adresse_complete: string | null
  prestation_id: string | null
  prestation_label: string | null
  price_ht: number | string | null
  date_livraison: string | null
  date_enlevement: string | null
  contact_nom: string | null
  contact_email: string | null
  contact_telephone: string | null
}

export function buildCommandeDevisPdfBytes(
  row: CommandeDevisPdfSourceRow
): { bytes: Uint8Array; filename: string } | null {
  const prestationId = row.prestation_id?.trim() ?? ""
  const prestation = prestationId ? prestationById(prestationId) : null
  const address = row.adresse_complete?.trim() ?? ""
  const deliveryDate = row.date_livraison?.trim() ?? ""
  const email = row.contact_email?.trim() ?? ""
  const phone = row.contact_telephone?.trim() ?? ""
  const contactName = row.contact_nom?.trim() ?? ""

  if (!prestation || !address || !deliveryDate || !email || !phone || !contactName) {
    return null
  }

  const priceHtFromRow =
    row.price_ht != null && !Number.isNaN(Number(row.price_ht))
      ? Number(row.price_ht)
      : null
  const priceHt = priceHtFromRow ?? prestation.priceHt

  const reference = formatOrderReference(row.id)
  const bytes = buildDevisPdfBytes({
    reference,
    contactName,
    contactEmail: email,
    contactPhone: phone,
    prestationLabel: row.prestation_label?.trim() || prestation.label,
    address,
    deliveryDate,
    pickupDate: row.date_enlevement?.trim() || null,
    priceHt,
    acceptedSummary: prestation.acceptedSummary,
    excludedSummary: prestation.excludedSummary,
    tonnageMax: prestation.tonnageMax,
    surchargePerTonHt: prestation.surchargePerTonHt,
    validityDays: 7,
  })

  return { bytes, filename: `devis-${reference}.pdf` }
}