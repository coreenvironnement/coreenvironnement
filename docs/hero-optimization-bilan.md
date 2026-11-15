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

## Régression réseau (`9c0cd69`) et correctif (`92c0493`)

Sur `9c0cd69`, le spread `{...imgProps}` **retirait** le `srcSet` mobile : le navigateur tombait sur `src` seul → **`w=3840`** (~127 Ko, High) au lieu de **`w=750`** via `srcset` + `sizes="(max-width: 767px) 100vw, 1px"`.

**Correctif** : spread complet `{...mobileImgProps}` + `sizes` distincts mobile/desktop dans `getImageProps`.

| Contrôle post-déploiement (`92c0493`, prod) | Résultat |
|---------------------------------------------|----------|
| HTML SSR — `srcSet` sur l’`<img>` hero mobile | OK |
| HTML SSR — `<source media="(min-width: 768px)"` desktop | OK |
| Preload hero dans `<head>` | Aucun |
| Smoke accueil + `/location-benne/meaux` (hero + tunnel étape 1) | OK |

### Images hero **prod après correctif** (réseau Lighthouse)

| Viewport | URL LCP / réseau | Priorité | `transferSize` |
|----------|------------------|----------|----------------|
| **Mobile** (412×823, 3/3) | `…hero-mobile.webp&w=750&q=75` | **High** | **~85,6 Ko** |
| **Desktop** (1350×940, 1 run) | `…hero-desktop.webp&w=3840&q=75` | **High** | **~165 Ko** |

Une seule requête hero par viewport ; pas de variante croisée.

---

## Médianes **après lot initial** (prod, commit `9c0cd69` — régression bytes)

Fichiers : `lighthouse-hero-after-prod-{1,2,3}.json` · desktop : `lighthouse-hero-desktop-prod.json`

| Métrique | Médiane | Détail |
|----------|---------|--------|
| **LCP** | **10,7 s** | [13,3 / 10,7 / **6,1**] s — forte variance lab |
| **FCP** | **10,6 s** | [13,1 / 10,6 / **5,6**] s |
| **TBT** | **N/A** | 3/3 → `NO_TTI_CPU_IDLE_PERIOD` |
| **CLS** | **0** | |

Images mobile (bug) : **w=3840** (~127 Ko) — voir correctif ci-dessus.

---

## Lighthouse **après correctif srcSet** (prod, commit `92c0493`)

Fichiers : `lighthouse-hero-after-fix-prod-{1,2,3}.json` · desktop : `lighthouse-hero-desktop-after-fix-prod.json`

### Runs **incomplets** (3/3 mobile + 1 desktop)

Tous signalent : `The page loaded too slowly to finish within the time limit` + **TBT** → `NO_TTI_CPU_IDLE_PERIOD` ; **score perf `null`**. Ne pas interpréter LCP/FCP comme gain lab définitif.

| Run | Erreurs | LCP (s) | FCP (s) | TBT | CLS |
|-----|---------|---------|---------|-----|-----|
| mobile 1 | timeout + NO_TTI | 8,99 | 8,57 | N/A | 0 |
| mobile 2 | timeout + NO_TTI | 7,81 | 7,71 | N/A | 0 |
| mobile 3 | timeout | 6,95 | 6,85 | N/A | 0 |
| desktop 1 | timeout + NO_TTI | 7,20 | 7,08 | N/A | 0,018 |

**Médiane LCP mobile** (présent malgré run incomplet) : **7,81 s** [6,95 / 7,81 / 8,99] — variance lab élevée.

### Conclusion correctif

| Objectif | Statut |
|----------|--------|
| Rétablir **bytes** mobile (`w=750` ~85 Ko vs `w=3840` ~127 Ko) | **OK** |
| Une variante hero / viewport | **OK** |
| Art direction desktop `w=3840` | **OK** |
| Gain LCP lab mesuré | **Non concluant** (runs incomplets) |

### Timeout Lighthouse (général)

Même symptômes sur prod : page load timeout + TBT quand le main thread reste occupé (bundle vitrine). **Pas lié au diff hero**.

---

## Suite (hors scope)

Lot tunnel / CSS — après validation du bilan prod post-déploiement.