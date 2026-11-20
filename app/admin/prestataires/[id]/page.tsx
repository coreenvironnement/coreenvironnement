import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { updatePrestataire } from "@/app/admin/actions"
import { PrestataireEntrepriseFields } from "@/components/admin/prestataire-entreprise-fields"
import { AdminAuditLogPanel } from "@/components/admin/admin-audit-log-panel"
import { requireAdmin } from "@/lib/auth/require-admin"
import { loadAuditLog } from "@/lib/admin/audit-log"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; ok?: string }>
}

export default async function AdminPrestataireFichePage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { error, ok } = await searchParams
  const { supabase } = await requireAdmin()

  const { data: prestataire } = await supabase
    .from("prestataires")
    .select("*")
    .eq("id", id)
    .single()

  if (!prestataire) notFound()

  const { data: documents } = await supabase
    .from("prestataire_documents")
    .select("id, document_kind, expires_at, file_name")
    .eq("prestataire_id", id)
    .order("expires_at", { ascending: true })

  const audit = await loadAuditLog(supabase, "prestataire", id)
  const updateBound = updatePrestataire.bind(null, id)
  const label = prestataire.raison_sociale ?? prestataire.nom

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/prestataires"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour aux prestataires
        </Link>
        <h2 className="mt-2 text-xl font-bold text-brand-navy">{label}</h2>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {decodeURIComponent(error)}
        </p>
      ) : null}
      {ok ? (
        <p className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-brand-navy">
          Fiche enregistrée.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Identité & contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateBound} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <PrestataireEntrepriseFields
                defaultRaison={label}
                defaultSiret={prestataire.siret ?? ""}
                defaultAdresse={prestataire.adresse ?? ""}
                defaultCodePostal={prestataire.code_postal ?? ""}
                defaultVille={prestataire.ville ?? ""}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail siège</label>
              <Input name="email" type="email" defaultValue={prestataire.email ?? ""} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input name="telephone" defaultValue={prestataire.telephone ?? ""} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact nom</label>
              <Input name="contact_nom" defaultValue={prestataire.contact_nom ?? ""} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact e-mail</label>
              <Input name="contact_email" type="email" defaultValue={prestataire.contact_email ?? ""} />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                defaultChecked={prestataire.is_active}
                className="size-4 rounded border-input"
              />
              <label htmlFor="is_active" className="text-sm">
                Prestataire actif
              </label>
            </div>
            <div>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents & échéances</CardTitle>
        </CardHeader>
        <CardContent>
          {documents?.length ? (
            <ul className="space-y-2 text-sm">
              {documents.map((d) => (
                <li key={d.id} className="flex justify-between gap-3">
                  <span>
                    {d.document_kind} · {d.file_name?.trim() || "Nom de fichier non renseigné"}
                  </span>
                  <span className="text-muted-foreground">
                    {d.expires_at
                      ? `Expire le ${d.expires_at}`
                      : "Date d&apos;expiration non renseignée"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucun document enregistré (ajout Storage à brancher sur le bucket admin).
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prestations & zones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <dl className="space-y-3">
            <div>
              <dt className="font-medium text-brand-navy">Départements couverts</dt>
              <dd className="mt-1 text-muted-foreground">
                {(() => {
                  const deps =
                    (prestataire.departements as string[] | null)?.filter((d) => d?.trim()) ?? []
                  return deps.length ? deps.join(", ") : "Aucun département renseigné"
                })()}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-brand-navy">Déchets acceptés</dt>
              <dd className="mt-1 text-muted-foreground">
                {(() => {
                  const dechets =
                    (prestataire.dechets_acceptes as string[] | null)?.filter((d) => d?.trim()) ??
                    []
                  return dechets.length
                    ? dechets.join(", ")
                    : "Aucune typologie de déchet renseignée"
                })()}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <AdminAuditLogPanel entries={audit} />
    </div>
  )
}