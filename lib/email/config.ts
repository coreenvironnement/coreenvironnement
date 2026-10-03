/** Destinataire interne unique si ORDER_NOTIFICATION_EMAIL est absent. */
export const ORDER_NOTIFICATION_EMAIL_FALLBACK = "contact@coreenvironnement.fr"

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim())
}

export function getEmailFrom(): string {
  return (
    process.env.EMAIL_FROM?.trim() || "CORE Environnement <onboarding@resend.dev>"
  )
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000"
}

export function getOrderNotificationEmail(): string {
  return process.env.ORDER_NOTIFICATION_EMAIL?.trim() || ORDER_NOTIFICATION_EMAIL_FALLBACK
}
