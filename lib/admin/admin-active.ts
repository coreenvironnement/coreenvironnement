import type { AdminNavId } from "@/lib/admin/nav-items"

export function resolveAdminNavId(pathname: string | null, searchParams?: string): AdminNavId {
  if (!pathname) return "overview"
  if (pathname.startsWith("/admin/clients")) return "clientsB2C"
  if (pathname.startsWith("/admin/comptes-pro")) return "comptesPro"
  if (pathname.startsWith("/admin/chantiers")) return "chantiers"
  if (pathname.startsWith("/admin/commandes")) {
    if (searchParams?.includes("audience=professionnel")) return "commandesB2B"
    if (searchParams?.includes("audience=particulier")) return "commandesB2C"
    return "overview"
  }
  if (pathname === "/admin") return "overview"
  return "overview"
}
