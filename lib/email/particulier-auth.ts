import { sendEmail } from "@/lib/email/send"

export async function sendParticulierEmailConfirmation(input: {
  to: string
  actionLink: string
}) {
  const to = input.to.trim()
  const link = input.actionLink.trim()

  const subject = "Confirmez votre e-mail — CORE Environnement"
  const text = [
    "Bonjour,",
    "",
    "Merci pour votre commande de benne sur CORE Environnement.",
    "Pour activer votre espace client et suivre votre commande, confirmez votre adresse e-mail en ouvrant le lien ci-dessous :",
    "",
    link,
    "",
    "Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.",
    "",
    "L’équipe CORE Environnement",
  ].join("\n")

  const html = `
    <p>Bonjour,</p>
    <p>Merci pour votre commande de benne sur <strong>CORE Environnement</strong>.</p>
    <p>Pour activer votre espace client et suivre votre commande, confirmez votre adresse e-mail :</p>
    <p style="margin:24px 0">
      <a href="${link}" style="display:inline-block;padding:12px 20px;background:#35A238;color:#fff;text-decoration:none;border-radius:10px;font-weight:600">
        Confirmer mon e-mail
      </a>
    </p>
    <p style="font-size:13px;color:#555">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br/><a href="${link}">${link}</a></p>
    <p style="font-size:13px;color:#555;margin-top:24px">Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.</p>
    <p>L’équipe CORE Environnement</p>
  `.trim()

  return sendEmail({ to, subject, html, text })
}
