import Link from "next/link"
import { Truck } from "lucide-react"

import { AdminDeletePrestataireButton } from "@/components/admin/admin-delete-prestataire-button"
import { AdminPrestataireListMeta } from "@/components/admin/admin-prestataire-list-meta"
import { PrestataireValorisationBars } from "@/components/admin/prestataire-valorisation-bars"
import type { PrestataireTauxSummary } from "@/lib/admin/prestataire-taux-summary"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type AdminPrestataireListItem = {
  id: string
  nom: string
  raison_sociale: string | null
  is_active: boolean | null
  ville: string | null
  email: string | null
  telephone: string | null
}

type Props = {
  prestataires: AdminPrestataireListItem[]
  tauxById: Map<string, PrestataireTauxSummary>
  expiringDocsById: Map<string, number>
}

export function AdminPrestatairesList({ prestataires, tauxById, expiringDocsById }: Props) {
  if (!prestataires.length) {
    return <p className="text-center text-sm text-muted-foreground">Aucun prestataire.</p>
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {prestataires.map((p) => {
        const label = p.raison_sociale ?? p.nom
        const exp = expiringDocsById.get(p.id)

        return (
          <li key={p.id}>
            <article
              className={cn(
                "rounded-xl border border-[#35A238]/12 bg-gradient-to-r from-white to-[#F7FAF5]/50",
                "px-3 py-3 shadow-[0_1px_1px_rgba(15,23,42,0.04)]",
                p.is_active === false && "opacity-[0.92] saturate-[0.9]"
              )}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                <div className="flex min-w-0 gap-2.5 lg:w-[13.5rem] lg:shrink-0">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#35A238]/10 text-[#19752b]"
                    aria-hidden
                  >
                    <Truck className="size-4" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold leading-tight text-brand-navy">{label}</h3>
                    {exp ? (
                      <span className="mt-0.5 inline-flex rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-900 ring-1 ring-amber-200/80">
                        {exp} doc. à surveiller
                      </span>
                    ) : null}
                    <AdminPrestataireListMeta
                      ville={p.ville}
                      email={p.email}
                      telephone={p.telephone}
                      isActive={p.is_active}
                      compact
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1 lg:max-w-md xl:max-w-lg">
                  <PrestataireValorisationBars summary={tauxById.get(p.id)} compact />
                </div>

                <div className="flex shrink-0 items-center justify-center gap-2 lg:flex-col">
                  <Link
                    href={`/admin/prestataires/${p.id}`}
                    className={cn(buttonVariants({ size: "sm", variant: "outline" }), "h-8 px-3 text-xs")}
                  >
                    Voir
                  </Link>
                  <AdminDeletePrestataireButton prestataireId={p.id} label={label} />
                </div>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}