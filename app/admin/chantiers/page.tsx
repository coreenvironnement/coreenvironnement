import { attachPremierCompteTelephone } from "@/lib/admin/chantiers-list-phones"
import { requireAdmin } from "@/lib/auth/require-admin"
import { AdminChantierCreateSection } from "@/components/admin/admin-chantier-create-section"
import { AdminChantiersList } from "@/components/admin/admin-chantiers-list"

export const metadata = {
  title: "Chantiers · Admin",
}

export default async function AdminChantiersPage() {
  const { supabase } = await requireAdmin()

  const { data: chantiersRaw } = await supabase
    .from("chantiers")
    .select("id, nom, adresse, code_affaire, is_active, created_at")
    .order("nom")

  const chantiers = await attachPremierCompteTelephone(supabase, chantiersRaw ?? [])

  const count = chantiers.length

  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#35A238]/18 bg-white text-sm text-card-foreground shadow-sm ring-1 ring-foreground/10">
      <header className="border-b border-[#35A238]/12 bg-gradient-to-r from-[#ECF4E9]/80 via-white to-white px-4 py-5 text-center sm:px-6">
        <h2 className="text-xl font-bold text-brand-navy">Chantiers</h2>
        <p className="mx-auto mt-1 max-w-2xl text-sm text-muted-foreground">
          Créez un chantier et liez les e-mails des clients qui y auront accès.
        </p>
      </header>

      <AdminChantierCreateSection />

      <section>
        <header className="border-b border-[#35A238]/10 bg-gradient-to-r from-white via-[#F7FAF5]/50 to-[#F7FAF5]/70 px-4 py-4 text-center sm:px-6">
          <h3 className="text-base font-semibold text-brand-navy">Liste des chantiers</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {count} chantier{count === 1 ? "" : "s"} enregistré{count === 1 ? "" : "s"}
          </p>
        </header>
        <div className="bg-[#F7FAF5]/60 px-4 py-4 sm:px-6 sm:py-5">
          <AdminChantiersList chantiers={chantiers} />
        </div>
      </section>
    </div>
  )
}