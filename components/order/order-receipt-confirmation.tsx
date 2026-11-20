"use client"

import type { LucideIcon } from "lucide-react"
import { Contact, LayoutList, Mail, Phone, Radio } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useReducedMotion } from "framer-motion"

import { OrderEmailConfirmBlock } from "@/components/order/order-email-confirm-block"
import { Button } from "@/components/ui/button"
import {
  buildOrderReceiptContent,
  type OrderReceiptContent,
} from "@/lib/order/order-receipt-content"
import type { OrderReceiptSoundMode } from "@/lib/order/use-order-receipt-sounds"
import { useOrderReceiptSounds } from "@/lib/order/use-order-receipt-sounds"
import {
  downloadSiteContactVCard,
  SITE_CONTACT_VCARD_PHONE_DISPLAY,
  SITE_ORG_NAME,
} from "@/lib/site"
import { cn } from "@/lib/utils"

import type { OrderCheckoutInput } from "@/lib/order/checkout-input"
import {
  ReceiptPrinter,
  type ReceiptPrinterStage,
  ReceiptTicketBody,
  ReceiptTicketHeader,
} from "./receipt-printer"

const ICON_STROKE = 1.75

const PRINTING_MS = 1400
const PROCESSING_MS_PAID = 700
const PROCESSING_MS_DEMANDE = 500

export type OrderSuccessScreenProps = {
  input: OrderCheckoutInput
  commandeId: string
  amountTtcCents: number
  referenceNumero?: string | null
  contactEmail?: string | null
  emailConfirmed?: boolean
  needsPasswordSetup?: boolean
  passwordSetupEmailSent?: boolean
  onClose: () => void
}

export type OrderReceiptConfirmationProps = OrderSuccessScreenProps & {
  embedded?: boolean
  initialStage?: ReceiptPrinterStage
  autoPlay?: boolean
  soundsEnabled?: boolean
  mode?: OrderReceiptSoundMode
}

export function OrderReceiptConfirmation({
  input,
  commandeId,
  amountTtcCents,
  referenceNumero,
  contactEmail,
  emailConfirmed = true,
  needsPasswordSetup = false,
  passwordSetupEmailSent = false,
  onClose,
  embedded = true,
  initialStage = "processing",
  autoPlay = true,
  soundsEnabled = true,
  mode = "particulier_paid",
}: OrderReceiptConfirmationProps) {
  const reduceMotion = useReducedMotion()
  const isDemande = mode === "professionnel_demande"
  const [stage, setStage] = useState<ReceiptPrinterStage>(
    reduceMotion ? "complete" : initialStage
  )

  const { playForStage, preload } = useOrderReceiptSounds(soundsEnabled && autoPlay)

  const receipt: OrderReceiptContent = useMemo(
    () =>
      buildOrderReceiptContent({
        input,
        commandeId,
        referenceNumero,
        amountTtcCents,
        mode,
      }),
    [input, commandeId, referenceNumero, amountTtcCents, mode]
  )

  useEffect(() => {
    if (soundsEnabled && autoPlay) {
      preload()
    }
  }, [soundsEnabled, autoPlay, preload, commandeId])

  useEffect(() => {
    playForStage(stage, mode)
  }, [stage, mode, playForStage])

  useEffect(() => {
    if (!autoPlay || reduceMotion) {
      setStage("complete")
      return
    }
    if (initialStage !== "processing") {
      setStage(initialStage)
      return
    }
    setStage("processing")
    if (isDemande) {
      const t = window.setTimeout(() => setStage("complete"), PROCESSING_MS_DEMANDE)
      return () => window.clearTimeout(t)
    }
    const t1 = window.setTimeout(() => setStage("printing"), PROCESSING_MS_PAID)
    const t2 = window.setTimeout(
      () => setStage("complete"),
      PROCESSING_MS_PAID + PRINTING_MS
    )
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [autoPlay, reduceMotion, commandeId, initialStage, isDemande])

  const title =
    stage === "complete"
      ? isDemande
        ? "Demande enregistrée"
        : "Commande confirmée"
      : stage === "printing"
        ? "Préparation du récapitulatif"
        : "Finalisation en cours"

  const showFooter = stage === "complete"

  return (
    <div
      className={cn(
        "order-tunnel-card flex flex-col items-center overflow-x-clip px-3 py-4 sm:px-4",
        embedded && "border-0 bg-transparent shadow-none"
      )}
    >
      <h3 className="sr-only">{title}</h3>
      <p className="mb-3 text-center text-[15px] font-semibold text-brand-navy" aria-hidden>
        {title}
      </p>

      <ReceiptPrinter.Root stage={stage} embedded={embedded} className="w-full">
        <ReceiptPrinter.Machine>
          <ReceiptPrinter.Screen>
            <ReceiptPrinter.Status />
          </ReceiptPrinter.Screen>
          <ReceiptPrinter.Output>
            <ReceiptPrinter.Paper>
              <ReceiptTicketHeader />
              <ReceiptTicketBody
                title={receipt.title}
                reference={receipt.reference}
                lines={receipt.lines}
                footerLines={receipt.footerLines}
              />
            </ReceiptPrinter.Paper>
          </ReceiptPrinter.Output>
        </ReceiptPrinter.Machine>
      </ReceiptPrinter.Root>

      {showFooter ? (
        <div className="mt-4 w-full space-y-3 text-left">
          {contactEmail && (needsPasswordSetup || !emailConfirmed) ? (
            <OrderEmailConfirmBlock
              email={contactEmail}
              needsPasswordSetup={needsPasswordSetup}
              passwordSetupEmailSent={passwordSetupEmailSent}
            />
          ) : null}

          <div className="rounded-xl border border-brand-border/80 bg-brand-bg-alt/80 px-3 py-3">
            <p className="text-center text-[12px] font-semibold uppercase tracking-wide text-brand-navy">
              Prochaines étapes
            </p>
            <ul className="mt-2.5 space-y-2.5">
              {isDemande ? (
                <>
                  <NextStepRow icon={Phone}>
                    Un expert CORE vous rappelle sous 24 h pour confirmer votre demande.
                  </NextStepRow>
                  <NextStepRow icon={Mail}>
                    Un e-mail récapitulatif vous a été envoyé si votre adresse est valide.
                  </NextStepRow>
                </>
              ) : (
                <>
                  <NextStepRow icon={Mail}>
                    E-mail récapitulatif envoyé à votre adresse.
                  </NextStepRow>
                  <NextStepRow icon={LayoutList}>
                    Suivi dans votre espace client ; facture après livraison.
                  </NextStepRow>
                  <NextStepRow icon={Phone}>
                    {input.audience !== "professionnel"
                      ? "Un conseiller CORE vous contacte pour le créneau de livraison et la pose."
                      : "Un conseiller CORE vous contacte pour confirmer le créneau de pose."}
                  </NextStepRow>
                </>
              )}
            </ul>
            {!isDemande ? (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link
                  href="/espace/commandes"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#35A238]/35 bg-white px-3 text-sm font-medium text-brand-navy hover:bg-[#ECF4E9]"
                >
                  <Radio
                    className="size-4 shrink-0 text-brand-green"
                    strokeWidth={ICON_STROKE}
                    aria-hidden
                  />
                  Suivre ma commande
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5 rounded-lg border border-[#35A238]/35 bg-white px-3 text-sm font-medium text-brand-navy hover:bg-[#ECF4E9]"
                  aria-label={`Ajouter ${SITE_ORG_NAME} à vos contacts, téléphone ${SITE_CONTACT_VCARD_PHONE_DISPLAY}`}
                  onClick={downloadSiteContactVCard}
                >
                  <Contact
                    className="size-4 shrink-0 text-brand-green"
                    strokeWidth={ICON_STROKE}
                    aria-hidden
                  />
                  Nous ajouter à vos contacts
                </Button>
              </div>
            ) : null}
          </div>

          <div className="sticky bottom-0 -mx-1 bg-gradient-to-t from-brand-warm-field via-brand-warm-field to-brand-warm-field/80 pt-2">
            <Button
              type="button"
              className="h-11 w-full min-h-11 rounded-xl text-base font-semibold shadow-lg"
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function NextStepRow({
  icon: Icon,
  children,
}: {
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-2.5">
      <Icon
        className="mt-0.5 size-4 shrink-0 text-brand-green"
        strokeWidth={ICON_STROKE}
        aria-hidden
      />
      <p className="min-w-0 text-[13px] leading-snug text-brand-navy/85">{children}</p>
    </li>
  )
}