# Bilan — posters fallback « Bien préparer » (pack Lottie)

Date : 14/11/2026

## Méthode

1. Extraction du WebP embarqué (data URI) de chaque `posters/*.svg`.
2. **Aplatissement** sur canvas aux dimensions exactes du `viewBox` (800×400 ou 800×300), en respectant le placement `x` / `y` / `width` / `height` de la balise `<image>` d’origine.
3. Encodage **WebP lossless** (alpha conservée) — l’essai lossy (q55–90) dépasse ~78 px d’écart max sur les pixels visibles ; rejeté pour garder un rendu fidèle.
4. Fichiers livrés :
   - `{id}-poster.webp` — asset servi par le site ;
   - `{id}.svg` — enveloppe mince (référence pack / `integration/section.html` legacy).

Rapport JSON : `docs/preparation-posters-optimize.json`  
Script : `node scripts/optimize-preparation-posters.mjs`

## Poids avant / après (fichiers locaux)

| Poster | Avant (SVG + base64) | Après (WebP + SVG mince) | Économie |
|--------|----------------------|---------------------------|----------|
| 01-volume | 266 267 o | 104 498 o (104 318 + 180) | −60,8 % |
| 02-acces | 212 551 o | 141 439 o (141 260 + 179) | −33,5 % |
| 03-dechets | 344 948 o | 140 659 o (140 478 + 181) | −59,2 % |
| **Total** | **823 766 o** | **386 596 o** | **−53,1 %** |

Le composant React charge **directement** les `.webp` (une requête HTTP par poster, sans chaîne SVG → image).

## Prod (après déploiement)

Commit déployé : **`47f6535`** — `perf(vitrine): posters preparation en WebP externes et lazy loading`  
Vérification `https://core-environnement.fr` le 14/11/2026 (post-release Vercel).

| Ressource | HTTP | Content-Length |
|-----------|------|----------------|
| `/images/core-preparation-pack/posters/01-volume-poster.webp` | 200 | 104 318 o |
| `/images/core-preparation-pack/posters/02-acces-poster.webp` | 200 | 141 260 o |
| `/images/core-preparation-pack/posters/03-dechets-poster.webp` | 200 | 140 478 o |
| **Total posters (servis)** | | **386 056 o** (−53 % vs ~824 Ko SVG) |

Page d’accueil : les trois `img.cp-poster` pointent vers les `*-poster.webp` (SSR/RSC).  
Attributs prod : `01-volume` sans `loading` ; `02-acces` / `03-dechets` `loading="lazy"` + `fetchPriority="low"`.  
`prefers-reduced-motion: reduce` (chargement initial) : posters OK, **aucune** requête `animations/*.json`, pas de canvas Lottie.

## Prod (référence avant chantier)
| `/images/stickyheaderlogo.png` (source logo header) | 737 196 o |
| `/_next/image?…stickyheaderlogo.png&w=256&q=75` | **7 380 o** |
| `/_next/image?…stickyheaderlogo.png&w=384&q=75` | **11 703 o** |
| `/images/core-icone-suivi-livraison-benne.webp` (fichier brut) | 47 186 o |
| `/_next/image?…&w=128&q=75` (icône suivi, ~62px UI) | **2 752 o** |
| `/_next/image?…&w=256&q=75` (icône suivi, ~88px UI) | **5 978 o** |
| `/_next/image?…prix…&w=128&q=75` | **2 836 o** |
| `/_next/image?…valorisation…&w=256&q=75` | **7 862 o** |

**Logo** (`VitrineLogo`, `sizes="148px"`) : le navigateur demande surtout `w=256` via `/_next/image`, pas le PNG 2172×724 (~737 Ko).

**Pictos Pourquoi CORE** (`sizes="(max-width: 1023px) 62px, 88px"`) : transfert typique **w=128** mobile, **w=256** desktop — pas les fichiers sources ~47–68 Ko bruts, mais bien inférieur après optimisation Next.

## Code — lazy loading

`components/vitrine/preparation-lottie-art.tsx` :

- `01-volume` : chargement par défaut (première carte, au-dessus de la ligne de flottaison).
- `02-acces`, `03-dechets` : `loading="lazy"` + `fetchPriority="low"`.
- `decoding="async"`, `alt=""` inchangés.

## Vérification visuelle en local

1. `npm run dev`, ouvrir la page d’accueil vitrine.
2. Scroller jusqu’à **« Bien préparer votre location de benne »**.
3. Vérifier les trois illustrations statiques avant animation Lottie.
4. OS / navigateur : activer **réduire les animations** → seuls les posters doivent rester visibles, sans chargement JSON Lottie.
5. Optionnel : comparer une capture avec la prod actuelle (même section) — les lossless locaux reproduisent l’aplati du rendu SVG d’origine (diff pixels visibles : 0 vs référence flatten).

## Reste à faire

- Aucun blocage sur le périmètre posters (déployé en prod).