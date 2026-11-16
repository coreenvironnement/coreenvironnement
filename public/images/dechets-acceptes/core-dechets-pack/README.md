# Pack visuels « Déchets acceptés » — CORE Environnement

Ce pack est conçu pour `/location-benne/dechets-acceptes`. Palette : `#35A238`, `#E9F1EC`, `#20372D`.

## Contenu

- **images/categorie-*.webp** : 7 photos en cartes, sans texte intégré, à utiliser avec HTML sémantique.
- **images/banniere-matieres.webp** : visuel d’introduction.
- **images/dechets-collecte-specifique.webp** : encadré des filières séparées.
- **images/chargement-correct-incorrect.webp** : comparaison de chargement.
- **images/infographie-complete.webp** : infographie alternative grand format (ne pas ajouter en plus de toutes les cartes si cela alourdit la page).
- **animations/tri-dechets.json** : Lottie vectorielle (pas une vidéo).
- **animations/chargement-benne.json** : Lottie vectorielle (pas une vidéo).
- **preview/index.html** : exemple responsive contenant les cartes et les animations.
- **preview/apercu-*.gif** : aperçus rapides ; en production, utiliser les JSON, plus légers.

## Intégration Next.js

Copiez les dossiers `images` et `animations` dans `public/assets/dechets/`.
Utilisez `next/image` et les tailles indiquées dans vos cartes : `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"`.

Pour les Lottie, installer `lottie-web` :

```bash
npm install lottie-web
```

Dans un composant client, charger `lottie-web` dynamiquement et importer le JSON depuis `/public` avec `fetch('/assets/dechets/animations/tri-dechets.json')` ou `path` dans `lottie.loadAnimation` ; utiliser `renderer: 'svg'`, `loop: true`, et nettoyer avec `destroy()` au démontage. Déclencher le chargement à l’entrée dans le viewport (`IntersectionObserver`) et figer l’animation si `prefers-reduced-motion` est activé.

## SEO & exactitude

Les images doivent illustrer le contenu, **pas décider à elles seules de l’acceptation** : les règles sont fonction de l’offre de benne réservée, notamment pour la terre, le plâtre, les isolants et les déchets verts. Ne jamais présenter ces sept catégories comme systématiquement acceptées. Les déchets chimiques, l’amiante suspectée, les piles et les appareils électriques relèvent de filières dédiées.

Conservez les titres, explications, tableaux et liens en HTML indexable. Sur mobile, affichez les cartes en deux colonnes ou une colonne selon le confort de lecture. Chargez les images secondaires en différé ; donnez `width`, `height` ou `aspect-ratio` pour éviter le CLS. Servez la bannière de haut de page sans `loading="lazy"` si elle est visible immédiatement.

## Taille

Toutes les photos et illustrations sont enregistrées au format WebP optimisé. Les animations sont vectorielles JSON et ne requièrent aucune image externe.
