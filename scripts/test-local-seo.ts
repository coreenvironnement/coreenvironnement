import { DEFAULT_VARIANT } from "../lib/seo/landing-variants"
import {
  buildLocalDescription,
  buildLocalH1,
  buildLocalTitle,
} from "../lib/seo/local-copy"
import { buildLongtailTitle } from "../lib/seo/longtail-seo"
import { getLocalPageBySlug } from "../lib/seo/local-pages"
import { assertLocalSeoParity } from "../lib/seo/local-seo-parity"

const result = assertLocalSeoParity()
if (!result.ok) {
  console.error(result.errors.join("\n"))
  process.exit(1)
}

const meaux = getLocalPageBySlug("meaux")
if (!meaux) {
  console.error("meaux missing")
  process.exit(1)
}

const checks: Array<[string, boolean]> = [
  [
    "title meaux",
    buildLocalTitle(meaux) === "Location de benne à Meaux (77) · tarif en ligne",
  ],
  [
    "h1 meaux",
    buildLocalH1(meaux) ===
      "Location de benne au meilleur prix : livraison rapide 24 h à Meaux",
  ],
  [
    "desc meaux",
    buildLocalDescription(meaux) ===
      "Location de bennes à Meaux et la Seine-et-Marne. Dès 330 € HT, tarif selon adresse et déchet, commande en 2 minutes, livraison rapide sous 24 h.",
  ],
  ["intro homepage", DEFAULT_VARIANT.intro.length > 0],
]

const paris = getLocalPageBySlug("75-paris")
if (
  !paris ||
  buildLocalTitle(paris) !== "Location de benne à Paris dès 330 € HT · livraison 24 h"
) {
  checks.push(["title paris dept", false])
}

const longtail = getLocalPageBySlug("enlevement-gravats-meaux")
if (
  !longtail ||
  buildLongtailTitle(longtail) !== "Enlèvement gravats Meaux · benne et tarif en ligne"
) {
  checks.push(["longtail meaux title", false])
}

const failed = checks.filter(([, ok]) => !ok)
if (failed.length > 0) {
  console.error(failed.map(([name]) => name).join("\n"))
  process.exit(1)
}

console.log(
  `OK pages=${result.count.total} depts=${result.count.departements} villes=${result.count.villes} longtail=${result.count.longtail}`,
)
