import { cn } from "@/lib/utils"

/** Classes partagées champs auth vitrine (voir `.form-field-input` dans vitrine.css). */
export const authFieldInputClass = "form-field-input"

export function fieldMessageId(fieldId: string, kind: "error" | "hint" = "error") {
  return `${fieldId}-${kind}`
}

export function authFieldClassName(
  options?: { invalid?: boolean; className?: string }
) {
  return cn(authFieldInputClass, options?.className)
}