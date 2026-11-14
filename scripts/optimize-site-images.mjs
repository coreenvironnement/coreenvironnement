/**
 * Génère les WebP descriptifs à partir des sources public/images.
 * Usage: node scripts/optimize-site-images.mjs
 * Code de sortie 0 si tout OK, 1 si au moins un échec.
 */
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const imgDir = path.join(root, "public", "images")
const vitrineScroll = path.join(root, "public", "vitrine-scroll")

/** @type {Array<{ from: string; to: string; maxWidth?: number; quality?: number; mode?: 'encode' | 'copy' }>} */
export const JOBS = [
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
  {
    from: "../vitrine-scroll/benne-vide.png",
    to: "parcours-etape-01-choix-dechets-benne-vide.webp",
    maxWidth: 800,
  },
  {
    from: "parcours-etape-2.png",
    to: "parcours-etape-02-camion-depose-benne.webp",
    maxWidth: 800,
  },
  {
    from: "parcours-etape-3.png",
    to: "parcours-etape-03-benne-remplie-gravats.webp",
    maxWidth: 800,
  },
  {
    from: "parcours-etape-4.png",
    to: "parcours-etape-04-enlevement-porte-benne.webp",
    maxWidth: 800,
  },
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
    mode: "copy",
  },
  {
    from: "Grand débarras de meubles à domicile-1_1.webp",
    to: "tunnel-dechets-debarras-meubles-domicile.webp",
    mode: "copy",
  },
  {
    from: "Grand tas de déchets verts-5_3.webp",
    to: "tunnel-dechets-verts-jardin.webp",
    mode: "copy",
  },
  {
    from: "Grand tas de déchets de rénovation-4_2.webp",
    to: "tunnel-dechets-travaux-melange.webp",
    mode: "copy",
  },
  {
    from: "Tas de terre excavée au jardin-6_6.webp",
    to: "tunnel-dechets-terre-excavee-jardin.webp",
    mode: "copy",
  },
  {
    from: "Tas de bois de rénovation résidentielle-2_4.webp",
    to: "tunnel-dechets-bois-renovation.webp",
    mode: "copy",
  },
  { from: "core-benne-8m3.webp", to: "location-benne-8m3.webp", mode: "copy" },
  { from: "core-benne-10m3.webp", to: "location-benne-10m3.webp", mode: "copy" },
  { from: "core-benne-15m3.webp", to: "location-benne-15m3.webp", mode: "copy" },
  { from: "core-benne-20m3.webp", to: "location-benne-20m3.webp", mode: "copy" },
  { from: "core-benne-30m3.webp", to: "location-benne-30m3.webp", mode: "copy" },
  {
    from: "core-icone-suivi.webp",
    to: "core-icone-suivi-livraison-benne.webp",
    mode: "copy",
  },
  {
    from: "core-icone-prix.webp",
    to: "core-icone-prix-location-benne.webp",
    mode: "copy",
  },
  {
    from: "core-icone-valorisation.webp",
    to: "core-icone-valorisation-dechets.webp",
    mode: "copy",
  },
]

async function resolveInput(rel) {
  if (rel.startsWith("../vitrine-scroll/")) {
    return path.join(
      vitrineScroll,
      path.basename(rel.replace("../vitrine-scroll/", "")),
    )
  }
  return path.join(imgDir, rel)
}

function publicLegacyPath(job) {
  if (job.from.startsWith("../vitrine-scroll/")) {
    return `/vitrine-scroll/${path.basename(job.from.replace("../vitrine-scroll/", ""))}`
  }
  return `/images/${job.from}`
}

/**
 * @param {{ from: string; to: string; maxWidth?: number; quality?: number }} job
 */
async function processJob(job) {
  const input = await resolveInput(job.from)
  const output = path.join(imgDir, job.to)
  const quality = job.quality ?? 80

  const inStat = await fs.stat(input)
  const meta = await sharp(input).metadata()
  const inputFormat = (meta.format ?? "").toLowerCase()
  const needsResize =
    Boolean(job.maxWidth) && meta.width && meta.width > job.maxWidth

  let mode = "webp-encode"
  if (job.mode === "copy" || (inputFormat === "webp" && !needsResize)) {
    await fs.copyFile(input, output)
    mode = job.mode === "copy" ? "copy" : "copy-webp"
  } else {
    let pipeline = sharp(input)
    if (needsResize) {
      pipeline = pipeline.resize({ width: job.maxWidth, withoutEnlargement: true })
    }
    await pipeline.webp({ quality, effort: 4 }).toFile(output)
    const outStatAfterEncode = await fs.stat(output)
    if (
      inputFormat === "webp" &&
      outStatAfterEncode.size > inStat.size * 1.02
    ) {
      await fs.copyFile(input, output)
      mode = "copy-webp-fallback-size"
    }
  }

  const outMeta = await sharp(output).metadata()
  const outStat = await fs.stat(output)

  const okFormat = outMeta.format === "webp"
  const okDimensions =
    outMeta.width > 0 &&
    outMeta.height > 0 &&
    (job.mode === "copy" ||
      !needsResize ||
      (outMeta.width && job.maxWidth && outMeta.width <= job.maxWidth))

  if (!okFormat || !okDimensions) {
    throw new Error(
      `Validation failed format=${outMeta.format} ${outMeta.width}x${outMeta.height}`,
    )
  }

  return {
    from: job.from,
    to: job.to,
    legacyPath: publicLegacyPath(job),
    mode,
    inputBytes: inStat.size,
    outputBytes: outStat.size,
    inputWidth: meta.width,
    inputHeight: meta.height,
    outputWidth: outMeta.width,
    outputHeight: outMeta.height,
    status: "ok",
  }
}

const successes = []
const failures = []

for (const job of JOBS) {
  try {
    const row = await processJob(job)
    successes.push(row)
    console.log(
      `OK  ${job.to}  [${row.mode}]  ${row.inputWidth}x${row.inputHeight} → ${row.outputWidth}x${row.outputHeight}  ${row.inputBytes} → ${row.outputBytes} o`,
    )
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    failures.push({
      from: job.from,
      to: job.to,
      legacyPath: publicLegacyPath(job),
      status: "fail",
      error: err,
    })
    console.error(`FAIL ${job.from} → ${job.to}: ${err}`)
  }
}

const report = {
  ranAt: new Date().toISOString(),
  total: JOBS.length,
  ok: successes.length,
  failed: failures.length,
  successes,
  failures,
}

const reportPath = path.join(root, "docs", "image-optimize-run.json")
await fs.writeFile(reportPath, JSON.stringify(report, null, 2))

console.log("\n--- Bilan ---")
console.log(`Total: ${report.total} | OK: ${report.ok} | Échecs: ${report.failed}`)
console.log(`Rapport: ${reportPath}`)

if (failures.length > 0) {
  process.exit(1)
}