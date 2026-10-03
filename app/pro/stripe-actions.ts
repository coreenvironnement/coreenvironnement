"use server"

export async function startProSubscription(): Promise<{ error: string }> {
  return {
    error:
      "L'abonnement professionnel n'est pas encore ouvert. Laissez vos coordonnées sur la page /pro.",
  }
}

export async function openBillingPortal(): Promise<{ error: string }> {
  return { error: "La gestion d'abonnement professionnel n'est pas encore ouverte." }
}
