import { emailLayout } from "@/lib/email/templates/layout"

export function interventionProgrammeeEmail(input: {
  numero: string
  chantierNom: string
  date?: string | null
}) {
  const dateLine = input.date ? ` pour le ${input.date}` : ""
  const subject = `CORE — Intervention ${input.numero} planifiée`
  const html = emailLayout(`
      <p>Bonjour,</p>
      <p>Votre intervention <strong>${input.numero}</strong> sur le chantier <strong>${input.chantierNom}</strong> est planifiée${dateLine}.</p>
      <p>L'équipe CORE Environnement reste à votre disposition pour tout complément.</p>
    `)
  const text = `Intervention ${input.numero} sur ${input.chantierNom} planifiée${dateLine}.`
  return { subject, html, text }
}