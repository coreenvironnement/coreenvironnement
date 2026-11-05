"use client"

import { useState } from "react"
import Link from "next/link"

import { resendParticulierEmailConfirmation } from "@/app/order/particulier-auth-actions"
import { Button } from "@/components/ui/button"

type Props = {
  commandeId: string
  email: string
}

export function OrderEmailConfirmBlock({ commandeId, email }: Props) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleResend() {
    setLoading(true)
    setError(null)
    const result = await resendParticulierEmailConfirmation(commandeId)
    setLoading(false)
    if (result.sent) {
      setSent(true)
      return
    }
    setError(
      result.error === "Email non configuré."
        ? "L’envoi d’e-mail n’est pas configuré sur cet environnement. Utilisez le lien reçu ou contactez-nous."
        : (result.error ?? "Impossible d’envoyer le lien. Réessayez dans quelques instants.")
    )
  }

  return (
    <div className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-3 text-left">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-amber-950">
        Confirmez votre e-mail
      </p>
      <p className="mt-2 text-[13px] leading-snug text-amber-950/90">
        Nous avons créé un accès client avec{" "}
        <span className="font-medium">{email}</span>. Ouvrez le lien reçu par e-mail
        pour activer votre espace et retrouver cette commande.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-lg border-amber-300/80 bg-white text-amber-950 hover:bg-amber-50"
          disabled={loading || sent}
          onClick={() => void handleResend()}
        >
          {loading ? "Envoi…" : sent ? "Lien renvoyé" : "Renvoyer le lien"}
        </Button>
        <Link
          href="/mes-commandes"
          className="text-center text-[13px] font-medium text-primary underline-offset-2 hover:underline sm:text-left"
        >
          Espace client
        </Link>
      </div>
      {error ? (
        <p className="mt-2 text-[12px] text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
