import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { createInterventionFromCommande, updateCommandeStatut } from "@/app/admin/actions"
import { AdminCommandeOps } from "@/components/admin/admin-commande-ops"
import { requireAdmin } from "@/lib/auth/require-admin"
import { canCreateInterventionFromCommande } from "@/lib/commande/intervention-from-commande"
import {
  audienceCommandeLabel,
  commandeMailtoHref,
  commandeTelHref,
  isCommandeNouvelle,
  paymentStatusBadgeClass,
  paymentStatusLabel,
  STATUTS_COMMANDE,
  statutCommandeBadgeClass,
  statutCommandeLabel,
} from "@/lib/commande/labels"
import { formatOrderReference } from "@/lib/commande/reference"
import { departementLabel } from "@/lib/geo/idf"
import { formatDateFr } from "@/lib/format/date"
import { formatEuro } from "@/lib/format/currency"
import { priceBreakdownFromHt } from "@/lib/order/prestation-mapping"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; intervention?: string; ok?: string }>
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
  const { error: errorParam, intervention: interventionCreated, ok: okParam } = await searchParams
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
  const breakdown =
    commande.price_ht != null ? priceBreakdownFromHt(Number(commande.price_ht)) : null
  const reference = formatOrderReference(commande.id)
  const paidStillCaptured =
    commande.statut === "annulee" && commande.payment_status === "paid"

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
          {reference} · {commande.prestation_label ?? dechet?.nom ?? "Commande benne"}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          {isCommandeNouvelle(commande.date_creation) ? (
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-sky-900">
              Nouvelle
            </span>
          ) : null}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-medium",
              statutCommandeBadgeClass(commande.statut)
            )}
          >
            Statut : {statutCommandeLabel(commande.statut)}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-medium",
              paymentStatusBadgeClass(commande.payment_status)
            )}
          >
            Paiement : {paymentStatusLabel(commande.payment_status)}
          </span>
          {commande.audience ? (
            <span className="text-muted-foreground">
              {audienceCommandeLabel(commande.audience)}
            </span>
          ) : null}
        </div>
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
      {okParam === "cancelled" ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Commande annulée.
        </p>
      ) : null}
      {okParam === "refund_pending" ? (
        <p className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-950">
          Annulation enregistrée. Remboursement demandé — en attente de confirmation Stripe.
        </p>
      ) : null}
      {okParam === "already_refunded" ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          Le paiement était déjà remboursé côté Stripe. La commande a été synchronisée.
        </p>
      ) : null}
      {paidStillCaptured ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
          Annulée — paiement toujours encaissé
        </p>
      ) : null}
      {commande.payment_status === "refund_pending" ? (
        <p className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-950">
          Remboursement en cours. Le badge « Remboursée » n’apparaîtra qu’après confirmation
          Stripe.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Actions principales</CardTitle>
          <CardDescription>
            Traitement opérationnel de la commande. L’annulation seule ne rembourse pas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {commande.contact_telephone ? (
            <a
              href={commandeTelHref(commande.contact_telephone)}
              className={cn(buttonVariants({ size: "lg" }), "justify-center")}
            >
              Appeler le client
            </a>
          ) : (
            <p className="w-full text-sm text-muted-foreground">Aucun téléphone client.</p>
          )}
          {commande.statut === "confirmee" ? (
            canCreate.ok ? (
              <form action={createInterventionBound}>
                <Button type="submit" variant="outline" size="lg" className="w-full sm:w-auto">
                  Passer en cours
                </Button>
              </form>
            ) : (
              <form action={updateBound}>
                <input type="hidden" name="statut" value="en_cours" />
                <Button type="submit" variant="outline" size="lg" className="w-full sm:w-auto">
                  Passer en cours
                </Button>
              </form>
            )
          ) : null}
          {commande.statut === "confirmee" || commande.statut === "en_cours" ? (
            <form action={updateBound}>
              <input type="hidden" name="statut" value="livree" />
              <Button type="submit" variant="outline" size="lg" className="w-full sm:w-auto">
                Marquer livrée
              </Button>
            </form>
          ) : null}
          <AdminCommandeOps
            commandeId={id}
            refundAmountLabel={formatEuro(breakdown?.ttc ?? null)}
            statut={commande.statut}
            paymentStatus={commande.payment_status ?? ""}
          />
        </CardContent>
      </Card>

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
              {commande.contact_email ? (
                <a
                  href={commandeMailtoHref(commande.contact_email)}
                  className="text-primary hover:underline"
                >
                  {commande.contact_email}
                </a>
              ) : (
                "—"
              )}
            </p>
            <p>
              <span className="text-muted-foreground">Téléphone :</span>{" "}
              {commande.contact_telephone ? (
                <a
                  href={commandeTelHref(commande.contact_telephone)}
                  className="text-primary hover:underline"
                >
                  {commande.contact_telephone}
                </a>
              ) : (
                "—"
              )}
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
              <span className="text-muted-foreground">HT :</span>{" "}
              {formatEuro(breakdown?.ht ?? null)}
            </p>
            <p>
              <span className="text-muted-foreground">TVA :</span>{" "}
              {formatEuro(breakdown?.tva ?? null)}
            </p>
            <p>
              <span className="text-muted-foreground">TTC :</span>{" "}
              {formatEuro(breakdown?.ttc ?? null)}
            </p>
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
            <p className="break-all font-mono text-xs">
              <span className="text-muted-foreground">stripe_payment_intent_id :</span>{" "}
              {commande.stripe_payment_intent_id ?? "—"}
            </p>
            {commande.stripe_checkout_session_id ? (
              <p className="break-all font-mono text-xs text-muted-foreground">
                Session : {commande.stripe_checkout_session_id}
              </p>
            ) : null}
            {commande.stripe_refund_id ? (
              <p className="break-all font-mono text-xs text-muted-foreground">
                Refund : {commande.stripe_refund_id}
              </p>
            ) : null}
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
