import { buildHeroImageAlt } from "@/lib/media/site-images"
import { getDefaultSeoVariant, type SeoVariant } from "@/lib/seo/landing-variants"
import type { LocalPage } from "@/lib/seo/local-copy"
import { localPageToSeoVariant } from "@/lib/seo/local-pages"

import { HeroBackdropImage } from "./hero-backdrop-image"
import { VitrineHomeClient } from "./vitrine-home-client"

export function VitrineHome({
  orderParam,
  seoVariant,
  localSeoData,
  hubPage,
}: {
  orderParam?: string
  seoVariant?: SeoVariant
  localSeoData?: LocalPage
  hubPage?: boolean
}) {
  const variant = localSeoData
    ? localPageToSeoVariant(localSeoData)
    : (seoVariant ?? getDefaultSeoVariant())

  const heroBackdrop = (
    <HeroBackdropImage
      alt={buildHeroImageAlt(localSeoData)}
      isParticulier
    />
  )

  return (
    <VitrineHomeClient
      orderParam={orderParam}
      seoVariant={variant}
      localSeoData={localSeoData}
      hubPage={hubPage}
      heroBackdrop={heroBackdrop}
    />
  )
}