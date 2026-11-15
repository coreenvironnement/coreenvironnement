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

## Médianes **après** (prod, commit `9c0cd69`, déployé)

Fichiers : `lighthouse-hero-after-prod-{1,2,3}.json` · desktop : `lighthouse-hero-desktop-prod.json`

| Métrique | Médiane | Détail |
|----------|---------|--------|
| **LCP** | **10,7 s** | [13,3 / 10,7 / **6,1**] s — forte variance lab (run 3 proche de l’avant) |
| **FCP** | **10,6 s** | [13,1 / 10,6 / **5,6**] s |
| **TBT** | **N/A** | 3/3 runs → `NO_TTI_CPU_IDLE_PERIOD` (idem avant sur 2/3) |
| **CLS** | **0** | |

### Images hero **après** (prod)

| Viewport | Téléchargé | Preload hero |
|----------|------------|--------------|
| **Mobile** (3/3 runs) | **mobile** uniquement (~127 Ko) | **non** |
| **Desktop** (1 run LH) | **desktop** uniquement (w=3840, ~161 Ko) | **non** |

**Gain réseau objectif** : suppression systématique de la **deuxième** variante hero (~42 Ko mobile avant).

### Timeout Lighthouse

Même symptômes **avant et après** sur prod : `Timed out waiting for page load` + TBT inaccessible quand le main thread reste occupé (bundle vitrine). **Pas lié au diff hero** ; desktop prod run complet sans hang confirme l’app saine.

---

## Suite (hors scope)

Lot tunnel / CSS — après validation du bilan prod post-déploiement.