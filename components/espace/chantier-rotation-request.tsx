"use client"

import { useActionState, useId } from "react"

import {
  requestChantierRotation,
  type RotationRequestResult,
} from "@/app/espace/chantier/rotation-actions"
import type { ChantierRotationContext } from "@/lib/chantier/rotation-context"
import { calendarDateParis } from "@/lib/order/delivery-dates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function formatSouhaiteLe(iso: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function ChantierRotationRequest({
  chantierId,
  context,
}: {
  chantierId: string
  context: ChantierRotationContext
}) {
  const dateId = useId()
  const timeId = useId()
  const commentId = useId()
  const [state, formAction, pending] = useActionState<
    RotationRequestResult | null,
    FormData
  >(requestChantierRotation, null)

  const todayParis = calendarDateParis()

  return (
    <section className="rounded-2xl border border-[#35A238]/20 bg-white p-4 sm:p-5">
      <h3 className="text-base font-semibold text-brand-navy">Demander une rotation</h3>
      {context.contenantLabel ? (
        <p className="mt-1 text-sm text-muted-foreground">
          Benne : {context.contenantLabel}
          {context.dechetNom ? ` · ${context.dechetNom}` : null}
        </p>
      ) : null}

      {context.pendingDemande ? (
        <p className="mt-3 rounded-xl border border-[#35A238]/15 bg-[#ECF4E9] px-3 py-2 text-sm text-brand-navy">
          Demande en attente pour le{" "}
          <strong>{formatSouhaiteLe(context.pendingDemande.souhaiteLe)}</strong>.
          Notre équipe la traite dès que possible.
        </p>
      ) : null}

      {!context.canRequest && !context.pendingDemande && context.blockedReason ? (
        <p className="mt-3 text-sm text-muted-foreground">{context.blockedReason}</p>
      ) : null}

      {context.canRequest ? (
        <form action={formAction} className="mt-4 space-y-3">
          <input type="hidden" name="chantier_id" value={chantierId} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor={dateId} className="text-sm font-medium text-brand-navy">
                Date souhaitée
              </label>
              <Input
                id={dateId}
                name="date"
                type="date"
                required
                min={todayParis}
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor={timeId} className="text-sm font-medium text-brand-navy">
                Heure souhaitée
              </label>
              <Input id={timeId} name="time" type="time" required className="h-11" />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor={commentId} className="text-sm font-medium text-brand-navy">
              Commentaire (optionnel)
            </label>
            <textarea
              id={commentId}
              name="commentaire"
              rows={2}
              className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:border-[#35A238] focus-visible:ring-2 focus-visible:ring-[#35A238]/20"
              placeholder="Accès, contraintes horaires…"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Délai minimum : 6 h avant l&apos;horaire (Europe/Paris).
          </p>
          {state && !state.ok ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}
          {state?.ok ? (
            <p className="text-sm font-medium text-[#35A238]">
              Demande envoyée. Vous serez informé dès sa prise en charge.
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={pending}
            className="h-11 min-h-12 bg-[#35A238] hover:bg-[#2d8a30]"
          >
            {pending ? "Envoi…" : "Envoyer la demande"}
          </Button>
        </form>
      ) : null}
    </section>
  )
}
