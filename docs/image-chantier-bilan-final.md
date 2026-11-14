# Bilan final — chantier images SEO

Date : 14/11/2026

## 1. Script `optimize-site-images.mjs`

- Bilan console **OK / FAIL**, rapport JSON structuré (`successes` + `failures`, dimensions, mode).
- **Code de sortie 1** si au moins un échec ; validation **format webp** + dimensions.
- Sources déjà WebP en **`mode: "copy"`** (11 jobs) : pas de recompression pour un simple renommage.
- Vérification sprite : `node scripts/verify-gravats-sprite.mjs` (ratio 3 bandes préservé : 2,3443 → 2,3438).

Dernière exécution : **27/27 OK**, 0 échec.

## 2. Redirections legacy

- **27 entrées** dans `IMAGE_LEGACY_REDIRECTS` (alignées sur les 27 JOBS).
- Branchées dans `next.config.ts` → `redirects()` via `...IMAGE_LEGACY_REDIRECTS`.
- `permanent: true` → **308** côté Next.js (comportement attendu).

### Prod (avant déploiement du correctif redirections)

Test `curl -I` sur `https://core-environnement.fr` le 14/11/2026 :

| URL | Statut observé | Note |
|-----|----------------|------|
| `/images/hero-paris-truck-desktop.png` | **200** (PNG d’origine) | Redir. pas encore en prod |
| `/images/core-benne-10m3.webp` | **200** (ancien fichier) | Idem |
| `/images/location-benne-camion-idf-hero-desktop.webp` | **404** | Commit `a830c59` non déployé |

Après déploiement : attendre **308** + `Location` vers le WebP descriptif sur les anciennes URL.

## 3. Sprite gravats 8 m³

- Redimensionnement : 1920×819 → 1200×512 ; **même ratio** → `backgroundSize: 300%` et positions **0% / 50% / 100%** restent valides (mobile & desktop : mêmes règles CSS).
- **Accessibilité** : `role="img"` + `aria-label` par matériau (lu par les lecteurs d’écran).
- **Google Images** : sprite découpé en CSS → **faible chance d’indexation** comme images distinctes (normal pour ce type d’asset).

## 4. Alt

- Hero : contexte local uniquement sur pages `/location-benne/*`.
- Parcours pro : sans suffixe local ni jargon technique.
- Pictos « Pourquoi CORE » : **alt vide** (titre + texte adjacents).
- Choix déchets : description visuelle, sans « tunnel de commande ».

## 5. Commits

| Commit | Contenu |
|--------|---------|
| `a830c59` | Assets WebP + registre + 14 redirections initiales |
| *(à pousser)* | Script fiabilisé, 27 redirections, alt, copies WebP |

## Exceptions

- Fichiers PNG sources **conservés** dans `public/` (sertent au script et aux liens tant que la prod n’a pas les 308).
- `core-icone-*` copiés en pleine résolution (1254 px) : affichage UI inchangé, poids un peu plus élevé que la version compressée précédente — **qualité préservée** volontairement.
- Vérification prod complète (redir. 308, poids hero via `/_next/image`) : **à refaire après `git push` + deploy Vercel**.