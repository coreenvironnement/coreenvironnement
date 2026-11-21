/**
 * Lotties « Comment ça marche » (pro home, #fonctionnement).
 * Composition 120×120, lecture unique à l’apparition + SVG statique (réduction de mouvement).
 */
export type CommentMarcheLottieAsset = {
  json: string
  static: string
}

export const COMMENT_MARCHE_LOTTIE = {
  exempleDemande: {
    json: "/images/comment-marche/ex-demande.json",
    static: "/images/comment-marche/ex-demande.svg",
  },
  documentsSync: {
    json: "/images/comment-marche/docs-sync.json",
    static: "/images/comment-marche/docs-sync.svg",
  },
} satisfies Record<string, CommentMarcheLottieAsset>