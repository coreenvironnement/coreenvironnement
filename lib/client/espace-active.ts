import type { ClientNavId } from "@/lib/client/nav-items"

export function resolveEspaceNavId(pathname: string | null): ClientNavId {
  if (!pathname) return "commandes"
  if (pathname.startsWith("/espace/chantier")) return "chantier"
  if (pathname.startsWith("/espace/documents")) return "documents"
  if (pathname.startsWith("/espace/factures")) return "factures"
  if (pathname.startsWith("/espace/compte")) return "compte"
  return "commandes"
}
