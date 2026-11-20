import { emailLayout } from "@/lib/email/templates/layout"

export function commandeLivraisonPlanifieeEmail(input: {
  reference: string
  creneauLabel: string
  adresse?: string | null
  report?: boolean
}) {
  const title = input.report ? "Livraison reportée" : "Livraison planifiée"
  const lead = input.report
    ? `Suite à un imprévu, votre livraison <strong>${input.reference}</strong> est reportée au créneau suivant :`
    : `Votre livraison <strong>${input.reference}</strong> est confirmée au créneau suivant :`

  const subject = input.report
    ? `CORE - ${title} (${input.reference})`
    : `CORE - ${title} (${input.reference})`

  const adresseLine = input.adresse
    ? `<p>Adresse : <strong>${input.adresse}</strong></p>`
    : ""

  const html = emailLayout(`
      <p>Bonjour,</p>
      <p>${lead}</p>
      <p style="font-size:18px;font-weight:600;margin:16px 0">${input.creneauLabel}</p>
      ${adresseLine}
      <p>Vous pouvez suivre l'avancement depuis votre espace client CORE.</p>
    `)

  const text = `${title} ${input.reference} - ${input.creneauLabel}${input.adresse ? ` - ${input.adresse}` : ""}.`

  return { subject, html, text }
}