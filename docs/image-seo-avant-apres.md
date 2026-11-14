# SEO images — avant / après

Généré le 13/11/2026. Poids « après » issus de `docs/image-optimize-run.json` (script `npm run optimize:images`).

## Synthèse technique

- Registre central : `lib/media/site-images.ts` (chemins + alt + `buildHeroImageAlt` / `buildParcoursStepImageAlt`).
- Assets servis en **WebP** sous `public/images/` avec noms descriptifs en kebab-case.
- **301** legacy : `lib/media/image-legacy-redirects.ts` + `next.config.ts` (anciennes URL indexables).
- Affichage : toujours via `next/image` → Google peut crawler `/_next/image` et les fichiers statiques.

## Tableau avant / après

| Fichier (avant) | Fichier (après) | Pages / zones | Défaut identifié | Correction | Alt final (exemple) | Poids avant → après |
|-----------------|-----------------|---------------|------------------|------------|----------------------|---------------------|
| `hero-paris-truck-mobile.png` | `location-benne-camion-idf-hero-mobile.webp` | Hero : accueil, hub, **~483 locales**, pro | PNG ~2 Mo, alt générique | WebP 1200px, alt contexte offre locale | *Accueil :* « Camion CORE… location de benne en Île-de-France » · *Locale :* « … — prestation à {ville/dép.} » | 2 054 219 → 175 250 o |
| `hero-paris-truck-desktop.png` | `location-benne-camion-idf-hero-desktop.webp` | idem desktop | idem | idem | idem | 2 191 094 → 208 822 o |
| `vitrine-scroll/benne-vide.png` | `parcours-etape-01-choix-dechets-benne-vide.webp` | `/professionnels` (how-it-works) | PNG lourd | WebP + alt parcours | « Benne vide prête à recevoir les déchets… » | 1 629 388 → 18 930 o |
| `parcours-etape-2.png` | `parcours-etape-02-camion-depose-benne.webp` | idem | idem | idem | « Camion déposant une benne vide… » | 687 546 → 42 322 o |
| `parcours-etape-3.png` | `parcours-etape-03-benne-remplie-gravats.webp` | idem | idem | idem | « Benne verte remplie de gravats… » | 971 659 → 32 450 o |
| `parcours-etape-4.png` | `parcours-etape-04-enlevement-porte-benne.webp` | idem | idem | idem | « Camion porte-benne chargé… » | 1 184 756 → 54 546 o |
| `core-icone-*.webp` | `core-icone-*-*.webp` (3 fichiers) | Accueil « Pourquoi CORE » | `alt=""` décoratif | Alt descriptif par carte | ex. « Pictogramme suivi de livraison… » | 47–68 Ko → 7–11 Ko |
| `core-benne-*m3.webp` | `location-benne-*m3.webp` | Tunnel, espace client, widget | alt court / vide | `benneImageAltForVolume()` | « Illustration d’une benne de location de {n} m³ » | ~38–52 Ko → 22–30 Ko |
| Fichiers tunnel déchets (noms longs) | `tunnel-dechets-*.webp` (6) | Tunnel commande (toutes pages) | `alt=""` sur cartes | Alt par type de déchet | ex. « Tas de gravats de rénovation — photo pour le choix gravats… » | 110–260 Ko → 51–119 Ko |
| PNG estimateur volume (3) | `volume-estimateur-*.webp` | Tunnel volume | PNG + alts partiels | WebP + alts précisés | « Tas rectangulaire… pour estimer le volume » | 1,5–2,2 Mo → 46–87 Ko |
| PNG intent volume (3) | `benne-gravats-*`, `illustration-*` | Tunnel volume | `aria-hidden` | Alt informatif | « Benne de location verte — choisir directement… » | 594 Ko–1,4 Mo → 6–22 Ko |
| `Déchets inertes acceptés.png` | `dechets-inertes-acceptes-gravats-sprite.webp` | Dialog gravats 8 m³ | sprite `aria-hidden` | `role="img"` + aria-label par matériau | « Illustration : Briques et tuiles acceptés… » | 1 756 101 → 128 880 o |

## Composants modifiés

- `components/vitrine/vitrine-hero.tsx` — chemins + `buildHeroImageAlt(localPage)`
- `components/vitrine/vitrine-how-it-works.tsx` — parcours WebP + alts (option `localPage`)
- `components/vitrine/vitrine-particulier-pourquoi.tsx` — alt cartes
- `components/order/particulier-waste-picker.tsx` — alt options
- `components/order/particulier-volume-step.tsx` — chemins, alts résultat / intent
- `components/order/gravats-propres-8-waste-dialog.tsx` — sprite WebP + aria-label
- `components/order-widget.tsx`, `components/espace/commande-track-card.tsx` — alt benne
- `lib/order/particulier-waste-options.ts`, `lib/commande/benne-visual.ts`, `lib/cdc/contenu-vitrine.ts`

## Vérification

```bash
npm run optimize:images   # régénère les WebP si les sources changent
npx next build            # OK 13/11/2026
```

Test manuel recommandé en prod : `https://core-environnement.fr/images/location-benne-camion-idf-hero-desktop.webp` (200) et ancienne URL → 301 vers le nouveau nom.
