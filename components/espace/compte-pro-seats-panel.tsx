"use client"

import { useState, useTransition } from "react"
import { Loader2, UserPlus, Users } from "lucide-react"

import {
  activateCompteProSeat,
  inviteCompteProSeat,
  revokeCompteProSeat,
} from "@/app/espace/compte/seats-actions"
import { EspacePanel } from "@/components/espace/espace-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ABONNEMENT_PRO_HT } from "@/lib/cdc/referentiels"
import type { CompteProSeatRow } from "@/lib/compte-pro/seats"
import { cn } from "@/lib/utils"

type Props = {
  seats: CompteProSeatRow[]
  canManage: boolean
  ownerEmail: string | null
}

export function CompteProSeatsPanel({ seats, canManage, ownerEmail }: Props) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function invite() {
    setMessage(null)
    startTransition(async () => {
      const result = await inviteCompteProSeat(email)
      if ("ok" in result) {
        setEmail("")
        setMessage("Invitation enregistrée.")
      } else {
        setMessage(result.error)
      }
    })
  }

  function activate(id: string) {
    startTransition(async () => {
      const result = await activateCompteProSeat(id)
      setMessage("ok" in result ? "Utilisateur activé — facturation mise à jour." : result.error)
    })
  }

  function revoke(id: string) {
    startTransition(async () => {
      const result = await revokeCompteProSeat(id)
      setMessage("ok" in result ? "Accès révoqué." : result.error)
    })
  }

  return (
    <EspacePanel>
      <div className="flex gap-3">
        <Users className="mt-0.5 size-5 shrink-0 text-[#35A238]" aria-hidden />
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="font-medium text-brand-navy">Utilisateurs</p>
            <p className="text-sm text-muted-foreground">
              {ABONNEMENT_PRO_HT} € HT / mois par utilisateur (titulaire inclus). Activez un siège
              pour facturer l&apos;accès supplémentaire.
            </p>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-lg bg-[#ECF4E9]/80 px-3 py-2">
              <span>{ownerEmail ?? "Titulaire"}</span>
              <span className="text-xs font-medium text-[#35A238]">Principal</span>
            </li>
            {seats.map((seat) => (
              <li
                key={seat.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#35A238]/15 px-3 py-2"
              >
                <span>{seat.invited_email}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      seat.status === "active" ? "text-[#35A238]" : "text-muted-foreground"
                    )}
                  >
                    {seat.status === "active" ? "Actif" : "En attente"}
                  </span>
                  {canManage ? (
                    <>
                      {seat.status === "pending" ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={pending}
                          onClick={() => activate(seat.id)}
                        >
                          Activer
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={pending}
                        onClick={() => revoke(seat.id)}
                      >
                        Retirer
                      </Button>
                    </>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          {canManage ? (
            <div className="flex flex-wrap gap-2">
              <Input
                type="email"
                placeholder="collaborateur@entreprise.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-xs"
              />
              <Button
                type="button"
                disabled={pending || !email.trim()}
                onClick={invite}
                className="gap-1.5 bg-[#35A238] hover:bg-[#2d8a30]"
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <UserPlus className="size-4" aria-hidden />
                )}
                Inviter
              </Button>
            </div>
          ) : null}

          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </div>
      </div>
    </EspacePanel>
  )
}
