import Link from "next/link"
import { redirect } from "next/navigation"

import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"
import { formatOrderReference } from "@/lib/commande/reference"
import {
  paymentStatusBadgeClass,
  paymentStatusLabel,
  statutCommandeBadgeClass,
  statutCommandeLabel,
} from "@/lib/commande/labels"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Mes commandes · CORE Environnement",
  robots: { index: false, follow: false },
}

function formatFrDate(isoDate: string | null) {
  if (!isoDate) return "—"
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function MesCommandesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/mes-commandes")
  }

  const emailConfirmed = Boolean(user.email_confirmed_at)

  const { data: commandes } = await supabase
    .from("commandes")
    .select(
      "id, statut, payment_status, prestation_label, date_livraison, date_creation, adresse_complete"
    )
    .eq("client_id", user.id)
    .order("date_creation", { ascending: false })

  const list = commandes ?? []

  return (
    <VitrinePublicShell>
      <section className="bg-brand-bg-alt py-12 sm:py-16">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <p className="section-eyebrow">Espace client</p>
            <h1 className="mt-3 text-[clamp(1.75rem,3.5vw,2.35rem)] leading-tight text-brand-navy">
              Mes commandes
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-muted sm:text-base">
              Suivez l’état de vos locations de bennes. Pour toute question, notre équipe
              reste joignable par e-mail ou téléphone.
            </p>

            {!emailConfirmed ? (
              <div className="card-vitrine mt-8 border-amber-200/80 bg-amber-50/60 p-5">
                <p className="font-medium text-brand-navy">Confirmez votre e-mail</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  Ouvrez le lien reçu après votre commande pour activer l’accès complet.
                  Vous pouvez aussi en demander un nouveau depuis l’écran de confirmation
                  de commande.
                </p>
              </div>
            ) : null}

            {list.length === 0 ? (
              <div className="card-vitrine mt-8 p-8 text-center">
                <p className="text-lg font-medium text-brand-navy">Aucune commande associée</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-brand-muted">
                  Si vous venez de commander, vérifiez que vous êtes connecté avec la même
                  adresse e-mail que lors du paiement.
                </p>
                <Link href="/" className="btn btn-accent mt-6 inline-flex">
                  Commander une benne
                </Link>
              </div>
            ) : (
              <ul className="mt-8 space-y-4">
                {list.map((commande) => (
                  <li key={commande.id} className="card-vitrine p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                          Référence
                        </p>
                        <p className="mt-0.5 font-mono text-sm font-semibold text-brand-navy">
                          {formatOrderReference(commande.id)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-medium",
                            statutCommandeBadgeClass(commande.statut)
                          )}
                        >
                          {statutCommandeLabel(commande.statut)}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-medium",
                            paymentStatusBadgeClass(commande.payment_status)
                          )}
                        >
                          {paymentStatusLabel(commande.payment_status)}
                        </span>
                      </div>
                    </div>
                    <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-brand-muted">Prestation</dt>
                        <dd className="font-medium text-brand-navy">
                          {commande.prestation_label ?? "Benne"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-brand-muted">Livraison souhaitée</dt>
                        <dd className="font-medium text-brand-navy">
                          {formatFrDate(commande.date_livraison)}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-brand-muted">Adresse</dt>
                        <dd className="font-medium text-brand-navy">
                          {commande.adresse_complete}
                        </dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-8 text-center text-sm text-brand-muted">
              <Link href="/" className="link-digital">
                Retour à l&apos;accueil
              </Link>
            </p>
          </div>
        </div>
      </section>
    </VitrinePublicShell>
  )
}
