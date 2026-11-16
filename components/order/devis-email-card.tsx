"use client"

import { useEffect, useState } from "react"
import { Loader2, Mail } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { Button } from "@/components/ui/button"
import type { AddressGeocodeHit } from "@/lib/geo/ban-api"
import { isValidSignupEmail, normalizeSignupEmail } from "@/lib/auth/signup-validation"
import type { ParticulierWasteOptionId } from "@/lib/order/particulier-waste-options"
import { cn } from "@/lib/utils"

type Props = {
  email: string
  canSend: boolean
  existingCommandeId?: string
  onDraftCommandeId?: (id: string) => void
  payload: {
    prestationId: string
    address: string
    selectedAddress: AddressGeocodeHit | null
    particulierWasteId: ParticulierWasteOptionId | null
    deliveryDate: string
    pickupDate?: string
    contactFirstName: string
    contactLastName: string
    contactPhone: string
  }
  embedded?: boolean
}

export function DevisEmailCard({
  email,
  canSend,
  existingCommandeId,
  onDraftCommandeId,
  payload,
  embedded,
}: Props) {
  const reduce = useReducedMotion()
  const normalized = normalizeSignupEmail(email)
  const visible = isValidSignupEmail(normalized)

  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  /** Dernière adresse à laquelle l’envoi a réussi (succès lié à cette adresse uniquement). */
  const [sentToEmail, setSentToEmail] = useState<string | null>(null)

  const sentToCurrent = sentToEmail === normalized

  useEffect(() => {
    if (sentToEmail !== null && normalized !== sentToEmail) {
      setError(null)
    }
  }, [normalized, sentToEmail])

  if (!visible) return null

  async function handleSend() {
    if (!canSend || pending) return
    setError(null)
    setPending(true)
    try {
      const res = await fetch("/api/order/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          contactEmail: normalized,
          existingCommandeId,
        }),
      })
      const json = (await res.json()) as {
        ok?: boolean
        error?: string
        commandeId?: string
      }
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Envoi impossible. Réessayez.")
        return
      }
      if (json.commandeId) {
        onDraftCommandeId?.(json.commandeId)
      }
      setSentToEmail(normalized)
    } catch {
      setError("Connexion impossible. Réessayez.")
    } finally {
      setPending(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={reduce ? false : { opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={reduce ? undefined : { opacity: 0, height: 0 }}
        className="overflow-hidden"
      >
        <div
          className={cn(
            "rounded-xl border border-[#35A238]/25 bg-[#ECF4E9]/90 px-3 py-3",
            embedded && "shadow-sm"
          )}
        >
          <div className="flex gap-3">
            <Mail className="mt-0.5 size-5 shrink-0 text-[#35A238]" aria-hidden />
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-sm font-semibold text-brand-navy">
                Recevoir le devis par e-mail
              </p>
              <p className="text-xs leading-snug text-brand-navy/80">
                PDF devis + CGV en pièces jointes, envoyés immédiatement à{" "}
                <span className="font-medium">{normalized}</span>.
              </p>
              {sentToCurrent ? (
                <p className="text-xs font-medium text-[#35A238]" role="status">
                  Devis envoyé à {sentToEmail}. Vérifiez votre boîte mail.
                </p>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!canSend || pending}
                  onClick={handleSend}
                  className="h-9 w-full border-[#35A238]/35 bg-white text-brand-navy hover:bg-[#ECF4E9] sm:w-auto"
                >
                  {pending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  ) : (
                    <Mail className="mr-2 size-4" aria-hidden />
                  )}
                  Envoyer le devis maintenant
                </Button>
              )}
              {sentToEmail && !sentToCurrent ? (
                <p className="text-[11px] text-brand-navy/70">
                  Adresse modifiée : vous pouvez renvoyer le devis à cette adresse.
                </p>
              ) : null}
              {!canSend ? (
                <p className="text-[11px] text-amber-900/90">
                  Complétez le prénom, le nom et le téléphone pour envoyer le devis.
                </p>
              ) : null}
              {error ? (
                <p className="text-xs font-medium text-amber-900" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}