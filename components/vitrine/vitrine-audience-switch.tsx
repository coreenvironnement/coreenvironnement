import Link from "next/link"

import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"

export function VitrineAudienceSwitch({ mode }: { mode: "particulier" | "pro" }) {
  const copy =
    mode === "particulier"
      ? particulierAccueil.switchPro
      : particulierAccueil.switchParticulier

  return (
    <section className="border-t border-brand-border/60 bg-brand-bg-alt py-8 sm:py-10">
      <div className="container-x text-center">
        <p className="text-[15px] text-brand-muted">{copy.label}</p>
        <Link
          href={copy.href}
          className="mt-2 inline-flex text-[15px] font-semibold text-brand-green hover:text-[#19752B]"
        >
          {copy.link} →
        </Link>
      </div>
    </section>
  )
}
