import { Suspense } from "react"

import { AdminAppShell } from "@/components/admin/admin-app-shell"
import { loadAdminNavBadges } from "@/lib/admin/nav-badges"
import { buildAdminNavGroups, flattenAdminNav } from "@/lib/admin/nav-items"
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
  let badges = {
    clientsNew: 0,
    chantiersNew: 0,
    interventionsNew: 0,
    prestatairesDocs: 0,
    comptesProPending: 0,
  }
  try {
    badges = await loadAdminNavBadges(supabase)
  } catch {
    /* migration 019 pas encore appliquée */
  }

  const navGroups = buildAdminNavGroups(badges)
  const navItems = flattenAdminNav(navGroups)
  const userLabel = profile.full_name ?? profile.email ?? "Administrateur"

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#ECF4E9]" />}>
      <AdminAppShell navGroups={navGroups} navItems={navItems} userLabel={userLabel}>
        {children}
      </AdminAppShell>
    </Suspense>
  )
}