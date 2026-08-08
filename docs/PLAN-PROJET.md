# Plan projet — Core Environnement

> Document de suivi : cahier des charges client, avancement réel et reste à faire.  
> Dernière mise à jour : 22 juillet 2026  
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


**Nous sommes en : Mois 1** (dashboard client : sélecteur, graphiques, historique et téléchargement PDF opérationnels).

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
- [ ] Export Excel / PDF de l'historique *(Mois 2)*
- [x] Upload admin des documents (BI, pesée, BSD) → téléchargement client
- [ ] Abonnement pro 35 € HT / mois *(Mois 2)*



### Règles métier (base de données)

- [x] N° d'intervention auto, unique (`INT-ANNÉE-00001`)
- [x] 5 types d'intervention : Dépose, Rotation, Retrait, Chargement sur place, Déplacement
- [x] 7 contenants : Benne 8/10/15/20/30 m³, Caisse palette 600 L, Fût 200 L
- [x] 16 types de déchets (9 non dangereux + 7 dangereux)
- [x] 5 statuts : En cours de programmation, Programmé, Annulée, Réalisée, Passage à vide
- [ ] Validation manuelle compte pro : CB obligatoire **ou** paiement sur facture *(Mois 2)*



### Zone géographique (CDC)

- [x] Île-de-France entière : 75, 77, 78, 91, 92, 93, 94, 95
- [ ] Validation d'adresse à la commande alignée IDF *(Mois 2, avec tunnel commande)*

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

- [ ] Page « Créer mon compte pro » (champs CDC § entreprise, interlocuteur, uploads)
- [ ] Upload KBIS + RIB → Supabase Storage
- [ ] Workflow **validation manuelle** admin : approuver / refuser
- [ ] Choix admin par dossier : **CB obligatoire** ou **paiement sur facture**
- [ ] E-mail confirmation ouverture de compte



#### Abonnement & paiements

- [ ] Stripe — abonnement **35 € HT / mois** (espace client pro)
- [ ] Paiement CB particulier à la commande benne
- [ ] Paiement différé 30 j pour pros validés
- [ ] Webhooks Stripe (confirmation, échec, renouvellement)



#### Tunnel commande benne

- [ ] Brancher le widget (ou nouveau tunnel) à Supabase
- [ ] Persistance commandes + création intervention liée
- [ ] Validation adresse **Île-de-France** (8 départements)
- [ ] E-mail confirmation commande
- [ ] Rappel expert déchets (notification / CRM)



#### Historique & reporting

- [ ] Export **Excel** de l'historique des prestations
- [ ] Export **PDF** de l'historique
- [ ] Récapitulatif mensuel volumes / valorisation (compte pro)

---



### Mois 3 — Vitrine CDC & mise en production



#### Page d'accueil (contenu `lib/cdc/contenu-vitrine.ts`)

- [ ] Hero — image camion + Tour Eiffel + titres CDC
- [ ] Bouton **« Commander une benne »** → ouverture formulaire (dialog ou scroll)
- [ ] Section **Nos services** — 4 cartes flip CSS/Framer Motion
- [ ] Section **Nos engagements** — 4 blocs
- [ ] Section **Comment ça fonctionne** — toggle particulier / pro
- [ ] Section **Compte pro** — formulaire + texte réassurance
- [ ] Section **FAQ** — accordéon 6 catégories / 19 questions
- [ ] Footer (mentions légales, contact, CGV — à définir avec le client)



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
│   ├── order-widget.tsx         # Prototype commande (Mois 2 : brancher)
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
| Contenu vitrine      | Prêt en `lib/cdc/contenu-vitrine.ts`, UI au Mois 3                |
| Graphiques dashboard | Tonnages saisis admin · **taux valorisation calculé** (prestataire × typologie × année) — voir `lib/valorisation/calculate.ts` |
| Infra Supabase       | Migrations 001–003 ✅ · PostGIS ✅ · Bucket `intervention-documents` ✅ · Admin ✅ · Login ✅ |


---



## Contact & ressources

- **Supabase Dashboard :** [supabase.com/dashboard](https://supabase.com/dashboard)
- **Doc Supabase Auth SSR :** [supabase.com/docs/guides/auth/server-side/nextjs](https://supabase.com/docs/guides/auth/server-side/nextjs)
- **Repo GitHub :** `coreenvironnement/coreenvironnement`

---

*Document maintenu par l'équipe de développement. Mettre à jour les cases* `[x]` *à chaque jalon livré.*