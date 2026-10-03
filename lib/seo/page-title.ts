export const SEO_BRAND_NAME = "CORE ENVIRONNEMENT"

const BRAND_SUFFIX = ` | ${SEO_BRAND_NAME}`

/** Titre document / Open Graph avec suffixe marque (évite le double suffixe). */
export function withBrandTitle(title: string): string {
  const trimmed = title.trim()
  if (trimmed.endsWith(BRAND_SUFFIX)) return trimmed
  return `${trimmed}${BRAND_SUFFIX}`
}
