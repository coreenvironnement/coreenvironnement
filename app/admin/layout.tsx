import { Suspense } from "react"

import { AdminAppShell } from "@/components/admin/admin-app-shell"
import { buildAdminNavItems } from "@/lib/admin/nav-items"
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
    .eq("audience", "particulier")

  const userLabel = profile.full_name ?? profile.email ?? "Administrateur"

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#ECF4E9]" />}>
      <AdminAppShell
        navItems={buildAdminNavItems(commandesATraiter ?? 0)}
        userLabel={userLabel}
      >
        {children}
      </AdminAppShell>
    </Suspense>
  )
}
