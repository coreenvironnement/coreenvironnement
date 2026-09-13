import { getAppUrl } from "@/lib/email/config"
import { paymentModeLabel } from "@/lib/compte-pro/labels"
import { comptePro } from "@/lib/cdc/contenu-vitrine"

export type CompteProReviewData = {
  contactEmail: string
  contactNom: string
  raisonSociale: string
  approved: boolean
  paymentMode: string | null
  reviewNotes: string | null
}

export function buildCompteProReviewEmail(data: CompteProReviewData) {
  const greeting = `Bonjour ${data.contactNom.trim()},`
  const proUrl = `${getAppUrl()}/pro`

  if (data.approved) {
    const modeLabel = paymentModeLabel(data.paymentMode)
    const nextStep =
      data.paymentMode === "cb_required"
        ? `Connectez-vous sur <a href="${proUrl}">${proUrl}</a> pour activer votre abonnement (${comptePro.abonnement}) et accéder à votre espace client.`
        : `Connectez-vous sur <a href="${proUrl}">${proUrl}</a> pour passer vos commandes sur facture depuis votre espace client.`

    const html = emailLayout(
      [
        `<p>${escapeHtml(greeting)}</p>`,
        `<p>Bonne nouvelle : votre demande de compte professionnel pour <strong>${escapeHtml(data.raisonSociale)}</strong> a été <strong>validée</strong>.</p>`,
        `<p><strong>Mode de paiement :</strong> ${escapeHtml(modeLabel)}</p>`,
        `<p>${nextStep}</p>`,
        `<p>${escapeHtml(comptePro.reassurance.footer)}</p>`,
        `<p>Cordialement,<br/>L'équipe CORE ENVIRONNEMENT</p>`,
      ].join("\n")
    )

    const text = [
      greeting,
      "",
      `Votre compte pro pour ${data.raisonSociale} a été validé.`,
      `Mode de paiement : ${modeLabel}`,
      data.paymentMode === "cb_required"
        ? `Activez votre abonnement sur ${proUrl}`
        : `Commandez sur facture depuis ${proUrl}`,
      "",
      "L'équipe CORE ENVIRONNEMENT",
    ].join("\n")

    return {
      subject: "Compte professionnel validé — CORE ENVIRONNEMENT",
      html,
      text,
    }
  }

  const motif = data.reviewNotes?.trim()
    ? `<p><strong>Motif :</strong> ${escapeHtml(data.reviewNotes.trim())}</p>`
    : ""

  const html = emailLayout(
    [
      `<p>${escapeHtml(greeting)}</p>`,
      `<p>Après étude de votre dossier pour <strong>${escapeHtml(data.raisonSociale)}</strong>, nous ne sommes pas en mesure d'ouvrir votre compte professionnel pour le moment.</p>`,
      motif,
      `<p>Vous pouvez nous contacter ou soumettre une nouvelle demande depuis <a href="${proUrl}">${proUrl}</a>.</p>`,
      `<p>Cordialement,<br/>L'équipe CORE ENVIRONNEMENT</p>`,
    ].join("\n")
  )

  const text = [
    greeting,
    "",
    `Votre demande de compte pro pour ${data.raisonSociale} n'a pas été acceptée.`,
    data.reviewNotes?.trim() ? `Motif : ${data.reviewNotes.trim()}` : "",
    `Nouvelle demande : ${proUrl}`,
    "",
    "L'équipe CORE ENVIRONNEMENT",
  ]
    .filter(Boolean)
    .join("\n")

  return {
    subject: "Compte professionnel — décision sur votre dossier",
    html,
    text,
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function emailLayout(body: string): string {
  return `<!DOCTYPE html><html lang="fr"><body style="font-family:Arial,sans-serif;line-height:1.5;color:#1a2744;max-width:560px;margin:0 auto;padding:24px">${body}</body></html>`
}
