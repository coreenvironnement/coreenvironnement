import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import {
  DEPARTMENT_GUIDE_SLUGS,
  getDepartmentGuideCopy,
} from "../lib/seo/department-guides"
import { getDepartementPages, getLocalPageBySlug, getLocalPageCount } from "../lib/seo/local-pages"

const errors: string[] = []
const counts = getLocalPageCount()

if (counts.total !== 482 || counts.departements !== 8) {
  errors.push("Le nombre de routes SEO existantes a changé.")
}

if (DEPARTMENT_GUIDE_SLUGS.length !== 8) {
  errors.push("Les 8 guides départementaux doivent être définis.")
}

const deptSlugs = getDepartementPages().map((p) => p.slug).sort()
const guideSlugs = [...DEPARTMENT_GUIDE_SLUGS].sort()
if (deptSlugs.join(",") !== guideSlugs.join(",")) {
  errors.push("Les slugs guides ne couvrent pas tous les départements.")
}

for (const slug of DEPARTMENT_GUIDE_SLUGS) {
  const page = getLocalPageBySlug(slug)
  if (!page || page.type !== "departement") {
    errors.push(`${slug}: page département introuvable.`)
    continue
  }
  const copy = getDepartmentGuideCopy(page)
  if (!copy) {
    errors.push(`${slug}: copie du guide absente.`)
    continue
  }
  const blob = `${copy.title} ${copy.description} ${copy.lead} ${copy.tarif} ${copy.particuliers} ${copy.pose}`.toLowerCase()
  if (!copy.title.includes("dès 330 €") || /\bHT\b/.test(copy.title)) {
    errors.push(`${slug}: le titre doit afficher 330 € sans la mention HT.`)
  }
  if (!blob.includes("396")) {
    errors.push(`${slug}: le montant TTC payé doit rester indiqué.`)
  }
  if (!copy.description.toLowerCase().includes("330")) {
    errors.push(`${slug}: la description doit mentionner le prix d'entrée.`)
  }
  if (!blob.includes("ttc")) {
    errors.push(`${slug}: le montant TTC n’est pas indiqué.`)
  }
  if (blob.includes("autorisation est obligatoire")) {
    errors.push(`${slug}: affirmation d’autorisation obligatoire.`)
  }
}

const meaux = getLocalPageBySlug("meaux")
if (meaux && getDepartmentGuideCopy(meaux)) {
  errors.push("Le guide départemental ne doit pas s’afficher sur une page ville.")
}

const guideSource = readFileSync(
  resolve(process.cwd(), "components/vitrine/vitrine-department-guide.tsx"),
  "utf8",
)
const homeSource = readFileSync(
  resolve(process.cwd(), "components/vitrine/vitrine-home.tsx"),
  "utf8",
)

if (/<h1[\s>]/i.test(guideSource)) {
  errors.push("Le guide départemental ne doit ajouter aucun H1.")
}
if (!homeSource.includes('localSeoData?.type === "departement"')) {
  errors.push("Le guide départemental n’est pas branché sur les pages département.")
}

if (errors.length > 0) {
  console.error(errors.join("\n"))
  process.exit(1)
}

console.log("OK guide-departement 8 dept IDF")
