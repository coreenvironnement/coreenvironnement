import { buildHeroImageAlt } from "@/lib/media/site-images"
import { getDefaultSeoVariant, type SeoVariant } from "@/lib/seo/landing-variants"
import type { LocalPage } from "@/lib/seo/local-copy"
import { localPageToSeoVariant } from "@/lib/seo/local-pages"

import type { OrderDemoMode } from "@/lib/order/dev-order-demo"

import { HeroBackdropImage } from "./hero-backdrop-image"
import { VitrineHomeClient } from "./vitrine-home-client"

export function VitrineHome({
  orderParam,
  repriseToken,
  orderDemo,
  seoVariant,
  localSeoData,
  hubPage,
}: {
  orderParam?: string
  repriseToken?: string
  orderDemo?: OrderDemoMode | null
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
      repriseToken={repriseToken}
      orderDemo={orderDemo}
      seoVariant={variant}
      localSeoData={localSeoData}
      hubPage={hubPage}
      heroBackdrop={heroBackdrop}
    />
  )
}