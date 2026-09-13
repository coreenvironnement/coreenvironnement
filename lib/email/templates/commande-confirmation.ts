import { getAppUrl } from "@/lib/email/config"
import { formatDateFr } from "@/lib/format/date"
import { formatEuro } from "@/lib/format/currency"
import { departementLabel } from "@/lib/geo/idf"
import { commentCaFonctionne } from "@/lib/cdc/contenu-vitrine"

export type CommandeConfirmationData = {
  contactEmail: string
  contactNom: string | null
  prestationLabel: string | null
  adresseComplete: string
  departementCode: string | null
  dateLivraison: string | null
  dateEnlevement: string | null
  priceHt: number | null
}

export function buildCommandeConfirmationEmail(data: CommandeConfirmationData) {
  const greeting = data.contactNom?.trim() ? `Bonjour ${data.contactNom.trim()},` : "Bonjour,"
  const dept = data.departementCode
    ? departementLabel(data.departementCode) ?? data.departementCode
    : null

  const lines = [
    `<p>${greeting}</p>`,
    `<p>Votre commande de benne <strong>CORE ENVIRONNEMENT</strong> est confirmée. Merci pour votre confiance.</p>`,
    "<ul>",
    data.prestationLabel ? `<li><strong>Forfait :</strong> ${escapeHtml(data.prestationLabel)}</li>` : "",
    `<li><strong>Adresse :</strong> ${escapeHtml(data.adresseComplete)}${dept ? ` (${escapeHtml(dept)})` : ""}</li>`,
    data.dateLivraison
      ? `<li><strong>Livraison souhaitée :</strong> ${escapeHtml(formatDateFr(data.dateLivraison))}</li>`
      : "",
    data.dateEnlevement
      ? `<li><strong>Enlèvement souhaité :</strong> ${escapeHtml(formatDateFr(data.dateEnlevement))}</li>`
      : "",
    data.priceHt != null
      ? `<li><strong>Montant HT :</strong> ${escapeHtml(formatEuro(data.priceHt))}</li>`
      : "",
    "</ul>",
    `<p>${escapeHtml(commentCaFonctionne.particulier.suite)}</p>`,
    `<p>À très bientôt,<br/>L'équipe CORE ENVIRONNEMENT</p>`,
    `<p style="font-size:12px;color:#666"><a href="${getAppUrl()}">${getAppUrl()}</a></p>`,
  ].filter(Boolean)

  const textLines = [
    greeting,
    "",
    "Votre commande de benne CORE ENVIRONNEMENT est confirmée.",
    "",
    data.prestationLabel ? `Forfait : ${data.prestationLabel}` : "",
    `Adresse : ${data.adresseComplete}${dept ? ` (${dept})` : ""}`,
    data.dateLivraison ? `Livraison : ${formatDateFr(data.dateLivraison)}` : "",
    data.priceHt != null ? `Montant HT : ${formatEuro(data.priceHt)}` : "",
    "",
    commentCaFonctionne.particulier.suite,
    "",
    "L'équipe CORE ENVIRONNEMENT",
  ].filter(Boolean)

  return {
    subject: "Confirmation de votre commande benne — CORE ENVIRONNEMENT",
    html: emailLayout(lines.join("\n")),
    text: textLines.join("\n"),
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
