import { DEFAULT_VARIANT } from "../lib/seo/landing-variants"
import {
  buildLocalDescription,
  buildLocalH1,
  buildLocalTitle,
} from "../lib/seo/local-copy"
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
  ["title meaux", buildLocalTitle(meaux) === "Location de benne à Meaux (77)"],
  [
    "h1 meaux",
    buildLocalH1(meaux) === "Location de benne à Meaux : intervention 24h & suivi digital",
  ],
  [
    "desc meaux",
    buildLocalDescription(meaux) ===
      "Location de bennes à Meaux et la Seine-et-Marne. Commande en 3 minutes, intervention sous 24 h, suivi digital et traçabilité de vos déchets.",
  ],
  ["intro homepage", DEFAULT_VARIANT.intro.length > 0],
]

const paris = getLocalPageBySlug("75-paris")
if (!paris || buildLocalTitle(paris) !== "Location de benne à Paris (75)") {
  checks.push(["title paris", false])
}

const longtail = getLocalPageBySlug("enlevement-gravats-meaux")
if (!longtail || buildLocalTitle(longtail) !== buildLocalTitle(meaux)) {
  checks.push(["longtail parent", false])
}

const failed = checks.filter(([, ok]) => !ok)
if (failed.length > 0) {
  console.error(failed.map(([name]) => name).join("\n"))
  process.exit(1)
}

console.log(
  `OK pages=${result.count.total} depts=${result.count.departements} villes=${result.count.villes} longtail=${result.count.longtail}`,
)
