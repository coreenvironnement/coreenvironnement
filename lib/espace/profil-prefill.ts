import type { SupabaseClient, User } from "@supabase/supabase-js"

import {
  buildDeliveryAddressComplete,
  parseDeliveryAddressComplete,
  type DeliveryAddressParts,
} from "@/lib/espace/delivery-address"
import { formatContactPhoneDisplay } from "@/lib/phone/phone-value"

export type ProfilPrefill = {
  email: string
  prenom: string
  nom: string
  phone: string
  delivery: DeliveryAddressParts
  updatedAt: string | null
}

function splitContactName(raw: string | null | undefined): { prenom: string; nom: string } {
  const trimmed = (raw ?? "").trim()
  if (!trimmed) {
    return { prenom: "", nom: "" }
  }
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) {
    return { prenom: parts[0], nom: "" }
  }
  return {
    prenom: parts[0],
    nom: parts.slice(1).join(" "),
  }
}

function authMetaString(user: User, key: string): string {
  const value = user.user_metadata?.[key]
  return typeof value === "string" ? value.trim() : ""
}

async function loadLastParticulierCommande(
  supabase: SupabaseClient,
  userId: string,
  email: string
) {
  const normalizedEmail = email.trim().toLowerCase()
  let query = supabase
    .from("commandes")
    .select("adresse_complete, contact_nom, contact_telephone, date_creation")
    .eq("audience", "particulier")
    .order("date_creation", { ascending: false })
    .limit(1)

  if (normalizedEmail) {
    query = query.or(
      `client_id.eq.${userId},contact_email.ilike.${normalizedEmail}`
    )
  } else {
    query = query.eq("client_id", userId)
  }

  const { data } = await query.maybeSingle()
  return data
}

function resolveDeliveryParts(
  profile: {
    adresse_livraison_ligne: string | null
    adresse_livraison_code_postal: string | null
    adresse_livraison_ville: string | null
  } | null,
  lastCommandeAdresse: string | null | undefined
): DeliveryAddressParts {
  const fromProfile =
    profile?.adresse_livraison_ligne?.trim() ||
    profile?.adresse_livraison_code_postal?.trim() ||
    profile?.adresse_livraison_ville?.trim()
      ? {
          ligne: profile.adresse_livraison_ligne?.trim() ?? "",
          codePostal: profile.adresse_livraison_code_postal?.trim() ?? "",
          ville: profile.adresse_livraison_ville?.trim() ?? "",
        }
      : null

  if (fromProfile) {
    return fromProfile
  }

  if (lastCommandeAdresse?.trim()) {
    return parseDeliveryAddressComplete(lastCommandeAdresse)
  }

  return { ligne: "", codePostal: "", ville: "" }
}

export async function loadProfilPrefill(
  supabase: SupabaseClient,
  user: User
): Promise<ProfilPrefill> {
  const userEmail = user.email?.trim() ?? ""

  const [{ data: profile }, lastCmd] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "full_name, email, phone, updated_at, adresse_livraison_ligne, adresse_livraison_code_postal, adresse_livraison_ville"
      )
      .eq("id", user.id)
      .maybeSingle(),
    loadLastParticulierCommande(supabase, user.id, userEmail),
  ])

  const email = profile?.email?.trim() || userEmail

  const fromProfileName = splitContactName(profile?.full_name)
  const fromCommandeName = splitContactName(lastCmd?.contact_nom)
  const fromAuthName = splitContactName(authMetaString(user, "full_name"))

  const prenom =
    fromCommandeName.prenom || fromProfileName.prenom || fromAuthName.prenom
  const nom = fromCommandeName.nom || fromProfileName.nom || fromAuthName.nom

  const phoneRaw =
    profile?.phone?.trim() ||
    authMetaString(user, "signup_phone") ||
    lastCmd?.contact_telephone?.trim() ||
    ""

  const delivery = resolveDeliveryParts(profile, lastCmd?.adresse_complete)

  return {
    email,
    prenom,
    nom,
    phone: phoneRaw ? formatContactPhoneDisplay(phoneRaw) : "",
    delivery,
    updatedAt: profile?.updated_at ?? null,
  }
}

export function profilFullName(prenom: string, nom: string): string {
  return [prenom.trim(), nom.trim()].filter(Boolean).join(" ")
}

export function profilPrefillFingerprint(prefill: ProfilPrefill): string {
  const addr = buildDeliveryAddressComplete(prefill.delivery)
  return [
    prefill.updatedAt ?? "",
    prefill.prenom,
    prefill.nom,
    prefill.phone,
    addr,
  ].join("|")
}