import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"

import { buildDevisPdfBytes } from "@/lib/documents/devis-pdf"
import { readCgvPdfBuffer } from "@/lib/documents/read-cgv-pdf"
import { buildDevisParticulierEmail } from "@/lib/email/templates/devis-particulier"
import { sendEmail } from "@/lib/email/send"
import {
  DELIVERY_DATE_INVALID_MESSAGE,
  isValidDeliveryDate,
  isValidPickupDate,
} from "@/lib/order/delivery-dates"
import { priceBreakdownFromHt } from "@/lib/order/prestation-mapping"
import { prestationById } from "@/lib/prestations"
import { isValidSignupEmail, normalizeSignupEmail } from "@/lib/auth/signup-validation"
import { CONTACT_PHONE_INVALID_MESSAGE } from "@/lib/phone/contact-phone-messages"
import { isValidContactPhone } from "@/lib/phone/phone-value"
import { createServiceClient, getSupabaseServiceConfigError } from "@/lib/supabase/service"
import type { AddressGeocodeHit } from "@/lib/geo/ban-api"
import type { ParticulierWasteOptionId } from "@/lib/order/particulier-waste-options"
import { buildParticulierTunnelResume } from "@/lib/order/particulier-tunnel-resume"
import { mintDevisResumeHrefFromResume } from "@/lib/order/mint-devis-resume-href"
import { buildParticulierTunnelDraftInput } from "@/lib/order/particulier-tunnel-draft"
import { prepareParticulierOrder } from "@/lib/order/prepare-particulier-order"
import { createClient } from "@/lib/supabase/server"

const COOLDOWN_MS = 10 * 60 * 1000

type DevisBody = {
  prestationId?: string
  address?: string
  selectedAddress?: AddressGeocodeHit | null
  particulierWasteId?: ParticulierWasteOptionId | null
  deliveryDate?: string
  pickupDate?: string
  contactFirstName?: string
  contactLastName?: string
  contactPhone?: string
  contactEmail?: string
  existingCommandeId?: string
}

export async function POST(request: Request) {
  let body: DevisBody
  try {
    body = (await request.json()) as DevisBody
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 })
  }

  const email = normalizeSignupEmail(body.contactEmail ?? "")
  if (!isValidSignupEmail(email)) {
    return NextResponse.json({ error: "Indiquez une adresse e-mail valide." }, { status: 400 })
  }

  const prestation = prestationById(String(body.prestationId ?? ""))
  if (!prestation) {
    return NextResponse.json({ error: "Benne introuvable." }, { status: 400 })
  }

  const address = String(body.address ?? "").trim()
  if (!address) {
    return NextResponse.json({ error: "Adresse manquante." }, { status: 400 })
  }

  const deliveryDate = String(body.deliveryDate ?? "").trim()
  if (!deliveryDate || !isValidDeliveryDate(deliveryDate)) {
    return NextResponse.json({ error: DELIVERY_DATE_INVALID_MESSAGE }, { status: 400 })
  }

  const pickupDate = String(body.pickupDate ?? "").trim()
  if (pickupDate && !isValidPickupDate(deliveryDate, pickupDate)) {
    return NextResponse.json(
      { error: "La date d'enlèvement n'est pas valide." },
      { status: 400 }
    )
  }

  const contactPhone = String(body.contactPhone ?? "").trim()
  if (!isValidContactPhone(contactPhone)) {
    return NextResponse.json({ error: CONTACT_PHONE_INVALID_MESSAGE }, { status: 400 })
  }

  const first = String(body.contactFirstName ?? "").trim()
  const last = String(body.contactLastName ?? "").trim()
  const contactName = [first, last].filter(Boolean).join(" ") || "Client"

  if (getSupabaseServiceConfigError()) {
    return NextResponse.json(
      { error: "Envoi devis temporairement indisponible." },
      { status: 503 }
    )
  }

  const supabase = createServiceClient()
  const since = new Date(Date.now() - COOLDOWN_MS).toISOString()
  const { data: recent } = await supabase
    .from("devis_email_log")
    .select("id")
    .eq("email", email)
    .gte("sent_at", since)
    .limit(1)

  if (recent?.length) {
    return NextResponse.json(
      { error: "Un devis a déjà été envoyé récemment à cette adresse. Réessayez dans quelques minutes." },
      { status: 429 }
    )
  }

  const authSupabase = await createClient()
  const {
    data: { user },
  } = await authSupabase.auth.getUser()

  let commandeId: string | undefined
  const draftInput = buildParticulierTunnelDraftInput(
    {
      selectedAddress: body.selectedAddress ?? null,
      prestationId: prestation.id,
      deliveryDate,
      pickupDate: pickupDate || undefined,
      contactFirstName: first,
      contactLastName: last,
      contactPhone,
      contactEmail: email,
      particulierWasteId: body.particulierWasteId ?? null,
    },
    body.existingCommandeId?.trim() || undefined
  )
  if (draftInput) {
    const prepared = await prepareParticulierOrder(draftInput, user?.id ?? null)
    if ("error" in prepared) {
      console.error("[api/order/devis] brouillon:", prepared.error)
    } else {
      commandeId = prepared.commandeId
      revalidatePath("/admin/interventions")
      if (commandeId) {
        revalidatePath(`/admin/interventions/${commandeId}`)
      }
    }
  }

  const reference = `DEV-${randomUUID().slice(0, 8).toUpperCase()}`
  const breakdown = priceBreakdownFromHt(prestation.priceHt)

  const devisPdf = buildDevisPdfBytes({
    reference,
    contactName,
    contactEmail: email,
    contactPhone,
    prestationLabel: prestation.label,
    address,
    deliveryDate,
    pickupDate: pickupDate || null,
    priceHt: prestation.priceHt,
    acceptedSummary: prestation.acceptedSummary,
    excludedSummary: prestation.excludedSummary,
    tonnageMax: prestation.tonnageMax,
  })

  const cgvPdf = await readCgvPdfBuffer()

  const resume = buildParticulierTunnelResume({
    prestationId: prestation.id,
    address,
    selectedAddress: body.selectedAddress ?? null,
    particulierWasteId: body.particulierWasteId ?? null,
    deliveryDate,
    pickupDate: pickupDate || undefined,
    contactFirstName: first,
    contactLastName: last,
    contactPhone,
    contactEmail: email,
  })
  const resumeUrl = mintDevisResumeHrefFromResume(resume)

  const mail = buildDevisParticulierEmail({
    contactNom: contactName,
    contactEmail: email,
    prestationLabel: prestation.label,
    adresse: address,
    deliveryDate,
    pickupDate: pickupDate || null,
    priceTtc: breakdown.ttc,
    reference,
    resumeUrl,
  })

  const sent = await sendEmail({
    to: email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    attachments: [
      { filename: `devis-${reference}.pdf`, content: devisPdf },
      { filename: "cgv-core-environnement.pdf", content: cgvPdf },
    ],
  })

  if (!sent.sent) {
    return NextResponse.json(
      { error: sent.error ?? "Impossible d'envoyer l'e-mail." },
      { status: 502 }
    )
  }

  const sentAt = new Date().toISOString()
  await supabase.from("devis_email_log").insert({ email })

  if (commandeId) {
    const { error: devisMarkError } = await supabase
      .from("commandes")
      .update({
        devis_sent_at: sentAt,
        ...(resume ? { tunnel_resume_snapshot: resume } : {}),
      })
      .eq("id", commandeId)
    if (devisMarkError) {
      console.error("[api/order/devis] devis_sent_at:", devisMarkError)
    } else {
      revalidatePath("/admin/interventions")
      revalidatePath(`/admin/interventions/${commandeId}`)
    }
  }

  return NextResponse.json({ ok: true, reference, commandeId })
}