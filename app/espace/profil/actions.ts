"use server"

import { revalidatePath } from "next/cache"

import { isValidFrenchPostcode } from "@/lib/espace/delivery-address"
import { profilFullName } from "@/lib/espace/profil-prefill"
import { createClient } from "@/lib/supabase/server"
import { isValidContactPhone } from "@/lib/phone/phone-value"

export type SaveProfilResult = { ok: true } | { error: string }

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function readParticulierFields(formData: FormData) {
  const prenom = String(formData.get("prenom") ?? "").trim()
  const nom = String(formData.get("nom") ?? "").trim()
  const phoneRaw = String(formData.get("phone") ?? "").trim()
  const adresse_ligne = String(formData.get("adresse_livraison_ligne") ?? "").trim()
  const code_postal = String(formData.get("adresse_livraison_code_postal") ?? "").trim()
  const ville = String(formData.get("adresse_livraison_ville") ?? "").trim()

  const full_name = profilFullName(prenom, nom)

  return {
    prenom,
    nom,
    full_name,
    phoneRaw,
    adresse_ligne,
    code_postal,
    ville,
  }
}

function validateParticulierFields(fields: ReturnType<typeof readParticulierFields>): string | null {
  if (!fields.full_name || fields.full_name.length < 2) {
    return "Indiquez votre prénom et votre nom."
  }

  if (fields.phoneRaw && !isValidContactPhone(fields.phoneRaw)) {
    return "Numéro de téléphone invalide."
  }

  const hasPartialAddress =
    Boolean(fields.adresse_ligne) ||
    Boolean(fields.code_postal) ||
    Boolean(fields.ville)

  if (hasPartialAddress) {
    if (!fields.adresse_ligne || !fields.code_postal || !fields.ville) {
      return "Complétez la rue, le code postal et la ville de livraison."
    }
    if (!isValidFrenchPostcode(fields.code_postal)) {
      return "Code postal invalide (5 chiffres attendus)."
    }
  }

  return null
}

export async function saveProfilParticulier(formData: FormData): Promise<SaveProfilResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Connectez-vous pour modifier votre profil." }
  }

  const fields = readParticulierFields(formData)
  const validationError = validateParticulierFields(fields)
  if (validationError) {
    return { error: validationError }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fields.full_name,
      phone: fields.phoneRaw || null,
      adresse_livraison_ligne: fields.adresse_ligne || null,
      adresse_livraison_code_postal: fields.code_postal || null,
      adresse_livraison_ville: fields.ville || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/espace/profil")
  revalidatePath("/espace/commandes")
  return { ok: true }
}

export async function saveProfilCompteProContact(formData: FormData): Promise<SaveProfilResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Connectez-vous pour modifier votre profil." }
  }

  const { data: compte } = await supabase
    .from("comptes_pro")
    .select("id, status")
    .eq("profile_id", user.id)
    .maybeSingle()

  if (!compte) {
    return { error: "Aucun dossier entreprise associé." }
  }

  const fields = readParticulierFields(formData)
  const validationError = validateParticulierFields(fields)
  if (validationError) {
    return { error: validationError }
  }

  const contact_nom = String(formData.get("contact_nom") ?? "").trim()
  const contact_fonction = String(formData.get("contact_fonction") ?? "").trim()
  const contact_telephone = String(formData.get("contact_telephone") ?? "").trim()
  const contact_email = normalizeEmail(String(formData.get("contact_email") ?? ""))
  const adresse_siege = String(formData.get("adresse_siege") ?? "").trim()

  if (!contact_nom) {
    return { error: "Nom du contact entreprise obligatoire." }
  }

  if (!contact_email || !contact_email.includes("@")) {
    return { error: "E-mail professionnel invalide." }
  }

  if (contact_telephone && !isValidContactPhone(contact_telephone)) {
    return { error: "Téléphone du contact invalide." }
  }

  const profilePatch = {
    full_name: fields.full_name,
    phone: fields.phoneRaw || null,
    updated_at: new Date().toISOString(),
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update(profilePatch)
    .eq("id", user.id)

  if (profileError) {
    return { error: profileError.message }
  }

  const comptePatch = {
    contact_nom,
    contact_fonction: contact_fonction || null,
    contact_telephone: contact_telephone || null,
    contact_email,
    adresse_siege: adresse_siege || null,
    updated_at: new Date().toISOString(),
  }

  const { error: compteError } = await supabase
    .from("comptes_pro")
    .update(comptePatch)
    .eq("id", compte.id)

  if (compteError) {
    return { error: compteError.message }
  }

  revalidatePath("/espace/profil")
  revalidatePath("/espace/compte")
  return { ok: true }
}