"use client"

import Link from "next/link"

import {
  planifierCommandeLivraison,
  planifierIntervention,
  reporterCommandeLivraison,
  reporterIntervention,
} from "@/app/admin/actions"
import type { AdminUnifiedRow } from "@/lib/admin/interventions-data"
import { statutInterventionBadgeClass } from "@/lib/admin/intervention-display"
import { audienceCommandeLabel } from "@/lib/commande/labels"
import { formatCreneauFrShort } from "@/lib/planning/creneau"
import { formatDateFr } from "@/lib/format/date"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { AdminClientContactMenu } from "./admin-client-contact-menu"
import { AdminCreneauPlanDialog } from "./admin-creneau-plan-dialog"

type Props = {
  rows: AdminUnifiedRow[]
  returnTo: string
  mode: "a-planifier" | "planifiees"
}

function canPlanifier(row: AdminUnifiedRow) {
  if (row.kind === "commande") {
    return (
      (row.statutCode === "confirmee" || row.statutCode === "en_cours") &&
      !row.planifieeAt
    )
  }
  return row.statutCode === "en_cours_programmation"
}

function canReporter(row: AdminUnifiedRow) {
  return Boolean(row.planifieeAt) && row.statutCode !== "realisee" && row.statutCode !== "livree"
}

function CreneauCell({ row }: { row: AdminUnifiedRow }) {
  const planned = formatCreneauFrShort(row.planifieeAt)
  const souhaitee = row.souhaiteeAt ? formatDateFr(row.souhaiteeAt) : null

  if (planned) {
    return (
      <div>
        <p className="font-medium text-brand-navy">{planned}</p>
        {souhaitee ? (
          <p className="text-xs text-muted-foreground">Souhaitée : {souhaitee}</p>
        ) : null}
      </div>
    )
  }
  return (
    <p className="text-muted-foreground">
      {souhaitee ? `Souhaitée ${souhaitee}` : "—"}
    </p>
  )
}

function RowActions({ row, returnTo, mode }: { row: AdminUnifiedRow; returnTo: string; mode: Props["mode"] }) {
  const creneauLabel = formatCreneauFrShort(row.planifieeAt)
  const showPlan = mode === "a-planifier" && canPlanifier(row)
  const showReporter = mode === "planifiees" && canReporter(row)

  if (row.kind === "commande") {
    const planAction = planifierCommandeLivraison.bind(null, row.id)
    const reportAction = reporterCommandeLivraison.bind(null, row.id)
    return (
      <div className="flex flex-wrap items-center gap-2">
        {showPlan ? (
          <AdminCreneauPlanDialog
            title="Planifier la livraison"
            description="Ce créneau sera visible par le client et un e-mail lui sera envoyé."
            submitLabel="Planifier"
            defaultDate={row.souhaiteeAt}
            returnTo={returnTo}
            action={planAction}
          />
        ) : null}
        {showReporter ? (
          <AdminCreneauPlanDialog
            title="Reporter la livraison"
            description="Informez le client du nouveau créneau (e-mail automatique)."
            submitLabel="Reporter"
            defaultDate={row.planifieeAt?.slice(0, 10) ?? row.souhaiteeAt}
            variant="outline"
            returnTo={returnTo}
            action={reportAction}
          />
        ) : null}
        <AdminClientContactMenu
          telephone={row.contactPhone}
          reference={row.reference}
          creneauLabel={creneauLabel}
        />
      </div>
    )
  }

  if (!row.chantierId) return null
  const planAction = planifierIntervention.bind(null, row.id, row.chantierId)
  const reportAction = reporterIntervention.bind(null, row.id, row.chantierId)

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showPlan ? (
        <AdminCreneauPlanDialog
          title="Planifier l'intervention"
          submitLabel="Planifier"
          defaultDate={row.souhaiteeAt}
          returnTo={returnTo}
          action={planAction}
        />
      ) : null}
      {showReporter ? (
        <AdminCreneauPlanDialog
          title="Reporter l'intervention"
          submitLabel="Reporter"
          defaultDate={row.planifieeAt?.slice(0, 10) ?? row.souhaiteeAt}
          variant="outline"
          returnTo={returnTo}
          action={reportAction}
        />
      ) : null}
      <AdminClientContactMenu
        telephone={row.contactPhone}
        reference={row.reference}
        creneauLabel={creneauLabel}
      />
    </div>
  )
}

export function AdminInterventionsOpsList({ rows, returnTo, mode }: Props) {
  return (
    <>
      <ul className="space-y-3 lg:hidden">
        {rows.map((r) => (
          <li
            key={`${r.kind}-${r.id}`}
            className="rounded-xl border border-[#35A238]/20 bg-white p-4 shadow-sm"
          >
            <RowHeader row={r} />
            <CreneauCell row={r} />
            <div className="mt-3 space-y-2">
              <RowActions row={r} returnTo={returnTo} mode={mode} />
              <Link href={r.href} className={cn(buttonVariants({ size: "sm", variant: "outline" }), "w-full")}>
                Ouvrir la fiche
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border border-[#35A238]/20 bg-white shadow-sm lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#35A238]/10 bg-[#ECF4E9]/50 text-muted-foreground">
              <th className="px-3 py-3 font-medium">Réf.</th>
              <th className="px-3 py-3 font-medium">Client</th>
              <th className="px-3 py-3 font-medium">Créneau</th>
              <th className="px-3 py-3 font-medium">Statut</th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.kind}-${r.id}`} className="border-b border-[#35A238]/8 align-top">
                <td className="px-3 py-3 font-medium text-brand-navy">{r.reference}</td>
                <td className="px-3 py-3">
                  <p>{r.clientLabel}</p>
                  {r.audience ? (
                    <p className="text-xs text-muted-foreground">{audienceCommandeLabel(r.audience)}</p>
                  ) : null}
                </td>
                <td className="px-3 py-3">
                  <CreneauCell row={r} />
                </td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      r.kind === "intervention"
                        ? statutInterventionBadgeClass(r.statutCode)
                        : "bg-primary/15 text-brand-navy"
                    )}
                  >
                    {r.statutLabel}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <RowActions row={r} returnTo={returnTo} mode={mode} />
                  <Link
                    href={r.href}
                    className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "mt-2")}
                  >
                    Détail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function RowHeader({ row }: { row: AdminUnifiedRow }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-semibold text-brand-navy">{row.reference}</span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[11px] font-medium",
          row.kind === "intervention"
            ? statutInterventionBadgeClass(row.statutCode)
            : "bg-primary/15 text-brand-navy"
        )}
      >
        {row.statutLabel}
      </span>
    </div>
  )
}