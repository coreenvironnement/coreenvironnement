import { contenantCodeForVolume } from "@/lib/order/prestation-mapping"

export type CommandeForIntervention = {
  id: string
  adresse_complete: string
  type_dechet_id: string
  volume_m3: number | null
  date_livraison: string | null
  contact_nom: string | null
  contact_email: string | null
  prestation_label: string | null
  payment_status: string
}

export function canCreateInterventionFromCommande(
  commande: CommandeForIntervention,
  hasIntervention: boolean
): { ok: true } | { ok: false; reason: string } {
  if (hasIntervention) {
    return { ok: false, reason: "Une intervention est déjà liée à cette commande." }
  }
  if (!["paid", "waived"].includes(commande.payment_status)) {
    return {
      ok: false,
      reason: "Le paiement doit être confirmé avant de créer l'intervention.",
    }
  }
  if (!commande.date_livraison) {
    return { ok: false, reason: "Date de livraison manquante sur la commande." }
  }
  return { ok: true }
}

export function chantierNomFromCommande(commande: CommandeForIntervention): string {
  const who = commande.contact_nom?.trim() || commande.contact_email || "Particulier"
  return `Commande ${who}`.slice(0, 120)
}

export function interventionCommentFromCommande(commande: CommandeForIntervention): string {
  return [
    `Commande benne ${commande.id.slice(0, 8)}`,
    commande.prestation_label,
    commande.contact_email,
  ]
    .filter(Boolean)
    .join(" · ")
}

export function contenantCodeForCommande(volumeM3: number | null): string {
  if (volumeM3 == null) return "benne_15m3"
  return contenantCodeForVolume(Number(volumeM3))
}
