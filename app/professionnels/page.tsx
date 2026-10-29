import type { Metadata } from "next"

import { VitrineJsonLd } from "@/components/seo/vitrine-json-ld"
import { VitrineProfessionnelsHome } from "@/components/vitrine/vitrine-professionnels-home"
import { PROFESSIONNELS_HERO_VARIANT } from "@/lib/seo/landing-variants"
import { publicPageMetadata } from "@/lib/seo/public-page"
export const metadata: Metadata = publicPageMetadata(
  PROFESSIONNELS_HERO_VARIANT.title,
  PROFESSIONNELS_HERO_VARIANT.description,
  "/professionnels"
)

export default function ProfessionnelsPage() {
  return (
    <>
      <VitrineJsonLd />
      <VitrineProfessionnelsHome />
    </>
  )
}
