import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"
import { comptePro } from "@/lib/cdc/contenu-vitrine"
import { publicPageMetadata } from "@/lib/seo/public-page"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = publicPageMetadata(
  "Compte professionnel",
  comptePro.description,
  "/pro"
)

type PageProps = {
  searchParams: Promise<{ subscription?: string; reason?: string }>
}

export default async function ProPage({ searchParams }: PageProps) {
  const { subscription: subscriptionParam, reason: reasonParam } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const q = new URLSearchParams()
    if (subscriptionParam) q.set("subscription", subscriptionParam)
    if (reasonParam) q.set("reason", reasonParam)
    const suffix = q.toString() ? `?${q.toString()}` : ""
    redirect(`/espace/compte${suffix}`)
  }

  return (
    <VitrinePublicShell>
      <section className="bg-brand-bg-alt py-12 sm:py-16 lg:py-20">
        <div className="container-x max-w-3xl space-y-6">
          <div className="pb-2 sm:pb-4">
            <p className="section-eyebrow">Espace professionnel</p>
            <h1 className="mt-4 text-[clamp(1.85rem,4.4vw,3rem)] leading-[1.1] text-brand-navy">
              {comptePro.titre}
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-[1.75] text-brand-muted sm:text-[18px]">
              {comptePro.sousTitre}
            </p>
          </div>

          <div className="card-vitrine p-6 sm:p-8">
            <h2 className="text-xl text-brand-navy">{comptePro.reassurance.titre}</h2>
            <p className="mt-1.5 text-sm text-brand-muted">
              Abonnement : {comptePro.abonnement}
            </p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-muted">
              {comptePro.reassurance.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="card-vitrine space-y-5 p-6 sm:p-8">
            <div>
              <h2 className="text-xl text-brand-navy">Créer ou accéder à votre dossier</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
                Même page de connexion que les particuliers : après identification, vous
                complétez votre dossier entreprise dans l&apos;espace client.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/inscription?type=professionnel&next=/espace/compte"
                className="btn btn-accent inline-flex min-h-12 items-center justify-center"
              >
                Créer un compte pro
              </Link>
              <Link
                href="/login?next=/espace/compte"
                className="btn btn-outline inline-flex min-h-12 items-center justify-center"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </VitrinePublicShell>
  )
}
