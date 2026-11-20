import { emailLayout } from "@/lib/email/templates/layout"

export function interventionProgrammeeEmail(input: {
  numero: string
  chantierNom: string
  date?: string | null
  creneauLabel?: string | null
  report?: boolean
}) {
  const when = input.creneauLabel ?? input.date
  const dateLine = when ? ` pour le <strong>${when}</strong>` : ""
  const subject = input.report
    ? `CORE - Intervention ${input.numero} reportée`
    : `CORE - Intervention ${input.numero} planifiée`
  const lead = input.report
    ? `Votre intervention <strong>${input.numero}</strong> sur le chantier <strong>${input.chantierNom}</strong> est reportée${when ? "" : ""}.`
    : `Votre intervention <strong>${input.numero}</strong> sur le chantier <strong>${input.chantierNom}</strong> est planifiée.`

  const html = emailLayout(`
      <p>Bonjour,</p>
      <p>${lead}</p>
      ${when ? `<p style="font-size:18px;font-weight:600;margin:16px 0">${when}</p>` : ""}
      <p>L'équipe CORE Environnement reste à votre disposition pour tout complément.</p>
    `)
  const text = input.report
    ? `Intervention ${input.numero} sur ${input.chantierNom} reportée${when ? ` - ${when}` : ""}.`
    : `Intervention ${input.numero} sur ${input.chantierNom} planifiée${when ? ` - ${when}` : dateLine.replace(/<[^>]+>/g, "")}.`
  return { subject, html, text }
}