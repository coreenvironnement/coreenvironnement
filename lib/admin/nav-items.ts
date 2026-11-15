import type { AdminNavBadges } from "@/lib/admin/nav-badges"

export type AdminNavSection = "gestion" | "reseau" | "administration"

export type AdminNavId =
  | "overview"
  | "clients"
  | "chantiers"
  | "interventions"
  | "prestataires"
  | "comptesPro"

export type AdminNavItem = {
  id: AdminNavId
  href: string
  label: string
  badge?: number
  section: AdminNavSection
}

export type AdminNavGroup = {
  title: string
  items: AdminNavItem[]
}

export const ADMIN_WARM_BG = "#ECF4E9"
export const ADMIN_ACCENT = "#35A238"

export function buildAdminNavGroups(badges: AdminNavBadges): AdminNavGroup[] {
  const items: AdminNavItem[] = [
    { id: "overview", href: "/admin", label: "Tableau de bord", section: "gestion" },
    {
      id: "clients",
      href: "/admin/clients",
      label: "Clients",
      badge: badges.clientsNew > 0 ? badges.clientsNew : undefined,
      section: "gestion",
    },
    {
      id: "chantiers",
      href: "/admin/chantiers",
      label: "Chantiers",
      badge: badges.chantiersNew > 0 ? badges.chantiersNew : undefined,
      section: "gestion",
    },
    {
      id: "interventions",
      href: "/admin/interventions",
      label: "Interventions",
      badge: badges.interventionsNew > 0 ? badges.interventionsNew : undefined,
      section: "gestion",
    },
    {
      id: "prestataires",
      href: "/admin/prestataires",
      label: "Prestataires",
      badge: badges.prestatairesDocs > 0 ? badges.prestatairesDocs : undefined,
      section: "reseau",
    },
    {
      id: "comptesPro",
      href: "/admin/comptes-pro",
      label: "Comptes pro",
      badge: badges.comptesProPending > 0 ? badges.comptesProPending : undefined,
      section: "administration",
    },
  ]

  const sections: { key: AdminNavSection; title: string }[] = [
    { key: "gestion", title: "Gestion" },
    { key: "reseau", title: "Réseau" },
    { key: "administration", title: "Administration" },
  ]

  return sections.map(({ key, title }) => ({
    title,
    items: items.filter((i) => i.section === key),
  }))
}

export function flattenAdminNav(groups: AdminNavGroup[]): AdminNavItem[] {
  return groups.flatMap((g) => g.items)
}