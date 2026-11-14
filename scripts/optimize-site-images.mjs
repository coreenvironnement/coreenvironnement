/**
 * Génère les WebP descriptifs à partir des sources public/images.
 * Usage: node scripts/optimize-site-images.mjs
 */
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const imgDir = path.join(root, "public", "images")
const vitrineScroll = path.join(root, "public", "vitrine-scroll")

/** @type {Array<{ from: string; to: string; maxWidth?: number; quality?: number }>} */
const JOBS = [
  {
    from: "hero-paris-truck-mobile.png",
    to: "location-benne-camion-idf-hero-mobile.webp",
    maxWidth: 1200,
    quality: 82,
  },
  {
    from: "hero-paris-truck-desktop.png",
    to: "location-benne-camion-idf-hero-desktop.webp",
    maxWidth: 2400,
    quality: 82,
  },
  { from: "../vitrine-scroll/benne-vide.png", to: "parcours-etape-01-choix-dechets-benne-vide.webp", maxWidth: 800 },
  { from: "parcours-etape-2.png", to: "parcours-etape-02-camion-depose-benne.webp", maxWidth: 800 },
  { from: "parcours-etape-3.png", to: "parcours-etape-03-benne-remplie-gravats.webp", maxWidth: 800 },
  { from: "parcours-etape-4.png", to: "parcours-etape-04-enlevement-porte-benne.webp", maxWidth: 800 },
  {
    from: "Benne à gravats verte, vue trois-quarts-2.png",
    to: "benne-gravats-vert-vue-trois-quarts.webp",
    maxWidth: 560,
  },
  {
    from: "Ampoule verte pour choisir la benne-1.png",
    to: "illustration-choix-volume-benne-ampoule.webp",
    maxWidth: 224,
  },
  {
    from: "Combiné téléphonique vert stylisé-1.png",
    to: "illustration-contact-telephone-estimation-volume.webp",
    maxWidth: 224,
  },
  {
    from: "Tas rectangulaire de gravats de chantier-2.png",
    to: "volume-estimateur-tas-gravats-rectangulaire.webp",
    maxWidth: 640,
  },
  {
    from: "Tas de gravats de chantier-1.png",
    to: "volume-estimateur-tas-gravats-irregulier.webp",
    maxWidth: 640,
  },
  {
    from: "Big bag rempli de gravats-3.png",
    to: "volume-estimateur-big-bag-gravats.webp",
    maxWidth: 640,
  },
  {
    from: "Déchets inertes acceptés.png",
    to: "dechets-inertes-acceptes-gravats-sprite.webp",
    maxWidth: 1200,
  },
  {
    from: "Tas de gravats de rénovation résidentielle-3_5.webp",
    to: "tunnel-dechets-tas-gravats-renovation.webp",
    maxWidth: 640,
  },
  {
    from: "Grand débarras de meubles à domicile-1_1.webp",
    to: "tunnel-dechets-debarras-meubles-domicile.webp",
    maxWidth: 640,
  },
  {
    from: "Grand tas de déchets verts-5_3.webp",
    to: "tunnel-dechets-verts-jardin.webp",
    maxWidth: 640,
  },
  {
    from: "Grand tas de déchets de rénovation-4_2.webp",
    to: "tunnel-dechets-travaux-melange.webp",
    maxWidth: 640,
  },
  {
    from: "Tas de terre excavée au jardin-6_6.webp",
    to: "tunnel-dechets-terre-excavee-jardin.webp",
    maxWidth: 640,
  },
  {
    from: "Tas de bois de rénovation résidentielle-2_4.webp",
    to: "tunnel-dechets-bois-renovation.webp",
    maxWidth: 640,
  },
  { from: "core-benne-8m3.webp", to: "location-benne-8m3.webp", maxWidth: 640 },
  { from: "core-benne-10m3.webp", to: "location-benne-10m3.webp", maxWidth: 640 },
  { from: "core-benne-15m3.webp", to: "location-benne-15m3.webp", maxWidth: 640 },
  { from: "core-benne-20m3.webp", to: "location-benne-20m3.webp", maxWidth: 640 },
  { from: "core-benne-30m3.webp", to: "location-benne-30m3.webp", maxWidth: 640 },
  { from: "core-icone-suivi.webp", to: "core-icone-suivi-livraison-benne.webp", maxWidth: 352 },
  { from: "core-icone-prix.webp", to: "core-icone-prix-location-benne.webp", maxWidth: 352 },
  { from: "core-icone-valorisation.webp", to: "core-icone-valorisation-dechets.webp", maxWidth: 352 },
]

async function resolveInput(rel) {
  if (rel.startsWith("../vitrine-scroll/")) {
    return path.join(vitrineScroll, path.basename(rel.replace("../vitrine-scroll/", "")))
  }
  return path.join(imgDir, rel)
}

async function convert(job) {
  const input = await resolveInput(job.from)
  const output = path.join(imgDir, job.to)
  const quality = job.quality ?? 80
  let pipeline = sharp(input)
  const meta = await pipeline.metadata()
  if (job.maxWidth && meta.width && meta.width > job.maxWidth) {
    pipeline = pipeline.resize({ width: job.maxWidth, withoutEnlargement: true })
  }
  await pipeline.webp({ quality, effort: 4 }).toFile(output)
  const inStat = await fs.stat(input)
  const outStat = await fs.stat(output)
  return {
    from: job.from,
    to: job.to,
    inputBytes: inStat.size,
    outputBytes: outStat.size,
  }
}

const results = []
for (const job of JOBS) {
  try {
    results.push(await convert(job))
    console.log(`OK ${job.to}`)
  } catch (e) {
    console.error(`FAIL ${job.from}:`, e.message)
  }
}

const reportPath = path.join(root, "docs", "image-optimize-run.json")
await fs.writeFile(reportPath, JSON.stringify(results, null, 2))
console.log(`Wrote ${reportPath} (${results.length} files)`)
