import { AdminPrestataireCreateDialog } from "@/components/admin/admin-prestataire-create-dialog"
import { AdminPrestatairesList } from "@/components/admin/admin-prestataires-list"
import {
  buildPrestataireTauxSummaries,
  type PrestataireTauxRow,
} from "@/lib/admin/prestataire-taux-summary"
import { requireAdmin } from "@/lib/auth/require-admin"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = {
  title: "Prestataires · Admin",
}

type PageProps = {
  searchParams: Promise<{ ok?: string; error?: string }>
}

export default async function AdminPrestatairesPage({ searchParams }: PageProps) {
  const { ok: okParam, error: errorParam } = await searchParams
  const { supabase } = await requireAdmin()

  const { data: prestataires } = await supabase
    .from("prestataires")
    .select("id, nom, raison_sociale, is_active, ville, email, telephone")
    .order("nom")

  const anneeTaux = new Date().getFullYear()
  const { data: tauxRows } = await supabase
    .from("prestataire_taux_valorisation")
    .select("prestataire_id, annee, taux_pct, dechets_types(code, nom)")

  const tauxSummaries = buildPrestataireTauxSummaries(
    (tauxRows ?? []) as unknown as PrestataireTauxRow[],
    anneeTaux
  )

  const { data: docsExpiring } = await supabase
    .from("prestataire_documents")
    .select("prestataire_id, expires_at")
    .lte("expires_at", new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10))

  const expiringByPrest = new Map<string, number>()
  for (const d of docsExpiring ?? []) {
    expiringByPrest.set(d.prestataire_id, (expiringByPrest.get(d.prestataire_id) ?? 0) + 1)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Prestataires</h2>
          <p className="text-sm text-muted-foreground">
            Filières d&apos;élimination et transport · {prestataires?.length ?? 0} prestataire
            {(prestataires?.length ?? 0) === 1 ? "" : "s"}
          </p>
        </div>
        <AdminPrestataireCreateDialog />
      </div>

      {errorParam ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorParam}
        </p>
      ) : null}
      {okParam === "deleted" ? (
        <p className="rounded-lg border border-[#35A238]/30 bg-[#ECF4E9] px-4 py-3 text-sm text-brand-navy">
          Prestataire supprimé.
        </p>
      ) : null}

      <Card>
        <CardHeader className="place-items-center text-center">
          <CardTitle className="text-xl font-bold text-brand-navy">Liste</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-4 sm:px-4">
          <AdminPrestatairesList
            prestataires={prestataires ?? []}
            tauxById={tauxSummaries}
            expiringDocsById={expiringByPrest}
          />
        </CardContent>
      </Card>
    </div>
  )
}