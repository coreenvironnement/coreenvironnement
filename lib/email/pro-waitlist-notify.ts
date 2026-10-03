import { getOrderNotificationEmail } from "@/lib/email/config"
import { sendEmail } from "@/lib/email/send"
import {
  buildProWaitlistEmail,
  type ProWaitlistData,
} from "@/lib/email/templates/pro-waitlist"

export async function notifyProWaitlist(data: ProWaitlistData) {
  const template = buildProWaitlistEmail(data)
  return sendEmail({
    to: getOrderNotificationEmail(),
    ...template,
  })
}
