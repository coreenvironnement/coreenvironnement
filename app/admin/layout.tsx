import Link from "next/link"

import { AdminNav } from "@/components/admin/admin-nav"
import { requireAdmin } from "@/lib/auth/require-admin"

export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, supabase } = await requireAdmin()
  const { count: commandesATraiter } = await supabase
    .from("commandes")
    .select("*", { count: "exact", head: true })
    .eq("statut", "confirmee")
    .eq("payment_status", "paid")

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Connecté en tant qu&apos;administrateur</p>
        <h1 className="text-2xl font-bold text-brand-navy">{profile.full_name ?? profile.email}</h1>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <AdminNav commandesATraiter={commandesATraiter ?? 0} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
