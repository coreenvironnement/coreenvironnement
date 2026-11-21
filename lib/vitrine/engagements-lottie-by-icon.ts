/**
 * Pack premium « Nos engagements » (`core-environnement-3-lotties-premium`).
 * Composition 160×160, JSON ~9–11 Ko + SVG statique pour `prefers-reduced-motion`.
 *
 * Carte → source ZIP → URL publique
 * 1. Réactivité   → 01-reactivite-benne.*
 * 2. Organisation → 02-organisation-livraison.*
 * 3. Justificatifs → 03-justificatifs-tracabilite.*
 *
 * a11y : icônes décoratives (`EngagementsCardLottie` → `aria-hidden`) ; le sens est porté par label / titre / texte de carte.
 */
export type EngagementsLottieAsset = {
  json: string
  static: string
}

export const ENGAGEMENTS_LOTTIE_BY_ICON: Record<string, EngagementsLottieAsset> = {
  reactivite: {
    json: "/images/engagements/reactivite.json",
    static: "/images/engagements/reactivite.svg",
  },
  organisation: {
    json: "/images/engagements/organisation.json",
    static: "/images/engagements/organisation.svg",
  },
  justificatifs: {
    json: "/images/engagements/justificatifs.json",
    static: "/images/engagements/justificatifs.svg",
  },
}