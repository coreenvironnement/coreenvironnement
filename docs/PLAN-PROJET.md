# Plan projet — Core Environnement

> Document de suivi : cahier des charges client, avancement réel et reste à faire.  
> Dernière mise à jour : 12 septembre 2026  
> Source de vérité fonctionnelle : **cahier des charges client** (Île-de-France, espace client, vitrine).

---

## Vue d'ensemble

**Objectif :** plateforme web pour CORE ENVIRONNEMENT — location de bennes, suivi digital des déchets, espace client pro avec traçabilité (BSD, bons de pesée, bons d'intervention).

**Stack :** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Supabase (Auth, PostgreSQL, Storage, RLS).

**Découpage livraison (3 mois) :**


| Mois       | Intitulé                            | Focus                                                              |
| ---------- | ----------------------------------- | ------------------------------------------------------------------ |
| **Mois 1** | Le moteur invisible                 | Base de données, sécurité, dashboard client, graphiques            |
| **Mois 2** | Gestion administrative et paiements | Historique exportable, compte pro, KBIS/RIB, abonnement 35 € HT    |
| **Mois 3** | Site vitrine et tests               | Accueil CDC, services flip, FAQ, sécurité avant ouverture publique |


**Nous sommes en : Mois 3** (Mois 1 ✅ · Mois 2 **~95 % code livré** — finitions reportées, voir § « À revenir »).

---

## ⏸ À revenir après la vitrine (Mois 2 — reporté volontairement)

> **Décision (12/09/2026) :** priorité à la **vitrine CDC (Mois 3)**. Les points ci-dessous restent valides ; le code est en place pour la plupart — il s’agit surtout de **config, tests et fonctionnalités secondaires**.

### Configuration & tests (priorité au retour)

| # | Étape | Statut code | Action à faire |
|---|--------|-------------|----------------|
| 1 | **E-mails Resend** | ✅ branché (`lib/email/`) | Créer compte [resend.com](https://resend.com) → `RESEND_API_KEY` dans `.env.local` + Vercel prod → redémarrer `npm run dev` |
| 2 | **Expéditeur e-mail prod** | ⏸ | Vérifier domaine sur Resend → `EMAIL_FROM=noreply@votre-domaine.fr` (en dev : `onboarding@resend.dev` suffit) |
| 3 | **Test e-mail commande** | ⏸ | Paiement test sur `/` → vérifier réception confirmation |
| 4 | **Test e-mail compte pro** | ⏸ | Admin → valider/refuser un dossier `pending` → vérifier réception |
| 5 | **Migration SQL `011`** | ✅ fichier prêt | Exécuter `011_commande_intervention.sql` sur Supabase si pas encore fait (lien commande → intervention) |
| 6 | **Test Stripe abo pro** | ⏸ | `/pro` → checkout 35 € → webhook → `subscription_active = true` en base |
| 7 | **Test tunnel commande complet** | ⏸ | `/` → CB test → `/admin/commandes` → « Créer l'intervention » |

### Fonctionnalités Mois 2 non implémentées (secondaire)

| # | Fonctionnalité | Fichiers / notes |
|---|----------------|------------------|
| 8 | **Récap mensuel** volumes / valorisation (compte pro) | Dashboard ou export dédié — CDC compte pro § reporting |
| 9 | **Rappel expert déchets** après commande | Notification / CRM — texte CDC dans `commentCaFonctionne.particulier.suite` |
| 10 | **Commande pro sur facture** depuis l'espace client | Pros validés (`payment_mode = invoice`) — aujourd'hui redirect vers `/pro` |
| 11 | **Persistance coords** (lat/lng) sur `commandes` | Widget envoie lat/lng ; non enregistrés en base |
| 12 | **Géocodage réel** (Google Places / API) | Remplacer validation CP mock sur adresse |

### Décisions client toujours en attente (cf. § plus bas)

- Espace **particulier** (suivi + factures sans abo)
- Confirmation flux **invitation compte** par lien admin

---

## Règle valorisation (validée client — juil. 2026)

Chaque **prestataire** (Paprec, Veolia, Bennes services, 4g environnement…) a un **taux par typologie de déchet**, mis à jour **chaque année**.

**Calcul du taux global chantier / client :**

1. `tonnage_valorisé(type) = tonnage(type) × taux_prestataire(type) / 100`  
   *Ex : 10 t DIB à 90 % → 9 t valorisées*
2. `total_valorisé = Σ tonnages valorisés`
3. `taux_global = total_valorisé / tonnage_total × 100`

**Implémentation :** migration `005_prestataires_valorisation.sql` · fonction `lib/valorisation/calculate.ts` · `% élimination = 100 − % valorisation`

---



## Cahier des charges — rappel des livrables



### Site vitrine (Mois 3)

- [ ] **Accueil** — Hero image camion + Tour Eiffel, titres CDC, bouton « Commander une benne » → formulaire
- [ ] **Nos services** — 4 cartes rectangulaires non cliquables, coins arrondis, effet flip au survol
- [ ] **Nos engagements** — 4 blocs (24h, suivi digital, conformité BSD, +90 % valorisation)
- [ ] **Comment ça fonctionne** — Toggle particulier / professionnel + flux décrits dans le CDC
- [ ] **Compte pro** — Formulaire inscription (entreprise, interlocuteur, upload KBIS/RIB) + texte réassurance
- [ ] **FAQ** — Accordéon, 6 catégories, 19 questions



### Espace client (Mois 1 → Mois 2)

- [x] Connexion e-mail + mot de passe
- [x] Admin lie chantiers ↔ e-mails (N-N)
- [x] Dashboard vide → sélection du chantier
- [x] Graphiques : tonnage / % par typologie de déchets
- [x] Camemberts : % valorisation / % élimination
- [x] Historique des prestations (tableau 12 colonnes)
- [x] Export Excel / PDF de l'historique *(Mois 2 — livré)*
- [x] Upload admin des documents (BI, pesée, BSD) → téléchargement client
- [ ] Abonnement pro 35 € HT / mois *(Mois 2)*



### Règles métier (base de données)

- [x] N° d'intervention auto, unique (`INT-ANNÉE-00001`)
- [x] 5 types d'intervention : Dépose, Rotation, Retrait, Chargement sur place, Déplacement
- [x] 7 contenants : Benne 8/10/15/20/30 m³, Caisse palette 600 L, Fût 200 L
- [x] 16 types de déchets (9 non dangereux + 7 dangereux)
- [x] 5 statuts : En cours de programmation, Programmé, Annulée, Réalisée, Passage à vide
- [x] Validation manuelle compte pro : CB obligatoire **ou** paiement sur facture *(Mois 2)*



### Zone géographique (CDC)

- [x] Île-de-France entière : 75, 77, 78, 91, 92, 93, 94, 95
- [x] Validation d'adresse à la commande alignée IDF *(Mois 2 — tunnel commande benne)*

---



## ✅ Ce qui est fait



### Infrastructure & dépôt

- [x] Projet cloné et ouvert dans Cursor (`C:\Users\redaa\Projects\coreenvironnement`)
- [x] Next.js 15 + React 19 + TypeScript + Tailwind + shadcn/ui
- [x] Déploiement Vercel configuré (`vercel.json`, région CDG)



### Supabase — schéma SQL (fichiers prêts)


| Migration                     | Contenu                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `001_initial_schema.sql`      | PostGIS, zones, catalogue déchets, commandes widget, RLS de base                         |
| `002_dashboard_mois1.sql`     | Profils, chantiers, membres N-N, interventions, documents, stats graphiques, comptes pro |
| `003_zones_ile_de_france.sql` | 8 départements IDF, zone « Île-de-France », désactivation zone prototype Élancourt       |
| `010_commandes_tunnel.sql`    | Colonnes tunnel commande benne (audience, prestation, paiement Stripe, contact)          |
| `011_commande_intervention.sql` | Lien `interventions.commande_id` → commande widget                                     |


**Tables principales Mois 1 :** `profiles`, `chantiers`, `chantier_membres`, `interventions`, `intervention_documents`, `chantier_stats_dechets`, `chantier_stats_valorisation`, `comptes_pro`, référentiels (`types_intervention`, `types_contenants`, `dechets_types`, `statuts_intervention`, `departements_idf`).

### Supabase — branchement applicatif

- [x] Packages `@supabase/supabase-js` et `@supabase/ssr` installés
- [x] `lib/supabase/client.ts` — client navigateur
- [x] `lib/supabase/server.ts` — client serveur (cookies)
- [x] `lib/supabase/middleware.ts` + `middleware.ts` — refresh session
- [x] `.env.local.example` + `.env.local` (clés configurées par le client)
- [x] Test connexion API Supabase OK



### Référentiels & contenu CDC (code)

- [x] `lib/cdc/referentiels.ts` — types intervention, contenants, déchets, statuts, colonnes historique, abonnement 35 €
- [x] `lib/cdc/contenu-vitrine.ts` — textes intégraux hero, services, engagements, comment ça marche, compte pro, FAQ, espace client



### Auth & espace client (première version)

- [x] Page `/login` — formulaire e-mail + mot de passe
- [x] Route `/auth/callback` — échange code session (PKCE)
- [x] Route `/auth/logout` — déconnexion
- [x] Page `/dashboard` — protégée, redirige si non connecté
- [x] État vide CDC : message si aucun chantier lié à l'e-mail
- [x] Affichage liste des chantiers liés (si l'admin en a créé)
- [x] Lien « Espace client » dans le header



### Prototype vitrine (hérité — à remplacer Mois 3)

- [x] Homepage basique avec widget commande benne (UI 3 étapes, **sans persistance**)
- [x] Section réassurance + témoignages
- [x] Page `/pro` placeholder
- [x] Catalogue forfaits en dur (`lib/prestations.ts`) — zone encore « Élancourt 20 km » côté UI
- [x] Géocodage simulé (`lib/geo/mock-geocode.ts`)

> ⚠️ Le prototype vitrine **ne correspond pas** au CDC final. Les textes CDC sont prêts dans `lib/cdc/` ; l'UI sera refaite au Mois 3.

---



## 🔲 Ce qui reste à faire



### Mois 1 — Priorité immédiate



#### Base de données (côté Supabase Dashboard)

- [ ] Confirmer que les **3 migrations SQL** sont exécutées sans erreur
- [ ] Extension **PostGIS** activée
- [ ] Bucket Storage `intervention-documents` créé (privé)
- [ ] Politiques Storage : lecture client si accès chantier, écriture admin
- [ ] Compte **admin** créé + `UPDATE profiles SET role = 'admin'`



#### Back-office admin (`/admin`)

- [x] Layout admin protégé (rôle `admin` uniquement)
- [x] CRUD **chantiers** (nom, adresse, code affaire, prestataire)
- [x] Gestion **chantier_membres** — lier / délier des e-mails à un chantier
- [x] CRUD **interventions** (tous les champs du tableau CDC)
- [x] **Upload** BI, bon de pesée, BSD par intervention
- [x] Saisie **stats déchets** par chantier (tonnages par typologie)
- [x] **Valorisation calculée** via prestataire + taux annuels (plus de saisie manuelle %)



#### Dashboard client (`/dashboard`) — compléter

- [x] **Sélecteur de chantier** (barre de sélection, un chantier actif à la fois)
- [x] État vide tant qu'aucun chantier sélectionné
- [x] **Diagramme** tonnage et % par typologie de déchets (Recharts)
- [x] **Camemberts** valorisation / élimination
- [x] Onglet **Historique des prestations**
- [x] Page **historique** — tableau 12 colonnes + liens téléchargement documents
- [x] Jeu de **données de démo** (`006_demo_seed.sql`)



#### Sécurité & tests Mois 1

- [ ] Tests RLS : un client A ne voit pas les chantiers du client B
- [ ] Tests upload / download documents
- [ ] Vérifier numérotation unique des interventions sous charge

---



### Mois 2 — Admin, paiements, export



#### Formulaire compte pro

- [x] Page « Créer mon compte pro » (`/pro` — champs CDC § entreprise, interlocuteur, uploads)
- [x] Upload KBIS + RIB → Supabase Storage (`compte-pro-documents`)
- [x] Workflow **validation manuelle** admin : approuver / refuser (`/admin/comptes-pro`)
- [x] Choix admin par dossier : **CB obligatoire** ou **paiement sur facture**
- [x] E-mail confirmation ouverture de compte *(code Resend ✅ — **config `RESEND_API_KEY` reportée** → § À revenir)*



#### Abonnement & paiements

- [x] Stripe — abonnement **35 € HT / mois** (Checkout + portail client, `/pro`)
- [x] Paiement CB particulier à la commande benne *(Checkout Stripe + webhook + e-mail confirmation)*
- [x] Paiement différé 30 j pour pros validés *(mode `invoice` défini à la validation admin)*
- [x] Webhooks Stripe compte pro + commandes benne (`/api/stripe/webhook`)



#### Tunnel commande benne

- [x] Brancher le widget à Supabase (`app/order/actions.ts`, migration `010`)
- [x] Persistance commandes particulier (statut `brouillon` → `confirmee` via webhook)
- [x] Vue admin `/admin/commandes` — liste + fiche + changement de statut
- [x] Création intervention liée à la commande (admin → fiche commande → « Créer l'intervention »)
- [x] Validation adresse **Île-de-France** (8 départements, `lib/geo/idf.ts`)
- [x] E-mail confirmation commande *(code webhook → Resend ✅ — **config + test reportés** → § À revenir)*
- [ ] Rappel expert déchets (notification / CRM)



#### Historique & reporting

- [x] Export **Excel** de l'historique des prestations
- [x] Export **PDF** de l'historique
- [ ] Récapitulatif mensuel volumes / valorisation (compte pro)

---



### Mois 3 — Vitrine CDC & mise en production

> **En cours (12/09/2026)** — vitrine LM Arena migrée dans Next.js (`components/vitrine/`) · hero + sections CDC · commande en **modale** (vrai `OrderWidget` + Stripe).

#### Ordre de livraison suggéré (vitrine)

1. Hero CDC + bouton « Commander une benne » → scroll `#commande`
2. Nos services (4 cartes flip)
3. Nos engagements (4 blocs)
4. Comment ça fonctionne (toggle particulier / pro)
5. Section compte pro + lien `/pro`
6. FAQ (accordéon 6 catégories)
7. Footer (mentions, contact — textes client)
8. Metadata SEO + assets hero

#### Page d'accueil (contenu `lib/cdc/contenu-vitrine.ts`)

- [x] Hero — image camion + Paris + titres CDC (`components/vitrine/vitrine-hero.tsx`)
- [x] Bouton **« Commander une benne »** → modale avec `OrderWidget` (Stripe)
- [x] Section **Nos services** — 4 cartes (CDC ; flip LM Arena à affiner)
- [x] Section **Nos engagements** — 4 blocs CDC
- [x] Section **Comment ça fonctionne** — particulier / pro (texte CDC)
- [x] Section **Compte pro** — teaser + lien `/pro`
- [ ] Section **FAQ** — accordéon 6 catégories / 19 questions
- [x] Footer vitrine (structure ; mentions légales client à compléter)



#### Assets & SEO

- [ ] Image hero (camion, benne, Paris / Tour Eiffel)
- [ ] Logo et logos clients partenaires
- [ ] Metadata SEO alignée CDC (Île-de-France, 24h, suivi digital)
- [ ] Remplacer tous les textes « Élancourt / 78 / 20 km »



#### Qualité & sécurité avant ouverture

- [ ] Revue sécurité RLS complète
- [ ] Tests parcours particulier et pro
- [ ] Tests mobile
- [ ] Performance (Lighthouse)
- [ ] Variables d'environnement Vercel (prod)
- [ ] Monitoring erreurs (optionnel : Sentry)

---



## Architecture cible (simplifiée)

```
Visiteur / Client                    Admin CORE ENVIRONNEMENT
      │                                        │
      ▼                                        ▼
┌─────────────┐                         ┌─────────────┐
│  Vitrine    │                         │   /admin    │
│  (Mois 3)   │                         │  back-office│
└──────┬──────┘                         └──────┬──────┘
       │                                       │
       ▼                                       ▼
┌─────────────┐    Auth JWT    ┌──────────────────────────┐
│   /login    │◄──────────────►│      Supabase            │
│  /dashboard │                │  Auth · PostgreSQL · RLS │
└─────────────┘                │  Storage · Edge (futur)  │
                               └──────────────────────────┘
```

---



## Fichiers clés du projet

```
coreenvironnement/
├── app/
│   ├── page.tsx                 # Homepage prototype (Mois 3 : refonte CDC)
│   ├── login/page.tsx           # ✅ Connexion
│   ├── dashboard/page.tsx       # ✅ Dashboard v1 (à compléter)
│   ├── pro/page.tsx             # Placeholder compte pro
│   └── auth/
│       ├── callback/route.ts    # ✅ Callback OAuth/PKCE
│       └── logout/route.ts      # ✅ Déconnexion
├── components/
│   ├── login-form.tsx           # ✅
│   ├── order-widget.tsx         # Tunnel commande benne (3 étapes, Stripe particulier)
│   └── site-header.tsx          # ✅ + lien Espace client
├── lib/
│   ├── cdc/
│   │   ├── referentiels.ts      # ✅ Référentiels métier CDC
│   │   └── contenu-vitrine.ts   # ✅ Textes vitrine CDC
│   └── supabase/                # ✅ Clients Supabase
├── supabase/migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_dashboard_mois1.sql
│   └── 003_zones_ile_de_france.sql
├── middleware.ts                # ✅ Session Supabase
├── .env.local                   # Clés (local, gitignored)
└── docs/
    └── PLAN-PROJET.md           # ← Ce document
```

---



## Prochaines actions recommandées (ordre)

1. ~~**Vérifier** migrations SQL + PostGIS + bucket Storage sur Supabase~~ ✅ Fait (22/07/2026)
2. ~~**Créer** compte admin et tester login → `/dashboard`~~ ✅ Fait
3. **En cours sans client** — `/admin` + dashboard pro (voir section ci-dessous)
4. **Après réponse client** — valider espace particulier + source des stats
5. **Compléter** `/dashboard` — graphiques + historique + documents
6. Enchaîner **Mois 2** (compte pro, Stripe, export)

---

## ⏳ Décisions en attente — réponse client

> **Statut :** en attente (depuis 22/07/2026)  
> **Action quand réponse reçue :** cocher ici, mettre à jour « Notes & décisions », ajuster le dashboard particulier si besoin.

| # | Question | Hypothèse de travail (en attendant) | Réponse client |
|---|----------|-------------------------------------|----------------|
| 1 | Comment alimenter les graphiques (tonnages, % valorisation) ? | **Validé client** — tonnages saisis admin ; valorisation **calculée** via prestataire + taux annuels | ✅ Validé |
| 2 | Créer des données de démo (1–2 chantiers fictifs) ? | Oui, pour dev et démo interne | _En attente_ |
| 3 | Espace **particulier** : suivi statuts + factures uniquement (sans abonnement) ? | Oui — proposition dev validée en interne | _En attente confirmation client_ |
| 4 | Création compte : admin envoie un **lien d'invitation** ? | Oui — aligné CDC compte pro | _En attente_ |

### Déjà tranché en interne (en attendant confirmation)

- **Pro** : dashboard complet (chantiers, graphiques, historique, BSD/BI/pesée), abonnement 35 € HT/mois.
- **Particulier** : espace simplifié — suivi d'avancement (statuts) + accès aux factures, **sans** abonnement.
- **Admin** : envoie un lien pour que le client configure son mot de passe (pas de mot de passe créé manuellement).

---

## 🚀 Travail en parallèle (sans bloquer sur le client)

Ces tâches **ne dépendent pas** de la réponse client et font avancer le Mois 1 :

| Priorité | Tâche | Pourquoi c'est safe |
|----------|-------|---------------------|
| **P1** | Back-office `/admin` (chantiers, lier e-mails, interventions) | ✅ v1 livrée (22/07/2026) |
| **P1** | Upload documents → bucket `intervention-documents` | CDC explicite (admin upload, client télécharge) |
| **P1** | Saisie stats déchets + valorisation dans `/admin` | Hypothèse par défaut = saisie manuelle |
| **P2** | Dashboard pro : sélecteur chantier + graphiques | Structure pro validée CDC ; particulier = variante plus tard |
| **P2** | Page historique interventions (tableau 12 colonnes) | Identique pour le cœur pro |
| **P2** | Jeu de données de démo (seed SQL ou via admin) | Utile même si le client dit non (supprimable) |
| **P3** | Flow invitation par lien (Supabase invite / magic link) | Aligné CDC + votre réponse interne |
| **P3** | Garde admin (middleware : `role = admin` pour `/admin`) | Sécurité indispensable |

**On ne fait pas encore** (attendre client ou Mois 2) :

- Espace particulier détaillé (statuts + factures UI)
- Stripe / abonnement 35 €
- Export Excel/PDF
- Vitrine Mois 3

---

## Notes & décisions


| Sujet                | Décision                                                          |
| -------------------- | ----------------------------------------------------------------- |
| Source de vérité     | Cahier des charges client (pas le prototype Élancourt)            |
| Zone                 | Île-de-France — 8 départements                                    |
| Abonnement pro       | 35 € HT / mois — **pro uniquement**, pas les particuliers         |
| Validation pro       | Manuelle — admin choisit CB ou facture                            |
| Espace particulier   | Suivi statuts + factures (proposition interne — confirmation client en attente) |
| Création comptes     | Admin envoie un lien d'invitation (proposition interne — confirmation en attente) |
| Contenu vitrine      | Prêt en `lib/cdc/contenu-vitrine.ts` — **UI Mois 3 en cours** (12/09/2026) |
| Mois 2 reporté       | E-mails Resend, tests Stripe, récap mensuel → § « À revenir après la vitrine » |
| Graphiques dashboard | Tonnages saisis admin · **taux valorisation calculé** (prestataire × typologie × année) — voir `lib/valorisation/calculate.ts` |
| Infra Supabase       | Migrations 001–003 ✅ · PostGIS ✅ · Bucket `intervention-documents` ✅ · Admin ✅ · Login ✅ |


---



## Contact & ressources

- **Supabase Dashboard :** [supabase.com/dashboard](https://supabase.com/dashboard)
- **Doc Supabase Auth SSR :** [supabase.com/docs/guides/auth/server-side/nextjs](https://supabase.com/docs/guides/auth/server-side/nextjs)
- **Repo GitHub :** `coreenvironnement/coreenvironnement`

---

*Document maintenu par l'équipe de développement. Mettre à jour les cases* `[x]` *à chaque jalon livré.*