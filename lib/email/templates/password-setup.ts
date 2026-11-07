import {
  emailButton,
  emailFallbackLink,
  emailLayout,
  escapeHtml,
} from "@/lib/email/templates/layout"
import { SITE_PHONE_DISPLAY } from "@/lib/site"

export type PasswordSetupEmailData = {
  contactEmail: string
  contactNom: string | null
  setupUrl: string
}

export function buildPasswordSetupEmail(data: PasswordSetupEmailData) {
  const greeting = data.contactNom?.trim()
    ? `Bonjour ${data.contactNom.trim()},`
    : "Bonjour,"

  const htmlBody = [
    `<p style="margin:0 0 16px;font-size:16px">${escapeHtml(greeting)}</p>`,
    `<p style="margin:0 0 14px">Votre espace client <strong>CORE Environnement</strong> est prêt. Pour suivre votre commande en ligne, choisissez un <strong>mot de passe personnel</strong> (une seule fois).</p>`,
    emailButton(data.setupUrl, "Choisir mon mot de passe"),
    emailFallbackLink(data.setupUrl),
    `<p style="margin:18px 0 0;font-size:14px;color:#667085">Ce lien est personnel et limité dans le temps. Après avoir défini votre mot de passe, connectez-vous sur la page <strong>Connexion</strong> avec votre e-mail.</p>`,
    `<p style="margin:16px 0 0;font-size:14px;color:#667085">Une question ? <strong style="color:#172033">${escapeHtml(SITE_PHONE_DISPLAY)}</strong></p>`,
    `<p style="margin:24px 0 0">À bientôt,<br/><strong>CORE Environnement</strong></p>`,
  ].join("\n")

  const text = [
    greeting,
    "",
    "Votre espace client CORE Environnement est prêt. Choisissez un mot de passe pour suivre votre commande :",
    data.setupUrl,
    "",
    "Ensuite, connectez-vous avec votre e-mail sur la page Connexion.",
    "",
    `Téléphone : ${SITE_PHONE_DISPLAY}`,
    "",
    "CORE Environnement",
  ].join("\n")

  return {
    subject: "Choisissez votre mot de passe — CORE Environnement",
    html: emailLayout(htmlBody, {
      preheader: "Accédez à votre espace client en quelques secondes.",
    }),
    text,
  }
}
