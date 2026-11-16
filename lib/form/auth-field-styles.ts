import { cn } from "@/lib/utils"

/** Classes partagées champs auth vitrine (voir `.form-field-input` dans vitrine.css). */
export const authFieldInputClass = "form-field-input"

/** Libellé champ espace profil / auth vitrine. */
export const espaceFieldLabelClass = "text-sm font-medium text-brand-navy"

/** Texte d’aide sous un champ espace profil. */
export const espaceFieldHintClass = "text-xs leading-snug text-brand-muted"

/** Champs profil espace (`.espace-profil-form` dans vitrine.css) — h-11, focus vert. */
export const espaceProfilInputClass = cn(authFieldInputClass)

/** E-mail ou identifiant en lecture seule (profil espace). */
export const espaceProfilReadonlyInputClass = cn(
  authFieldInputClass,
  "espace-profil-input--readonly"
)

export function fieldMessageId(fieldId: string, kind: "error" | "hint" = "error") {
  return `${fieldId}-${kind}`
}

export function authFieldClassName(
  options?: { invalid?: boolean; className?: string }
) {
  return cn(authFieldInputClass, options?.className)
}