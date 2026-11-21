import type { Metadata } from "next"
import { redirect } from "next/navigation"

import {
  ProCompteCtaPanel,
  ProCompteSwoosh,
} from "@/components/pro/pro-compte-cta-panel"
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
      <section className="relative -mt-[var(--vitrine-header-height)] overflow-hidden bg-brand-bg-alt pb-12 pt-[calc(var(--vitrine-header-height)+1rem)] sm:-mt-[calc(var(--vitrine-header-height)+0.75rem)] sm:pb-16 sm:pt-[calc(var(--vitrine-header-height)+0.75rem+1.5rem)] lg:-mt-[calc(var(--vitrine-header-height)+1.25rem)] lg:pb-20 lg:pt-[calc(var(--vitrine-header-height)+1.25rem+2rem)]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-brand-green/[0.09] blur-3xl" />
          <div className="absolute -right-16 top-0 h-56 w-56 rounded-full bg-brand-green/[0.07] blur-3xl" />
        </div>

        <div className="container-x relative flex max-w-3xl flex-col gap-5 sm:gap-6">
          <VitrineSectionHeader
            className="mx-auto max-w-2xl !mb-0 pb-0"
            eyebrow={comptePro.eyebrow}
            title={
              <>
                {comptePro.titreAvant}{" "}
                <span className="relative inline-block">
                  {comptePro.titreHighlight}
                  <ProCompteSwoosh />
                </span>
              </>
            }
            titleAs="h1"
            titleClassName="text-brand-navy text-[clamp(1.75rem,4.2vw,2.65rem)] !font-extrabold leading-[1.12] tracking-tight"
            intro={comptePro.sousTitre}
          />

          <ProCompteCtaPanel />
        </div>
      </section>
    </VitrinePublicShell>
  )
}