import Link from "next/link"

import { loadParticulierClients } from "@/lib/admin/particulier-clients"
import { requireAdmin } from "@/lib/auth/require-admin"
import { formatDateFr } from "@/lib/format/date"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Clients particuliers · Admin",
}

export default async function AdminClientsParticuliersPage() {
  const { supabase } = await requireAdmin()
  const clients = await loadParticulierClients(supabase)

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-navy">Clients particuliers</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {clients.length} compte{clients.length === 1 ? "" : "s"} avec au moins une commande B2C
        </p>
      </div>

      {clients.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#35A238]/25 bg-white p-10 text-center text-sm text-muted-foreground">
          Aucun client particulier pour le moment.
        </p>
      ) : (
        <>
          <ul className="space-y-3 lg:hidden">
            {clients.map((c) => (
              <li
                key={c.key}
                className="rounded-xl border border-[#35A238]/20 bg-white p-4 shadow-sm"
              >
                <p className="font-medium text-brand-navy">{c.nom ?? "—"}</p>
                <p className="text-sm text-muted-foreground">{c.email}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {c.commandeCount} commande{c.commandeCount === 1 ? "" : "s"} · Dernière{" "}
                  {formatDateFr(c.lastCommandeAt.slice(0, 10))}
                </p>
                <Link
                  href={`/admin/commandes?audience=particulier&q=${encodeURIComponent(c.email !== "—" ? c.email : "")}`}
                  className={cn(buttonVariants({ size: "sm", variant: "outline" }), "mt-3")}
                >
                  Voir commandes
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-xl border border-[#35A238]/20 bg-white shadow-sm lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#35A238]/10 bg-[#ECF4E9]/50 text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Nom</th>
                  <th className="px-4 py-3 font-medium">E-mail</th>
                  <th className="px-4 py-3 font-medium">Commandes</th>
                  <th className="px-4 py-3 font-medium">Dernière</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.key} className="border-b border-[#35A238]/8">
                    <td className="px-4 py-3 font-medium">{c.nom ?? "—"}</td>
                    <td className="px-4 py-3">{c.email}</td>
                    <td className="px-4 py-3">{c.commandeCount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDateFr(c.lastCommandeAt.slice(0, 10))}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/commandes?audience=particulier&q=${encodeURIComponent(c.email !== "—" ? c.email : "")}`}
                        className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                      >
                        Commandes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
