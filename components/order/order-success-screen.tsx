"use client"

import { motion, useReducedMotion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { LoaderCore } from "@/components/ui/loader-core"
import {
  OrderReceiptConfirmation,
  type OrderSuccessScreenProps,
} from "./order-receipt-confirmation"

export type { OrderSuccessScreenProps }

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

export function OrderSuccessScreen(props: OrderSuccessScreenProps) {
  const mode =
    props.input.audience === "professionnel" ? "professionnel_paid" : "particulier_paid"

  return (
    <OrderReceiptConfirmation
      {...props}
      mode={mode}
      embedded
      autoPlay
      soundsEnabled
    />
  )
}