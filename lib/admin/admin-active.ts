import type { AdminNavId } from "@/lib/admin/nav-items"

export function resolveAdminNavId(pathname: string | null, _searchParams?: string): AdminNavId {
  if (!pathname) return "overview"
  if (pathname.startsWith("/admin/clients")) return "clients"
  if (pathname.startsWith("/admin/comptes-pro")) return "comptesPro"
  if (pathname.startsWith("/admin/chantiers")) return "chantiers"
  if (pathname.startsWith("/admin/prestataires")) return "prestataires"
  if (pathname.startsWith("/admin/interventions")) return "interventions"
  if (pathname.startsWith("/admin/commandes")) return "interventions"
  if (pathname === "/admin") return "overview"
  return "overview"
}