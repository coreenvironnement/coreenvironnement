# Maillage interne — lot 1 (gravats, DIB, enlèvement gravats)

Date : 14/11/2026

## Périmètre

44 URLs longtail du catalogue (`gravats-*`, `dib-*`, `enlevement-gravats-*`).  
Implémentation : `lib/seo/prestation-mesh-lot1.ts`, bloc `VitrinePrestationMeshBlock` dans :

- pages **ville** — `vitrine-city-guide.tsx` (« Flux de déchets à {ville} ») ;
- pages **département** — `vitrine-department-guide.tsx` (« Prestations dans le {code} »).

Hors périmètre : accueil, footer global, autres intents longtail (chantier, urgence, etc.).

## Avant / après (navigation interne)

| URL longtail | Avant | Après — source | Emplacement |
|--------------|------:|----------------|-------------|
| `gravats-nanterre` | 0 | `/location-benne/nanterre` | Guide ville |
| `dib-nanterre` | 0 | `/location-benne/nanterre` | Guide ville |
| `enlevement-gravats-nanterre` | 0 | `/location-benne/nanterre` | Guide ville |
| `enlevement-gravats-meaux` | 0 | `/location-benne/meaux` | Guide ville |
| `gravats-77-seine-et-marne` | 0 | `/location-benne/77-seine-et-marne` | Guide département |
| `dib-77-seine-et-marne` | 0 | `/location-benne/77-seine-et-marne` | Guide département |
| … (38 autres raccordées) | 0 | ville ou dept parent | idem |
| `gravats-paris` | 0 | — | **En attente** |
| `dib-paris` | 0 | — | **En attente** |
| `enlevement-gravats-paris` | 0 | — | **En attente** |

**Bilan :** 41/44 raccordées ; **3 en attente** (voir ci-dessous).

## Pages en attente (non supprimées)

| Longtail | Raison |
|----------|--------|
| `gravats-paris` | Catalogue ville « Paris » sans page `/location-benne/paris` (uniquement arrondissements + dept `75-paris`). Variante ville non rattachable selon la règle « page ville parent ». |
| `dib-paris` | Idem. |
| `enlevement-gravats-paris` | Idem. |

**Piste ultérieure (hors cette étape) :** lien contextuel depuis `75-paris` vers ces 3 URLs *ville Paris* ou ajout d’une ancre « Paris (ensemble) » — **non fait** pour respecter dept vs ville.

Le dept `75-paris` expose bien `gravats-75-paris` et `dib-75-paris` (niveau département).

## Similarité signalée (sans suppression)

Sur une même commune, **benne gravats** et **enlèvement gravats** partagent la même coque vitrine et le même tunnel commande ; la longtail n’ajoute qu’un angle sémantique (`VitrineLongtailIntro` générique). Utile pour la découverte SEO, mais **enrichissement éditorial recommandé** sur ces paires si vous voulez distinguer les intentions dans le contenu (pas réécrit à cette étape).

Même remarque pour `gravats-75-paris` vs `gravats-paris` : double cible « Paris » (dept vs nom ville) — contenus très proches.

## Vérifications

| Contrôle | Résultat |
|----------|----------|
| `npm test` | OK (482 pages) |
| `npm run test:city-guide` | OK |
| `npm run test:department-guide` | OK |
| `npm run test:prestation-mesh-lot1` | OK — 41 linked, 3 pending |
| HTML local `nanterre` | contient `/location-benne/dib-nanterre` |
| HTML local `meaux` | contient `enlevement-gravats-meaux` |
| HTML local `77-seine-et-marne` | contient `gravats-77-seine-et-marne` |

**Prod :** à re-vérifier après déploiement (`href` exact sur les pages sources).  
**Mobile :** blocs en `flex-wrap` + pastilles `min-h-10` (même motif que les listes villes du guide dept).

## Tests

`npm run test:prestation-mesh-lot1`