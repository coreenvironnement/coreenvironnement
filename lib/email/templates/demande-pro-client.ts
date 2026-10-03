import { emailLayout, escapeHtml } from "@/lib/email/templates/layout"
import { formatDateFr } from "@/lib/format/date"
import type { PreparedProfessionalBenneRequest } from "@/lib/order/pro-request"

export function buildDemandeProClientEmail(data: PreparedProfessionalBenneRequest) {
  const greeting = `Bonjour ${data.contactName},`
  const lines = [
    `<p>${escapeHtml(greeting)}</p>`,
    `<p>Nous avons bien reçu votre demande de benne pour <strong>${escapeHtml(data.companyName)}</strong>.</p>`,
    "<p>Un expert CORE Environnement vous recontactera prochainement afin de confirmer votre besoin et les modalités d’intervention.</p>",
    "<ul>",
    `<li><strong>Référence :</strong> ${escapeHtml(data.reference)}</li>`,
    `<li><strong>Benne :</strong> ${escapeHtml(data.prestationLabel)} (${escapeHtml(data.benneVolume)})</li>`,
    `<li><strong>Déchets :</strong> ${escapeHtml(data.wasteLabel)}</li>`,
    `<li><strong>Adresse :</strong> ${escapeHtml(data.address)}</li>`,
    `<li><strong>Livraison :</strong> ${escapeHtml(formatDateFr(data.deliveryDate))}</li>`,
    data.pickupDate
      ? `<li><strong>Enlèvement :</strong> ${escapeHtml(formatDateFr(data.pickupDate))}</li>`
      : "",
    "</ul>",
    "<p><strong>Bientôt disponible</strong><br/>Votre espace professionnel vous permettra prochainement de suivre vos demandes, vos rotations de bennes et vos documents liés à la gestion de vos déchets.</p>",
    "<p>À très bientôt,<br/>L'équipe CORE Environnement</p>",
  ].filter(Boolean)

  const text = [
    greeting,
    "",
    `Nous avons bien reçu votre demande de benne pour ${data.companyName}.`,
    "",
    "Un expert CORE Environnement vous recontactera prochainement afin de confirmer votre besoin et les modalités d’intervention.",
    "",
    `Référence : ${data.reference}`,
    `Benne : ${data.prestationLabel} (${data.benneVolume})`,
    `Déchets : ${data.wasteLabel}`,
    `Adresse : ${data.address}`,
    `Livraison : ${formatDateFr(data.deliveryDate)}`,
    data.pickupDate ? `Enlèvement : ${formatDateFr(data.pickupDate)}` : "",
    "",
    "Bientôt disponible",
    "Votre espace professionnel vous permettra prochainement de suivre vos demandes, vos rotations de bennes et vos documents liés à la gestion de vos déchets.",
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
