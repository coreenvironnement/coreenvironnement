# Propositions de copy vitrine particulier — textes complets

**Statut :** document de rédaction uniquement. **Aucune intégration code** dans ce livrable (sauf correctifs techniques déjà commités en `b44de8c`).  
**Sources lues :** `lib/cdc/contenu-vitrine.ts`, `lib/seo/landing-variants.ts`, `app/page.tsx`, pages hub/guides, composants vitrine particulier, tunnel commande (`order-widget`, `embedded-checkout`, `checkout-reassurance-banner`).  
**Professionnels :** voir [`copy-professionnels-proposition.md`](./copy-professionnels-proposition.md).

**Principe :** besoin → réponse → preuve → action. Le prix et le tarif doivent apparaître **dès que l’adresse, le déchet et le volume sont connus**, avant l’étape d’engagement (paiement particulier ou envoi de demande pro).

---

## `/` — Accueil particulier

### Métadonnées (title, description, siteName)

**Actuel (complet) :**

- Title : `Location de benne en Île-de-France | Core Environnement`
- Meta description : `Des travaux ou un débarras ? Choisissez une benne adaptée à vos déchets, consultez le tarif selon votre adresse et réservez la livraison en ligne.`
- Open Graph siteName : `Core Environnement`
- JSON-LD : `faqSource="particulier"`, `websiteName` = siteName accueil, `description` = meta description, `aggregateRating` présent (badge hero)

**Proposé (complet) :**

- Title : `Location de benne en Île-de-France | CORE ENVIRONNEMENT`
- Meta description : `Des travaux ou un débarras ? Indiquez votre adresse et vos déchets : le tarif TTC s’affiche avant le paiement. Réservez la livraison en ligne en Île-de-France.`
- Open Graph siteName : `CORE ENVIRONNEMENT`
- JSON-LD : inchangé côté structure (`particulier` + rating si badge affiché)

**Problème résolu :** harmonisation du nom de marque dans le title document sans toucher au H1 visuel.

---

### Hero — H1, intro, badge, carte commande

**Actuel (complet) :**

- H1 : `Louez une benne pour vos travaux en Île-de-France` (ligne 2 vide)
- Intro : `Rénovation ou débarras : choisissez votre benne en ligne. Nous organisons sa livraison, son enlèvement et le traitement des déchets acceptés.` (`DEFAULT_VARIANT.intro`)
- Badge Google hero : note agrégée affichée (`GoogleRatingBadge`)
- Carte hero — titre : `Trouvez votre benne et consultez son tarif`
- Carte hero — champ : `Où faut-il livrer la benne ?` / placeholder `Saisissez l’adresse de livraison`
- CTA hero particulier : ouverture tunnel commande (libellé bouton selon contexte carte)
- Bandeau réassurance mobile (3 slides) :
  1. `Livraison possible sous 24 h` — `Selon votre adresse de livraison et les disponibilités.`
  2. `Suivi de commande en ligne` — `Consultez l’avancement de votre commande depuis votre espace client.`
  3. `Livraison en Île-de-France` — `Livraison et enlèvement à l’adresse de vos travaux ou de votre débarras.`

**Proposé (complet) :**

- H1 : `Louez une benne pour vos travaux en Île-de-France`
- Intro : `Rénovation ou débarras : indiquez votre adresse et le type de déchets. Le tarif TTC s’affiche avant le paiement ; nous organisons ensuite la livraison, l’enlèvement et le traitement en centre agréé.`
- Badge Google : texte inchangé (aligné sur `SITE_GOOGLE_RATING` / review count)
- Carte hero — titre : `Estimez votre tarif et choisissez votre benne`
- Carte hero — champ : `Où faut-il livrer la benne ?` / placeholder `Saisissez l’adresse de livraison (Île-de-France)`
- Sous-texte carte (si ajout micro-copy UI) : `Le montant s’affiche dès que l’adresse, le déchet et le volume sont renseignés.`
- Bandeau réassurance : textes actuels maintenus

**Problème résolu :** l’intro et la carte expriment explicitement que le **prix précède** le paiement, sans impliquer « d’abord la zone, puis la commande, puis le prix ».

---

### Section parcours — « Louer une benne en 4 étapes »

**Actuel (complet) :** (`particulierAccueil.parcours`)

- Eyebrow : `Comment ça se passe`
- Titre : `Louer une benne en 4 étapes`
- Intro : `Pour vos travaux ou un débarras, une benne sur place vous évite des allers-retours à la déchetterie.`
- Étape 01 — `Choisissez votre benne` : `Indiquez votre adresse, le type de déchets et le volume. Vous voyez le prix avant de payer.` + lien `Je ne sais pas quelle benne choisir`
- Étape 02 — `On vous livre la benne` : `Le chauffeur la dépose à l’adresse indiquée. On vous contacte si besoin pour vérifier l’accès du camion.`
- Étape 03 — `Remplissez la benne` : `Déposez les déchets prévus dans votre forfait, sans dépasser le bord de la benne.`
- Étape 04 — `On récupère la benne` : `Demandez le retrait quand vous avez fini. Vos déchets sont ensuite traités en centre agréé.`
- CTA section : `Voir les bennes et les tarifs`

**Proposé (complet) :**

- Eyebrow, titre, étapes 02 à 04, CTA : **identiques à l’actuel**
- Étape 01 — texte : `Indiquez votre adresse, le type de déchets et le volume : le tarif TTC s’affiche immédiatement. Vous validez ensuite la réservation et le paiement en ligne.`
- Lien estimateur : `Je ne sais pas quelle benne choisir` (inchangé)

**Problème résolu :** ordre mental prix → engagement clarifié dès l’étape 01.

---

### Section « Pourquoi Core Environnement »

**Actuel (complet) :**

- Eyebrow : `Pourquoi Core Environnement`
- Titre : `Votre benne, l’esprit tranquille`
- Carte suivi : titre `Vous savez quand elle arrive` — `Suivez votre commande en direct et consultez l’heure prévue de livraison.`
- Carte prix : titre `Vous connaissez le prix avant de payer` — `Votre tarif s’affiche avant de confirmer votre réservation.`
- Carte valorisation : titre `Vos déchets deviennent des ressources` — `99 % des déchets pris en charge sont valorisés.`
- CTA : `Voir les bennes et les tarifs`

**Proposé (complet) :**

- Eyebrow, titre, cartes suivi et prix, CTA : **inchangés**
- Carte valorisation — texte : `Vos déchets sont orientés vers des centres de tri et de valorisation agréés en Île-de-France. Notre engagement interne vise plus de 90 % de valorisation sur les flux collectés (hors déchets non valorisables).`

**Problème résolu :** retrait du **99 %** non sourcé ; alignement possible avec l’engagement rédactionnel `engagements[3]` du CDC **sans** afficher un second pourcentage contradictoire sur l’accueil (formulation engagement, pas statistique client).

*Alternative si le client refuse tout chiffre sur l’accueil :* `Tri et acheminement vers des filières agréées, avec un interlocuteur unique jusqu’au traitement.`

---

### Section conseils — préparation

**Actuel (complet) :** (`particulierAccueil.conseils` + sous-blocs)

- Eyebrow : `AVANT DE COMMANDER`
- Titre : `Bien préparer votre location de benne`
- Intro : `Trois repères simples pour choisir et préparer la livraison.`
- Carte volume : `LE VOLUME` / `Quelle taille choisir ?` / `Estimez le volume de vos déchets pour choisir une benne adaptée.` / note `Une estimation pour vous guider.` / CTA `Estimer mon volume`
- Carte accès : specs `3 m` large, `4 m` haut, `10 à 12 m` pour la pose ; `Dans la rue ? Une autorisation est nécessaire.` / lien démarches AOT
- Carte déchets : `Que mettre dans la benne ?` / `Gravats, bois, cartons… Vérifiez ce que votre benne peut recevoir avant de la remplir.` / CTA `Vérifier mes déchets`
- Bloc conseiller : `Un doute sur la taille, l’accès ou vos déchets ?` — `Notre équipe vous aide à faire le bon choix.` — CTA `Parler à un conseiller`

**Proposé (complet) :**

- **Texte intégral identique à l’actuel**, sauf micro-ajustement carte volume note : `Une estimation pour vous guider, puis votre tarif en ligne selon adresse et déchet.`

**Problème résolu :** lien implicite estimateur → tarif sans promettre un ordre de tunnel inexact.

---

### FAQ particulier (accueil)

**Actuel (complet) :** (`particulierFaq` — 8 paires Q/R affichées + titres section `Vos questions sur la location de benne` / intro `Les informations utiles pour choisir votre benne, préparer la livraison et suivre votre commande.`)

1. **À partir de quand puis-je recevoir ma benne ?** — `La livraison est proposée à partir du lendemain de votre commande, selon les disponibilités. Choisissez votre date parmi celles proposées dans le calendrier.`
2. **Combien coûte une benne pour un particulier ?** — `Le tarif dépend de votre adresse, des déchets et du volume choisi. Renseignez ces informations pour consulter le montant TTC avant le paiement.`
3. **Puis-je commander entièrement en ligne ?** — `Oui. Le choix de la benne, les informations de livraison et le paiement se font en ligne. Notre équipe reste disponible par téléphone si vous souhaitez être conseillé.`
4. **Comment choisir le volume de ma benne ?** — `L'estimateur disponible dans la commande vous aide à évaluer votre besoin. La nature des déchets et leur poids comptent également dans le choix de la benne.` + lien guide volume (URL absolue prod)
5. **Que se passe-t-il après le paiement ?** — `Vous recevez un e-mail de confirmation. Nous vous contactons si nécessaire pour préparer la livraison. Vous pouvez également suivre l'avancement de votre commande depuis votre espace client.`
6. **Quels déchets ne vont pas dans une benne classique ?** — `Une benne classique n'accepte notamment pas l'amiante, les produits chimiques et les peintures liquides. Contactez-nous avant de réserver si vous hésitez sur un déchet.`
7. **Dois-je être présent lors de la livraison ?** — `Votre présence n'est pas obligatoire si l'accès est libre. Prévoyez un contact joignable par téléphone pour guider le chauffeur si nécessaire.`
8. **Jusqu'où puis-je remplir la benne ?** — `Remplissez la benne sans dépasser le haut des parois et respectez la limite de poids indiquée. Le chargement doit permettre un transport en sécurité.`

**Proposé (complet) :**

- Questions 1, 2, 3, 5, 6, 7, 8 : **identiques**
- Question 4 — lien interne : remplacer l’URL absolue par `/location-benne/volume` dans le texte affiché du lien « Voir le guide des volumes »
- Titres de section : inchangés

**Problème résolu :** maillage interne relatif ; contenu déjà conforme à « tarif avant paiement ».

---

### CTA final et espace client vitrine

**Actuel (complet) :** (`finalCta` + `espaceClientVitrine`)

- CTA final eyebrow : `Votre chantier, notre priorité`
- Titre : `Besoin d'une benne` + `en Île-de-France ?`
- Description : `Commandez votre benne en quelques minutes et laissez CORE ENVIRONNEMENT coordonner la suite, de la dépose jusqu'au traitement de vos déchets.`
- CTA primaire : `Commander une benne` ; secondaire : `Nous contacter`
- Réassurance : `Intervention sous 24h*`, `E-mail de confirmation`, `Traçabilité`, `Toute l'Île-de-France` ; note `*Selon disponibilités, hors week-ends et jours fériés.`
- Espace client vitrine : `Bientôt disponible` / `Le suivi en ligne arrive. Aujourd'hui, on vous rappelle.` + description + `Espace client — bientôt disponible`

**Proposé (complet) :**

- **Bloc final CTA : texte intégral inchangé** (déjà footnote délai cohérente)
- Espace client : **inchangé** (ne pas promettre suivi temps réel tant que l’accès n’est pas ouvert)

**Problème résolu :** aucune sur-promesse sur le suivi en ligne vitrine.

---

### Bandeau succès commande (`?order=success`)

**Actuel :** `Paiement reçu. Votre commande est confirmée. Vous recevrez un e-mail de confirmation sous peu.`

**Proposé :** identique.

**Problème résolu :** —

---

## `/location-benne` — Hub géographique

### Métadonnées et hero

**Actuel (complet) :**

- Title : `Location de benne en Île-de-France · communes desservies | CORE ENVIRONNEMENT`
- Meta : `Dès 330 € HT, tarif selon adresse et déchet, commande en 2 minutes. Paris, petite et grande couronne : commande en ligne CORE ENVIRONNEMENT.`
- H1 L1 : `Location de benne en Île-de-France`
- H1 L2 : `Commande en ligne, tarif avant validation`
- Intro hero : `Dès 330 € HT · tarif selon adresse et déchet · commande en 2 minutes.`
- Chip : `Gestion des déchets · Île-de-France`

**Proposé (complet) :**

- Title : `Communes desservies — location de benne en Île-de-France | CORE ENVIRONNEMENT`
- Meta : `Dès 330 € HT. Retrouvez Paris (75) et les 7 départements d’Île-de-France (77, 78, 91, 92, 93, 94, 95). Tarif selon adresse et déchet, affiché avant validation de la commande.`
- H1 L1 : `Location de benne en Île-de-France`
- H1 L2 : `Trouvez votre commune ou votre département`
- Intro hero : `Parcourez les fiches par département et par commune. Indiquez ensuite votre adresse dans le tunnel : le tarif s’affiche avant de confirmer la commande.`
- Chip : inchangé

**Problème résolu :** formulation **8 départements** exacte (plus seulement « petite couronne ») ; le hub n’invite pas à « choisir une zone puis commander pour enfin voir le prix ».

---

### Intro maillage (bloc listes dept/villes)

**Actuel :** libellés UI des listes SEO existantes (composants hub) sans phrase d’ancrage unique longue.

**Proposé (complet) — paragraphe d’introduction au-dessus des listes :**

`CORE ENVIRONNEMENT dessert l’ensemble de l’Île-de-France : Paris (75), Seine-et-Marne (77), Yvelines (78), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94) et Val-d’Oise (95). Chaque fiche rappelle les modalités de commande en ligne et les repères tarifaires selon votre adresse.`

**Problème résolu :** ancrage géo fidèle au maillage réel (8 dept + Paris).

---

## `/location-benne/volume` — Guide volume

### Métadonnées et introduction

**Actuel (complet) :**

- Title : `Quel volume de benne choisir ? Guide m³ | CORE Environnement`
- Meta : `Estimez votre volume de déchets en m³, comparez les bennes et comprenez le rôle du poids avant de consulter votre tarif en Île-de-France.`
- Intro : `Vous préparez des travaux ou un débarras ? Pour choisir votre benne, deux éléments comptent : la place occupée par vos déchets et leur poids. Voici des repères simples pour estimer votre volume et comparer les offres de CORE ENVIRONNEMENT en Île-de-France.`

**Proposé (complet) :**

- Title : `Quel volume de benne choisir ? Guide m³ | CORE ENVIRONNEMENT`
- Meta : **identique**
- Intro : `Vous préparez des travaux ou un débarras ? Estimez d’abord le volume (m³) et le poids de vos déchets avec les repères ci-dessous. Vous pourrez ensuite saisir votre adresse en ligne : le tarif du forfait choisi s’affiche avant le paiement.`

**Problème résolu :** enchaînement estimation → tarif en ligne, sans inverser engagement et prix.

---

### CTA guide volume

**Actuel :** liens vers estimateur `/#estimer-volume`, commande `/#parcours`, grilles tarifaires exemples 330 € HT / 396 € TTC (8 m³ gravats propres, etc.)

**Proposé (complet) :**

- Bouton principal : `Voir mon tarif en ligne`
- Sous-texte : `Adresse, déchet, volume : le montant TTC apparaît avant le paiement.`
- Conserver les **exemples de prix** du tableau actuel (déjà factuels dans `VOLUME_GUIDE_PRICING_ROWS`)

**Problème résolu :** CTA orienté tarif, pas seulement « commander ».

---

## `/location-benne/dechets-acceptes` — Guide déchets

### Métadonnées et introduction

**Actuel (complet) :**

- Title : `Déchets acceptés dans une benne : guide | CORE Environnement`
- Meta : `Gravats, terre, bois, plâtre, encombrants : découvrez les points à vérifier avant de remplir votre benne et les déchets nécessitant une collecte spécifique.`
- Intro : `Vous préparez une rénovation, des travaux ou un débarras ? Identifier vos déchets avant de réserver vous aide à choisir la bonne offre et à préparer le chargement. Retrouvez les points à vérifier pour vos gravats, votre terre, vos encombrants et les autres matériaux à évacuer.`
- Encart : `La règle à retenir : déposez uniquement les déchets acceptés dans l’offre choisie lors de votre commande. Une benne pour gravats propres et une benne pour déchets mélangés ne se remplissent pas de la même façon.`

**Proposé (complet) :**

- Title : suffixe marque `CORE ENVIRONNEMENT` (cohérence)
- Meta, intro, encart : **textes intégraux inchangés**

**Problème résolu :** homogénéité marque uniquement.

---

### Bloc « Demander conseil »

**Actuel :** section conseil fin de guide (téléphone + formulaire de contact selon composant guide).

**Proposé (complet) :**

- Titre : `Un doute sur un déchet ?`
- Texte : `Appelez-nous avant de réserver si un matériau n’apparaît pas dans le tableau ou si vous hésitez entre gravats propres et mélange. Nous vous indiquons l’offre adaptée et le tarif affiché en ligne pour votre adresse.`
- CTA téléphone : libellé `Appeler un conseiller` + `07 53 70 57 27`

**Problème résolu :** incite à vérifier **avant** engagement, sans promettre de devis par téléphone systématique.

---

## Blocs partagés — tunnel, paiement, réassurance

### Étapes tunnel (libellés barre de progression)

**Actuel (complet) :** (`lib/order/tunnel-steps.ts`)

Particulier : `Votre demande` → `Benne` → `Informations` → `Récapitulatif` → `Paiement`  
Professionnel : dernière étape `Envoi` au lieu de `Paiement`

**Proposé :** **identique** (déjà clair sur la séparation pro/particulier).

**Problème résolu :** —

---

### Bannière réassurance checkout

**Actuel (complet) — particulier :**

- Titre : `Livraison et enlèvement inclus`
- Sous-titre : `Traitement des déchets acceptés compris`
- Puces : `Montant TTC affiché` ; `Confirmation par e-mail`
- Ligne téléphone : `Une question ?` + numéro

**Actuel — professionnel :**

- Titre : `De la livraison à l'enlèvement`
- Sous-titre : `CORE organise votre location de benne.`
- Puces : `Livraison sur place` ; `Traitement en centre agréé`

**Proposé (complet) — particulier :**

- Ajout sous-titre secondaire optionnel : `Le total TTC est indiqué sur le récapitulatif avant le paiement sécurisé.`
- Reste : inchangé

**Proposé — professionnel :** inchangé.

**Problème résolu :** renforce transparence tarifaire au moment du paiement CB.

---

### Note suivi post-checkout particulier

**Actuel :** `Suivez l’arrivée de votre benne en direct` / `Votre espace de suivi est créé automatiquement après la réservation…`

**Proposé :** identique (comportement produit réel après paiement).

**Problème résolu :** —

---

### Messages formulaire pro (tunnel sans Stripe)

**Actuel (extraits) :**

- Bouton final : `Envoyer ma demande de benne` / étape recap `Vérifier ma demande`
- Succès : `Votre demande a bien été transmise à CORE Environnement. Un expert…`
- Info contact : `Ces informations nous permettent de confirmer votre demande et de vous contacter pour organiser la livraison.`

**Proposé :** **identique** (déjà distinction demande vs commande payée).

**Problème résolu :** —

---

### Switch audience vers page pro

**Actuel :** `Vous gérez des chantiers ou des volumes réguliers ?` — lien `Accéder à la page pro`

**Proposé :** identique.

**Problème résolu :** —

---

## Écart valorisation (rappel décision copy)

| Emplacement | Actuel | Proposition accueil |
|-------------|--------|---------------------|
| Carte accueil | 99 % | Texte engagement sans 99 % (voir section Pourquoi) |
| Engagements site / pro | +90 % … | Garder **uniquement** là où l’engagement client est validé |
| FAQ générale recyclage | minimum 90 % | Maintenir si validé métier ; sinon formulation « filières agréées » |

**Problème résolu :** une seule logique chiffrée côté public, sourcée au CDC engagements.

---

## Questions métier (liste unique, copy particulier)

1. Valider formulation valorisation accueil : **sans %**, **90 % engagement**, ou autre chiffre audité ?
2. Règle exacte « sous 24 h » (heure limite, zones, week-ends) pour aligner hero, FAQ et CGV.
3. Périmètre du « dès 330 € HT » (référence 8 m³ gravats propres, zone standard) pour hub et guides.
4. Harmonisation définitive `Core Environnement` vs `CORE ENVIRONNEMENT` sur title homepage vs CDC.
5. Espace client particulier : quand le texte « bientôt » peut passer en promesse ouverte ?

---

*Fin du pack copy vitrine particulier. URL : [`seo-url-decisions.md`](./seo-url-decisions.md). Statut technique : [`chantier-seo-statut-technique.md`](./chantier-seo-statut-technique.md).*
