import type { Metadata } from "next"

import { LegalPageShell } from "@/components/legal-page"
import { mentionsLegalesSections } from "@/lib/legal"
import { publicPageMetadata } from "@/lib/seo/public-page"

export const metadata: Metadata = publicPageMetadata(
  "Mentions légales",
  "Mentions légales du site CORE ENVIRONNEMENT.",
  "/mentions-legales",
)

export default function MentionsLegalesPage() {
  return (
    <LegalPageShell
      title="Mentions légales"
      intro="Informations légales relatives à l'édition et à l'hébergement du site CORE ENVIRONNEMENT."
      sections={mentionsLegalesSections}
    />
  )
}
