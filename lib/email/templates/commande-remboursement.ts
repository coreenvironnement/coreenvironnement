import { emailLayout, escapeHtml } from "@/lib/email/templates/layout"
import { formatEuro } from "@/lib/format/currency"

export type CommandeRemboursementData = {
  contactEmail: string
  contactNom: string | null
  reference: string
  montantTtc: number
}

export function buildCommandeRemboursementEmail(data: CommandeRemboursementData) {
  const greeting = data.contactNom?.trim() ? `Bonjour ${data.contactNom.trim()},` : "Bonjour,"
  const montant = formatEuro(data.montantTtc)

  const lines = [
    `<p>${escapeHtml(greeting)}</p>`,
    `<p>Votre remboursement CORE Environnement a été effectué.</p>`,
    "<ul>",
    `<li><strong>Référence :</strong> ${escapeHtml(data.reference)}</li>`,
    `<li><strong>Montant :</strong> ${escapeHtml(montant)}</li>`,
    "</ul>",
    `<p>Le délai d'apparition sur votre compte dépend de votre banque (généralement 5 à 10 jours ouvrés).</p>`,
    `<p>Cordialement,<br/>L'équipe CORE ENVIRONNEMENT</p>`,
  ]

  const text = [
    greeting,
    "",
    "Votre remboursement CORE Environnement a été effectué.",
    `Référence : ${data.reference}`,
    `Montant : ${montant}`,
    "",
    "Le délai d'apparition sur votre compte dépend de votre banque (généralement 5 à 10 jours ouvrés).",
    "",
    "L'équipe CORE ENVIRONNEMENT",
  ].join("\n")

  return {
    subject: "Votre remboursement CORE Environnement a été effectué",
    html: emailLayout(lines.join("\n")),
    text,
  }
}
