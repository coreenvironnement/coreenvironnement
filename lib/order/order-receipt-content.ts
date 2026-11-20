import { formatOrderReference } from "@/lib/commande/reference"
import type { OrderCheckoutInput } from "@/lib/order/checkout-input"
import { prestationById } from "@/lib/prestations"
import { SITE_ORG_NAME, SITE_PHONE_DISPLAY } from "@/lib/site"

export type OrderReceiptContent = {
  title: string
  reference: string
  lines: { label: string; value: string; emphasize?: boolean }[]
  footerLines: string[]
}

function formatFrDate(isoDate: string) {
  if (!isoDate) return ""
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function fmtTtcFromCents(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

export function buildOrderReceiptContent(args: {
  input: OrderCheckoutInput
  commandeId: string
  referenceNumero?: string | null
  amountTtcCents: number
  mode?: "particulier_paid" | "professionnel_paid" | "professionnel_demande"
}): OrderReceiptContent {
  const { input, commandeId, referenceNumero, amountTtcCents, mode = "particulier_paid" } =
    args
  const reference = formatOrderReference(commandeId, referenceNumero)
  const prestation = prestationById(input.prestationId)
  const address = input.addressLabel || input.address

  const lines: OrderReceiptContent["lines"] = [
    { label: "Benne", value: prestation?.label ?? "—" },
    { label: "Livraison", value: formatFrDate(input.deliveryDate) },
  ]
  if (input.pickupDate) {
    lines.push({ label: "Enlèvement", value: formatFrDate(input.pickupDate) })
  }
  lines.push({ label: "Adresse", value: address })
  if (input.companyName?.trim()) {
    lines.push({ label: "Entreprise", value: input.companyName.trim() })
  } else if (input.contactName?.trim()) {
    lines.push({ label: "Contact", value: input.contactName.trim() })
  }

  if (mode === "professionnel_demande") {
    return {
      title: "DEMANDE ENREGISTRÉE",
      reference,
      lines,
      footerLines: [
        "Un expert CORE vous rappelle sous 24 h.",
        `Besoin d'aide : ${SITE_PHONE_DISPLAY}`,
        SITE_ORG_NAME,
      ],
    }
  }

  lines.push({
    label: "Total TTC",
    value: fmtTtcFromCents(amountTtcCents),
    emphasize: true,
  })

  return {
    title: "COMMANDE CONFIRMÉE",
    reference,
    lines,
    footerLines: [
      "E-mail récapitulatif envoyé.",
      "Suivi dans votre espace client.",
      `Merci de votre confiance — ${SITE_ORG_NAME}`,
    ],
  }
}