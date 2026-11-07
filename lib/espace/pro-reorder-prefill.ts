import type { SupabaseClient } from "@supabase/supabase-js"

import { prestationById } from "@/lib/prestations"

export type ProReorderSeed = {
  addressLabel: string
  departementCode: string | null
  prestationId: string
  deliveryDate: string | null
  pickupDate: string | null
  companyName: string
  proContactName: string
  contactPhone: string
  contactEmail: string
  siret: string | null
}

export type ProReorderPrefill = {
  seed: ProReorderSeed | null
  hasComptePro: boolean
  paymentMode: string | null
  compteApproved: boolean
}

function parseProContactNom(raw: string | null): {
  contactName: string
  companyName: string
} {
  const trimmed = (raw ?? "").trim()
  const match = trimmed.match(/^(.+?)\s*\(([^)]+)\)\s*$/)
  if (match) {
    return { contactName: match[1].trim(), companyName: match[2].trim() }
  }
  return { contactName: trimmed, companyName: "" }
}

export async function loadProReorderPrefill(
  supabase: SupabaseClient,
  userId: string,
  userEmail: string | undefined
): Promise<ProReorderPrefill> {
  const { data: compte } = await supabase
    .from("comptes_pro")
    .select(
      "raison_sociale, contact_nom, contact_email, contact_phone, siret, status, payment_mode"
    )
    .eq("profile_id", userId)
    .maybeSingle()

  const { data: lastCommande } = await supabase
    .from("commandes")
    .select(
      "adresse_complete, departement_code, prestation_id, date_livraison, date_enlevement, contact_nom, contact_telephone, contact_email"
    )
    .eq("client_id", userId)
    .eq("audience", "professionnel")
    .order("date_creation", { ascending: false })
    .limit(1)
    .maybeSingle()

  const fromCompte = compte
    ? {
        companyName: compte.raison_sociale ?? "",
        proContactName: compte.contact_nom ?? "",
        contactPhone: compte.contact_phone ?? "",
        contactEmail: compte.contact_email ?? userEmail ?? "",
        siret: compte.siret,
      }
    : null

  const fromCommande = lastCommande
    ? (() => {
        const parsed = parseProContactNom(lastCommande.contact_nom)
        return {
          addressLabel: lastCommande.adresse_complete ?? "",
          departementCode: lastCommande.departement_code,
          prestationId: lastCommande.prestation_id ?? "",
          deliveryDate: lastCommande.date_livraison,
          pickupDate: lastCommande.date_enlevement,
          companyName: parsed.companyName || fromCompte?.companyName || "",
          proContactName: parsed.contactName || fromCompte?.proContactName || "",
          contactPhone: lastCommande.contact_telephone ?? fromCompte?.contactPhone ?? "",
          contactEmail: lastCommande.contact_email ?? fromCompte?.contactEmail ?? "",
          siret: fromCompte?.siret ?? null,
        }
      })()
    : null

  if (!fromCommande?.prestationId || !prestationById(fromCommande.prestationId)) {
    return {
      seed: null,
      hasComptePro: Boolean(compte),
      paymentMode: compte?.payment_mode ?? null,
      compteApproved: compte?.status === "approved",
    }
  }

  const seed: ProReorderSeed = {
    addressLabel: fromCommande.addressLabel,
    departementCode: fromCommande.departementCode,
    prestationId: fromCommande.prestationId,
    deliveryDate: fromCommande.deliveryDate,
    pickupDate: fromCommande.pickupDate,
    companyName: fromCompte?.companyName || fromCommande.companyName,
    proContactName: fromCompte?.proContactName || fromCommande.proContactName,
    contactPhone: fromCompte?.contactPhone || fromCommande.contactPhone,
    contactEmail: fromCompte?.contactEmail || fromCommande.contactEmail,
    siret: fromCompte?.siret ?? fromCommande.siret ?? null,
  }

  return {
    seed,
    hasComptePro: Boolean(compte),
    paymentMode: compte?.payment_mode ?? null,
    compteApproved: compte?.status === "approved",
  }
}
