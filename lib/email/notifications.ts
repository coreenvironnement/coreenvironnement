import { getOrderNotificationEmail } from "@/lib/email/config"
import { sendEmail } from "@/lib/email/send"
import {
  buildCommandeAdminNotifyEmail,
  type CommandeAdminNotifyData,
} from "@/lib/email/templates/commande-admin-notify"
import {
  buildCommandeAnnulationEmail,
  type CommandeAnnulationData,
} from "@/lib/email/templates/commande-annulation"
import {
  buildCommandeConfirmationEmail,
  type CommandeConfirmationData,
} from "@/lib/email/templates/commande-confirmation"
import {
  buildCommandeRemboursementEmail,
  type CommandeRemboursementData,
} from "@/lib/email/templates/commande-remboursement"
import {
  buildCompteProReviewEmail,
  type CompteProReviewData,
} from "@/lib/email/templates/compte-pro-review"
import {
  buildProWaitlistEmail,
  type ProWaitlistData,
} from "@/lib/email/templates/pro-waitlist"
import { buildDemandeProAdminEmail } from "@/lib/email/templates/demande-pro-admin"
import { buildDemandeProClientEmail } from "@/lib/email/templates/demande-pro-client"
import type { PreparedProfessionalBenneRequest } from "@/lib/order/pro-request"

export async function notifyCommandeConfirmed(data: CommandeConfirmationData) {
  const template = buildCommandeConfirmationEmail(data)
  return sendEmail({
    to: data.contactEmail,
    ...template,
  })
}

export async function notifyCommandeAdminNewOrder(data: CommandeAdminNotifyData) {
  const template = buildCommandeAdminNotifyEmail(data)
  return sendEmail({
    to: getOrderNotificationEmail(),
    ...template,
  })
}

export async function notifyCommandeCancelled(data: CommandeAnnulationData) {
  const template = buildCommandeAnnulationEmail(data)
  return sendEmail({
    to: data.contactEmail,
    ...template,
  })
}

export async function notifyCommandeRefunded(data: CommandeRemboursementData) {
  const template = buildCommandeRemboursementEmail(data)
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

export async function notifyProWaitlist(data: ProWaitlistData) {
  const template = buildProWaitlistEmail(data)
  return sendEmail({
    to: getOrderNotificationEmail(),
    ...template,
  })
}

export async function notifyDemandeProAdmin(data: PreparedProfessionalBenneRequest) {
  const template = buildDemandeProAdminEmail(data)
  return sendEmail({
    to: getOrderNotificationEmail(),
    ...template,
  })
}

export async function notifyDemandeProClient(data: PreparedProfessionalBenneRequest) {
  const template = buildDemandeProClientEmail(data)
  return sendEmail({
    to: data.contactEmail,
    ...template,
  })
}
