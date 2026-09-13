import type { BenneFamily } from "@/lib/prestations"

/** Correspondance famille forfait → code dechets_types (002). */
export function dechetCodeForFamily(family: BenneFamily): string {
  switch (family) {
    case "gravats_propres":
      return "gravats_propres"
    case "melange_dnd":
    case "gravats_melanges":
    default:
      return "dib"
  }
}

/** Volume catalogue → code types_contenants. */
export function contenantCodeForVolume(volumeM3: number): string {
  const map: Record<number, string> = {
    8: "benne_8m3",
    10: "benne_10m3",
    15: "benne_15m3",
    20: "benne_20m3",
    30: "benne_30m3",
  }
  return map[volumeM3] ?? "benne_15m3"
}

/** Montant TTC estimé (TVA 20 %) pour Stripe Checkout particulier. */
export function priceTtcFromHt(priceHt: number): number {
  return Math.round(priceHt * 1.2 * 100)
}
