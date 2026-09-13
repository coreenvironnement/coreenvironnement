import type { Metadata } from "next"

import { LegalPageShell } from "@/components/legal-page"
import { mentionsLegalesSections } from "@/lib/legal"

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site CORE ENVIRONNEMENT.",
}

export default function MentionsLegalesPage() {
  return (
    <LegalPageShell
      title="Mentions légales"
      intro="Informations légales relatives à l'édition et à l'hébergement du site CORE ENVIRONNEMENT."
      sections={mentionsLegalesSections}
    />
  )
}
