import { readFile, writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

import { buildCgvPdfBytes } from "@/lib/documents/pdf-theme"

let cachedCgv: Buffer | null = null

/** PDF CGV pour pièce jointe devis (fichier public ou génération à la volée). */
export async function readCgvPdfBuffer(): Promise<Buffer> {
  if (cachedCgv) return cachedCgv
  const filePath = path.join(
    process.cwd(),
    "public",
    "documents",
    "cgv-core-environnement.pdf"
  )
  try {
    cachedCgv = await readFile(filePath)
    return cachedCgv
  } catch {
    cachedCgv = Buffer.from(buildCgvPdfBytes())
    return cachedCgv
  }
}

/** Régénère le fichier statique (npm script / déploiement). */
export async function writeCgvPdfToPublic(): Promise<void> {
  const outDir = path.join(process.cwd(), "public", "documents")
  const outFile = path.join(outDir, "cgv-core-environnement.pdf")
  await mkdir(outDir, { recursive: true })
  const buf = Buffer.from(buildCgvPdfBytes())
  await writeFile(outFile, buf)
  cachedCgv = buf
}