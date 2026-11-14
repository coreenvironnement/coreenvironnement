/**
 * Aplati chaque poster SVG (image positionnée dans le viewBox) en WebP + SVG mince.
 * Usage: node scripts/optimize-preparation-posters.mjs
 */
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const posterDir = path.join(root, "public", "images", "core-preparation-pack", "posters")
const reportPath = path.join(root, "docs", "preparation-posters-optimize.json")

/** Comparaison sur pixels visibles (alpha > 0 dans la référence). */
/** @param {Buffer} a @param {Buffer} b */
function pixelDiffStats(a, b) {
  if (a.length !== b.length) {
    return { identical: false, maxDelta: 255, meanDelta: 255, differingPixels: -1 }
  }
  let sum = 0
  let max = 0
  let diff = 0
  let visible = 0
  for (let i = 0; i < a.length; i += 4) {
    if (a[i + 3] === 0 && b[i + 3] === 0) continue
    visible++
    let d = 0
    for (let c = 0; c < 4; c++) {
      d = Math.max(d, Math.abs(a[i + c] - b[i + c]))
    }
    if (d > 0) diff++
    max = Math.max(max, d)
    sum += d
  }
  return {
    identical: diff === 0,
    maxDelta: max,
    meanDelta: visible ? sum / visible : 0,
    differingPixels: diff,
    totalPixels: visible,
  }
}

async function extractEmbeddedWebp(svgText) {
  const m =
    svgText.match(/href="(data:image\/webp;base64,[^"]+)"/) ??
    svgText.match(/xlink:href="(data:image\/webp;base64,[^"]+)"/)
  if (!m) throw new Error("data:image/webp introuvable")
  return Buffer.from(m[1].replace(/^data:image\/webp;base64,/, ""), "base64")
}

function parseImageAttrs(svgText) {
  const viewBox = svgText.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 800 400"
  const [, , w, h] = viewBox.split(/\s+/).map(Number)
  const attrStr =
    svgText.match(/<image\s+([^>]+?)href="data:image\/webp/)?.[1] ?? ""
  const num = (key) => {
    const m = attrStr.match(new RegExp(`${key}="([^"]+)"`))
    return m ? Number(m[1]) : 0
  }
  return {
    viewW: w,
    viewH: h,
    x: num("x"),
    y: num("y"),
    imgW: num("width"),
    imgH: num("height"),
  }
}

async function flattenPoster(svgText) {
  const { viewW, viewH, x, y, imgW, imgH } = parseImageAttrs(svgText)
  const embedded = await extractEmbeddedWebp(svgText)
  const rw = Math.round(imgW)
  const rh = Math.round(imgH)
  const full = await sharp(embedded).resize(rw, rh, { fit: "fill" }).ensureAlpha().raw().toBuffer()

  const flat = Buffer.alloc(viewW * viewH * 4, 0)
  const ix = Math.round(x)
  const iy = Math.round(y)

  for (let row = 0; row < viewH; row++) {
    for (let col = 0; col < viewW; col++) {
      const sx = col - ix
      const sy = row - iy
      if (sx < 0 || sy < 0 || sx >= rw || sy >= rh) continue
      const src = (sy * rw + sx) * 4
      const dst = (row * viewW + col) * 4
      flat[dst] = full[src]
      flat[dst + 1] = full[src + 1]
      flat[dst + 2] = full[src + 2]
      flat[dst + 3] = full[src + 3]
    }
  }

  const flatPng = await sharp(flat, {
    raw: { width: viewW, height: viewH, channels: 4 },
  })
    .png()
    .toBuffer()

  return { flat: flatPng, flatRaw: flat, viewW, viewH, embeddedBytes: embedded.length }
}

async function encodeWebp(flatPng) {
  const reference = await sharp(flatPng).ensureAlpha().raw().toBuffer()
  const qualities = [90, 88, 85, 82, 80, 78, 76, 74, 72, 70, 68, 65, 62, 60, 58, 55]

  /** @type {Array<{ quality: number | string; bytes: number; buf: Buffer; maxDelta: number; meanDelta: number }>} */
  const candidates = []

  for (const quality of qualities) {
    const out = await sharp(flatPng)
      .webp({ quality, alphaQuality: quality, effort: 6 })
      .toBuffer()
    const decoded = await sharp(out).ensureAlpha().raw().toBuffer()
    const stats = pixelDiffStats(reference, decoded)
    if (stats.maxDelta <= 12 && stats.meanDelta <= 1.2) {
      candidates.push({
        quality,
        bytes: out.length,
        buf: out,
        maxDelta: stats.maxDelta,
        meanDelta: stats.meanDelta,
        differingPixels: stats.differingPixels,
      })
    }
  }

  if (candidates.length) {
    candidates.sort((a, b) => a.bytes - b.bytes)
    return candidates[0]
  }

  const lossless = await sharp(flatPng).webp({ lossless: true, effort: 6 }).toBuffer()
  const decoded = await sharp(lossless).ensureAlpha().raw().toBuffer()
  const stats = pixelDiffStats(reference, decoded)
  return {
    quality: "lossless",
    bytes: lossless.length,
    buf: lossless,
    ...stats,
  }
}

async function main() {
  const ids = ["01-volume", "02-acces", "03-dechets"]
  const report = { date: new Date().toISOString(), posters: [] }

  for (const id of ids) {
    const svgPath = path.join(posterDir, `${id}.svg`)
    const webpPath = path.join(posterDir, `${id}-poster.webp`)
    const svgBefore = await fs.readFile(svgPath)
    const svgText = svgBefore.toString("utf8")

    const { flat, flatRaw, viewW, viewH, embeddedBytes } = await flattenPoster(svgText)
    const encoded = await encodeWebp(flat)
    await fs.writeFile(webpPath, encoded.buf)

    const thinSvg =
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${viewW} ${viewH}">` +
      `<image xlink:href="${id}-poster.webp" width="${viewW}" height="${viewH}"/></svg>\n`
    await fs.writeFile(svgPath, thinSvg)

    const embeddedOnly = embeddedBytes
    const totalAfter = thinSvg.length + encoded.bytes

    report.posters.push({
      id,
      viewBox: `${viewW}x${viewH}`,
      embeddedWebpBytes: embeddedOnly,
      flattenedPngBytes: flat.length,
      outputWebpBytes: encoded.bytes,
      quality: encoded.quality,
      pixelDiff: {
        maxDelta: encoded.maxDelta,
        meanDelta: Number(encoded.meanDelta.toFixed(4)),
        differingPixels: encoded.differingPixels ?? 0,
      },
      svgBytesBefore: svgBefore.length,
      svgBytesAfter: thinSvg.length,
      totalBytesBefore: svgBefore.length,
      totalBytesAfter: totalAfter,
      savedBytes: svgBefore.length - totalAfter,
      savedPercent: Number(
        (((svgBefore.length - totalAfter) / svgBefore.length) * 100).toFixed(1)
      ),
    })
  }

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})