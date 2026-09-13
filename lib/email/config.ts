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
