/**
 * Vérifie que le sprite gravats 8 m³ conserve le ratio 3 bandes (CSS backgroundSize 300%).
 */
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const imgDir = path.join(root, "public", "images")

const source = path.join(imgDir, "Déchets inertes acceptés.png")
const output = path.join(
  imgDir,
  "dechets-inertes-acceptes-gravats-sprite.webp",
)

const [srcMeta, outMeta] = await Promise.all([
  sharp(source).metadata(),
  sharp(output).metadata(),
])

const srcRatio = (srcMeta.width ?? 0) / (srcMeta.height ?? 0)
const outRatio = (outMeta.width ?? 0) / (outMeta.height ?? 0)
const ratioDelta = Math.abs(srcRatio - outRatio)

const srcPanelW = (srcMeta.width ?? 0) / 3
const outPanelW = (outMeta.width ?? 0) / 3

console.log("Source PNG:", `${srcMeta.width}x${srcMeta.height}`, "ratio", srcRatio.toFixed(4))
console.log("Sprite WebP:", `${outMeta.width}x${outMeta.height}`, "ratio", outRatio.toFixed(4))
console.log("Largeur bandeau (1/3):", `${srcPanelW.toFixed(1)} → ${outPanelW.toFixed(1)} px`)
console.log(
  "CSS inchangé (backgroundSize 300%, positions 0/50/100%) :",
  ratioDelta < 0.01 ? "OK (ratio préservé)" : "ATTENTION ratio différent",
)

if (ratioDelta >= 0.01 || outMeta.format !== "webp") {
  process.exit(1)
}