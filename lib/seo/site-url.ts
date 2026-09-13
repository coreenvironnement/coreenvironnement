const DEFAULT_SITE_URL = "https://core-environnement.fr"

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (configured) {
    return configured.replace(/\/$/, "")
  }
  return DEFAULT_SITE_URL
}
