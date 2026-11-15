import { formatDateFr } from "@/lib/format/date"

type AuditRow = {
  id: string
  action: string
  detail: Record<string, unknown> | null
  created_at: string
  profiles: { full_name: string | null; email: string | null } | null
}

export function AdminAuditLogPanel({ entries }: { entries: AuditRow[] }) {
  if (!entries.length) return null

  return (
    <section className="rounded-xl border border-[#35A238]/20 bg-white p-4">
      <h3 className="text-sm font-semibold text-brand-navy">Historique des modifications</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {entries.map((e) => (
          <li key={e.id} className="border-b border-border/40 pb-2 last:border-0">
            <p className="font-medium">{e.action}</p>
            <p className="text-xs text-muted-foreground">
              {formatDateFr(e.created_at.slice(0, 10))} ·{" "}
              {e.profiles?.full_name ?? e.profiles?.email ?? "Admin"}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}