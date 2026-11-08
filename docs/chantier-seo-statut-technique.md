# Chantier SEO — statut des correctifs techniques

**Référence commit :** `b44de8c` — `fix(seo): titre pro, sitemap, JSON-LD et annexes copy/URL`  
**Branche :** `main` (synchronisée avec `origin/main`)  
**Vérification prod :** 8 nov. 2026 — audit [Audit technique URLs](efe625ee-9eda-4bb0-9bd2-f5ec3e276399)  
**Périmètre hors scope :** aucune modification des composants visuels `vitrine-professionnels-*`.

**Légende colonnes :** chaque étape est notée oui/non. Une étape ultérieure sans la précédente implique que le travail est en attente (ex. pas « publiée » tant que le déploiement prod ne reflète pas le commit).

| Correctif | Préparée | Testée | Commitée | Publiée (prod) | Preuves |
|-----------|----------|--------|----------|----------------|---------|
| **Titre `/professionnels` — double marque** (`… \| CORE \| CORE ENVIRONNEMENT`) | oui | oui | oui | **oui** | **Commit :** `b44de8c`. **Prod 8 nov. :** title `Location de benne pour professionnels en Île-de-France \| CORE ENVIRONNEMENT` (fetch document). |
| **Sitemap — suppression `lastModified` artificiel** (date identique à chaque build) | oui | oui | oui | **oui** | **Commit :** `b44de8c`. **Prod 8 nov. :** `sitemap.xml` sans balises `<lastmod>` (fetch live). |
| **`/pro` retiré du sitemap** (page toujours crawlable, **pas** de `noindex`) | oui | oui | oui | **oui** | **Commit :** `b44de8c`. **Prod 8 nov. :** aucune `<loc>…/pro</loc>` ; page **200**, indexable, liens footer/FAQ — **ne pas désindexer** sans analyse GSC (≈8 clics signalés côté métier, hors CSV repo). |
| **JSON-LD — `faqSource`, `aggregateRating`, alignement `description`** | oui | oui | oui | **oui** (partiel) | **Prod 8 nov. :** `/professionnels` — FAQPage, sans `aggregateRating` ; guides volume/déchets — pas de FAQPage au fetch. **Indexation / rich results :** à confirmer dans GSC (Inspection d’URL), pas un constat HTTP. |

## Synthèse

Les quatre correctifs sont **déployés en production** (contrôle 8 nov. 2026). L’**état d’indexation** (couverture, « Détectée / non indexée » au 23 oct.) reste distinct : pages publiées après cette date (ex. `/location-benne/dechets-acceptes`, ~5 nov.) ne peuvent pas être expliquées par seul le graphique du 23 oct. — **Inspection d’URL** GSC requise.

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

## Suivi technique post-audit (périmètre 6 URLs)

| URL | Constats HTTP/SEO | Action technique éventuelle |
|-----|-------------------|---------------------------|
| Périmètre audit + `/pro` | Toutes **200**, canoniques OK, pas de `noindex` bloquant ; voir détail audit `efe625ee` | Maillage optionnel : lien hub → `/location-benne/dechets-acceptes` (asymétrie vs `/volume`) — **sans** toucher au copywriting |

**Inventaire GSC :** le fichier `docs/seo-url-inventory.csv` dans le dépôt affiche encore `statut GSC à importer` sur les lignes vérifiées — si vous avez fusionné les exports localement, **committer le CSV** pour aligner le repo avec votre analyse.

---

*Dernière mise à jour : 8 novembre 2026.*
