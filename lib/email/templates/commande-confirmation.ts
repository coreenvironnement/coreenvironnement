import { getAppUrl } from "@/lib/email/config"
import { emailLayout, escapeHtml } from "@/lib/email/templates/layout"
import { formatDateFr } from "@/lib/format/date"
import { formatEuro } from "@/lib/format/currency"
import { departementLabel } from "@/lib/geo/idf"
import { commentCaFonctionne } from "@/lib/cdc/contenu-vitrine"
import { priceBreakdownFromHt } from "@/lib/order/prestation-mapping"
import { SITE_PHONE_DISPLAY } from "@/lib/site"

export type CommandeConfirmationData = {
  contactEmail: string
  contactNom: string | null
  prestationLabel: string | null
  adresseComplete: string
  departementCode: string | null
  dateLivraison: string | null
  dateEnlevement: string | null
  priceHt: number | null
  reference?: string | null
}

export function buildCommandeConfirmationEmail(data: CommandeConfirmationData) {
  const greeting = data.contactNom?.trim() ? `Bonjour ${data.contactNom.trim()},` : "Bonjour,"
  const dept = data.departementCode
    ? departementLabel(data.departementCode) ?? data.departementCode
    : null
  const breakdown = data.priceHt != null ? priceBreakdownFromHt(data.priceHt) : null

  const lines = [
    `<p>${greeting}</p>`,
    `<p>Votre commande de benne <strong>CORE ENVIRONNEMENT</strong> est confirmée. Merci pour votre confiance.</p>`,
    "<ul>",
    data.reference ? `<li><strong>Référence :</strong> ${escapeHtml(data.reference)}</li>` : "",
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
    breakdown
      ? `<li><strong>Montant TTC :</strong> ${escapeHtml(formatEuro(breakdown.ttc))}</li>`
      : "",
    "</ul>",
    `<p>${escapeHtml(commentCaFonctionne.particulier.suite)}</p>`,
    `<p>Une question ? Appelez-nous au <strong>${escapeHtml(SITE_PHONE_DISPLAY)}</strong>.</p>`,
    `<p>À très bientôt,<br/>L'équipe CORE ENVIRONNEMENT</p>`,
    `<p style="font-size:12px;color:#666"><a href="${getAppUrl()}">${getAppUrl()}</a></p>`,
  ].filter(Boolean)

  const textLines = [
    greeting,
    "",
    "Votre commande de benne CORE ENVIRONNEMENT est confirmée.",
    "",
    data.reference ? `Référence : ${data.reference}` : "",
    data.prestationLabel ? `Forfait : ${data.prestationLabel}` : "",
    `Adresse : ${data.adresseComplete}${dept ? ` (${dept})` : ""}`,
    data.dateLivraison ? `Livraison : ${formatDateFr(data.dateLivraison)}` : "",
    data.dateEnlevement ? `Enlèvement : ${formatDateFr(data.dateEnlevement)}` : "",
    data.priceHt != null ? `Montant HT : ${formatEuro(data.priceHt)}` : "",
    breakdown ? `Montant TTC : ${formatEuro(breakdown.ttc)}` : "",
    "",
    commentCaFonctionne.particulier.suite,
    "",
    `Téléphone CORE : ${SITE_PHONE_DISPLAY}`,
    "",
    "L'équipe CORE ENVIRONNEMENT",
  ].filter(Boolean)

  return {
    subject: "Confirmation de votre commande benne — CORE ENVIRONNEMENT",
    html: emailLayout(lines.join("\n")),
    text: textLines.join("\n"),
  }
}
