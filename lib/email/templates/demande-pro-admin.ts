import { emailLayout, escapeHtml } from "@/lib/email/templates/layout"
import { formatEuro } from "@/lib/format/currency"
import { formatDateFr } from "@/lib/format/date"
import { departementLabel } from "@/lib/geo/idf"
import type { PreparedProfessionalBenneRequest } from "@/lib/order/pro-request"

export function buildDemandeProAdminEmail(data: PreparedProfessionalBenneRequest) {
  const dept =
    data.departementCode != null
      ? departementLabel(data.departementCode) ?? data.departementCode
      : null

  const lines = [
    "<p>Nouvelle demande professionnelle de benne (sans paiement).</p>",
    "<ul>",
    `<li><strong>Référence :</strong> ${escapeHtml(data.reference)}</li>`,
    `<li><strong>Entreprise :</strong> ${escapeHtml(data.companyName)}</li>`,
    `<li><strong>Contact :</strong> ${escapeHtml(data.contactName)}</li>`,
    `<li><strong>Téléphone :</strong> ${escapeHtml(data.contactPhone)}</li>`,
    `<li><strong>E-mail :</strong> ${escapeHtml(data.contactEmail)}</li>`,
    `<li><strong>SIRET :</strong> ${escapeHtml(data.siret ?? "Non renseigné")}</li>`,
    `<li><strong>Adresse de livraison :</strong> ${escapeHtml(data.address)}</li>`,
    data.postcode ? `<li><strong>Code postal :</strong> ${escapeHtml(data.postcode)}</li>` : "",
    dept ? `<li><strong>Département :</strong> ${escapeHtml(dept)}</li>` : "",
    `<li><strong>Type de déchets :</strong> ${escapeHtml(data.wasteLabel)}</li>`,
    `<li><strong>Benne / volume :</strong> ${escapeHtml(data.benneVolume)}</li>`,
    `<li><strong>Prestation :</strong> ${escapeHtml(data.prestationLabel)}</li>`,
    `<li><strong>Forfait catalogue HT :</strong> ${escapeHtml(formatEuro(data.forfaitHt))} (indicatif, non payé)</li>`,
    `<li><strong>Livraison :</strong> ${escapeHtml(formatDateFr(data.deliveryDate))}</li>`,
    data.pickupDate
      ? `<li><strong>Enlèvement :</strong> ${escapeHtml(formatDateFr(data.pickupDate))}</li>`
      : "<li><strong>Enlèvement :</strong> Non renseigné</li>",
    "</ul>",
    "<p>Aucun compte professionnel ni paiement n'a été créé.</p>",
  ].filter(Boolean)

  const text = [
    "Nouvelle demande professionnelle de benne (sans paiement).",
    `Référence : ${data.reference}`,
    `Entreprise : ${data.companyName}`,
    `Contact : ${data.contactName}`,
    `Téléphone : ${data.contactPhone}`,
    `E-mail : ${data.contactEmail}`,
    `SIRET : ${data.siret ?? "Non renseigné"}`,
    `Adresse de livraison : ${data.address}`,
    data.postcode ? `Code postal : ${data.postcode}` : "",
    dept ? `Département : ${dept}` : "",
    `Type de déchets : ${data.wasteLabel}`,
    `Benne / volume : ${data.benneVolume}`,
    `Prestation : ${data.prestationLabel}`,
    `Forfait catalogue HT : ${formatEuro(data.forfaitHt)} (indicatif, non payé)`,
    `Livraison : ${formatDateFr(data.deliveryDate)}`,
    data.pickupDate
      ? `Enlèvement : ${formatDateFr(data.pickupDate)}`
      : "Enlèvement : Non renseigné",
    "",
    "Aucun compte professionnel ni paiement n'a été créé.",
  ]
    .filter(Boolean)
    .join("\n")

  return {
    subject: `Nouvelle demande professionnelle — ${data.companyName} — ${data.benneVolume}`,
    html: emailLayout(lines.join("\n")),
    text,
  }
}
