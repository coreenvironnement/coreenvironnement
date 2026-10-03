import { emailLayout, escapeHtml } from "@/lib/email/templates/layout"

export type ProWaitlistData = {
  societe: string
  nom: string
  prenom: string
  email: string
  telephone: string
  siret: string | null
}

export function buildProWaitlistEmail(data: ProWaitlistData) {
  const siret = data.siret || "Non renseigné"
  const lines = [
    `<p>Nouvelle demande d'intérêt <strong>compte professionnel</strong> (pré-lancement).</p>`,
    "<ul>",
    `<li><strong>Société :</strong> ${escapeHtml(data.societe)}</li>`,
    `<li><strong>Nom :</strong> ${escapeHtml(data.nom)}</li>`,
    `<li><strong>Prénom :</strong> ${escapeHtml(data.prenom)}</li>`,
    `<li><strong>E-mail :</strong> ${escapeHtml(data.email)}</li>`,
    `<li><strong>Téléphone :</strong> ${escapeHtml(data.telephone)}</li>`,
    `<li><strong>SIRET :</strong> ${escapeHtml(siret)}</li>`,
    "</ul>",
    "<p>Aucun compte ni paiement n'a été créé.</p>",
  ]

  const text = [
    "Nouvelle demande d'intérêt compte professionnel (pré-lancement).",
    `Société : ${data.societe}`,
    `Nom : ${data.nom}`,
    `Prénom : ${data.prenom}`,
    `E-mail : ${data.email}`,
    `Téléphone : ${data.telephone}`,
    `SIRET : ${siret}`,
    "",
    "Aucun compte ni paiement n'a été créé.",
  ].join("\n")

  return {
    subject: `Demande compte pro — ${data.societe}`,
    html: emailLayout(lines.join("\n")),
    text,
  }
}
