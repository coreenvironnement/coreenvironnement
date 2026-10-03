import { DEFAULT_VARIANT } from "@/lib/seo/landing-variants"
import {
  buildLocalChip,
  buildLocalDescription,
  buildLocalH1,
  buildLocalTitle,
} from "@/lib/seo/local-copy"
import {
  getAllLocalPageSlugs,
  getLocalPageBySlug,
  getLocalPageCount,
  localPageToSeoVariant,
} from "@/lib/seo/local-pages"

const LOCKED_HOME_FIELDS = ["intro", "h1Line2"] as const

export function assertLocalSeoParity() {
  const errors: string[] = []
  const slugs = getAllLocalPageSlugs()
  const count = getLocalPageCount()
  const unique = new Set(slugs)

  if (unique.size !== slugs.length) {
    errors.push("duplicate slugs")
  }

  for (const required of [
    "meaux",
    "77-seine-et-marne",
    "75-paris",
    "enlevement-gravats-meaux",
    "paris-1er",
  ]) {
    if (!unique.has(required)) {
      errors.push(`missing slug ${required}`)
    }
  }

  for (const slug of slugs) {
    const page = getLocalPageBySlug(slug)
    if (!page) {
      errors.push(`unresolved slug ${slug}`)
      continue
    }

    const variant = localPageToSeoVariant(page)

    for (const field of LOCKED_HOME_FIELDS) {
      if (variant[field] !== DEFAULT_VARIANT[field]) {
        errors.push(`${slug}: ${field} rewritten`)
      }
    }

    if (variant.h1Line1 !== buildLocalH1(page)) {
      errors.push(`${slug}: h1 not deterministic`)
    }
    if (variant.title !== buildLocalTitle(page)) {
      errors.push(`${slug}: title not deterministic`)
    }
    if (variant.description !== buildLocalDescription(page)) {
      errors.push(`${slug}: description not deterministic`)
    }
    if (variant.chipLabel !== buildLocalChip(page)) {
      errors.push(`${slug}: chip not deterministic`)
    }

    if (!variant.h1Line1.includes("Location de benne") || !variant.h1Line1.includes("intervention 24h")) {
      errors.push(`${slug}: h1 left homepage template`)
    }

    if (!variant.description.includes("Commande en 3 minutes")) {
      errors.push(`${slug}: description left homepage template`)
    }

    const commercialKeys = Object.keys(page).filter((key) =>
      ["title", "description", "h1Line1", "h1Line2", "intro", "chipLabel"].includes(key),
    )
    if (commercialKeys.length > 0) {
      errors.push(`${slug}: stored commercial fields ${commercialKeys.join(",")}`)
    }
  }

  return { ok: errors.length === 0, errors, count }
}
