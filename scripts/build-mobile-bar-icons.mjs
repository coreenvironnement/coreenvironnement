import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

const OUT_DIR = path.join(process.cwd(), "public", "images", "mobile-bar")

const SOURCES = [
  {
    name: "mon-compte",
    src: "C:/Users/redaa/.cursor/projects/c-Users-redaa-Projects-coreenvironnement/assets/Ic_ne_profil_vert_et_bleu_marine-3-e459da9b-22e3-4d9e-b624-86d7ba58f3ad.png",
  },
  {
    name: "commander-benne",
    src: "C:/Users/redaa/.cursor/projects/c-Users-redaa-Projects-coreenvironnement/assets/Benne_ouverte_de_chantier-1-bc1b8717-0e3f-45aa-afaf-d3cf9e83f1b4.png",
    whiteVariant: true,
  },
  {
    name: "estimer-volume",
    src: "C:/Users/redaa/.cursor/projects/c-Users-redaa-Projects-coreenvironnement/assets/Cube_isom_trique_de_volume-4-061815e1-22e1-4c68-8b1c-4825558a957d.png",
  },
  {
    name: "appeler",
    src: "C:/Users/redaa/.cursor/projects/c-Users-redaa-Projects-coreenvironnement/assets/Combin__t_l_phonique_vert_minimaliste-2-9c51fa84-cd59-4692-a575-8035d7fd3113.png",
  },
]

async function rasterWithTransparentBg(input, { white = false } = {}) {
  const trimmed = sharp(input).trim({ threshold: 14 }).ensureAlpha()
  const { data, info } = await trimmed.raw().toBuffer({ resolveWithObject: true })
  const pixels = new Uint8Array(data)

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    if (r < 28 && g < 28 && b < 28) {
      pixels[i + 3] = 0
      continue
    }
    if (white && pixels[i + 3] > 0) {
      pixels[i] = 255
      pixels[i + 1] = 255
      pixels[i + 2] = 255
    }
  }

  return sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
}

async function exportSizes(base, fileBase) {
  const stats = []
  for (const size of [48, 64]) {
    const outPath = path.join(OUT_DIR, `${fileBase}${size === 48 ? "-48" : ""}.webp`)
    await base
      .clone()
      .resize(size - 8, size - 8, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .extend({
        top: 4,
        bottom: 4,
        left: 4,
        right: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 92, alphaQuality: 100 })
      .toFile(outPath)

    const { size: bytes } = fs.statSync(outPath)
    stats.push({ file: path.basename(outPath), size, bytes })
  }
  return stats
}

fs.mkdirSync(OUT_DIR, { recursive: true })

const report = []

for (const item of SOURCES) {
  const base = await rasterWithTransparentBg(item.src)
  const mainStats = await exportSizes(base, item.name)
  report.push(...mainStats.map((s) => ({ ...s, name: item.name, variant: "couleur" })))

  if (item.whiteVariant) {
    const whiteBase = await rasterWithTransparentBg(item.src, { white: true })
    const whiteStats = await exportSizes(whiteBase, `${item.name}-white`)
    report.push(...whiteStats.map((s) => ({ ...s, name: item.name, variant: "blanc" })))
  }
}

console.log(JSON.stringify(report, null, 2))