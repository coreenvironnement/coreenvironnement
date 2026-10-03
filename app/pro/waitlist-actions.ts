"use server"

import { notifyProWaitlist } from "@/lib/email/pro-waitlist-notify"

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "").trim()
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "")
  return digits.length >= 8 && digits.length <= 15
}

function normalizeSiret(value: string) {
  return value.replace(/\s/g, "")
}

export async function submitProWaitlist(formData: FormData) {
  const societe = clean(formData.get("societe"))
  const nom = clean(formData.get("nom"))
  const prenom = clean(formData.get("prenom"))
  const email = clean(formData.get("email")).toLowerCase()
  const telephone = clean(formData.get("telephone"))
  const siretRaw = clean(formData.get("siret"))
  const siret = siretRaw ? normalizeSiret(siretRaw) : ""

  if (!societe || !nom || !prenom || !email || !telephone) {
    return { error: "Société, nom, prénom, e-mail et téléphone sont obligatoires." }
  }

  if (!isValidEmail(email)) {
    return { error: "Indiquez une adresse e-mail professionnelle valide." }
  }

  if (!isValidPhone(telephone)) {
    return { error: "Indiquez un numéro de téléphone joignable." }
  }

  if (siret && !/^\d{14}$/.test(siret)) {
    return { error: "Le SIRET doit contenir 14 chiffres, ou rester vide." }
  }

  const result = await notifyProWaitlist({
    societe,
    nom,
    prenom,
    email,
    telephone,
    siret: siret || null,
  })

  if (!result.sent) {
    return {
      error:
        result.error === "Email non configuré."
          ? "L'envoi d'e-mail n'est pas configuré sur cet environnement."
          : "Impossible d'envoyer la demande pour le moment. Réessayez ou appelez-nous.",
    }
  }

  return { success: true }
}
