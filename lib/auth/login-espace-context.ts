export type LoginEspaceKind = "particulier" | "professionnel"

export function resolveLoginEspace(
  espaceParam: string | null,
  nextParam: string | null
): LoginEspaceKind {
  if (espaceParam === "pro" || espaceParam === "professionnel") return "professionnel"
  if (espaceParam === "particulier") return "particulier"

  const next = nextParam?.trim() ?? ""
  if (
    next.startsWith("/espace/chantier") ||
    next.startsWith("/pro") ||
    next.startsWith("/espace/compte")
  ) {
    return "professionnel"
  }
  return "particulier"
}

export function loginHref(opts: {
  espace: LoginEspaceKind
  next?: string | null
}): string {
  const params = new URLSearchParams()
  params.set("espace", opts.espace === "professionnel" ? "pro" : "particulier")
  if (opts.next?.trim()) params.set("next", opts.next.trim())
  const q = params.toString()
  return q ? `/login?${q}` : "/login"
}
