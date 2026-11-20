import { getAppUrl } from "@/lib/email/config"
import {
  buildDevisResumeUrl,
  issueDevisResumeToken,
} from "@/lib/order/devis-resume-token"
import {
  parseParticulierTunnelResume,
  type ParticulierTunnelResume,
} from "@/lib/order/particulier-tunnel-resume"
import {
  buildDevisResumeHrefFromCommandeRow,
  type CommandeResumeEnrich,
  type CommandeResumeSourceRow,
} from "@/lib/order/resume-from-commande-row"

export type CommandeResumeRow = CommandeResumeSourceRow & {
  tunnel_resume_snapshot?: unknown
}

export function mintDevisResumeHrefFromResume(
  resume: ParticulierTunnelResume | null
): string | null {
  if (!resume) return null
  const token = issueDevisResumeToken(resume)
  if (!token) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[devis-resume] Lien de reprise impossible : définissez DEVIS_RESUME_SECRET (≥ 16 caractères) ou CRON_SECRET dans .env.local."
      )
    }
    return null
  }
  return buildDevisResumeUrl(token, getAppUrl())
}

/** Priorité : snapshot jsonb en base → reconstruction legacy (BAN + profil). */
export async function mintDevisResumeHrefFromCommande(
  row: CommandeResumeRow,
  enrich?: CommandeResumeEnrich
): Promise<string | null> {
  const fromSnapshot = parseParticulierTunnelResume(row.tunnel_resume_snapshot)
  if (fromSnapshot) {
    const enriched = enrichResumeContacts(fromSnapshot, enrich)
    const href = mintDevisResumeHrefFromResume(enriched)
    if (href) return href
  }

  return buildDevisResumeHrefFromCommandeRow(row, enrich)
}

function enrichResumeContacts(
  resume: ParticulierTunnelResume,
  enrich?: CommandeResumeEnrich
): ParticulierTunnelResume {
  if (!enrich) return resume
  let contactEmail = resume.contactEmail
  let contactPhone = resume.contactPhone
  let contactFirstName = resume.contactFirstName
  let contactLastName = resume.contactLastName

  if (!contactEmail.trim() && enrich.fallbackEmail?.trim()) {
    contactEmail = enrich.fallbackEmail.trim()
  }
  if (!contactPhone.trim() && enrich.fallbackPhone?.trim()) {
    contactPhone = enrich.fallbackPhone.trim()
  }
  if (
    (!contactFirstName.trim() || !contactLastName.trim()) &&
    enrich.fallbackContactName?.trim()
  ) {
    const parts = enrich.fallbackContactName.trim().split(/\s+/)
    if (parts.length === 1) {
      contactFirstName = parts[0]
      contactLastName = "-"
    } else {
      contactFirstName = parts[0]
      contactLastName = parts.slice(1).join(" ")
    }
  }

  return {
    ...resume,
    contactEmail,
    contactPhone,
    contactFirstName,
    contactLastName,
  }
}