import type { Metadata } from "next"

import { LegalPageShell } from "@/components/legal-page"
import { politiqueConfidentialiteSections } from "@/lib/legal"

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et protection des données — CORE ENVIRONNEMENT.",
}

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPageShell
      title="Politique de confidentialité"
      intro="Cette page décrit comment CORE ENVIRONNEMENT traite vos données personnelles dans le cadre de ses services de location de bennes et de l'espace client."
      sections={politiqueConfidentialiteSections}
    />
  )
}
