import { Resend } from "resend"

import { getEmailFrom, isEmailConfigured } from "@/lib/email/config"

let resendClient: Resend | null = null

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) {
    throw new Error("RESEND_API_KEY manquante.")
  }
  if (!resendClient) {
    resendClient = new Resend(key)
  }
  return resendClient
}

export type SendEmailInput = {
  to: string
  subject: string
  html: string
  text: string
}

export async function sendEmail(input: SendEmailInput): Promise<{ sent: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn("[email] RESEND_API_KEY absente — e-mail non envoyé:", input.subject)
    return { sent: false, error: "Email non configuré." }
  }

  const to = input.to.trim()
  if (!to.includes("@")) {
    return { sent: false, error: "Destinataire invalide." }
  }

  try {
    const { error } = await getResend().emails.send({
      from: getEmailFrom(),
      to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    })

    if (error) {
      console.error("[email] Erreur Resend:", error)
      return { sent: false, error: error.message }
    }

    return { sent: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    console.error("[email] Exception:", message)
    return { sent: false, error: message }
  }
}
