"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { Trash2 } from "lucide-react"

import {
  deleteCommandeBrouillon,
  deleteCommandesBrouillonBulk,
} from "@/app/admin/actions"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import { audienceCommandeLabel } from "@/lib/commande/labels"
import { formatOrderReference } from "@/lib/commande/reference"
import { formatDateFr } from "@/lib/format/date"
import { formatEuro } from "@/lib/format/currency"
import { cn } from "@/lib/utils"

import {
  type AdminCommandeListItem,
  CommandeBadges,
  ContactLinks,
  NouvelleBadge,
} from "./admin-commandes-list"

type Props = {
  commandes: AdminCommandeListItem[]
  returnTo: string
  detailBasePath?: string
}

export function AdminCommandesBrouillonPanel({
  commandes,
  returnTo,
  detailBasePath = "/admin/interventions",
}: Props) {
  const allIds = useMemo(() => commandes.map((c) => c.id), [commandes])
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [pending, startTransition] = useTransition()

  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id))
  const someSelected = selected.size > 0

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allIds))
  }

  function confirmBulkDelete() {
  const n = selected.size
  if (
    !window.confirm(
      `${n} brouillon${n > 1 ? "s" : ""} seront supprimé${n > 1 ? "s" : ""} définitivement. Continuer ?`
    )
  ) {
    return
  }
  const formData = new FormData()
  formData.set("returnTo", returnTo)
  for (const id of selected) {
    formData.append("ids", id)
  }
  startTransition(() => {
    void deleteCommandesBrouillonBulk(formData)
  })
}

  return (
    <div className="space-y-3">
      <BrouillonToolbar
        allSelected={allSelected}
        pending={pending}
        selectedCount={selected.size}
        onToggleAll={toggleAll}
        onBulkDelete={confirmBulkDelete}
        someSelected={someSelected}
      />

      <ul className="space-y-3 lg:hidden">
        {commandes.map((c) => {
          const dechet = c.dechets_types
          const reference = formatOrderReference(c.id)
          const deleteBound = deleteCommandeBrouillon.bind(null, c.id)
          return (
            <li
              key={c.id}
              className={cn(
                "rounded-xl border border-[#35A238]/20 bg-white p-4 shadow-sm",
                selected.has(c.id) && "ring-2 ring-destructive/25"
              )}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 size-4 shrink-0 accent-[#35A238]"
                  checked={selected.has(c.id)}
                  onChange={() => toggleOne(c.id)}
                  aria-label={`Sélectionner ${reference}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-sm font-semibold text-brand-navy">{reference}</p>
                      <p className="mt-0.5 text-sm font-medium text-brand-navy">
                        {c.contact_nom ?? audienceCommandeLabel(c.audience)}
                      </p>
                    </div>
                    <NouvelleBadge dateCreation={c.date_creation} />
                  </div>
                  <ContactLinks
                    className="mt-1"
                    email={c.contact_email}
                    telephone={c.contact_telephone}
                  />
                  <p className="mt-2 text-sm text-brand-navy">
                    {c.prestation_label ?? dechet?.nom ?? "—"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Link
                      href={`${detailBasePath}/${c.id}`}
                      className={cn(buttonVariants({ size: "sm" }))}
                    >
                      Ouvrir
                    </Link>
                    <form
                      action={deleteBound}
                      onSubmit={(e) => {
                        if (
                          !window.confirm(
                            `Supprimer définitivement le brouillon ${reference} ?`
                          )
                        ) {
                          e.preventDefault()
                        }
                      }}
                    >
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                        Supprimer
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border border-[#35A238]/20 bg-white shadow-sm lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  className="size-4 accent-[#35A238]"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Tout sélectionner"
                />
              </th>
              <th className="px-3 py-3 font-medium">Réf.</th>
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 font-medium">Client</th>
              <th className="px-3 py-3 font-medium">Prestation</th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((c) => {
              const dechet = c.dechets_types
              const reference = formatOrderReference(c.id)
              const deleteBound = deleteCommandeBrouillon.bind(null, c.id)
              return (
                <tr
                  key={c.id}
                  className={cn(
                    "border-b border-border/40",
                    selected.has(c.id) && "bg-destructive/5"
                  )}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      className="size-4 accent-[#35A238]"
                      checked={selected.has(c.id)}
                      onChange={() => toggleOne(c.id)}
                      aria-label={`Sélectionner ${reference}`}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-mono text-xs font-semibold text-brand-navy">{reference}</p>
                    <CommandeBadges
                      statut={c.statut}
                      paymentStatus={c.payment_status}
                      devisSentAt={c.devis_sent_at}
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDateFr(c.date_creation)}
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-brand-navy">
                      {c.contact_nom ?? audienceCommandeLabel(c.audience)}
                    </p>
                    <ContactLinks email={c.contact_email} telephone={c.contact_telephone} />
                    <p className="mt-0.5 max-w-[220px] truncate text-xs text-muted-foreground">
                      {c.adresse_complete}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <p>{c.prestation_label ?? dechet?.nom ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatEuro(c.price_ht == null ? null : Number(c.price_ht))}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`${detailBasePath}/${c.id}`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        Ouvrir
                      </Link>
                      <form
                        action={deleteBound}
                        onSubmit={(e) => {
                          if (
                            !window.confirm(
                              `Supprimer définitivement le brouillon ${reference} ?`
                            )
                          ) {
                            e.preventDefault()
                          }
                        }}
                      >
                        <input type="hidden" name="returnTo" value={returnTo} />
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="border-destructive/30 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BrouillonToolbar({
  allSelected,
  pending,
  selectedCount,
  onToggleAll,
  onBulkDelete,
  someSelected,
}: {
  allSelected: boolean
  pending: boolean
  selectedCount: number
  onToggleAll: () => void
  onBulkDelete: () => void
  someSelected: boolean
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#35A238]/20 bg-white px-4 py-3 shadow-sm">
      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-navy">
        <input
          type="checkbox"
          className="size-4 accent-[#35A238]"
          checked={allSelected}
          onChange={onToggleAll}
        />
        Tout sélectionner
      </label>
      <div className="flex flex-wrap items-center gap-2">
        {someSelected ? (
          <span className="text-sm text-muted-foreground">
            {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Sélectionnez des brouillons à supprimer</span>
        )}
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={!someSelected || pending}
          onClick={onBulkDelete}
        >
          <Trash2 className="size-3.5" aria-hidden />
          Supprimer la sélection
        </Button>
      </div>
    </div>
  )
}