import Link from "next/link"

import { AdminNav } from "@/components/admin/admin-nav"
import { requireAdmin } from "@/lib/auth/require-admin"

export const metadata = {
  title: "Administration",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await requireAdmin()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Connecté en tant qu&apos;administrateur</p>
        <h1 className="text-2xl font-bold text-brand-navy">{profile.full_name ?? profile.email}</h1>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <AdminNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
