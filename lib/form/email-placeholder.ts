const DEFAULT_EMAIL_PLACEHOLDER = "prenom.nom@gmail.com"

function nameSlug(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
}

/** Ex. Jean + Dupont → jean.dupont@gmail.com */
export function emailPlaceholderFromNames(prenom: string, nom: string): string {
  const p = nameSlug(prenom)
  const n = nameSlug(nom)
  if (p && n) return `${p}.${n}@gmail.com`
  if (p) return `${p}.nom@gmail.com`
  if (n) return `prenom.${n}@gmail.com`
  return DEFAULT_EMAIL_PLACEHOLDER
}

export { DEFAULT_EMAIL_PLACEHOLDER }