"use server"

import { revalidatePath } from "next/cache"

import {
  syncSubscriptionSeatsQuantity,
  type CompteProSeatRow,
} from "@/lib/compte-pro/seats"
import { createClient } from "@/lib/supabase/server"

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

async function getOwnerCompte(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("comptes_pro")
    .select("id, profile_id, contact_email, status")
    .eq("profile_id", userId)
    .maybeSingle()
  return data
}

export async function listCompteProSeats(): Promise<CompteProSeatRow[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const compte = await getOwnerCompte(supabase, user.id)
  if (!compte) return []

  const { data } = await supabase
    .from("compte_pro_seats")
    .select("id, compte_pro_id, profile_id, invited_email, status, created_at")
    .eq("compte_pro_id", compte.id)
    .neq("status", "revoked")
    .order("created_at", { ascending: true })

  return (data ?? []) as CompteProSeatRow[]
}

export async function inviteCompteProSeat(
  emailRaw: string
): Promise<{ ok: true } | { error: string }> {
  const email = normalizeEmail(emailRaw)
  if (!email.includes("@")) {
    return { error: "Adresse e-mail invalide." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Connexion requise." }

  const compte = await getOwnerCompte(supabase, user.id)
  if (!compte) return { error: "Aucun dossier professionnel." }
  if (compte.status !== "approved") {
    return { error: "Dossier non validé." }
  }

  if (compte.contact_email && normalizeEmail(compte.contact_email) === email) {
    return { error: "Le titulaire du compte compte déjà comme utilisateur principal." }
  }

  const { error } = await supabase.from("compte_pro_seats").insert({
    compte_pro_id: compte.id,
    invited_email: email,
    status: "pending",
  })

  if (error) {
    if (error.code === "23505") {
      return { error: "Cet e-mail est déjà invité." }
    }
    return { error: "Impossible d'ajouter l'utilisateur." }
  }

  revalidatePath("/espace/compte")
  return { ok: true }
}

export async function activateCompteProSeat(seatId: string): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Connexion requise." }

  const compte = await getOwnerCompte(supabase, user.id)
  if (!compte) return { error: "Dossier introuvable." }

  const { data: seat } = await supabase
    .from("compte_pro_seats")
    .select("id, compte_pro_id, status")
    .eq("id", seatId)
    .eq("compte_pro_id", compte.id)
    .maybeSingle()

  if (!seat || seat.status === "revoked") {
    return { error: "Siège introuvable." }
  }

  const { error } = await supabase
    .from("compte_pro_seats")
    .update({ status: "active" })
    .eq("id", seatId)

  if (error) return { error: "Mise à jour impossible." }

  const sync = await syncSubscriptionSeatsQuantity(supabase, compte.id)
  if (sync.error) return { error: sync.error }

  revalidatePath("/espace/compte")
  return { ok: true }
}

export async function revokeCompteProSeat(seatId: string): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Connexion requise." }

  const compte = await getOwnerCompte(supabase, user.id)
  if (!compte) return { error: "Dossier introuvable." }

  const { error } = await supabase
    .from("compte_pro_seats")
    .update({ status: "revoked" })
    .eq("id", seatId)
    .eq("compte_pro_id", compte.id)

  if (error) return { error: "Révocation impossible." }

  const sync = await syncSubscriptionSeatsQuantity(supabase, compte.id)
  if (sync.error) return { error: sync.error }

  revalidatePath("/espace/compte")
  return { ok: true }
}
