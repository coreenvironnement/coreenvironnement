import { getAppUrl } from "@/lib/email/config"
import { emailLayout, escapeHtml } from "@/lib/email/templates/layout"
import { formatDateFr } from "@/lib/format/date"
import { formatEuro } from "@/lib/format/currency"
import { priceBreakdownFromHt } from "@/lib/order/prestation-mapping"

export type CommandeAdminNotifyData = {
  commandeId: string
  reference: string
  contactNom: string | null
  contactEmail: string | null
  contactTelephone: string | null
  prestationLabel: string | null
  adresseComplete: string
  dateLivraison: string | null
  dateEnlevement: string | null
  priceHt: number | null
}

export function buildCommandeAdminNotifyEmail(data: CommandeAdminNotifyData) {
  const adminUrl = `${getAppUrl()}/admin/commandes/${data.commandeId}`
  const breakdown = data.priceHt != null ? priceBreakdownFromHt(data.priceHt) : null

  const lines = [
    `<p>Nouvelle commande payée.</p>`,
    "<ul>",
    `<li><strong>Référence :</strong> ${escapeHtml(data.reference)}</li>`,
    data.prestationLabel ? `<li><strong>Benne :</strong> ${escapeHtml(data.prestationLabel)}</li>` : "",
    `<li><strong>Client :</strong> ${escapeHtml(data.contactNom ?? "—")}</li>`,
    `<li><strong>E-mail :</strong> ${escapeHtml(data.contactEmail ?? "—")}</li>`,
    `<li><strong>Téléphone :</strong> ${escapeHtml(data.contactTelephone ?? "—")}</li>`,
    `<li><strong>Adresse :</strong> ${escapeHtml(data.adresseComplete)}</li>`,
    data.dateLivraison
      ? `<li><strong>Livraison :</strong> ${escapeHtml(formatDateFr(data.dateLivraison))}</li>`
      : "",
    data.dateEnlevement
      ? `<li><strong>Enlèvement :</strong> ${escapeHtml(formatDateFr(data.dateEnlevement))}</li>`
      : "",
    breakdown ? `<li><strong>TTC :</strong> ${escapeHtml(formatEuro(breakdown.ttc))}</li>` : "",
    "</ul>",
    `<p><a href="${escapeHtml(adminUrl)}">Voir la commande</a></p>`,
  ].filter(Boolean)

  const text = [
    "Nouvelle commande payée.",
    `Référence : ${data.reference}`,
    data.prestationLabel ? `Benne : ${data.prestationLabel}` : "",
    `Client : ${data.contactNom ?? "—"}`,
    `Adresse : ${data.adresseComplete}`,
    breakdown ? `TTC : ${formatEuro(breakdown.ttc)}` : "",
    "",
    `Voir la commande : ${adminUrl}`,
  ]
    .filter(Boolean)
    .join("\n")

  return {
    subject: `Nouvelle commande CORE Environnement — ${data.reference}`,
    html: emailLayout(lines.join("\n")),
    text,
  }
}
