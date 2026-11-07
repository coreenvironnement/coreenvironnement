# Pack copy SEO — proposition de remplacement (non appliquée en prod)

**Périmètre audité**

- **Web production** : constats visuels / fetch novembre 2026 (titres, FAQ affichée, badge Google sur hero particulier).
- **Dépôt** : base `f2dedeb` + correctifs locaux dont `c2c968a` (logout) — **non régressés**.
- **Page `/professionnels`** : publiée côté web mais **non finalisée client** ; les textes ci-dessous pour les pros sont dans un fichier dédié, pas dans les composants.

**Principe rédactionnel** : besoin → réponse → preuve → action. Ton simple, sans promettre des services non livrés dans le code (déchetteries pro, espace client, paiement différé 30 jours, etc. = signalés comme « en cours » ou « sur demande »).

---

## Écart valorisation 99 % / 90 % (preuves — **pas de swap code silencieux**)

| Emplacement | Texte actuel (repo) | Source / commentaire |
|-------------|---------------------|----------------------|
| `particulierAccueil.pourquoi.cartes[valorisation]` | « 99 % des déchets pris en charge sont valorisés. » | Carte accueil particulier — **aucune source chiffrée** dans `lib/site.ts` |
| `engagements[3]` (engagements pro / legacy) | « +90 % de valorisation et recyclage » + détail filières | `contenu-vitrine.ts` — formulation engagement |
| FAQ générale Q « Que deviennent les déchets… » | « …taux de recyclage minimum de **90%**. » | Aligné sur engagements |
| Code produit | Pas de constante `99` ou `90` dans `lib/site.ts` | Seuls `SITE_GOOGLE_RATING` / review count |

**Proposition copy (accueil carte valorisation — à valider métier avant intégration)**  

- Remplacement suggéré : *« Vos déchets partent vers des centres agréés en Île-de-France ; nous visons un taux de valorisation supérieur à 90 % sur les flux pris en charge. »*  
- Alternative sans pourcentage : *« Tri et orientation vers des filières de valorisation agréées — un engagement suivi avec nos centres partenaires. »*

---

## `/` — Accueil particulier

### Title & meta

| Élément | Actuel (repo / prod mix) | Proposition |
|---------|--------------------------|-------------|
| **Title** | `Location de benne en Île-de-France \| Core Environnement` (`app/page.tsx`) | `Location de benne en Île-de-France \| CORE ENVIRONNEMENT` |
| **Meta description** | `Des travaux ou un débarras ? Choisissez une benne…` | Identique — déjà claire ; option : ajouter « tarif avant paiement » si validé pricing |

### Hero (H1 / intro / CTA)

| Élément | Actuel (`landing-variants` + hero CDC) | Proposition |
|---------|----------------------------------------|-------------|
| **H1** | « Louez une benne pour vos travaux en Île-de-France » | **Conserver** |
| **Intro** | `DEFAULT_VARIANT.intro` — rénovation, livraison, enlèvement | **Conserver** avec micro-ajust : *« …consultez le tarif selon votre adresse, puis validez la livraison en ligne. »* |
| **CTA principal** | « Commander une benne » | **Conserver** |
| **Badge Google** | 4,9 / 12 avis — visible | **Conserver** (aligné JSON-LD si badge présent) |

### Section « Pourquoi Core » (`particulierAccueil.pourquoi`)

| Carte | Actuel | Proposition |
|-------|--------|-------------|
| Eyebrow / titre | « Pourquoi Core Environnement » / « Votre benne, l'esprit tranquille » | **Conserver** |
| Suivi | « Vous savez quand elle arrive » + texte suivi commande | **Conserver** |
| Prix | « Vous connaissez le prix avant de payer » | **Conserver** |
| Valorisation | **99 %** (voir tableau preuves) | Remplacement factuel **sans %** ou **90 % aligné FAQ** — **validation client requise** |
| CTA section | « Voir les bennes et les tarifs » | **Conserver** |

### FAQ particulier (`particulierFaq`)

8 questions — contenu déjà cohérent tunnel particulier. **Proposition** : conserver l’ensemble ; ajuster uniquement la réponse « volume » si l’URL canonique interne passe en `/location-benne/volume` (au lieu du domaine absolu actuel).

### CTA final (`finalCta`)

| Actuel | Proposition |
|--------|-------------|
| « Intervention sous 24h* » | Ajouter nuance footer existante : *hors week-ends et jours fériés* déjà en footnote — **conserver** |

---

## `/location-benne` — Hub géographique

### Title & meta

| Élément | Actuel | Proposition |
|---------|--------|-------------|
| **Title** | `Location de benne en Île-de-France · communes desservies \| CORE ENVIRONNEMENT` | `Communes desservies — location de benne en Île-de-France \| CORE ENVIRONNEMENT` |
| **Meta** | Dès 330 € HT… | **Conserver** + précision : *« Paris et petite couronne : pages par commune et par département. »* |

### H1 / intro (hub variant)

| Actuel | Proposition |
|--------|-------------|
| H1 : « Location de benne en Île-de-France » + ligne 2 « Commande en ligne, tarif avant validation » | H1 : **Conserver ligne 1** ; ligne 2 → *« Trouvez votre commune ou votre département »* |
| Intro : Dès 330 € HT… | *« Choisissez votre zone, commandez en ligne et consultez le tarif avant validation. »* |

### Sections

- **Maillage départements / villes** : conserver structure ; textes d’intro hub → une phrase par bloc : *« Accédez aux fiches Paris, 77, 78, 91, 92, 93, 94, 95 et aux communes associées. »*
- **FAQ affichée** : `VitrineParticulierFaq` — **ne pas** injecter la FAQ générale complète en schema (corrigé en code nov. 2026).

### CTA

- **Conserver** `VitrineFinalCta` ; lien pro via `switchPro` inchangé.

---

## `/location-benne/volume` — Guide volume

| Élément | Actuel (`volume-guide-content`) | Proposition |
|---------|----------------------------------|-------------|
| **Title** | `Quel volume de benne choisir ? Guide m³ \| CORE Environnement` | **Conserver** (déjà `absolute`) |
| **Meta** | Estimez votre volume… | **Conserver** |
| **H1** (composant guide) | Reprendre titre guide | `Quel volume de benne choisir ?` |
| **Intro** | `VOLUME_GUIDE_INTRO` | Légèrement raccourcie : *« Pour choisir votre benne : estimez le volume (m³) et le poids. Voici des repères avant de consulter votre tarif en Île-de-France. »* |
| **CTA** | Vers commande / estimateur | *« Estimer mon volume et voir le tarif »* — libellé bouton aligné `particulierAccueil.conseils.cartes[volume].cta` |

Pas de FAQ sur la page — **pas de FAQPage** en JSON-LD (corrigé en code).

---

## `/location-benne/dechets-acceptes` — Guide déchets

| Élément | Actuel | Proposition |
|---------|--------|-------------|
| **Title** | `Déchets acceptés dans une benne : guide \| CORE Environnement` | **Conserver** |
| **Meta** | Gravats, terre, bois… | **Conserver** |
| **Intro** | `DECHETS_ACCEPTES_GUIDE_INTRO` | **Conserver** |
| **Encart** | `DECHETS_ACCEPTES_GUIDE_CALLOUT` | **Conserver** — déjà clair |
| **CTA conseil** | Section « Demander conseil » | *« Un doute sur un déchet ? Appelez-nous avant de réserver. »* + téléphone |

---

## Blocs partagés / formulaire commande (libellés sensibles)

| Zone | Problème observé | Proposition |
|------|------------------|-------------|
| Tunnel particulier | Mélange TTC / HT selon étapes | Harmoniser micro-copy : *« Montant TTC affiché avant paiement »* (particulier uniquement) |
| Espace client vitrine (`espaceClientVitrine`) | « Bientôt disponible » | **Conserver** — ne pas promettre suivi en ligne |
| Services carte (`services` — déchetteries pro, ADR) | Visibles dans certains composants legacy | **Ne pas** les remonter en accueil particulier tant qu’offre non activée |

---

## Décisions URL par famille (guidelines — non appliquées)

Voir `docs/seo-url-inventory.csv` (491 URLs : 9 statiques + 482 locales).

| Famille | Volume | Décision proposée | Priorité |
|---------|--------|-------------------|----------|
| home | 1 | Améliorer copy conversion | P0 |
| hub | 1 | Améliorer maillage + intro | P1 |
| guide | 2 | Améliorer contenu intent info | P1 |
| dept | 8 | Conserver, enrichir unicité | P1 |
| ville | 318 | Améliorer (risque template) | P2 |
| longtail | 156 | Améliorer / fusion si GSC le montre | P2 |
| pro | 2 (`/pro`, `/professionnels`) | Améliorer vitrine ; `/pro` hors sitemap | P1 |
| legal | 3 | Conserver | P3 |

**Note GSC** : statut impressions / cannibalisation **à importer** avant toute fusion ville → dept.

---

## Questions métier bloquantes pour la copy (liste unique)

1. **Taux de valorisation** : peut-on afficher 90 % minimum partout, un autre chiffre audité, ou une formulation sans pourcentage ?
2. **Délai « sous 24 h »** : règle exacte (heure limite de commande, zones exclues, week-ends) pour aligner hero, FAQ et CGV.
3. **Prix d’appel « dès 330 € HT »** : périmètre géographique et type de déchet de référence (8 m³ gravats propres ?).
4. **Offre professionnelle** : quelles prestations sont **contractuellement** vendables aujourd’hui (benne seule vs BSD, ADR, déchetteries) ?
5. **Compte pro / facture 30 jours** : date d’ouverture réelle et parcours `/pro` vs demande depuis `/professionnels`.
6. **Avis Google** : confirmation 4,9 / 12 avis et fréquence de mise à jour du badge.
7. **Zones hors IDF** : refus systématique ou exceptions à mentionner ?
8. **Nom marque** : « Core Environnement » vs « CORE ENVIRONNEMENT » dans titles publics (homepage utilise « Core »).

---

## Mesure & analytics (état repo, nov. 2026)

### Existant

- **Aucun** `gtag`, GTM, `@vercel/analytics`, Plausible ou Posthog dans le code applicatif (`app/`, `components/`).
- **Stripe** : événements serveur (checkout, webhook) pour paiements — traçabilité **commande payée** côté back, pas exposés au marketing.
- **Téléphone** : liens `tel:` (`SITE_PHONE_HREF`) — **non instrumentés**.
- **Formulaires** : tunnel commande (particulier), demande pro — **pas d’événements front nommés**.

### Carte d’événements proposée

| Intent métier | Signal aujourd’hui | Instrumentation suggérée |
|---------------|-------------------|-------------------------|
| Clic téléphone | Navigation `tel:` | Event `click_phone` (label page + section) |
| Ouverture tunnel commande | State React / modal | Event `begin_checkout` |
| Tarif affiché (qualifié) | Étape pricing tunnel | Event `view_pricing` |
| Paiement Stripe réussi | Webhook + redirect `?order=success` | Event serveur `purchase` + client confirmation |
| Demande pro envoyée | Action serveur email | Event `generate_lead` (pro) |
| Clic CTA « professionnels » | Liens `/professionnels` | Event `select_promotion` |

**Recommandation** : avant tout nouvel outil, ajouter une couche minimale (ex. GTM ou Vercel Analytics + `dataLayer` sur 4–5 événements ci-dessus) et documenter dans `docs/PLAN-SEO.md`.

---

*Fin du pack copy vitrine particulier + guides. Page professionnels : voir `docs/copy-professionnels-proposition.md`.*
