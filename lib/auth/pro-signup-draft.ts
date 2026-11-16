export type ProSignupDraft = {
  raison_sociale: string
  siret: string | null
  code_naf: string | null
  adresse_siege: string | null
  contact_fonction: string | null
  contact_nom: string
  contact_email: string
  contact_telephone: string | null
}

export function parseProSignupDraft(raw: unknown): ProSignupDraft | null {
  if (!raw || typeof raw !== "object") return null
  const d = raw as Record<string, unknown>
  const raison_sociale = typeof d.raison_sociale === "string" ? d.raison_sociale.trim() : ""
  const contact_email =
    typeof d.contact_email === "string" ? d.contact_email.trim().toLowerCase() : ""
  const contact_nom = typeof d.contact_nom === "string" ? d.contact_nom.trim() : ""
  if (!raison_sociale || !contact_email || !contact_nom) return null
  return {
    raison_sociale,
    siret: typeof d.siret === "string" && d.siret.trim() ? d.siret.trim() : null,
    code_naf: typeof d.code_naf === "string" && d.code_naf.trim() ? d.code_naf.trim() : null,
    adresse_siege:
      typeof d.adresse_siege === "string" && d.adresse_siege.trim() ? d.adresse_siege.trim() : null,
    contact_fonction:
      typeof d.contact_fonction === "string" && d.contact_fonction.trim()
        ? d.contact_fonction.trim()
        : null,
    contact_nom,
    contact_email,
    contact_telephone:
      typeof d.contact_telephone === "string" && d.contact_telephone.trim()
        ? d.contact_telephone.trim()
        : null,
  }
}