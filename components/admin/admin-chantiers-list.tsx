import Link from "next/link"
import { HardHat, Mail, MapPin, Phone } from "lucide-react"

import { chantierCardStyle } from "@/lib/admin/chantier-card-colors"
import { commandeMailtoHref, commandeTelHref } from "@/lib/commande/labels"
import { formatDateFr } from "@/lib/format/date"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type AdminChantierListItem = {
  id: string
  nom: string
  adresse: string | null
  code_affaire: string | null
  is_active: boolean | null
  created_at: string | null
  premierCompteTelephone: string | null
  premierCompteEmail: string | null
}

export function AdminChantiersList({ chantiers }: { chantiers: AdminChantierListItem[] }) {
  if (!chantiers.length) {
    return <p className="text-sm text-muted-foreground">Aucun chantier pour le moment.</p>
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {chantiers.map((c) => {
        const detailHref = `/admin/chantiers/${c.id}`
        const createdLabel = c.created_at ? formatDateFr(c.created_at.slice(0, 10)) : null
        const cardStyle = chantierCardStyle(c.id)

        return (
          <li key={c.id}>
            <article
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-4",
                "sm:flex-row sm:items-center sm:justify-between",
                cardStyle.article,
                !c.is_active && "opacity-90 saturate-[0.85]"
              )}
            >
              <div className="flex min-w-0 flex-1 gap-3">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    cardStyle.icon
                  )}
                  aria-hidden
                >
                  <HardHat className="size-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <Link
                      href={detailHref}
                      className="text-base font-semibold leading-snug text-brand-navy hover:text-primary"
                    >
                      {c.nom}
                    </Link>
                    {createdLabel ? (
                      <span className="text-[11px] text-muted-foreground">
                        depuis le {createdLabel}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-brand-navy/75">
                    {c.adresse ? (
                      <span className="inline-flex max-w-full items-start gap-1.5">
                        <MapPin
                          className="mt-0.5 size-3.5 shrink-0 text-[#35A238]"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                        <span className="line-clamp-2">{c.adresse}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Adresse non renseignée</span>
                    )}
                    {c.code_affaire ? (
                      <span
                        className="shrink-0 rounded-md border border-[#35A238]/20 bg-white/90 px-2 py-0.5 font-mono text-[11px] font-medium text-brand-navy"
                        title="Code affaire"
                      >
                        {c.code_affaire}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-navy/75">
                    <p className="flex min-w-0 items-center gap-1.5">
                      <Phone
                        className="size-3.5 shrink-0 text-brand-navy/50"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      {c.premierCompteTelephone ? (
                        <a
                          href={commandeTelHref(c.premierCompteTelephone)}
                          className="hover:text-primary hover:underline"
                        >
                          {c.premierCompteTelephone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground italic">Téléphone non renseigné</span>
                      )}
                    </p>
                    <p className="flex min-w-0 items-center gap-1.5">
                      <Mail
                        className="size-3.5 shrink-0 text-brand-navy/50"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      {c.premierCompteEmail ? (
                        <a
                          href={commandeMailtoHref(c.premierCompteEmail)}
                          className="min-w-0 truncate hover:text-primary hover:underline"
                        >
                          {c.premierCompteEmail}
                        </a>
                      ) : (
                        <span className="text-muted-foreground italic">E-mail non renseigné</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-end gap-2 sm:flex-col sm:items-end sm:gap-2 md:flex-row md:items-center">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    c.is_active
                      ? "bg-[#35A238]/15 text-[#19752b]"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {c.is_active ? "Actif" : "Inactif"}
                </span>
                <Link
                  href={detailHref}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "border-[#35A238]/30 bg-white hover:bg-[#ECF4E9]"
                  )}
                >
                  Gérer
                </Link>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}