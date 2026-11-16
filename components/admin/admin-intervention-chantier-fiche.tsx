import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { updateInterventionStatutAdmin } from "@/app/admin/actions"
import { AdminInterventionPlanificationCard } from "@/components/admin/admin-intervention-planification-card"
import { AdminAuditLogPanel } from "@/components/admin/admin-audit-log-panel"
import { DocumentUploadRow } from "@/components/admin/document-upload-row"
import { requireAdmin } from "@/lib/auth/require-admin"
import { statutInterventionAffiche } from "@/lib/admin/intervention-display"
import { loadAuditLog } from "@/lib/admin/audit-log"
import { STATUTS_INTERVENTION } from "@/lib/cdc/referentiels"
import { formatDateFr } from "@/lib/format/date"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const textareaClass =
  "w-full min-h-20 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

type Props = {
  interventionId: string
  chantierId: string
  error?: string
  ok?: string
}

export async function AdminInterventionChantierFiche({
  interventionId,
  chantierId,
  error,
  ok,
}: Props) {
  const { supabase } = await requireAdmin()

  const { data: intervention } = await supabase
    .from("interventions")
    .select(
      `
      *,
      chantiers ( id, nom, adresse ),
      types_intervention ( label ),
      types_contenants ( label ),
      dechets_types ( nom ),
      prestataires ( nom ),
      intervention_documents ( document_type, file_name )
    `
    )
    .eq("id", interventionId)
    .single()

  if (!intervention) notFound()

  const { data: prestataires } = await supabase
    .from("prestataires")
    .select("id, nom, is_active")
    .eq("is_active", true)
    .order("nom")

  const { data: tarifs } = await supabase
    .from("chantier_lignes_tarifaires")
    .select("tonnage_inclus_kg, label")
    .eq("chantier_id", chantierId)
    .eq("is_active", true)

  const tonnageMax = (tarifs ?? []).reduce(
    (max, t) => Math.max(max, Number(t.tonnage_inclus_kg ?? 0)),
    0
  )
  const poids = intervention.poids_reel_kg != null ? Number(intervention.poids_reel_kg) : null
  const tonnageAlert =
    intervention.statut === "realisee" &&
    tonnageMax > 0 &&
    poids != null &&
    poids > tonnageMax

  const docs = (intervention.intervention_documents ?? []) as {
    document_type: string
    file_name: string
  }[]
  const docMap = Object.fromEntries(docs.map((d) => [d.document_type, d.file_name]))
  const chantier = intervention.chantiers as { id: string; nom: string; adresse: string | null }
  const updateBound = updateInterventionStatutAdmin.bind(null, interventionId, chantierId)
  const audit = await loadAuditLog(supabase, "intervention", interventionId)

  let contactPhone: string | null = null
  if (intervention.commande_id) {
    const { data: cmd } = await supabase
      .from("commandes")
      .select("contact_telephone")
      .eq("id", intervention.commande_id as string)
      .maybeSingle()
    contactPhone = cmd?.contact_telephone ?? null
  }

  const returnTo = `/admin/interventions/${interventionId}`
  const canPlan =
    intervention.statut === "en_cours_programmation" || intervention.statut === "programme"

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/interventions"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour aux interventions
        </Link>
        <h2 className="mt-2 text-xl font-bold text-brand-navy">
          {intervention.numero} · {chantier?.nom ?? "Chantier"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {statutInterventionAffiche(intervention.statut)}
          {intervention.date_souhaitee
            ? ` · souhaitée le ${formatDateFr(intervention.date_souhaitee)}`
            : null}
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {decodeURIComponent(error)}
        </p>
      ) : null}
      {ok === "statut" ? (
        <p className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-brand-navy">
          Intervention mise à jour.
        </p>
      ) : null}
      {ok === "planned" ? (
        <p className="rounded-lg border border-[#35A238]/30 bg-[#ECF4E9] px-4 py-3 text-sm text-brand-navy">
          Intervention planifiée — e-mail envoyé aux contacts chantier.
        </p>
      ) : null}
      {ok === "rescheduled" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Intervention reportée — contacts notifiés.
        </p>
      ) : null}
      {tonnageAlert ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Tonnage réel ({poids} kg) au-dessus du forfait chantier ({tonnageMax} kg).
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chantier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium text-brand-navy">{chantier?.nom}</p>
            {chantier?.adresse ? <p className="text-muted-foreground">{chantier.adresse}</p> : null}
            <Link href={`/admin/chantiers/${chantierId}`} className="text-primary hover:underline">
              Fiche chantier
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>
              Type :{" "}
              {(intervention.types_intervention as { label: string } | null)?.label ?? "—"}
            </p>
            <p>
              Contenant :{" "}
              {(intervention.types_contenants as { label: string } | null)?.label ?? "—"}
            </p>
            <p>
              Déchet : {(intervention.dechets_types as { nom: string } | null)?.nom ?? "—"}
            </p>
            <p>Date demande : {formatDateFr(intervention.date_demande)}</p>
          </CardContent>
        </Card>
      </div>

      {canPlan ? (
        <AdminInterventionPlanificationCard
          interventionId={interventionId}
          chantierId={chantierId}
          reference={intervention.numero}
          telephone={contactPhone}
          dateSouhaitee={intervention.date_souhaitee as string | null}
          planifieeLe={(intervention.planifiee_le as string | null) ?? null}
          canPlan={intervention.statut === "en_cours_programmation"}
          returnTo={returnTo}
        />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Planification & réalisation</CardTitle>
          <CardDescription>
            Programmer (prestataire + date), clôturer avec le poids réel ou signaler un passage à
            vide.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateBound} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <select
                name="statut"
                defaultValue={intervention.statut}
                className="h-9 w-full rounded-lg border border-input px-2 text-sm"
              >
                {STATUTS_INTERVENTION.map((s) => (
                  <option key={s.code} value={s.code}>
                    {statutInterventionAffiche(s.code)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prestataire</label>
              <select
                name="prestataire_id"
                defaultValue={intervention.prestataire_id ?? ""}
                className="h-9 w-full rounded-lg border border-input px-2 text-sm"
              >
                <option value="">—</option>
                {prestataires?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date réelle</label>
              <Input name="date_reelle" type="date" defaultValue={intervention.date_reelle ?? ""} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Poids réel (kg)</label>
              <Input
                name="poids_reel_kg"
                type="number"
                step="0.01"
                min="0"
                defaultValue={intervention.poids_reel_kg ?? ""}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Commentaire</label>
              <textarea
                name="commentaire"
                className={textareaClass}
                defaultValue={intervention.commentaire ?? ""}
              />
            </div>
            <div>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUploadRow
            interventionId={interventionId}
            chantierId={chantierId}
            existing={docMap}
          />
        </CardContent>
      </Card>

      <AdminAuditLogPanel entries={audit} />
    </div>
  )
}