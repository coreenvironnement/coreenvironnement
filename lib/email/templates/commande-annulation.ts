import { emailLayout, escapeHtml } from "@/lib/email/templates/layout"
import { formatDateFr } from "@/lib/format/date"

export type CommandeAnnulationData = {
  contactEmail: string
  contactNom: string | null
  reference: string
  prestationLabel: string | null
  adresseComplete: string
  dateLivraison: string | null
  mentionRemboursementPossible: boolean
}

export function buildCommandeAnnulationEmail(data: CommandeAnnulationData) {
  const greeting = data.contactNom?.trim() ? `Bonjour ${data.contactNom.trim()},` : "Bonjour,"

  const refundLine = data.mentionRemboursementPossible
    ? "<p>Un remboursement sera traité si celui-ci a été demandé.</p>"
    : ""
  const refundText = data.mentionRemboursementPossible
    ? "Un remboursement sera traité si celui-ci a été demandé."
    : ""

  const lines = [
    `<p>${escapeHtml(greeting)}</p>`,
    `<p>Votre commande CORE Environnement a été annulée.</p>`,
    "<ul>",
    `<li><strong>Référence :</strong> ${escapeHtml(data.reference)}</li>`,
    data.prestationLabel ? `<li><strong>Benne :</strong> ${escapeHtml(data.prestationLabel)}</li>` : "",
    `<li><strong>Adresse :</strong> ${escapeHtml(data.adresseComplete)}</li>`,
    data.dateLivraison
      ? `<li><strong>Date :</strong> ${escapeHtml(formatDateFr(data.dateLivraison))}</li>`
      : "",
    "</ul>",
    refundLine,
    `<p>Cordialement,<br/>L'équipe CORE ENVIRONNEMENT</p>`,
  ].filter(Boolean)

  const text = [
    greeting,
    "",
    "Votre commande CORE Environnement a été annulée.",
    `Référence : ${data.reference}`,
    data.prestationLabel ? `Benne : ${data.prestationLabel}` : "",
    `Adresse : ${data.adresseComplete}`,
    data.dateLivraison ? `Date : ${formatDateFr(data.dateLivraison)}` : "",
    refundText,
    "",
    "L'équipe CORE ENVIRONNEMENT",
  ]
    .filter(Boolean)
    .join("\n")

  return {
    subject: "Votre commande CORE Environnement a été annulée",
    html: emailLayout(lines.join("\n")),
    text,
  }
}
