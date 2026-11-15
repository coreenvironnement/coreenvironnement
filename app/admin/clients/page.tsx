import Link from "next/link"

import { loadUnifiedClients } from "@/lib/admin/clients-unified"
import { requireAdmin } from "@/lib/auth/require-admin"
import { formatDateFr } from "@/lib/format/date"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Clients · Admin",
}

export default async function AdminClientsPage() {
  const { supabase } = await requireAdmin()
  const clients = await loadUnifiedClients(supabase)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Clients</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Particuliers et professionnels — {clients.length} fiche{clients.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/api/admin/export/clients"
          className={cn(buttonVariants({ variant: "outline" }), "border-[#35A238]/25")}
        >
          Exporter Excel
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#35A238]/20 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#35A238]/10 bg-[#ECF4E9]/50 text-muted-foreground">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">SIRET</th>
              <th className="px-4 py-3 font-medium">Activité</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={`${c.kind}-${c.id}`} className="border-b border-[#35A238]/8">
                <td className="px-4 py-3 font-medium text-brand-navy">{c.label}</td>
                <td className="px-4 py-3 capitalize">{c.kind === "professionnel" ? "Pro" : "Particulier"}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.siret ?? "—"}</td>
                <td className="px-4 py-3">
                  {c.lastActivity ? formatDateFr(c.lastActivity.slice(0, 10)) : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/clients/${encodeURIComponent(c.id)}?kind=${c.kind}`}
                    className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                  >
                    Fiche
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}