import { priceBreakdownFromHt } from "@/lib/order/prestation-mapping"
import { prestationById } from "@/lib/prestations"

/** Forfait d’entrée catalogue (gravats propres 8 m³). */
export const ENTRY_PRESTATION_ID = "gp-ch-8"

export function getEntryPrestation() {
  return prestationById(ENTRY_PRESTATION_ID)
}

export function getEntryPriceHt(): number {
  return getEntryPrestation()?.priceHt ?? 330
}

export function getEntryPriceTtcParticulier(): number {
  return priceBreakdownFromHt(getEntryPriceHt()).ttc
}

/** Lignes courtes pour blocs SEO (prix HT catalogue, zone standard). */
export function getCatalogPricingRows(): Array<{
  label: string
  priceHt: number
  priceTtc: number
}> {
  const pick = ["gp-ch-8", "gp-ch-10", "dnd-ch-8", "dnd-ch-10"] as const
  return pick
    .map((id) => prestationById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({
      label: `${p.volumeM3} m³ · ${p.label.replace(/^Benne à chaîne \d+ m³, /, "")}`,
      priceHt: p.priceHt,
      priceTtc: priceBreakdownFromHt(p.priceHt).ttc,
    }))
}

export const PRICING_DISCLAIMER =
  "Montant exact selon votre adresse, le type de déchet et le forfait choisi avant validation."
