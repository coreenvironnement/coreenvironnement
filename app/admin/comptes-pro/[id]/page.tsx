import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { reviewComptePro } from "@/app/admin/actions"
import { CompteProDocumentButton } from "@/components/admin/compte-pro-document-button"
import { requireAdmin } from "@/lib/auth/require-admin"
import { comptePro } from "@/lib/cdc/contenu-vitrine"
import { MODES_PAIEMENT_PRO } from "@/lib/cdc/referentiels"
import { paymentModeLabel, statutCompteProLabel } from "@/lib/compte-pro/labels"
import { formatDateFr } from "@/lib/format/date"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
const textareaClass =
  "w-full min-h-24 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const { supabase } = await requireAdmin()
  const { data } = await supabase
    .from("comptes_pro")
    .select("raison_sociale")
    .eq("id", id)
    .single()
  return { title: data?.raison_sociale ? `${data.raison_sociale} · Compte pro` : "Compte pro" }
}

export default async function AdminCompteProDetailPage({ params }: PageProps) {
  const { id } = await params
  const { supabase } = await requireAdmin()

  const { data: compte } = await supabase
    .from("comptes_pro")
    .select(
      `
      *,
      profiles(email, full_name)
    `
    )
    .eq("id", id)
    .single()

  if (!compte) notFound()

  const profile = compte.profiles as unknown as { email: string; full_name: string | null } | null
  const reviewBound = reviewComptePro.bind(null, id)

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/comptes-pro"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour aux comptes pro
        </Link>
        <h2 className="mt-2 text-xl font-bold text-brand-navy">{compte.raison_sociale}</h2>
        <p className="text-sm text-muted-foreground">
          {statutCompteProLabel(compte.status)}
          {compte.payment_mode ? ` · ${paymentModeLabel(compte.payment_mode)}` : null}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Entreprise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">SIRET :</span> {compte.siret ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">NAF :</span> {compte.code_naf ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Siège :</span>{" "}
              {compte.adresse_siege ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Compte auth :</span>{" "}
              {profile?.email ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interlocuteur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{compte.contact_nom}</p>
            <p className="text-muted-foreground">{compte.contact_fonction ?? "—"}</p>
            <p>{compte.contact_email}</p>
            <p>{compte.contact_telephone ?? "—"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>KBIS et RIB déposés par le client</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {compte.kbis_storage_path ? (
            <CompteProDocumentButton compteId={id} kind="kbis" label="Télécharger KBIS" />
          ) : (
            <p className="text-sm text-muted-foreground">KBIS absent</p>
          )}
          {compte.rib_storage_path ? (
            <CompteProDocumentButton compteId={id} kind="rib" label="Télécharger RIB" />
          ) : (
            <p className="text-sm text-muted-foreground">RIB absent</p>
          )}
        </CardContent>
      </Card>

      {compte.status === "pending" ? (
        <Card>
          <CardHeader>
            <CardTitle>Validation du dossier</CardTitle>
            <CardDescription>{comptePro.validationAdmin}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={reviewBound} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="payment_mode" className="text-sm font-medium">
                  Mode de paiement (si validation)
                </label>
                <select
                  id="payment_mode"
                  name="payment_mode"
                  defaultValue="invoice"
                  className="h-9 w-full max-w-md rounded-lg border border-input bg-transparent px-2 text-sm"
                >
                  {MODES_PAIEMENT_PRO.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="review_notes" className="text-sm font-medium">
                  Notes internes / motif de refus
                </label>
                <textarea
                  id="review_notes"
                  name="review_notes"
                  className={textareaClass}
                  placeholder="Visible par le client en cas de refus"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" name="decision" value="approve">
                  Valider le compte
                </Button>
                <Button type="submit" name="decision" value="reject" variant="destructive">
                  Refuser
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Décision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Statut : <strong>{statutCompteProLabel(compte.status)}</strong>
            </p>
            {compte.payment_mode ? (
              <p>Mode de paiement : {paymentModeLabel(compte.payment_mode)}</p>
            ) : null}
            <p>
              Abonnement Stripe :{" "}
              {compte.subscription_active ? (
                <strong className="text-brand-navy">Actif</strong>
              ) : (
                "Inactif"
              )}
              {compte.subscription_status ? ` (${compte.subscription_status})` : null}
            </p>
            {compte.review_notes ? <p>Notes : {compte.review_notes}</p> : null}
            {compte.reviewed_at ? (
              <p className="text-muted-foreground">
                Traitée le {formatDateFr(compte.reviewed_at)}
              </p>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
