import { buildHeroImageAlt } from "@/lib/media/site-images"

import { HeroBackdropImage } from "./hero-backdrop-image"
import { VitrineProfessionnelsHomeClient } from "./vitrine-professionnels-home-client"

export function VitrineProfessionnelsHome() {
  const heroBackdrop = (
    <HeroBackdropImage alt={buildHeroImageAlt()} isParticulier={false} />
  )

  return <VitrineProfessionnelsHomeClient heroBackdrop={heroBackdrop} />
}