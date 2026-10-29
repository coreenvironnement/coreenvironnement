# Plan SEO : CORE ENVIRONNEMENT

Document de travail pour combler l’écart avec les sites comparateurs (ex. Good Collect) **sans** copier leur modèle marketplace France entière.  
Public : équipe produit et dev.  
Dernière rédaction : 29 octobre 2026.

---

## Objectif

Améliorer la **visibilité sur Google** en Île-de-France sur des requêtes du type « location benne + ville », « benne gravats », « tarif benne en ligne », tout en restant **honnête** (prix « dès 330 € HT », délais réalistes, pas de promesses que CORE ne tient pas).

CORE reste un **loueur direct** en IDF avec commande en ligne. Le référencement doit le montrer clairement.

---

## Règles de contenu (toutes les phases)

Ces règles s’appliquent aux textes ajoutés ou réécrits dans le plan :

1. **Pas de tiret cadratin** dans les contenus publics (titres, meta, paragraphes, FAQ). Utiliser la ponctuation simple : point, virgule, deux-points, parenthèses.
2. **Peu de jargon** : éviter « SERP », « crawl », « silo » côté client ; en interne ce plan peut les utiliser. Côté site : dire « résultats Google », « page », « lien interne ».
3. **Ton** : professionnel, direct, accessible. Ni familiier (« top », « ultra »), ni administratif lourd.
4. **Pas de duplicate** : chaque bloc ajouté doit apporter une info utile (prix indicatif, délai, type de déchet), pas reformuler trois fois la même phrase.
5. **Cohérence** avec la copy validée : « Dès 330 € HT », « tarif selon adresse et déchet », « commande en 2 minutes », « livraison sous 24 h » là où c’est vrai.

---

## État des lieux

### Déjà en place (à conserver)

| Élément | Où |
|--------|-----|
| ~482 pages locales `/location-benne/[slug]` | `lib/seo/local-pages.ts`, `app/location-benne/[slug]/page.tsx` |
| Sitemap + robots | `app/sitemap.ts`, `app/robots.ts` |
| Titres / descriptions / canonical par page locale | `generateMetadata`, `lib/seo/local-copy.ts` |
| Template homepage + variantes SEO | `lib/seo/landing-variants.ts` |
| Guides département 78, 92, 93 | `lib/seo/department-guides.ts` |
| Guide ville (variantes par slug) | `components/vitrine/vitrine-city-guide.tsx` |
| Pages longue traîne (ex. enlèvement gravats) | `lib/seo/longtail-pages.ts` |
| Données structurées : WebSite, LocalBusiness, FAQ | `components/seo/vitrine-json-ld.tsx` |
| Tests SEO automatisés | `scripts/test-local-seo.ts`, `lib/seo/local-seo-parity.ts` |
| Open Graph / Twitter | `lib/seo/share-metadata.ts` |

### Lacunes principales (par rapport à un acteur très fourni en contenu)

1. **Peu de texte unique** sur la majorité des pages ville (même hero + guide court).
2. **Peu de grilles tarifaires indexables** (Good Collect affiche des « à partir de » par volume en HTML).
3. **Titres de page** sobres (`Location de benne à Meaux (77)`) mais peu orientés clic (330 €, 24 h, en ligne).
4. **Données structurées** incomplètes : pas de note Google en schema, pas de fil d’Ariane, description WebSite parfois décalée vs le site.
5. **Pas de page hub** listant départements et grandes villes (maillage et compréhension du site).
6. **Longue traîne** limitée (volumes 8 m³, encombrants, etc.) par rapport au potentiel des requêtes.
7. **Sitemap** sans date de modification des pages.
8. **FAQ** riche en UX mais pas encore orientée requêtes prix / délai / téléphone.

---

## Vue d’ensemble des phases

| Phase | Intitulé | Effort estimé | Impact SEO |
|-------|----------|---------------|------------|
| **0** | Fondations techniques et cohérence | Faible | Moyen |
| **1** | Données structurées et signaux confiance | Faible | Moyen à fort |
| **2** | Titres, descriptions, modèles meta | Moyen | Fort |
| **3** | Contenu indexable (tarifs, déchets, départements) | Moyen | Fort |
| **4** | Hub local et maillage interne | Moyen | Fort |
| **5** | Longue traîne intention (déchet, volume) | Moyen | Moyen à fort |
| **6** | Contenu ville (extension progressive) | Fort (continu) | Fort sur villes ciblées |
| **7** | Mesure et itération | Faible (récurrent) | Pilotage |

Les phases 0 à 2 peuvent partir en prod rapidement. Les phases 3 à 6 se chevauchent mais 3 et 4 avant d’étendre à toutes les villes (phase 6).

---

## Phase 0 : Fondations

**But :** aligner le site et les tests sur la copy actuelle, sans nouveau contenu marketing.

| # | Tâche | Détail | Fichiers / actions |
|---|--------|--------|---------------------|
| 0.1 | Sync JSON-LD WebSite | Remplacer la description obsolète (ex. « 3 minutes », « rappel pose ») par la description homepage actuelle. | `components/seo/vitrine-json-ld.tsx` |
| 0.2 | Vérifier parity tests | S’assurer que tout changement de `DEFAULT_VARIANT.description` met à jour `scripts/test-local-seo.ts` et `local-seo-parity.ts`. | `lib/seo/landing-variants.ts`, tests |
| 0.3 | Sitemap : dates | Ajouter `lastModified` sur entrées statiques et locales si possible (date build ou fichier dédié). | `app/sitemap.ts` |
| 0.4 | Checklist déploiement | Après chaque lot SEO : `npm test`, build, spot-check 3 URLs (home, Meaux, 78-yvelines). | CI / manuel |

**Definition of done :** build vert, schemas validés (Google Rich Results Test sur home + 1 locale).

---

## Phase 1 : Données structurées et confiance

**But :** aider Google à afficher étoiles, fil d’Ariane, offres claires quand c’est pertinent.

| # | Tâche | Détail | Fichiers / actions |
|---|--------|--------|---------------------|
| 1.1 | Note Google en schema | Ajouter `aggregateRating` et `reviewCount` sur LocalBusiness si alignés avec `SITE_GOOGLE_RATING` / avis affichés sur le hero. Mention légale : chiffres réels uniquement. | `components/seo/vitrine-json-ld.tsx`, `lib/site.ts` |
| 1.2 | Fil d’Ariane visible | Sur pages `/location-benne/*` : Accueil > Location benne > [Département] > [Ville] (adapter dept seul, longtail). | Nouveau composant ex. `components/seo/local-breadcrumbs.tsx`, intégration vitrine locale |
| 1.3 | BreadcrumbList JSON-LD | Même arborescence que le fil visible. | `vitrine-json-ld.tsx` ou composant dédié |
| 1.4 | Offer « dès 330 € HT » | Sur LocalBusiness ou Service : offre « Location benne 8 m³ gravats » avec `price` 330, `priceCurrency` EUR, mention « prix de départ » dans le texte visible à côté. | Schema + bloc HTML court sur home / guides |
| 1.5 | FAQ schema enrichi | Ajouter 4 à 6 questions orientées recherche (voir phase 3.4) dans `contenu-vitrine` FAQ + schema existant. | `lib/cdc/contenu-vitrine.ts`, json-ld |

**Definition of done :** Rich Results Test sans erreur bloquante ; fil d’Ariane visible sur mobile.

---

## Phase 2 : Titres et meta descriptions

**But :** meilleur taux de clic dans les résultats Google, sans bourrage de mots-clés.

### Modèles proposés (plain language)

| Type de page | Title (exemple) | Description (exemple) |
|--------------|-----------------|------------------------|
| Home | Inchangé ou « Location de benne IDF dès 330 € HT \| CORE ENVIRONNEMENT » | Garder intro actuelle + 24 h |
| Département | `Location de benne {nom dept} dès 330 € HT · livraison 24 h` | Reprendre `FROM_PRICE` + communes clés |
| Ville | `Location de benne à {ville} ({code}) · tarif en ligne` | 1 phrase locale + tarif selon adresse et déchet + 2 min |
| Longtail | `Enlèvement gravats {ville} · benne et tarif en ligne` | Même logique, mot-clé longtail en tête |

| # | Tâche | Détail | Fichiers |
|---|--------|--------|----------|
| 2.1 | Étendre `buildLocalTitle` / description | Paramètres optionnels ou templates par `type` (departement, ville, longtail). | `lib/seo/local-copy.ts` |
| 2.2 | Guides 78/92/93 | Harmoniser titles avec les modèles ci-dessus. | `lib/seo/department-guides.ts` |
| 2.3 | Mettre à jour tests | Assertions Meaux, Paris, longtail. | `scripts/test-local-seo.ts` |
| 2.4 | Longueur | Title ~ 55 caractères visibles si possible ; description ~ 150-160 caractères. | Revue manuelle 10 URLs |

**Definition of done :** tests SEO OK ; revue humaine de 10 titles sans répétition absurde.

---

## Phase 3 : Contenu indexable (cœur métier)

**But :** donner à Google du **texte utile** (prix indicatifs, volumes, déchets), comme les grilles concurrentes, but **vérité CORE**.

### 3.1 Bloc « Tarifs indicatifs » (réutilisable)

Contenu type (à valider métier avant publication) :

- Benne 8 m³ gravats propres : dès 330 € HT (396 € TTC particulier).
- Autres volumes : renvoi au tunnel ou fourchettes issues du catalogue `lib/prestations`.
- Phrase : « Le montant exact dépend de l’adresse, du type de déchet et du forfait choisi avant paiement. »

| # | Tâche | Où l’afficher |
|---|--------|----------------|
| 3.1a | Composant `LocalPricingGuide` | Home (section basse ou sous hero desktop), pages dept, top 20 villes |
| 3.1b | Source données | Lire prix depuis prestations (pas de chiffres en dur dispersés) |

### 3.2 Tableau « Quelle benne pour quel déchet ? »

Une page **Île-de-France** + extrait court sur dept :

| Déchet (langage client) | Volume souvent adapté | Rappel |
|-------------------------|----------------------|--------|
| Gravats propres | 8 à 10 m³ | Ne pas mélanger avec du tout-venant |
| Débarras / mélange | selon cartes tunnel | Correspondre aux familles CORE |
| etc. | | |

Fichier data : `lib/seo/waste-volume-guide.ts` (données + libellés simples).

### 3.3 Enrichir guides département

Pour 77, 91, 94, 95 (pas seulement 78/92/93) : même structure que `department-guides.ts` (title, description, lead, tarif, particuliers, pose).

### 3.4 FAQ orientée recherche (texte simple)

Exemples de questions :

- Combien coûte une location de benne 8 m³ en Île-de-France ?
- Faut-il téléphoner pour avoir un prix ?
- Quel délai pour la livraison d’une benne ?
- Quels déchets acceptez-vous dans une benne gravats ?
- Comment commander une benne en tant que particulier ?

Réponses courtes, factuelles, lien implicite vers le tunnel.

| # | Tâche | Fichier |
|---|--------|---------|
| 3.4 | Ajouter section ou étendre FAQ vitrine | `lib/cdc/contenu-vitrine.ts` |

**Definition of done :** chaque page dept IDF a au moins un paragraphe tarif + lien vers tableau déchets ; home contient le tableau ou un lien visible.

---

## Phase 4 : Hub local et maillage

**But :** une page (ou section indexable) qui liste **où** CORE intervient, pour les humains et Google.

| # | Tâche | Détail |
|---|--------|--------|
| 4.1 | Route `/location-benne` (index) | Liste 8 départements + liens vers villes principales (`villesPrincipales` dans `local-pages`). |
| 4.2 | Meta hub | Title : « Location de benne en Île-de-France · toutes les communes » ; description avec 330 € HT et commande en ligne. |
| 4.3 | Liens depuis footer | Lien « Villes desservies » vers le hub. |
| 4.4 | Liens related existants | Vérifier `relatedCityLinks` / `departementLink` dans variantes : visibles au-dessus du pli sur pages ville. |
| 4.5 | Sitemap | URL hub priority 0.95 |

**Definition of done :** hub accessible, 8 dept + ≥ 3 villes chacun en liens HTML ; pas de page orpheline dept.

---

## Phase 5 : Longue traîne (intention déchet / volume)

**But :** capturer des requêtes précises sans créer 300 pages vides.

| # | Tâche | Détail |
|---|--------|--------|
| 5.1 | Audit `longtail-pages.ts` | Lister slugs actuels vs liste cible (gravats, encombrants, 8m3 par grande ville). |
| 5.2 | Règles de génération | Longtail = ville parente connue + texte unique 2 paragraphes (template + variables ville/dept). |
| 5.3 | Titles longtail | Mot-clé en premier : « Benne gravats {ville} », « Location benne 8 m³ {ville} ». |
| 5.4 | Éviter le spam | Pas de page longtail pour chaque commune si contenu identique : privilégier villes principales + dept. |

**Definition of done :** +30 longtails utiles max en vague 1 ; tests parity OK.

---

## Phase 6 : Extension contenu ville (continu)

**But :** renforcer les communes qui comptent commerciallement, pas les 318 d’un coup.

### Priorisation

1. Villes `villesPrincipales` + trafic Search Console (quand dispo).
2. Communes longtail déjà en place.
3. Reste du fichier `cities` : par vague de 20, avec variante guide existante ou texte officiel `city-official-info`.

| # | Tâche | Détail |
|---|--------|--------|
| 6.1 | « Contenu local minimal » | Par ville prioritaire : 1 paragraphe contexte (déjà partiellement `city-official-info`) + rappel tarif + CTA commande. |
| 6.2 | Pas de fausses promesses | Ne pas inventer délais par commune sans règle métier. |
| 6.3 | Date « Mis à jour le … » | Sur guide dept et hub, mois/année de revue contenu. |

**Definition of done (vague 1) :** top 23 villes sourcees (`test-city-guide`) + 10 villes business avec paragraphe unique vérifiable.

---

## Phase 7 : Mesure et itération

| # | Tâche | Fréquence |
|---|--------|-----------|
| 7.1 | Google Search Console | Requêtes, pages, CTR : mensuel |
| 7.2 | Positions manuelles ou outil | 10 requêtes cibles IDF : mensuel |
| 7.3 | Rich Results / schema | Après chaque changement json-ld |
| 7.4 | Core Web Vitals | Inchangé (perf déjà suivie côté Next) |
| 7.5 | Revue copy | Trimestriel : aligner meta, hero, FAQ |

**Requêtes cibles exemples :** location benne paris, location benne meaux, benne gravats 77, prix benne 8m3, location benne pas cher idf (si assumé avec « dès 330 »).

---

## Hors scope (volontaire)

Ne pas traiter dans ce plan :

- Couverture **France entière** ou « 96 départements ».
- Contenu **marketplace** (comparaison prestataires, ticket de pesée, API grand compte).
- **Blog** long format (voirie, permis) : option phase 8 non planifiée ici.
- **Avis schema** si les chiffres Google ne sont pas maintenus à jour.

---

## Ordre d’exécution recommandé (sprint logique)

1. Phase **0** + **1** (1 à 2 jours dev).
2. Phase **2** (meta templates + tests).
3. Phase **3.1** + **3.4** (tarifs + FAQ).
4. Phase **4** (hub).
5. Phase **3.2** + **3.3** (tableau déchets + depts manquants).
6. Phase **5** (longtail vague 1).
7. Phase **6** en continu par priorités.
8. Phase **7** en parallèle après mise en prod.

---

## Fichiers principaux (référence rapide)

| Domaine | Fichiers |
|---------|----------|
| Variantes SEO | `lib/seo/landing-variants.ts`, `local-copy.ts`, `local-pages.ts` |
| Guides | `department-guides.ts`, `vitrine-city-guide.tsx`, `city-official-info` |
| Pages | `app/page.tsx`, `app/location-benne/[slug]/page.tsx`, futur `app/location-benne/page.tsx` |
| Schema | `components/seo/vitrine-json-ld.tsx` |
| Tests | `scripts/test-local-seo.ts`, `lib/seo/local-seo-parity.ts`, `test-department-guide.ts`, `test-city-guide.ts` |
| Contenu | `lib/cdc/contenu-vitrine.ts`, futur `lib/seo/waste-volume-guide.ts` |
| Prix métier | `lib/prestations.ts`, `lib/order/prestation-mapping.ts` |

---

## Validation finale du programme SEO

Le plan est considéré **livré** lorsque :

- [ ] Hub `/location-benne` en prod avec maillage 8 dept.
- [ ] Schema : FAQ, LocalBusiness avec note, BreadcrumbList sur locales.
- [ ] Tous les dept IDF ont un guide meta enrichi (phase 3.3).
- [ ] Bloc tarifs indicatifs sur home + pages dept.
- [ ] Tableau déchets/volumes indexable (page ou section dédiée).
- [ ] Tests automatisés SEO verts en CI.
- [ ] Search Console configurée et première revue documentée (phase 7).

---

*Ce document ne remplace pas le cahier des charges produit (`PLAN-PROJET.md`). En cas de conflit prix ou délai, la vérité métier (catalogue, CGV) prime sur le SEO.*
