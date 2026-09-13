import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { createInterventionFromCommande, updateCommandeStatut } from "@/app/admin/actions"
import { requireAdmin } from "@/lib/auth/require-admin"
import { canCreateInterventionFromCommande } from "@/lib/commande/intervention-from-commande"
import {
  audienceCommandeLabel,
  paymentStatusLabel,
  STATUTS_COMMANDE,
  statutCommandeLabel,
} from "@/lib/commande/labels"
import { departementLabel } from "@/lib/geo/idf"
import { formatDateFr } from "@/lib/format/date"
import { formatEuro } from "@/lib/format/currency"
import { priceTtcFromHt } from "@/lib/order/prestation-mapping"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; intervention?: string }>
}

type DechetEmbed = { nom: string; code: string | null } | null

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const { supabase } = await requireAdmin()
  const { data } = await supabase
    .from("commandes")
    .select("prestation_label, adresse_complete")
    .eq("id", id)
    .single()
  return {
    title: data?.prestation_label
      ? `${data.prestation_label} · Commande`
      : "Commande benne",
  }
}

export default async function AdminCommandeDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { error: errorParam, intervention: interventionCreated } = await searchParams
  const { supabase } = await requireAdmin()

  const { data: commande } = await supabase
    .from("commandes")
    .select(
      `
      *,
      dechets_types ( nom, code )
    `
    )
    .eq("id", id)
    .single()

  if (!commande) notFound()

  const { data: linkedIntervention } = await supabase
    .from("interventions")
    .select("id, numero, statut, chantier_id")
    .eq("commande_id", id)
    .maybeSingle()

  const dechet = commande.dechets_types as unknown as DechetEmbed
  const updateBound = updateCommandeStatut.bind(null, id)
  const createInterventionBound = createInterventionFromCommande.bind(null, id)
  const canCreate = canCreateInterventionFromCommande(
    commande,
    Boolean(linkedIntervention)
  )
  const priceTtc =
    commande.price_ht != null ? priceTtcFromHt(Number(commande.price_ht)) / 100 : null

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/commandes"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour aux commandes
        </Link>
        <h2 className="mt-2 text-xl font-bold text-brand-navy">
          {commande.prestation_label ?? dechet?.nom ?? "Commande benne"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {statutCommandeLabel(commande.statut)} · {paymentStatusLabel(commande.payment_status)}
          {commande.audience ? ` · ${audienceCommandeLabel(commande.audience)}` : null}
        </p>
      </div>

      {errorParam ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {decodeURIComponent(errorParam)}
        </p>
      ) : null}
      {interventionCreated ? (
        <p className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-brand-navy">
          Intervention <strong>{decodeURIComponent(interventionCreated)}</strong> créée avec
          succès.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact & adresse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Nom :</span>{" "}
              {commande.contact_nom ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">E-mail :</span>{" "}
              {commande.contact_email ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Adresse :</span>{" "}
              {commande.adresse_complete}
            </p>
            {commande.departement_code ? (
              <p>
                <span className="text-muted-foreground">Département :</span>{" "}
                {departementLabel(commande.departement_code) ?? commande.departement_code}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prestation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Forfait :</span>{" "}
              {commande.prestation_label ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Type déchet :</span> {dechet?.nom ?? "—"}
            </p>
            {commande.volume_m3 != null ? (
              <p>
                <span className="text-muted-foreground">Volume :</span> {commande.volume_m3} m³
              </p>
            ) : null}
            <p>
              <span className="text-muted-foreground">Montant HT :</span>{" "}
              {formatEuro(commande.price_ht != null ? Number(commande.price_ht) : null)}
            </p>
            {priceTtc != null ? (
              <p>
                <span className="text-muted-foreground">Montant TTC (20 %) :</span>{" "}
                {formatEuro(priceTtc)}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Livraison souhaitée :</span>{" "}
              {formatDateFr(commande.date_livraison)}
            </p>
            <p>
              <span className="text-muted-foreground">Enlèvement souhaité :</span>{" "}
              {formatDateFr(commande.date_enlevement)}
            </p>
            <p>
              <span className="text-muted-foreground">Commande créée le :</span>{" "}
              {formatDateFr(commande.date_creation)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paiement Stripe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Statut paiement :</span>{" "}
              {paymentStatusLabel(commande.payment_status)}
            </p>
            {commande.stripe_checkout_session_id ? (
              <p className="break-all font-mono text-xs text-muted-foreground">
                Session : {commande.stripe_checkout_session_id}
              </p>
            ) : (
              <p className="text-muted-foreground">Aucune session Stripe</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Intervention opérationnelle</CardTitle>
          <CardDescription>
            Crée un chantier et une intervention « Dépose » pré-remplie depuis cette commande.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {linkedIntervention ? (
            <div className="space-y-2 text-sm">
              <p>
                Intervention liée :{" "}
                <strong className="text-brand-navy">{linkedIntervention.numero}</strong>
              </p>
              <Link
                href={`/admin/chantiers/${linkedIntervention.chantier_id}`}
                className="inline-block text-primary hover:underline"
              >
                Ouvrir le chantier →
              </Link>
            </div>
          ) : canCreate.ok ? (
            <form action={createInterventionBound}>
              <Button type="submit">Créer l&apos;intervention</Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">{canCreate.reason}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suivi opérationnel</CardTitle>
          <CardDescription>
            Mettez à jour le statut après traitement (programmation, livraison, annulation).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateBound} className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <label htmlFor="statut" className="text-sm font-medium">
                Statut commande
              </label>
              <select
                id="statut"
                name="statut"
                defaultValue={commande.statut}
                className="h-9 w-full min-w-[200px] rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                {STATUTS_COMMANDE.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Enregistrer</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
