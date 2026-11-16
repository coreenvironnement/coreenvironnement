/**
 * Layout du header vitrine compact (module sans "use client" : importable depuis
 * les composants serveur — guides, article).
 *
 * La hauteur réelle est portée par `--vitrine-header-height` (app/vitrine.css) :
 * ≈ 57px mobile / ≈ 64.6px desktop. Tout offset doit en dériver.
 */

/** Hero plein écran sous le header fixe (home, locales, hub, pro). */
export const VITRINE_HEADER_TOTAL_OFFSET_CLASS =
  "pt-[calc(var(--vitrine-header-height)+1rem)]"

/** Pages de contenu sur fond clair (guides, article, pages publiques). */
export const VITRINE_HEADER_CONTENT_OFFSET_CLASS =
  "pt-[calc(var(--vitrine-header-height)+1.25rem)]"

/**
 * VitrinePublicShell (login, inscription, /pro…) : le `main` compense déjà le header
 * fixe ; les sections auth ajoutent leur propre `pt-*` — éviter le double vide sur mobile.
 */
export const VITRINE_HEADER_AUTH_OFFSET_CLASS =
  "pt-[var(--vitrine-header-height)] sm:pt-[calc(var(--vitrine-header-height)+0.75rem)] lg:pt-[calc(var(--vitrine-header-height)+1.25rem)]"

/** Sections ancrées d’un guide / article (sans padding vertical propre). */
export const VITRINE_SCROLL_MARGIN_CLASS =
  "scroll-mt-[calc(var(--vitrine-header-height)+1rem)]"
