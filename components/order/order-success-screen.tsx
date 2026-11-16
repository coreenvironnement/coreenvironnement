"use client"

import type { LucideIcon } from "lucide-react"
import {
  Calendar,
  Contact,
  LayoutList,
  Mail,
  MapPin,
  Phone,
  Radio,
} from "lucide-react"
import type { ReactNode } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

import { OrderEmailConfirmBlock } from "@/components/order/order-email-confirm-block"
import { Button } from "@/components/ui/button"
import { LoaderCore } from "@/components/ui/loader-core"
import { formatOrderReference } from "@/lib/commande/reference"
import type { OrderCheckoutInput } from "@/lib/order/checkout-input"
import { prestationById } from "@/lib/prestations"
import {
  downloadSiteContactVCard,
  SITE_CONTACT_VCARD_PHONE_DISPLAY,
  SITE_ORG_NAME,
} from "@/lib/site"
import { cn } from "@/lib/utils"

const ICON_STROKE = 1.75

function fmtTtcFromCents(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

function formatFrDate(isoDate: string) {
  if (!isoDate) return ""
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function benneRecapLabel(prestationId: string) {
  const prestation = prestationById(prestationId)
  return prestation?.label ?? "Benne"
}

export function OrderConfirmingState({
  onClose,
  phase = "confirming",
}: {
  onClose?: () => void
  phase?: "confirming" | "finalizing"
}) {
  const reduce = useReducedMotion()
  const duration = reduce ? 0.35 : 0.55
  const ease = [0.22, 1, 0.36, 1] as const
  const isFinalizing = phase === "finalizing"

  return (
    <motion.div
      className="order-tunnel-card overflow-x-clip px-3.5 py-4 text-center sm:px-5 sm:py-5"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease }}
      role="status"
      aria-live="polite"
      aria-busy={!isFinalizing}
    >
      {isFinalizing ? (
        <div className="relative mx-auto mb-2.5 flex size-[52px] items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-brand-green/10" aria-hidden />
          <svg
            viewBox="0 0 56 56"
            className="relative size-10 text-brand-green"
            aria-hidden
          >
            <circle
              cx="28"
              cy="28"
              r="25"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="opacity-25"
            />
            <path
              d="M17 28.5 L24.5 36 L39.5 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <div className="mb-2">
          <LoaderCore standaloneStatus={false} />
        </div>
      )}

      <h3 className="text-[18px] font-semibold leading-tight text-brand-navy sm:text-[20px]">
        Paiement validé
      </h3>
      <p className="mx-auto mt-2 max-w-[40ch] text-[13px] leading-relaxed text-brand-navy/80 sm:text-sm">
        {isFinalizing ? (
          "Votre paiement a bien été validé. La confirmation de votre commande est en cours de finalisation. Vous recevrez un e-mail dès qu’elle sera confirmée."
        ) : (
          "Nous finalisons la confirmation de votre commande."
        )}
      </p>

      {onClose && isFinalizing ? (
        <div className="sticky bottom-0 mt-4 -mx-1 bg-gradient-to-t from-brand-warm-field via-brand-warm-field to-brand-warm-field/80 pt-2">
          <Button
            type="button"
            className="h-11 w-full min-h-11 rounded-xl text-base font-semibold shadow-lg"
            onClick={onClose}
          >
            Fermer
          </Button>
        </div>
      ) : null}
    </motion.div>
  )
}

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

export function OrderSuccessScreen({
  input,
  commandeId,
  amountTtcCents,
  referenceNumero,
  contactEmail,
  emailConfirmed = true,
  needsPasswordSetup = false,
  passwordSetupEmailSent = false,
  onClose,
}: OrderSuccessScreenProps) {
  const reduce = useReducedMotion()
  const deliveryLabel = formatFrDate(input.deliveryDate)
  const pickupLabel = input.pickupDate ? formatFrDate(input.pickupDate) : ""
  const address = input.addressLabel || input.address
  const reference = formatOrderReference(commandeId, referenceNumero)

  const duration = reduce ? 0.35 : 0.55
  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <motion.div
      className="order-tunnel-card overflow-x-clip px-3.5 py-4 text-center sm:px-5 sm:py-5"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease }}
    >
      <motion.div
        className="relative mx-auto mb-2 flex size-[56px] items-center justify-center"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduce ? 0.3 : 0.45, ease, delay: reduce ? 0 : 0.08 }}
      >
        {!reduce ? (
          <motion.span
            className="absolute inset-[-8px] rounded-full bg-brand-green/15"
            initial={{ opacity: 0.35, scale: 0.72 }}
            animate={{ opacity: 0, scale: 1.35 }}
            transition={{ duration: 0.7, ease }}
            aria-hidden
          />
        ) : null}
        <span className="absolute inset-0 rounded-full bg-brand-green/10" aria-hidden />
        <svg
          viewBox="0 0 56 56"
          className="relative size-12 text-brand-green"
          aria-hidden
        >
          <circle
            cx="28"
            cy="28"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="opacity-25"
          />
          <motion.path
            d="M17 28.5 L24.5 36 L39.5 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? { opacity: 1 } : { pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: reduce ? 0 : 0.45, ease, delay: reduce ? 0 : 0.22 }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="space-y-2.5"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: reduce ? 0 : 0.05,
              delayChildren: reduce ? 0 : 0.18,
            },
          },
        }}
      >
        <SuccessBlock>
          <h3 className="text-[18px] font-semibold leading-tight text-brand-navy sm:text-[20px]">
            Commande confirmée
          </h3>
          <p className="mt-1.5 text-[13px] font-medium text-brand-green sm:text-sm">
            Paiement reçu — commande enregistrée.
          </p>
          <ul className="mt-3 space-y-2 rounded-xl border border-brand-border/80 bg-brand-bg-alt/60 px-3 py-2.5 text-left">
            <KeyFactRow icon={Calendar} label="Livraison souhaitée" value={deliveryLabel} />
            {pickupLabel ? (
              <KeyFactRow icon={Calendar} label="Enlèvement" value={pickupLabel} />
            ) : null}
            <KeyFactRow icon={MapPin} label="Adresse" value={address} />
          </ul>
        </SuccessBlock>

        {contactEmail && (needsPasswordSetup || !emailConfirmed) ? (
          <SuccessBlock>
            <OrderEmailConfirmBlock
              email={contactEmail}
              needsPasswordSetup={needsPasswordSetup}
              passwordSetupEmailSent={passwordSetupEmailSent}
            />
          </SuccessBlock>
        ) : null}

        <SuccessBlock>
          <div className="rounded-xl border border-brand-border/80 bg-brand-bg-alt/80 px-3 py-3 text-left">
            <p className="text-center text-[12px] font-semibold uppercase tracking-wide text-brand-navy">
              Prochaines étapes
            </p>
            <ul className="mt-2.5 space-y-2.5">
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
            </ul>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link
                href="/espace/commandes"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#35A238]/35 bg-white px-3 text-sm font-medium text-brand-navy hover:bg-[#ECF4E9]"
              >
                <Radio className="size-4 shrink-0 text-brand-green" strokeWidth={ICON_STROKE} aria-hidden />
                Suivre ma commande
              </Link>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 rounded-lg border-[#35A238]/35 bg-white px-3 text-sm font-medium text-brand-navy hover:bg-[#ECF4E9]"
                aria-label={`Ajouter ${SITE_ORG_NAME} à vos contacts, téléphone ${SITE_CONTACT_VCARD_PHONE_DISPLAY}`}
                onClick={downloadSiteContactVCard}
              >
                <Contact className="size-4 shrink-0 text-brand-green" strokeWidth={ICON_STROKE} aria-hidden />
                Nous ajouter à vos contacts
              </Button>
            </div>
          </div>
        </SuccessBlock>

        <SuccessBlock>
          <p className="text-[12px] text-muted-foreground">
            Référence de commande
          </p>
          <p className="mt-0.5 font-mono text-sm font-semibold tracking-wide text-brand-navy">
            {reference}
          </p>
        </SuccessBlock>

        <SuccessBlock>
          <p className="mb-1.5 text-left text-[12px] font-semibold uppercase tracking-wide text-brand-navy">
            Récapitulatif
          </p>
          <dl className="space-y-1.5 rounded-xl border border-brand-border/70 px-3 py-3 text-left text-[13px]">
            <RecapRow label="Benne" value={benneRecapLabel(input.prestationId)} />
            <RecapRow label="Livraison" value={deliveryLabel} />
            {pickupLabel ? <RecapRow label="Enlèvement" value={pickupLabel} /> : null}
            <RecapRow label="Adresse" value={address} />
            <RecapRow
              label="Total TTC"
              value={fmtTtcFromCents(amountTtcCents)}
              emphasize
            />
          </dl>
        </SuccessBlock>

        <SuccessBlock>
          <div className="sticky bottom-0 -mx-1 bg-gradient-to-t from-brand-warm-field via-brand-warm-field to-brand-warm-field/80 pt-2">
            <Button
              type="button"
              className="h-11 w-full min-h-11 rounded-xl text-base font-semibold shadow-lg"
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        </SuccessBlock>
      </motion.div>
    </motion.div>
  )
}

function KeyFactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <li className="flex gap-2.5">
      <span
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green"
        aria-hidden
      >
        <Icon className="size-4" strokeWidth={ICON_STROKE} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-[13px] font-medium leading-snug text-brand-navy">{value}</p>
      </div>
    </li>
  )
}

function NextStepRow({
  icon: Icon,
  children,
}: {
  icon: LucideIcon
  children: ReactNode
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

function SuccessBlock({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}

function RecapRow({
  label,
  value,
  emphasize,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "min-w-0 text-right text-brand-navy",
          emphasize && "font-semibold tabular-nums text-primary"
        )}
      >
        {value}
      </dd>
    </div>
  )
}
