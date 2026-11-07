export type AdminNavId =
  | "overview"
  | "commandesB2C"
  | "commandesB2B"
  | "clientsB2C"
  | "comptesPro"
  | "chantiers"

export type AdminNavItem = {
  id: AdminNavId
  href: string
  label: string
  badge?: number
}

export const ADMIN_WARM_BG = "#ECF4E9"
export const ADMIN_ACCENT = "#35A238"

export function buildAdminNavItems(commandesATraiter: number): AdminNavItem[] {
  const items: AdminNavItem[] = [
    { id: "overview", href: "/admin", label: "Tableau de bord" },
    {
      id: "commandesB2C",
      href: "/admin/commandes?audience=particulier",
      label: "Cmd. particuliers",
    },
    {
      id: "commandesB2B",
      href: "/admin/commandes?audience=professionnel",
      label: "Cmd. pro",
    },
    { id: "clientsB2C", href: "/admin/clients/particuliers", label: "Clients particuliers" },
    { id: "comptesPro", href: "/admin/comptes-pro", label: "Comptes pro" },
    { id: "chantiers", href: "/admin/chantiers", label: "Chantiers" },
  ]
  return items.map((item) =>
    item.id === "commandesB2C" && commandesATraiter > 0
      ? { ...item, badge: commandesATraiter }
      : item
  )
}
