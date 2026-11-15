# Bilan lot 1 — optimisation hero (LCP / art direction)

## Vérifications pré-publication

| Contrôle | Résultat |
|----------|----------|
| **Desktop** — une seule variante hero | OK (LH local desktop : **desktop uniquement**, `heroPreloads: []`) |
| **Mobile** — une seule variante hero | OK (LH local mobile : **mobile uniquement**, pas de desktop, pas de preload `<link>` hero) |
| **HTML desktop** — pas de `rel=preload` hero | OK (aucun preload hero dans le `<head>` après build) |
| **Timeout LH local** | **Reproduit aussi sur prod actuelle** (`waitFor: Timed out waiting for page load`) + erreur TBT `NO_TTI_CPU_IDLE_PERIOD` sur 2/3 runs prod → **limitation LH + charge JS**, pas régression applicative ; `next start` démarre sans erreur |
| **Hero + formulaire** | OK accueil + `/location-benne/meaux` (mobile & desktop), ouverture tunnel étape 1 |

---

## Méthode mesure prod (avant déploiement)

- **Outil** : Lighthouse **13.6.0** CLI
- **URL** : `https://core-environnement.fr/`
- **Preset** : `--preset=perf --only-categories=performance`
- **Mobile** : `--form-factor=mobile --screenEmulation.mobile --screenEmulation.width=412 --screenEmulation.height=823 --throttling.cpuSlowdownMultiplier=4`
- **Fichiers** : `lighthouse-hero-before.json`, `lighthouse-hero-before-prod-2.json`, `lighthouse-hero-before-prod-3.json`

### Médianes **avant** (prod, 3 runs)

| Métrique | Médiane | Détail |
|----------|---------|--------|
| **LCP** | **6,53 s** | [5,64 / 6,53 / 7,14] s |
| **FCP** | **6,10 s** | [1,47 / 6,10 / 6,79] s (run 1 anormalement bas) |
| **TBT** | **1,73 s** | Valeur fiable sur **1/3** runs ; 2/3 → `NO_TTI_CPU_IDLE_PERIOD` |
| **CLS** | **0** | |

### Images hero **avant** (mobile, prod)

Sur **chaque** run : **mobile** (High, preload) **+ desktop** (Low, preload) ≈ **86 + 42 Ko**.

---

## Changements livrés

- `hero-backdrop-image.tsx` — composant **serveur**, `<picture>` + `getImageProps`, **sans** `priority` (doc Next 15), `fetchPriority="high"` + `loading="eager"` sur l’`<img>`.
- `vitrine-home.tsx` / `vitrine-home-client.tsx` — backdrop serveur passé au client via `heroBackdrop`.
- `vitrine-professionnels-home.tsx` + client — idem.
- `vitrine-hero.tsx` — un cadre `.hero-bg-frame--art`.
- `vitrine.css` — zoom mobile/desktop conservé.
- `hero-formulaire-livraison-lottie.tsx` — montage Lottie différé (`requestIdleCallback`).
- Scripts de test SEO : lecture `vitrine-home-client.tsx`.
- `scripts/summarize-lighthouse-hero.mjs` — extraction métriques / requêtes hero.

**Inchangé** : Stripe, tunnel, copywriting, URLs, maillage.

---

## Contrôle réseau post-build (local, même LH 13.6)

| Viewport | Téléchargé | Preload hero |
|----------|------------|--------------|
| Mobile (412×823) | `hero-mobile.webp` (w=750) uniquement | non |
| Desktop (1350×940) | `hero-desktop.webp` (w=3840) uniquement | non |

---

## Médianes **après** (prod)

> À compléter après déploiement : `lighthouse-hero-after-prod-{1,2,3}.json`

---

## Suite (hors scope)

Lot tunnel / CSS — après validation du bilan prod post-déploiement.