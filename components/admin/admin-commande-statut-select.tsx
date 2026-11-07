"use client"

import { useTransition } from "react"
import { Loader2 } from "lucide-react"

import { updateCommandeStatut } from "@/app/admin/actions"
import { STATUTS_COMMANDE, statutCommandeLabel } from "@/lib/commande/labels"

type Props = {
  commandeId: string
  currentStatut: string
}

export function AdminCommandeStatutSelect({ commandeId, currentStatut }: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <form
      className="flex flex-wrap items-center gap-3"
      action={(formData) => {
        startTransition(() => updateCommandeStatut(commandeId, formData))
      }}
    >
      <label htmlFor="statut" className="text-sm font-medium text-brand-navy">
        Statut commande
      </label>
      <div className="relative">
        <select
          id="statut"
          name="statut"
          defaultValue={currentStatut}
          disabled={pending}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="h-10 min-w-[12rem] rounded-lg border border-[#35A238]/25 bg-white px-3 text-sm"
        >
          {STATUTS_COMMANDE.map((s) => (
            <option key={s.code} value={s.code}>
              {statutCommandeLabel(s.code)}
            </option>
          ))}
        </select>
        {pending ? (
          <Loader2
            className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 animate-spin text-[#35A238]"
            aria-hidden
          />
        ) : null}
      </div>
    </form>
  )
}
