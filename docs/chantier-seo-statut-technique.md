# Chantier SEO — statut des correctifs techniques

**Référence commit :** `b44de8c` — `fix(seo): titre pro, sitemap, JSON-LD et annexes copy/URL`  
**Branche :** `main` (synchronisée avec `origin/main` au 7 nov. 2026)  
**Périmètre hors scope :** aucune modification des composants visuels `vitrine-professionnels-*`.

**Légende colonnes :** chaque étape est notée oui/non. Une étape ultérieure sans la précédente implique que le travail est en attente (ex. pas « publiée » tant que le déploiement prod ne reflète pas le commit).

| Correctif | Préparée | Testée | Commitée | Publiée (prod) | Preuves |
|-----------|----------|--------|----------|----------------|---------|
| **Titre `/professionnels` — double marque** (`… \| CORE \| CORE ENVIRONNEMENT`) | oui | oui | oui | **non** | **Commit :** `b44de8c` — retrait de `\| CORE` dans `PROFESSIONNELS_HERO_VARIANT.title` (`lib/seo/landing-variants.ts`) + titre absolu via `withBrandTitle()` dans `lib/seo/public-page.ts` (`title: { absolute: pageTitle }`). **Snippet attendu après déploiement :** `Location de benne pour professionnels en Île-de-France \| CORE ENVIRONNEMENT`. **Build :** `npm run build` OK (7 nov. 2026, tests SEO + Next build). **Prod (fetch 7 nov.) :** title encore `… \| CORE \| CORE ENVIRONNEMENT` sur https://core-environnement.fr/professionnels |
| **Sitemap — suppression `lastModified` artificiel** (date identique à chaque build) | oui | oui | oui | **non** | **Commit :** `b44de8c` — `app/sitemap.ts` : suppression de `lastModified` global et des champs sur chaque entrée ; commentaire d’intention lignes 6-8. **Snippet :** aucune clé `lastModified` dans le fichier actuel. **Build :** OK. **Prod :** `sitemap.xml` contient encore `<lastmod>2026-11-07T14:23:04.752Z</lastmod>` sur la majorité des URLs |
| **`/pro` retiré du sitemap** (page toujours crawlable, **pas** de `noindex`) | oui | oui | oui | **non** | **Commit :** `b44de8c` — entrée `${base}/pro` supprimée ; commentaire explicite dans `app/sitemap.ts`. **Inventaire :** `docs/seo-url-inventory.csv` ligne `/pro` → `retirer-sitemap`. **Build :** OK. **Prod :** `<loc>https://core-environnement.fr/pro</loc>` toujours présent dans `sitemap.xml` (l. ~28) |
| **JSON-LD — `faqSource`, `aggregateRating`, alignement `description`** | oui | oui | oui | **à confirmer post-déploiement** | **Commit :** `b44de8c` — `components/seo/vitrine-json-ld.tsx` : type `VitrineFaqSource` (`general` \| `particulier` \| `professionnels` \| `none`), FAQ pro avec variante paiement `professionnelsFaqModalitesPaiement`, `includeAggregateRating` conditionnel, `description` propagée vers `WebSite` + `LocalBusiness`. **Pages :** `/` et hub → `faqSource="particulier"` + `description` meta ; `/professionnels` → `faqSource="professionnels"`, `includeAggregateRating={false}` ; guides volume/déchets → `faqSource="none"`. **Build :** OK. **Prod :** contenu FAQ visible cohérent avec le CDC ; validation du JSON-LD brut (absence de `aggregateRating` sur `/professionnels`, absence de `FAQPage` sur guides) à refaire après déploiement |

## Synthèse

Les quatre correctifs sont **intégrés et testés en local** sur `main` (`b44de8c`, poussé sur `origin/main`). **La production consultée le 7 nov. 2026 n’a pas encore reflété** le sitemap ni le titre document `/professionnels` : **action attendue = déploiement** (même commit que `origin/main`).

## Commande de build (preuve test)

```text
npm run build
→ prebuild: test-local-seo, test-city-guide, test-department-guide OK
→ next build: Compiled successfully (7 nov. 2026)
```

## Hors tableau mais lié au chantier

| Élément | Statut |
|---------|--------|
| `docs/seo-url-inventory.csv` (491 URLs) | Commitée dans `b44de8c` |
| `docs/copy-propositions.md`, `docs/copy-professionnels-proposition.md` | Commitées dans `b44de8c` ; réécrites dans le commit docs suivant |
| `docs/seo-url-decisions.md` | Décisions par famille (sans réécriture des 318 fiches ville) |

---

*Dernière mise à jour : 7 novembre 2026.*
