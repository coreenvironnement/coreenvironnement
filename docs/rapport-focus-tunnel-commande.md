# Rapport — halo focus rogné (tunnel de commande)

## Symptôme

Sur les étapes du tunnel (modal `order-modal` + widget embarqué) et sur l’adresse du hero (`hero-order-card__address`), l’anneau de focus clavier (`focus-visible:ring-3`, vert marque via `--ring: #35a238`) paraît tronqué sur un ou plusieurs bords, surtout mobile.

## Cause racine

1. **Modal tunnel** — Le `OrderWidget` embarqué est rendu dans un `Card` dont les classes par défaut imposent `overflow-hidden` (`components/ui/card.tsx`). Une couche supplémentaire `overflow-x-hidden` sur `order-tunnel-embedded-card` créait un second contexte de rognage. Les champs (`[data-slot="input"]`, sélecteurs, boutons date) appliquent un halo **externe** (box-shadow Tailwind `ring-3`) qui dépasse la boîte du champ ; tout ancêtre en `overflow` ≠ `visible` coupe ce halo, même si `.order-tunnel-scroll` a déjà `px-4` / `px-6` (le rognage se produit **à l’intérieur** de la zone utile, au bord du contenu).

2. **Scroll vertical** — `.order-tunnel-scroll` avait un `pt-0.5` (2px), inférieur à l’épaisseur utile du halo (~3px + filet), ce qui rognait le focus sur le **premier champ** en haut de l’étape.

3. **Hero adresse** — La section `#accueil` (`vitrine-hero`) est en `overflow-hidden`. L’autocomplete d’adresse est en pleine largeur dans la carte : le halo peut toucher la limite de rognage du hero ; un micro-gain de place **sans changer la taille du champ** est obtenu par `padding: 3px` + `margin: -3px` sur `.hero-order-card__address`.

## Correctifs appliqués (périmètre visuel uniquement)

| Zone | Fichier | Changement |
|------|---------|------------|
| Carte tunnel embarquée | `components/order-widget.tsx` | `overflow-x-hidden` → `overflow-visible` (annule le `overflow-hidden` du `Card`) |
| Zone scroll modal | `components/vitrine/order-modal.tsx` | `pt-0.5` → `pt-1`, `sm:pt-1` → `sm:pt-1.5` (marge pour le halo en tête d’étape) |
| Adresse hero | `app/vitrine.css` | Padding / marge compensée 3px sur `.hero-order-card__address` |

**Non modifié (volontaire)** : `overflow-x-hidden` sur `.order-tunnel-scroll` et `.order-tunnel-shell` (évite le scroll horizontal) ; dimensions `h-11` / `h-12` des champs ; tokens focus (`ring-3`, `--ring` vert).

## Vérification manuelle recommandée

### Avant / après (mobile + desktop)

1. **Hero** — Particulier / pro : focus clavier sur l’adresse (repos → focus → saisie) : halo vert complet sur les 4 côtés.
2. **Modal — étape adresse / déchets** — `AddressAutocomplete`, listes, boutons : halo non rogné.
3. **Modal — étape infos** — texte, `tel`, `email`, SIRET (pro) : halo sur erreur (`aria-invalid`) et au repos.
4. **Modal — dates** — `OrderDateField` (bouton + picker) : `ring-offset-1` visible.
5. **Modal — volume** — champs dimension (`Input` décimal) : halo complet dans la grille.
6. **Régressions** — pas de barre de défilement horizontale ; pas de changement de position / hauteur perceptible des champs.

## Compilation

Exécuter `npx tsc --noEmit` (aucun commit demandé).
