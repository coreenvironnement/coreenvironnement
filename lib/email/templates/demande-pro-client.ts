import { getAppUrl } from "@/lib/email/config"
import { emailLayout, escapeHtml } from "@/lib/email/templates/layout"
import { formatOrderReference } from "@/lib/commande/reference"
import { formatDateFr } from "@/lib/format/date"
import type { PreparedProfessionalBenneRequest } from "@/lib/order/pro-request"

export function buildDemandeProClientEmail(data: PreparedProfessionalBenneRequest) {
  const mesCommandesUrl = `${getAppUrl()}/mes-commandes`
  const commandeRef = data.commandeId
    ? formatOrderReference(data.commandeId)
    : data.reference
  const greeting = `Bonjour ${data.contactName},`
  const lines = [
    `<p>${escapeHtml(greeting)}</p>`,
    `<p>Nous avons bien reçu votre demande de benne pour <strong>${escapeHtml(data.companyName)}</strong>.</p>`,
    "<p>Un expert CORE Environnement vous recontactera prochainement afin de confirmer votre besoin et les modalités d’intervention.</p>",
    "<ul>",
    `<li><strong>Référence :</strong> ${escapeHtml(commandeRef)}</li>`,
    data.reference !== commandeRef
      ? `<li><strong>Référence demande :</strong> ${escapeHtml(data.reference)}</li>`
      : "",
    `<li><strong>Benne :</strong> ${escapeHtml(data.prestationLabel)} (${escapeHtml(data.benneVolume)})</li>`,
    `<li><strong>Déchets :</strong> ${escapeHtml(data.wasteLabel)}</li>`,
    `<li><strong>Adresse :</strong> ${escapeHtml(data.address)}</li>`,
    `<li><strong>Livraison :</strong> ${escapeHtml(formatDateFr(data.deliveryDate))}</li>`,
    data.pickupDate
      ? `<li><strong>Enlèvement :</strong> ${escapeHtml(formatDateFr(data.pickupDate))}</li>`
      : "",
    "</ul>",
    `<p>Retrouvez l’avancement de cette commande dans votre <a href="${escapeHtml(mesCommandesUrl)}">espace client</a> (connexion avec la même adresse e-mail).</p>`,
    "<p>À très bientôt,<br/>L'équipe CORE Environnement</p>",
  ].filter(Boolean)

  const text = [
    greeting,
    "",
    `Nous avons bien reçu votre demande de benne pour ${data.companyName}.`,
    "",
    "Un expert CORE Environnement vous recontactera prochainement afin de confirmer votre besoin et les modalités d’intervention.",
    "",
    `Référence : ${commandeRef}`,
    data.reference !== commandeRef ? `Référence demande : ${data.reference}` : "",
    `Benne : ${data.prestationLabel} (${data.benneVolume})`,
    `Déchets : ${data.wasteLabel}`,
    `Adresse : ${data.address}`,
    `Livraison : ${formatDateFr(data.deliveryDate)}`,
    data.pickupDate ? `Enlèvement : ${formatDateFr(data.pickupDate)}` : "",
    "",
    `Espace client : ${mesCommandesUrl}`,
    "Connectez-vous avec la même adresse e-mail pour suivre l’avancement de votre commande.",
    "",
    "L'équipe CORE Environnement",
  ]
    .filter(Boolean)
    .join("\n")

  return {
    subject: "Votre demande a bien été reçue — CORE Environnement",
    html: emailLayout(lines.join("\n")),
    text,
  }
}
