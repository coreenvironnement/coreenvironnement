import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Trash2 } from "lucide-react"

import {
  addChantierMember,
  createIntervention,
  removeChantierMemberForm,
  updateChantierMemberForm,
  updateChantier,
  updateInterventionStatut,
  upsertStatsDechet,
} from "@/app/admin/actions"
import { DocumentUploadRow } from "@/components/admin/document-upload-row"
import { requireAdmin } from "@/lib/auth/require-admin"
import { loadChantierDashboard } from "@/lib/dashboard/chantier-data"
import { STATUTS_INTERVENTION } from "@/lib/cdc/referentiels"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const textareaClass =
  "w-full min-h-20 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ member?: string; error?: string }>
}

function memberFeedback(member?: string, error?: string) {
  if (error) {
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {decodeURIComponent(error)}
      </p>
    )
  }
  if (!member) return null

  const value = decodeURIComponent(member)
  if (value === "linked") {
    return (
      <p className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-brand-navy">
        E-mail lié au chantier. Le client verra ce chantier dans son espace client.
      </p>
    )
  }
  if (value === "pending") {
    return (
      <p className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-brand-navy">
        E-mail enregistré (invitation non envoyée). Le lien sera actif quand le compte existera.
      </p>
    )
  }
  if (value === "invite_sent") {
    return (
      <p className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-brand-navy">
        E-mail lié et invitation envoyée. Vérifiez la boîte de réception (et les spams).
      </p>
    )
  }
  if (value === "updated") {
    return (
      <p className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-brand-navy">
        Contact mis à jour.
      </p>
    )
  }
  if (value === "removed") {
    return (
      <p className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-brand-navy">
        Contact retiré du chantier.
      </p>
    )
  }
  if (value.startsWith("invite_failed:")) {
    return (
      <p className="rounded-lg border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        E-mail lié au chantier, mais l&apos;invitation n&apos;a pas pu être envoyée :{" "}
        {value.replace("invite_failed:", "")}. Configurez les URLs et e-mails dans Supabase →
        Authentication.
      </p>
    )
  }
  return null
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from("chantiers").select("nom").eq("id", id).single()
  return { title: data?.nom ? `${data.nom} · Admin` : "Chantier · Admin" }
}

export default async function AdminChantierDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params
  const { member, error } = await searchParams
  const { supabase } = await requireAdmin()

  const { data: chantier } = await supabase
    .from("chantiers")
    .select("*")
    .eq("id", id)
    .single()

  if (!chantier) notFound()

  const [
    membresResult,
    { data: typesIntervention },
    { data: typesContenants },
    { data: typesDechets },
    { data: statsDechets },
    { data: prestataires },
  ] = await Promise.all([
    supabase
      .from("chantier_membres")
      .select(
        "id, invited_email, profile_id, contact_prenom, contact_nom, contact_fonction, contact_entreprise, created_at"
      )
      .eq("chantier_id", id)
      .order("created_at"),
    supabase.from("types_intervention").select("id, label").order("sort_order"),
    supabase.from("types_contenants").select("id, label").order("sort_order"),
    supabase.from("dechets_types").select("id, nom, categorie").order("sort_order"),
    supabase
      .from("chantier_stats_dechets")
      .select("dechet_type_id, tonnage_t")
      .eq("chantier_id", id),
    supabase.from("prestataires").select("id, nom").eq("is_active", true).order("nom"),
  ])

  const membres = membresResult.data
  const membresError = membresResult.error

  const profileIds = (membres ?? [])
    .map((m) => m.profile_id)
    .filter((pid): pid is string => Boolean(pid))

  const profilesById: Record<string, { email: string; full_name: string | null }> = {}

  if (profileIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", profileIds)

    for (const p of profiles ?? []) {
      profilesById[p.id] = { email: p.email, full_name: p.full_name }
    }
  }

  const { data: interventions } = await supabase
    .from("interventions")
    .select(
      `
      id, numero, statut, date_demande, date_souhaitee, date_reelle, commentaire,
      types_intervention(label),
      types_contenants(label),
      dechets_types(nom),
      intervention_documents(document_type, file_name)
    `
    )
    .eq("chantier_id", id)
    .order("date_demande", { ascending: false })

  const updateChantierBound = updateChantier.bind(null, id)
  const addMemberBound = addChantierMember.bind(null, id)
  const createInterventionBound = createIntervention.bind(null, id)
  const upsertDechetBound = upsertStatsDechet.bind(null, id)

  const dashboardPreview = await loadChantierDashboard(supabase, id)

  const statutLabel = (code: string) =>
    STATUTS_INTERVENTION.find((s) => s.code === code)?.label ?? code

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/chantiers"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour aux chantiers
        </Link>
        <h2 className="mt-2 text-xl font-bold text-brand-navy">{chantier.nom}</h2>
      </div>

      {/* Infos chantier */}
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateChantierBound} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="nom" className="text-sm font-medium">
                Nom *
              </label>
              <Input id="nom" name="nom" required defaultValue={chantier.nom} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="adresse" className="text-sm font-medium">
                Adresse
              </label>
              <Input id="adresse" name="adresse" defaultValue={chantier.adresse ?? ""} />
            </div>
            <div className="space-y-2">
              <label htmlFor="code_affaire" className="text-sm font-medium">
                Code affaire
              </label>
              <Input
                id="code_affaire"
                name="code_affaire"
                defaultValue={chantier.code_affaire ?? ""}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="prestataire_id" className="text-sm font-medium">
                Prestataire (calcul valorisation)
              </label>
              <select
                id="prestataire_id"
                name="prestataire_id"
                defaultValue={chantier.prestataire_id ?? ""}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                <option value="">— Aucun —</option>
                {prestataires?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                defaultChecked={chantier.is_active}
                className="size-4 rounded border-input"
              />
              <label htmlFor="is_active" className="text-sm">
                Chantier actif
              </label>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Membres */}
      <Card>
        <CardHeader>
          <CardTitle>Accès clients</CardTitle>
          <CardDescription>
            Personnes liées à ce chantier. E-mail obligatoire · nom, prénom, fonction et entreprise
            optionnels.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {memberFeedback(member, error)}
          {membresError ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Erreur lecture des accès : {membresError.message}
            </p>
          ) : null}

          <form action={addMemberBound} className="grid gap-4 rounded-xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="contact_prenom" className="text-sm font-medium">
                Prénom
              </label>
              <Input id="contact_prenom" name="contact_prenom" placeholder="Jean" />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact_nom" className="text-sm font-medium">
                Nom
              </label>
              <Input id="contact_nom" name="contact_nom" placeholder="Dupont" />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact_fonction" className="text-sm font-medium">
                Fonction
              </label>
              <Input id="contact_fonction" name="contact_fonction" placeholder="Chef de chantier" />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact_entreprise" className="text-sm font-medium">
                Entreprise
              </label>
              <Input id="contact_entreprise" name="contact_entreprise" placeholder="BTP Exemple SAS" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail *
              </label>
              <Input id="email" name="email" type="email" required placeholder="client@entreprise.fr" />
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input name="send_invite" type="checkbox" className="size-4 rounded" />
              Envoyer une invitation Supabase (nouveau compte uniquement)
            </label>
            <div className="sm:col-span-2">
              <Button type="submit">Ajouter le contact</Button>
            </div>
          </form>

          {membres?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Prénom</th>
                    <th className="py-2 pr-3 font-medium">Nom</th>
                    <th className="py-2 pr-3 font-medium">Fonction</th>
                    <th className="py-2 pr-3 font-medium">Entreprise</th>
                    <th className="py-2 pr-3 font-medium">E-mail</th>
                    <th className="py-2 pr-3 font-medium">Statut</th>
                    <th className="py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {membres.map((m) => {
                    const profile = m.profile_id ? profilesById[m.profile_id] : null
                    const email = profile?.email ?? m.invited_email ?? "—"
                    const updateBound = updateChantierMemberForm.bind(null, m.id, id)
                    const removeBound = removeChantierMemberForm.bind(null, m.id, id)
                    return (
                      <tr key={m.id} className="border-b border-border/40 align-top">
                        <td colSpan={7} className="p-0">
                          <details className="group">
                            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                              <div className="grid grid-cols-[repeat(6,minmax(0,1fr))_auto] gap-2 py-3 pr-2">
                                <span>{m.contact_prenom ?? "—"}</span>
                                <span>{m.contact_nom ?? "—"}</span>
                                <span>{m.contact_fonction ?? "—"}</span>
                                <span>{m.contact_entreprise ?? "—"}</span>
                                <span className="font-medium text-brand-navy">{email}</span>
                                <span className="text-xs">
                                  {profile ? (
                                    <span className="text-primary">Compte actif</span>
                                  ) : (
                                    <span className="text-amber-700">En attente</span>
                                  )}
                                </span>
                                <span className="text-xs text-primary underline-offset-2 group-open:underline">
                                  Modifier
                                </span>
                              </div>
                            </summary>
                            <div className="border-t border-border/40 bg-muted/20 px-3 py-4">
                              <form action={updateBound} className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                  <label className="text-xs font-medium">Prénom</label>
                                  <Input name="contact_prenom" defaultValue={m.contact_prenom ?? ""} />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-medium">Nom</label>
                                  <Input name="contact_nom" defaultValue={m.contact_nom ?? ""} />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-medium">Fonction</label>
                                  <Input name="contact_fonction" defaultValue={m.contact_fonction ?? ""} />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-medium">Entreprise</label>
                                  <Input
                                    name="contact_entreprise"
                                    defaultValue={m.contact_entreprise ?? ""}
                                  />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                  <label className="text-xs font-medium">E-mail *</label>
                                  <Input
                                    name="email"
                                    type="email"
                                    required
                                    defaultValue={email}
                                    disabled={Boolean(profile)}
                                  />
                                  {profile ? (
                                    <p className="text-xs text-muted-foreground">
                                      E-mail du compte existant (non modifiable ici).
                                    </p>
                                  ) : null}
                                </div>
                                <div className="flex flex-wrap gap-2 sm:col-span-2">
                                  <Button type="submit" size="sm">
                                    Enregistrer
                                  </Button>
                                </div>
                              </form>
                              <form action={removeBound} className="mt-2">
                                <Button type="submit" variant="destructive" size="sm">
                                  <Trash2 className="size-3.5" aria-hidden />
                                  Retirer du chantier
                                </Button>
                              </form>
                            </div>
                          </details>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun contact lié à ce chantier.</p>
          )}
        </CardContent>
      </Card>

      {/* Stats dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques dashboard</CardTitle>
          <CardDescription>
            Tonnages saisis ici · valorisation calculée automatiquement via le prestataire du
            chantier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form action={upsertDechetBound} className="flex flex-wrap items-end gap-3">
            <div className="min-w-[200px] flex-1 space-y-2">
              <label className="text-sm font-medium">Typologie déchet</label>
              <select
                name="dechet_type_id"
                required
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                <option value="">— Choisir —</option>
                {typesDechets?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-32 space-y-2">
              <label className="text-sm font-medium">Tonnage (t)</label>
              <Input name="tonnage_t" type="number" step="0.001" min="0" required />
            </div>
            <Button type="submit">Ajouter / mettre à jour</Button>
          </form>

          {statsDechets?.length ? (
            <ul className="text-sm">
              {statsDechets.map((s) => {
                const dechet = typesDechets?.find((d) => d.id === s.dechet_type_id)
                return (
                  <li key={s.dechet_type_id} className="py-1">
                    {dechet?.nom} : <strong>{s.tonnage_t} t</strong>
                  </li>
                )
              })}
            </ul>
          ) : null}

          {dashboardPreview ? (
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-sm">
              <p className="font-medium text-brand-navy">Aperçu valorisation client</p>
              <p className="mt-2 text-muted-foreground">
                Prestataire :{" "}
                {dashboardPreview.chantier.prestataireNom ?? "non défini"} · année{" "}
                {dashboardPreview.anneeTaux}
              </p>
              <p className="mt-1">
                <strong>{dashboardPreview.valorisation.tauxValorisationPct} %</strong> valorisation
                ·{" "}
                <strong>{dashboardPreview.valorisation.tauxEliminationPct} %</strong> élimination
                · total {dashboardPreview.valorisation.tonnageTotalT} t
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Interventions */}
      <Card>
        <CardHeader>
          <CardTitle>Interventions</CardTitle>
          <CardDescription>Numéro généré automatiquement · upload PDF (BI, pesée, BSD)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form action={createInterventionBound} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type *</label>
              <select
                name="type_intervention_id"
                required
                className="h-8 w-full rounded-lg border border-input px-2 text-sm"
              >
                <option value="">—</option>
                {typesIntervention?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contenant *</label>
              <select
                name="contenant_id"
                required
                className="h-8 w-full rounded-lg border border-input px-2 text-sm"
              >
                <option value="">—</option>
                {typesContenants?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Déchet *</label>
              <select
                name="dechet_type_id"
                required
                className="h-8 w-full rounded-lg border border-input px-2 text-sm"
              >
                <option value="">—</option>
                {typesDechets?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <select name="statut" className="h-8 w-full rounded-lg border border-input px-2 text-sm">
                {STATUTS_INTERVENTION.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date demande *</label>
              <Input name="date_demande" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date souhaitée</label>
              <Input name="date_souhaitee" type="date" />
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium">Commentaire</label>
              <textarea name="commentaire" className={textareaClass} />
            </div>
            <div>
              <Button type="submit">Créer l&apos;intervention</Button>
            </div>
          </form>

          {interventions?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">N°</th>
                    <th className="py-2 pr-3 font-medium">Type</th>
                    <th className="py-2 pr-3 font-medium">Contenant</th>
                    <th className="py-2 pr-3 font-medium">Déchet</th>
                    <th className="py-2 pr-3 font-medium">Statut</th>
                    <th className="py-2 pr-3 font-medium">Documents</th>
                  </tr>
                </thead>
                <tbody>
                  {interventions.map((row) => {
                    const docs = (row.intervention_documents ?? []) as {
                      document_type: string
                      file_name: string
                    }[]
                    const docMap = Object.fromEntries(
                      docs.map((d) => [d.document_type, d.file_name])
                    )
                    const updateStatutBound = updateInterventionStatut.bind(
                      null,
                      row.id,
                      id
                    )
                    return (
                      <tr key={row.id} className="border-b border-border/40 align-top">
                        <td className="py-3 pr-3 font-mono text-xs">{row.numero}</td>
                        <td className="py-3 pr-3">
                          {(row.types_intervention as unknown as { label: string } | null)?.label}
                        </td>
                        <td className="py-3 pr-3">
                          {(row.types_contenants as unknown as { label: string } | null)?.label}
                        </td>
                        <td className="py-3 pr-3">
                          {(row.dechets_types as unknown as { nom: string } | null)?.nom}
                        </td>
                        <td className="py-3 pr-3">
                          <form action={updateStatutBound} className="space-y-2">
                            <select
                              name="statut"
                              defaultValue={row.statut}
                              className="h-8 w-full min-w-[140px] rounded-lg border border-input px-2 text-xs"
                            >
                              {STATUTS_INTERVENTION.map((s) => (
                                <option key={s.code} value={s.code}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                            <Input
                              name="date_reelle"
                              type="date"
                              defaultValue={row.date_reelle ?? ""}
                              className="h-8 text-xs"
                            />
                            <Button type="submit" variant="outline" size="sm">
                              MAJ statut
                            </Button>
                          </form>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {statutLabel(row.statut)}
                          </p>
                        </td>
                        <td className="py-3">
                          <DocumentUploadRow
                            interventionId={row.id}
                            chantierId={id}
                            existing={docMap}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune intervention.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
