import {
  emailButton,
  emailCard,
  emailFallbackLink,
  emailInset,
  emailLayout,
  escapeHtml,
} from "@/lib/email/templates/layout"
import { formatDateFr } from "@/lib/format/date"
import { formatEuro } from "@/lib/format/currency"

export type DevisParticulierEmailData = {
  contactNom: string
  contactEmail: string
  prestationLabel: string
  adresse: string
  deliveryDate: string
  pickupDate?: string | null
  priceTtc: number
  reference: string
  /** Lien signé : reprise du tunnel au récap (données déjà saisies). */
  resumeUrl?: string | null
}

export function buildDevisParticulierEmail(data: DevisParticulierEmailData) {
  const greeting = data.contactNom ? `Bonjour ${escapeHtml(data.contactNom)},` : "Bonjour,"

  const ctaBlock = data.resumeUrl
    ? [
        emailCard(
          [
            `<p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#172033">Votre benne vous attend</p>`,
            `<p style="margin:0 0 4px;font-size:14px;line-height:1.55;color:#475467">Tout est déjà enregistré : benne, adresse, dates et vos coordonnées. Il ne reste qu’à <strong>vérifier le récapitulatif</strong> et payer en toute sécurité.</p>`,
            `<p style="margin:8px 0 0;font-size:13px;color:#667085">Pas besoin de tout ressaisir - un clic vous ramène exactement où vous en étiez.</p>`,
          ].join("")
        ),
        emailButton(data.resumeUrl, "Reprendre ma commande"),
        emailFallbackLink(data.resumeUrl),
      ].join("\n")
    : ""

  const fullHtml = [
    `<p style="margin:0 0 14px">${greeting}</p>`,
    `<p style="margin:0 0 14px">Votre <strong>devis</strong> et nos <strong>Conditions Générales de Vente</strong> sont en pièces jointes pour votre dossier.</p>`,
    ctaBlock,
    emailInset(
      [
        `<p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#172033">Rappel de votre demande</p>`,
        `<ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.55">`,
        `<li><strong>Benne :</strong> ${escapeHtml(data.prestationLabel)}</li>`,
        `<li><strong>Adresse :</strong> ${escapeHtml(data.adresse)}</li>`,
        `<li><strong>Livraison :</strong> ${escapeHtml(formatDateFr(data.deliveryDate))}</li>`,
        data.pickupDate
          ? `<li><strong>Enlèvement :</strong> ${escapeHtml(formatDateFr(data.pickupDate))}</li>`
          : "",
        `<li><strong>Total TTC (indicatif) :</strong> ${escapeHtml(formatEuro(data.priceTtc))}</li>`,
        `</ul>`,
      ].join("")
    ),
    `<p style="margin:14px 0 0;font-size:13px;color:#667085">Référence devis : <strong>${escapeHtml(data.reference)}</strong></p>`,
    `<p style="margin:14px 0 0;font-size:14px;color:#334155;line-height:1.5">Après paiement, un conseiller CORE vous contacte pour confirmer le créneau de livraison à la date souhaitée.</p>`,
  ]
    .filter(Boolean)
    .join("\n")

  const textLines = [
    data.contactNom ? `Bonjour ${data.contactNom},` : "Bonjour,",
    "",
    "Votre devis et les CGV sont en pièces jointes.",
    data.resumeUrl
      ? `Reprendre ma commande (tout est déjà rempli) : ${data.resumeUrl}`
      : "",
    `Benne : ${data.prestationLabel}`,
    `Adresse : ${data.adresse}`,
    `Livraison : ${formatDateFr(data.deliveryDate)}`,
    data.pickupDate ? `Enlèvement : ${formatDateFr(data.pickupDate)}` : "",
    `Total TTC : ${formatEuro(data.priceTtc)}`,
    `Réf. ${data.reference}`,
  ].filter(Boolean)

  return {
    subject: `Votre devis CORE Environnement - ${data.reference}`,
    html: emailLayout(fullHtml, {
      preheader: data.resumeUrl
        ? "Reprenez votre commande en 1 clic - benne, adresse et dates déjà enregistrées."
        : "Devis benne + CGV en pièces jointes.",
    }),
    text: textLines.join("\n"),
  }
}