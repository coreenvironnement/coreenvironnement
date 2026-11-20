import Link from "next/link"

import { AdminClientKindIcon } from "@/components/admin/admin-client-kind-icon"
import {
  AdminClientEmailCell,
  AdminClientPhoneCell,
} from "@/components/admin/admin-client-table-contact"
import { AdminClientTypeBadge } from "@/components/admin/admin-client-type-badge"
import { loadUnifiedClients, type UnifiedClientRow } from "@/lib/admin/clients-unified"
import { requireAdmin } from "@/lib/auth/require-admin"
import { formatDateFr } from "@/lib/format/date"
import { Input } from "@/components/ui/input"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Clients · Admin",
}

type ClientKindFilter = "all" | "particulier" | "professionnel"

type PageProps = {
  searchParams: Promise<{ q?: string; type?: string }>
}

function parseKindFilter(raw: string | undefined): ClientKindFilter {
  if (raw === "particulier") return "particulier"
  if (raw === "professionnel") return "professionnel"
  return "all"
}

const KIND_PILLS: { id: ClientKindFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "particulier", label: "Particuliers" },
  { id: "professionnel", label: "Professionnels" },
]

function clientsHref(kind: ClientKindFilter, q: string) {
  const params = new URLSearchParams()
  if (kind !== "all") params.set("type", kind)
  if (q) params.set("q", q)
  const qs = params.toString()
  return qs ? `/admin/clients?${qs}` : "/admin/clients"
}

function filterClients(
  clients: UnifiedClientRow[],
  kind: ClientKindFilter,
  q: string
): UnifiedClientRow[] {
  let rows = clients
  if (kind !== "all") {
    rows = rows.filter((c) => c.kind === kind)
  }
  const needle = q.trim().toLowerCase()
  if (!needle) return rows
  return rows.filter((c) => matchesClientSearch(c, needle))
}

function matchesClientSearch(client: UnifiedClientRow, needle: string): boolean {
  const haystack = [client.label, client.email, client.siret ?? "", client.phone ?? ""]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
  if (haystack.includes(needle)) return true

  const queryDigits = needle.replace(/\D/g, "")
  const phoneDigits = (client.phone ?? "").replace(/\D/g, "")
  return queryDigits.length >= 4 && phoneDigits.includes(queryDigits)
}

export default async function AdminClientsPage({ searchParams }: PageProps) {
  const { q: qParam, type: typeParam } = await searchParams
  const q = qParam?.trim() ?? ""
  const kind = parseKindFilter(typeParam)
  const { supabase } = await requireAdmin()
  const clients = await loadUnifiedClients(supabase)
  const filtered = filterClients(clients, kind, q)

  const subtitleParts: string[] = [
    "Particuliers et professionnels",
    filtered.length === clients.length
      ? `${clients.length} client${clients.length === 1 ? "" : "s"} au total`
      : `${filtered.length} client${filtered.length === 1 ? "" : "s"} affiché${filtered.length === 1 ? "" : "s"} sur ${clients.length}`,
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Clients</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {subtitleParts[0]}
            <span className="text-muted-foreground/80"> · </span>
            {subtitleParts[1]}
          </p>
        </div>
        <Link
          href="/api/admin/export/clients"
          className={cn(buttonVariants({ variant: "outline" }), "border-[#35A238]/25")}
        >
          Exporter Excel
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {KIND_PILLS.map((pill) => {
          const active = kind === pill.id
          return (
            <Link
              key={pill.id}
              href={clientsHref(pill.id, q)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                active
                  ? "border-[#35A238] bg-[#35A238] text-white"
                  : "border-[#35A238]/25 bg-white text-brand-navy hover:bg-[#ECF4E9]"
              )}
            >
              {pill.label}
            </Link>
          )
        })}
      </div>

      <form action="/admin/clients" method="get" className="flex flex-col gap-2 sm:flex-row">
        {kind !== "all" ? <input type="hidden" name="type" value={kind} /> : null}
        <Input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Nom, e-mail, téléphone ou SIRET"
          className="h-10 border-[#35A238]/20 sm:max-w-md"
          aria-label="Rechercher un client par nom, e-mail, téléphone ou SIRET"
        />
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "outline" }), "h-10 border-[#35A238]/25")}
        >
          Rechercher
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-[#35A238]/20 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#35A238]/10 bg-[#ECF4E9]/50 text-muted-foreground">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Téléphone</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">SIRET</th>
              <th className="px-4 py-3 font-medium">Activité</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((c) => (
                <tr key={`${c.kind}-${c.id}`} className="border-b border-[#35A238]/8">
                  <td className="px-4 py-3 font-medium text-brand-navy">
                    <div className="flex items-center gap-2.5">
                      <AdminClientKindIcon kind={c.kind} clientId={c.id} />
                      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="min-w-0 leading-snug">{c.label}</span>
                        <AdminClientTypeBadge kind={c.kind} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <AdminClientPhoneCell phone={c.phone} />
                  </td>
                  <td className="px-4 py-3">
                    <AdminClientEmailCell email={c.email} />
                  </td>
                  <td className="px-4 py-3 text-brand-navy/85">
                    {c.siret?.trim() ? (
                      c.siret
                    ) : c.kind === "particulier" ? (
                      <span className="text-muted-foreground">aucun</span>
                    ) : (
                      <span className="italic text-muted-foreground">À renseigner</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {c.lastActivity ? formatDateFr(c.lastActivity.slice(0, 10)) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/clients/${encodeURIComponent(c.id)}?kind=${c.kind}`}
                      className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Aucun client ne correspond à ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}