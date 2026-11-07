# Parcours QA manuel — espace professionnel

Checklist pour valider le flux bout en bout (sans automatisation). À exécuter sur un environnement avec Supabase et Stripe configurés.

## Prérequis

- Compte **admin** avec accès `/admin`.
- **Compte test pro** : inscription sur `/pro`, dossier complété.
- Dans `/admin/comptes-pro/[id]` : valider le compte, définir le **mode de paiement** (CB obligatoire ou facture), puis laisser le pro souscrire à l’abonnement jusqu’à `subscription_active`.

## 1. Admin — chantier et données

1. Créer ou ouvrir un **chantier** (`/admin/chantiers`).
2. Ajouter le **profil du pro test** comme membre du chantier (e-mail / lien `chantier_membres`).
3. Saisir des **stats déchets** et **interventions** visibles pour ce chantier.
4. Téléverser au moins un document par type utile au dashboard (BI, pesée, BSD) si prévu par l’UI admin.

## 2. Pro — abonnement et accès dashboard

1. Se connecter avec le compte pro.
2. Sur `/pro`, vérifier que l’**abonnement est actif** (Stripe synchronisé).
3. Ouvrir `/dashboard` : doit afficher le chantier (sélecteur) et les graphiques si des données existent.
4. Ouvrir `/dashboard/historique` : liste des interventions et exports (Excel/PDF) si données présentes.

## 3. Vérifications de garde-fou

- Avec abonnement **inactif** mais membre d’un chantier : `/dashboard` et `/dashboard/historique` doivent **rediriger** vers `/pro?reason=dashboard_subscription` avec message explicite sur `/pro`.
- Connexion **sans** `next` : utilisateur avec chantier + compte pro approuvé + abonnement actif → `/dashboard` ; sinon logique inchangée (`/mes-commandes` ou admin).

## 4. Tunnel commande professionnelle

- **Mode facture (`invoice`)** : utilisateur connecté avec dossier approuvé → étape paiement = **demande** (référence, e-mails) ; pas d’EmbeddedCheckout.
- **Mode CB (`cb_required`)** : connecté + approuvé → **paiement intégré** Stripe (même flux technique que le particulier). Déconnecté → invite à se connecter.
- Compte **sans** ligne `comptes_pro` : comportement **demande ponctuelle** inchangé (aucun blocage serveur inutile).

## 5. Régression rapide particulier

- Parcours **particulier** du tunnel : étape paiement et webhook inchangés (`order_type` `benne_particulier`).

## 6. Mon espace `/espace` (mobile ~390px)

- **Particulier** : `/espace/commandes` — cartes avec visuel benne, fil de statut, badge « Synchronisé il y a X s » (refresh ~30 s).
- **Pro** : onglets Commandes / Suivi chantier / Documents / Factures / Entreprise ; couleurs `#ECF4E9` / `#35A238`.
- **Connexion** : header → **Mon espace** → `/espace/commandes`.

## 7. Back-office admin (SaaS)

- Compte **admin** : `/espace` redirige vers `/admin/commandes` ; lien vitrine **Administration**.
- Client : `/admin` redirige vers `/espace/commandes`.
- Mobile : bottom nav + cartes commandes ; filtres **Particuliers / Pro**.
- `/admin/clients/particuliers` : liste agrégée ; fiche commande : changement de statut (select).
- **Audience B2C/B2B** : commande tunnel particulier → onglet **Particuliers** uniquement ; pro → **Professionnels** uniquement. Appliquer **`016_commandes_audience_backfill.sql`** sur les bases avec commandes `audience` NULL (sinon visibles seulement dans **Toutes**).

## 8. Factures, reçus et sièges pro

- Appliquer la migration **`015_compte_pro_seats.sql`** sur Supabase avant test sièges.
- **Factures** : commande `paid` + Stripe → bouton **Reçu** ouvre l’URL Stripe ; `waived` = texte sur facture.
- Abonnement actif : **Portail Stripe** sur `/espace/factures`.
- **Entreprise** : inviter e-mail → **Activer** siège → vérifier quantité abonnement Stripe (1 + sièges actifs).
