import { sendEmail } from "@/lib/email/send"
import {
  buildCommandeConfirmationEmail,
  type CommandeConfirmationData,
} from "@/lib/email/templates/commande-confirmation"
import {
  buildCompteProReviewEmail,
  type CompteProReviewData,
} from "@/lib/email/templates/compte-pro-review"

export async function notifyCommandeConfirmed(data: CommandeConfirmationData) {
  const template = buildCommandeConfirmationEmail(data)
  return sendEmail({
    to: data.contactEmail,
    ...template,
  })
}

export async function notifyCompteProReviewed(data: CompteProReviewData) {
  const template = buildCompteProReviewEmail(data)
  return sendEmail({
    to: data.contactEmail,
    ...template,
  })
}
