import { getAppUrl } from "@/lib/email/config"
import {
  emailButton,
  emailInset,
  emailLayout,
  escapeHtml,
} from "@/lib/email/templates/layout"
import { formatDateFr } from "@/lib/format/date"
import { formatEuro } from "@/lib/format/currency"
import { departementLabel } from "@/lib/geo/idf"
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
  const appUrl = getAppUrl()
  const mesCommandesUrl = `${appUrl}/mes-commandes`
  const loginUrl = `${appUrl}/login?next=${encodeURIComponent("/mes-commandes")}`

  const recapLines = [
    data.reference ? `<li style="margin:0 0 8px"><strong>Référence :</strong> ${escapeHtml(data.reference)}</li>` : "",
    data.prestationLabel ? `<li style="margin:0 0 8px"><strong>Benne :</strong> ${escapeHtml(data.prestationLabel)}</li>` : "",
    `<li style="margin:0 0 8px"><strong>Adresse :</strong> ${escapeHtml(data.adresseComplete)}${dept ? ` (${escapeHtml(dept)})` : ""}</li>`,
    data.dateLivraison
      ? `<li style="margin:0 0 8px"><strong>Livraison souhaitée :</strong> ${escapeHtml(formatDateFr(data.dateLivraison))}</li>`
      : "",
    data.dateEnlevement
      ? `<li style="margin:0 0 8px"><strong>Enlèvement souhaité :</strong> ${escapeHtml(formatDateFr(data.dateEnlevement))}</li>`
      : "",
    breakdown
      ? `<li style="margin:0 0 8px"><strong>Montant payé :</strong> ${escapeHtml(formatEuro(breakdown.ttc))} <span style="color:#667085">(dont TVA ${escapeHtml(formatEuro(breakdown.tva))})</span></li>`
      : "",
  ].filter(Boolean)

  const htmlBody = [
    `<p style="margin:0 0 16px;font-size:16px">${escapeHtml(greeting)}</p>`,
    `<p style="margin:0 0 14px">Nous avons bien reçu votre <strong>paiement</strong>. Votre commande de benne <strong>CORE Environnement</strong> est enregistrée — merci pour votre confiance.</p>`,
    recapLines.length
      ? emailInset(`<p style="margin:0 0 10px;font-weight:600;color:#172033">Récapitulatif</p><ul style="margin:0;padding:0 0 0 18px">${recapLines.join("")}</ul>`)
      : "",
    `<p style="margin:18px 0 0">Un expert déchets vous <strong>recontactera dans les prochaines heures</strong> pour valider les conditions d'accès et le créneau de pose de la benne.</p>`,
    `<p style="margin:14px 0 0;font-size:14px;color:#334155">Vous allez aussi recevoir un e-mail pour <strong>choisir votre mot de passe</strong> et accéder à votre espace client. Ensuite, connectez-vous avec l’adresse e-mail du paiement.</p>`,
    emailButton(loginUrl, "Aller à la page de connexion"),
    `<p style="margin:12px 0 0;font-size:13px;color:#667085">Suivi en ligne : <a href="${escapeHtml(mesCommandesUrl)}" style="color:#35A238">${escapeHtml(mesCommandesUrl)}</a></p>`,
    `<p style="margin:16px 0 0;font-size:14px;color:#667085">Une question ? Appelez-nous au <strong style="color:#172033">${escapeHtml(SITE_PHONE_DISPLAY)}</strong>.</p>`,
    `<p style="margin:24px 0 0">À très bientôt,<br/><strong>CORE Environnement</strong></p>`,
  ].join("\n")

  const textLines = [
    greeting,
    "",
    "Nous avons bien reçu votre paiement. Votre commande de benne CORE Environnement est enregistrée.",
    "",
    data.reference ? `Référence : ${data.reference}` : "",
    data.prestationLabel ? `Benne : ${data.prestationLabel}` : "",
    `Adresse : ${data.adresseComplete}${dept ? ` (${dept})` : ""}`,
    data.dateLivraison ? `Livraison : ${formatDateFr(data.dateLivraison)}` : "",
    data.dateEnlevement ? `Enlèvement : ${formatDateFr(data.dateEnlevement)}` : "",
    breakdown ? `Montant payé : ${formatEuro(breakdown.ttc)} (dont TVA ${formatEuro(breakdown.tva)})` : "",
    "",
    "Un expert CORE vous recontactera dans les prochaines heures pour valider l'accès et le créneau de pose.",
    "",
    "Un e-mail séparé vous permet de choisir votre mot de passe.",
    `Connexion : ${loginUrl}`,
    `Suivre vos commandes : ${mesCommandesUrl}`,
    "",
    `Téléphone : ${SITE_PHONE_DISPLAY}`,
    "",
    "CORE Environnement",
  ].filter(Boolean)

  return {
    subject: "Paiement reçu — votre commande benne CORE Environnement",
    html: emailLayout(htmlBody, {
      preheader: "Paiement confirmé — nous vous recontactons très vite.",
    }),
    text: textLines.join("\n"),
  }
}
