"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { getCommandeDevisResumeHref } from "@/app/espace/commandes/actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  commandeId: string
  initialHref?: string
  devisPdfHref?: string | null
  /** Affiche « Consulter le devis » (désactivé dans le footer de la carte de suivi). */
  showDevisPdf?: boolean
  layout?: "inline" | "footer"
}

export function CommandeRepriseCta({
  commandeId,
  initialHref,
  devisPdfHref = null,
  showDevisPdf = true,
  layout = "inline",
}: Props) {
  const [href, setHref] = useState(initialHref ?? null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (href?.trim()) return
    let cancelled = false
    setLoading(true)
    void getCommandeDevisResumeHref(commandeId).then((next) => {
      if (cancelled) return
      if (next) setHref(next)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [commandeId, href])

  const buttonClass = cn(
    "w-full bg-[#35A238] font-semibold shadow-sm hover:bg-[#2d8a30]",
    layout === "footer" ? "h-12 text-base" : "h-11 text-sm sm:w-auto sm:min-w-[220px] sm:px-8"
  )

  const outlineClass = cn(
    "w-full border-[#35A238]/45 font-semibold text-brand-navy hover:bg-[#ECF4E9]",
    layout === "footer" ? "h-12 text-base" : "h-11 text-sm sm:w-auto sm:min-w-[220px] sm:px-8"
  )

  const actions = (
    <div
      className={cn(
        "flex w-full flex-col gap-2",
        layout === "inline"
          ? "sm:flex-row sm:flex-wrap sm:items-center"
          : showDevisPdf && devisPdfHref
            ? "sm:flex-row"
            : undefined
      )}
    >
      {loading && !href ? (
        <Button disabled className={cn(buttonClass, "opacity-80")}>
          Chargement…
        </Button>
      ) : href ? (
        <Link
          href={href}
          className={cn(
            layout === "footer"
              ? showDevisPdf && devisPdfHref
                ? "block w-full sm:flex-1"
                : "block w-full"
              : "block w-full sm:w-auto sm:flex-initial"
          )}
        >
          <Button className={buttonClass}>Reprendre ma commande</Button>
        </Link>
      ) : (
        <p className="text-xs text-muted-foreground sm:flex-1">
          Reprise indisponible ici pour le moment : ouvrez le lien «&nbsp;Reprendre ma
          commande&nbsp;» dans votre e-mail de devis, ou contactez-nous.
        </p>
      )}

      {showDevisPdf && devisPdfHref ? (
        <a
          href={devisPdfHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            layout === "footer" ? "block w-full sm:flex-1" : "block w-full sm:w-auto sm:flex-initial"
          )}
        >
          <Button variant="outline" className={outlineClass}>
            Consulter le devis
            <ExternalLink className="ml-2 size-4 shrink-0 opacity-70" aria-hidden />
          </Button>
        </a>
      ) : null}
    </div>
  )

  return <div className={cn(layout === "inline" && "pt-1")}>{actions}</div>
}