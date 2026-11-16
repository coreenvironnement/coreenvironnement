import type { SupabaseClient } from "@supabase/supabase-js"

import { buildDeliveryAddressComplete } from "@/lib/espace/delivery-address"

export type ParticulierReorderSeed = {
  addressLabel: string
  contactFirstName: string
  contactLastName: string
  contactPhone: string
  contactEmail: string
}

export type ParticulierReorderPrefill = {
  seed: ParticulierReorderSeed
  hasSavedAddress: boolean
}

function splitContactName(raw: string | null | undefined): {
  contactFirstName: string
  contactLastName: string
} {
  const trimmed = (raw ?? "").trim()
  if (!trimmed) {
    return { contactFirstName: "", contactLastName: "" }
  }
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) {
    return { contactFirstName: parts[0], contactLastName: "" }
  }
  return {
    contactFirstName: parts[0],
    contactLastName: parts.slice(1).join(" "),
  }
}

export async function loadParticulierReorderPrefill(
  supabase: SupabaseClient,
  userId: string,
  userEmail: string | undefined
): Promise<ParticulierReorderPrefill> {
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, phone, email, adresse_livraison_ligne, adresse_livraison_code_postal, adresse_livraison_ville"
    )
    .eq("id", userId)
    .maybeSingle()

  const emailForLookup = profile?.email?.trim().toLowerCase() || userEmail?.trim().toLowerCase() || ""

  let commandeQuery = supabase
    .from("commandes")
    .select("adresse_complete, contact_nom, contact_telephone, contact_email")
    .eq("audience", "particulier")
    .order("date_creation", { ascending: false })
    .limit(1)

  if (emailForLookup) {
    commandeQuery = commandeQuery.or(
      `client_id.eq.${userId},contact_email.ilike.${emailForLookup}`
    )
  } else {
    commandeQuery = commandeQuery.eq("client_id", userId)
  }

  const { data: lastCommande } = await commandeQuery.maybeSingle()

  const fromProfile = splitContactName(profile?.full_name)
  const fromCommande = lastCommande
    ? splitContactName(lastCommande.contact_nom)
    : { contactFirstName: "", contactLastName: "" }

  const addressFromProfile = profile
    ? buildDeliveryAddressComplete({
        ligne: profile.adresse_livraison_ligne?.trim() ?? "",
        codePostal: profile.adresse_livraison_code_postal?.trim() ?? "",
        ville: profile.adresse_livraison_ville?.trim() ?? "",
      })
    : ""

  const addressLabel =
    addressFromProfile.trim() || lastCommande?.adresse_complete?.trim() || ""

  const seed: ParticulierReorderSeed = {
    addressLabel,
    contactFirstName: fromCommande.contactFirstName || fromProfile.contactFirstName,
    contactLastName: fromCommande.contactLastName || fromProfile.contactLastName,
    contactPhone:
      lastCommande?.contact_telephone?.trim() || profile?.phone?.trim() || "",
    contactEmail:
      lastCommande?.contact_email?.trim() ||
      profile?.email?.trim() ||
      userEmail?.trim() ||
      "",
  }

  return { seed, hasSavedAddress: addressLabel.length > 0 }
}