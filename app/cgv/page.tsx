import type { Metadata } from "next"

import { LegalPageShell } from "@/components/legal-page"
import { cgvSections } from "@/lib/legal"
import { publicPageMetadata } from "@/lib/seo/public-page"

export const metadata: Metadata = publicPageMetadata(
  "Conditions Générales de Vente",
  "Conditions Générales de Vente de CORE ENVIRONNEMENT — location de bennes et gestion des déchets en Île-de-France.",
  "/cgv",
)

export default function CgvPage() {
  return (
    <LegalPageShell
      title="Conditions Générales de Vente"
      intro="Les présentes Conditions Générales de Vente régissent les prestations organisées par CORE ENVIRONNEMENT pour le compte de ses Clients."
      sections={cgvSections}
    />
  )
}
