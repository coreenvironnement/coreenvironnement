import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ProCompteCtaPanel } from "@/components/pro/pro-compte-cta-panel"
import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"
import { VitrineSectionHeader } from "@/components/vitrine/vitrine-section-header"
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
      <section className="bg-brand-bg-alt pt-8 pb-12 sm:py-16 lg:py-20">
        <div className="container-x max-w-3xl space-y-6">
          <VitrineSectionHeader
            className="mx-auto max-w-2xl pb-2 sm:pb-4"
            eyebrow="Espace professionnel"
            title={comptePro.titre}
            titleAs="h1"
            titleClassName="text-brand-navy text-[clamp(1.85rem,4.4vw,3rem)] !font-extrabold leading-[1.1] tracking-tight"
            intro={comptePro.sousTitre}
          />

          <ProCompteCtaPanel />
        </div>
      </section>
    </VitrinePublicShell>
  )
}
