import type { ClientNavContext } from "@/lib/auth/client-nav-context"

export type ClientNavId =
  | "commandes"
  | "chantier"
  | "documents"
  | "factures"
  | "compte"

/** Props sérialisables serveur → client (pas de composants React). */
export type ClientNavItem = {
  id: ClientNavId
  href: string
  label: string
}

export function buildClientNavItems(ctx: ClientNavContext): ClientNavItem[] {
  if (!ctx.isLoggedIn) return []

  const items: ClientNavItem[] = [
    {
      id: "commandes",
      href: "/espace/commandes",
      label: "Commandes",
    },
  ]

  if (ctx.hasChantier) {
    items.push({
      id: "chantier",
      href: "/espace/chantier",
      label: "Suivi chantier",
    })
  }

  items.push({
    id: "factures",
    href: "/espace/factures",
    label: "Factures",
  })

  if (ctx.hasChantier) {
    items.push({
      id: "documents",
      href: "/espace/documents",
      label: "Documents",
    })
  }

  if (ctx.hasComptePro || ctx.hasChantier) {
    items.push({
      id: "compte",
      href: "/espace/compte",
      label: "Entreprise",
    })
  }

  return items
}

export const ESPACE_ACCENT = "#35A238"
export const ESPACE_WARM_BG = "#ECF4E9"
