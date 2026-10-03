"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe, type StripeExpressCheckoutElementReadyEvent } from "@stripe/stripe-js"

import { getCommandePaymentStatus } from "@/app/order/commande-status"
import { initOrderEmbeddedPayment } from "@/app/order/embedded-payment"
import type { OrderCheckoutInput } from "@/lib/order/checkout-input"
import { Button } from "@/components/ui/button"
import {
  OrderConfirmingState,
  OrderSuccessScreen,
} from "@/components/order/order-success-screen"
import { cn } from "@/lib/utils"

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
const stripePromise = publishableKey.startsWith("pk_")
  ? loadStripe(publishableKey)
  : null

function fmtTtcFromCents(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

type EmbeddedCheckoutProps = {
  input: OrderCheckoutInput
  existingCommandeId?: string
  onCommandeId: (id: string) => void
  onBack: () => void
  onClose?: () => void
  deliveryDate: string
}

export function EmbeddedCheckout(props: EmbeddedCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [commandeId, setCommandeId] = useState(props.existingCommandeId ?? "")
  const [amountTtcCents, setAmountTtcCents] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [serverConfirmed, setServerConfirmed] = useState(false)
  const [orderNumero, setOrderNumero] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  const startInit = useCallback(() => {
    setLoading(true)
    setError(null)
    setClientSecret(null)
  }, [])

  useEffect(() => {
    let cancelled = false
    startInit()

    initOrderEmbeddedPayment({
      ...props.input,
      existingCommandeId: props.existingCommandeId,
    })
      .then((result) => {
        if (cancelled) return
        if ("error" in result) {
          setError(result.error)
          setLoading(false)
          return
        }
        props.onCommandeId(result.commandeId)
        setCommandeId(result.commandeId)
        setAmountTtcCents(result.amountTtcCents)
        if (result.alreadyPaid) {
          setSuccess(true)
          setServerConfirmed(true)
          setLoading(false)
          return
        }
        if (!result.clientSecret) {
          setError("Impossible d'initialiser le paiement. Réessayez.")
          setLoading(false)
          return
        }
        setClientSecret(result.clientSecret)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError("Impossible d'initialiser le paiement. Réessayez.")
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.existingCommandeId, retryKey, startInit])

  useEffect(() => {
    if (!success || serverConfirmed || !commandeId) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const startedAt = Date.now()
    const pollMs = 1500
    const maxMs = 50_000

    const poll = async () => {
      const result = await getCommandePaymentStatus(commandeId)
      if (cancelled) return
      if (!("error" in result) && result.paid) {
        setOrderNumero(result.numero)
        setServerConfirmed(true)
        return
      }
      if (Date.now() - startedAt >= maxMs) return
      timer = setTimeout(() => {
        void poll()
      }, pollMs)
    }

    void poll()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [success, serverConfirmed, commandeId])

  const options = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            appearance: {
              theme: "stripe" as const,
              variables: {
                colorPrimary: "#35A238",
                colorText: "#122a5c",
                borderRadius: "12px",
              },
            },
          }
        : undefined,
    [clientSecret]
  )

  const showSuccessUi = success

  return (
    <div className="space-y-3.5">
      {showSuccessUi ? null : (
        <p className="text-left text-[14px] font-semibold leading-snug text-brand-navy">
          Paiement
        </p>
      )}

      {!stripePromise && !showSuccessUi ? (
        <PaymentErrorState
          message="Paiement intégré indisponible : clé publique Stripe manquante."
          onBack={props.onBack}
        />
      ) : showSuccessUi ? (
        serverConfirmed ? (
          <OrderSuccessScreen
            input={props.input}
            commandeId={commandeId}
            amountTtcCents={amountTtcCents}
            referenceNumero={orderNumero}
            onClose={props.onClose ?? props.onBack}
          />
        ) : (
          <OrderConfirmingState onClose={props.onClose ?? props.onBack} />
        )
      ) : loading ? (
        <PaymentLoadingState />
      ) : error && !clientSecret ? (
        <PaymentErrorState
          message={error}
          onBack={props.onBack}
          onRetry={() => setRetryKey((n) => n + 1)}
        />
      ) : clientSecret && options ? (
        <Elements key={clientSecret} stripe={stripePromise} options={options}>
          <CheckoutFields
            amountTtcCents={amountTtcCents}
            billingEmail={props.input.contactEmail}
            billingName={props.input.contactName}
            billingPhone={props.input.contactPhone}
            onBack={props.onBack}
            onSuccess={() => setSuccess(true)}
          />
        </Elements>
      ) : (
        <PaymentErrorState
          message="Impossible d'afficher le paiement. Réessayez."
          onBack={props.onBack}
          onRetry={() => setRetryKey((n) => n + 1)}
        />
      )}
    </div>
  )
}

function PaymentLoadingState() {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border border-brand-border/70 bg-white px-4 py-6 text-center">
      <span
        className="size-8 animate-spin rounded-full border-2 border-brand-navy/15 border-t-[#35A238]"
        aria-hidden
      />
      <p className="text-sm font-medium text-brand-navy">
        Préparation sécurisée du paiement...
      </p>
      <p className="text-[11px] text-muted-foreground">Cela ne prend que quelques secondes.</p>
    </div>
  )
}

function PaymentErrorState({
  message,
  onBack,
  onRetry,
}: {
  message: string
  onBack: () => void
  onRetry?: () => void
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-amber-200/80 bg-white px-4 py-5 text-center">
      <p className="text-sm font-medium text-amber-900">{message}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" type="button" className="h-10 rounded-xl sm:flex-1" onClick={onBack}>
          Retour
        </Button>
        {onRetry ? (
          <Button type="button" className="h-10 rounded-xl sm:flex-1" onClick={onRetry}>
            Réessayer
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function CheckoutFields({
  amountTtcCents,
  billingEmail,
  billingName,
  billingPhone,
  onBack,
  onSuccess,
}: {
  amountTtcCents: number
  billingEmail?: string
  billingName?: string
  billingPhone?: string
  onBack: () => void
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showWallets, setShowWallets] = useState(false)
  const amountLabel = fmtTtcFromCents(amountTtcCents)

  const handleReady = (event: StripeExpressCheckoutElementReadyEvent) => {
    const methods = event.availablePaymentMethods
    setShowWallets(Boolean(methods?.applePay || methods?.googlePay))
  }

  const confirm = async () => {
    if (!stripe || !elements || busy) return
    setBusy(true)
    setError(null)

    let timedOut = false
    const timeoutId = window.setTimeout(() => {
      timedOut = true
      setError(
        "La confirmation du paiement prend plus de temps que prévu. Vérifiez votre paiement avant de réessayer."
      )
      setBusy(false)
    }, 22_000)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        if (!timedOut) {
          setError(submitError.message ?? "Vérifiez les informations de carte.")
        }
        return
      }

      const origin = window.location.origin
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${origin}/?order=success`,
          payment_method_data: {
            billing_details: {
              email: billingEmail || undefined,
              name: billingName || undefined,
              phone: billingPhone || undefined,
            },
          },
        },
        redirect: "if_required",
      })

      if (confirmError) {
        if (!timedOut) {
          setError(confirmError.message ?? "Le paiement a été refusé. Réessayez.")
        }
        return
      }

      if (paymentIntent?.status === "succeeded") {
        onSuccess()
        return
      }

      if (!timedOut) {
        setError(
          "Paiement en cours de validation. Si le montant n’est pas débité, réessayez."
        )
      }
    } catch {
      if (!timedOut) {
        setError("Le paiement n’a pas pu être confirmé. Réessayez.")
      }
    } finally {
      window.clearTimeout(timeoutId)
      if (!timedOut) setBusy(false)
    }
  }

  return (
    <div className="space-y-3.5">
      <p className="text-sm text-brand-navy">
        Total à payer :{" "}
        <strong className="font-semibold tabular-nums text-primary">
          {amountLabel} TTC
        </strong>
      </p>

      <div className={cn(showWallets ? "space-y-3" : "h-0 overflow-hidden")}>
        <ExpressCheckoutElement
          options={{
            paymentMethods: {
              applePay: "auto",
              googlePay: "auto",
              link: "never",
              paypal: "never",
              amazonPay: "never",
              klarna: "never",
            },
          }}
          onReady={handleReady}
          onConfirm={() => void confirm()}
        />
        {showWallets ? (
          <p className="text-center text-[11px] text-muted-foreground">ou payer par carte</p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-brand-border/80 bg-white p-3 sm:p-3.5">
        <PaymentElement
          options={{
            layout: "tabs",
            wallets: {
              applePay: "never",
              googlePay: "never",
              link: "never",
            },
            fields: {
              billingDetails: {
                name: "never",
                email: "never",
                phone: "never",
              },
            },
          }}
        />
      </div>

      {error ? (
        <p className="text-center text-xs font-medium text-amber-800">{error}</p>
      ) : null}

      <div className="flex flex-col gap-2 pt-0.5 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          type="button"
          className="h-11 rounded-xl sm:min-w-[7.5rem]"
          disabled={busy}
          onClick={onBack}
        >
          Retour
        </Button>
        <Button
          type="button"
          className="h-11 flex-1 rounded-xl text-base font-semibold shadow-lg"
          disabled={!stripe || !elements || busy}
          onClick={() => void confirm()}
        >
          {busy ? "Paiement en cours…" : `Payer ${amountLabel}`}
        </Button>
      </div>
    </div>
  )
}
