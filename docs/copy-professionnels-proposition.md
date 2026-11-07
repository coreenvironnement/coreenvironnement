# Proposition copy — `/professionnels` et parcours pro

**Statut :** brief rédactionnel uniquement. **Aucune modification** des composants `vitrine-professionnels-*` dans ce chantier.  
**Référence technique JSON-LD / titre :** commit `b44de8c`, détail dans [`chantier-seo-statut-technique.md`](./chantier-seo-statut-technique.md).

---

## Tableau prestations — preuve, conditions, formulation

Légende **preuve** : **code seulement** = décrit dans le dépôt sans validation terrain récente ; **testé** = parcours manuel documenté ou QA ; **confirmé métier** = accord client / ops (à cocher).

| Prestation / fonction | Preuve disponible | Conditions | Formulation possible (page ou tunnel) |
|----------------------|-------------------|------------|--------------------------------------|
| **Commande en ligne pro (tunnel vitrine)** | code seulement — `submitProfessionalBenneRequest`, pas de Stripe dans le flux vitrine | Île-de-France, champs entreprise + contact valides ; **demande étudiée** par l’équipe avant confirmation | « Transmettez votre demande de benne en ligne. Notre équipe confirme avec vous la livraison et les modalités de règlement avant intervention. » |
| **Compte pro `/pro` (KBIS, RIB)** | code seulement — pages `/pro`, `/inscription`, admin `comptes-pro` | Dossier déposé en ligne ; **validation manuelle** admin | « Ouvrez votre dossier sur `/pro` : KBIS de moins de 3 mois et RIB à joindre. » |
| **Abonnement 35 € HT / mois** | code seulement — `comptePro.abonnement`, `app/pro/stripe-actions.ts` | Compte **validé** avant activation Stripe ; mention CGV | « Après validation du dossier, activez l’abonnement espace client (35 € HT / mois) pour accéder au tableau de bord. » |
| **Facturation à 30 jours** | code seulement — CDC `comptePro`, mode paiement admin | Admin choisit **paiement sur facture** ou **CB obligatoire** par compte | « Règlement sur facture possible pour les comptes validés, selon les conditions acceptées à l’ouverture. » |
| **Paiement CB vs facture** | code seulement — `comptePro.validationAdmin`, referentiels admin | Pas de choix libre à l’inscription : **décision admin** | « Les modalités de règlement (carte ou facture) sont définies après étude de votre dossier. » |
| **Commande pro compte validé (espace client)** | code seulement — `/espace/commandes/nouvelle`, emails `demande-pro-*` | Compte approuvé + abonnement actif si requis ; peut créer commande **sur facture** | « Depuis votre espace, repassez commande sur vos chantiers enregistrés. » |
| **Rotations / benne longue durée** | code seulement — FAQ générale `faq` | Sur demande, planning chantier | « Rotations et locations longue durée : précisez votre besoin dans la demande ou par téléphone. » |
| **BSD / traçabilité** | code seulement — engagements + FAQ | **À la demande** ; pas de téléchargement libre-service documenté | « Les BSD et bons de pesée sont transmis par l’équipe lorsqu’ils sont disponibles. » |
| **Déchetteries professionnelles (5 centres)** | code seulement — `services` CDC « en cours de développement » | Offre **non** activée produit | « Accès réseau déchetteries pro : projet en cours, contactez-nous pour les besoins actuels. » |
| **Déchets dangereux / ADR** | code seulement — `services` CDC | **Sur devis**, hors tunnel self-service | « Déchets dangereux et contenants ADR : étude au cas par cas avec notre équipe. » |
| **Tunnel sans paiement immédiat (vitrine)** | testé — écran succès `order-widget`, pas d’appel `EmbeddedCheckout` en audience pro | Profil professionnel depuis hero `/professionnels` | « Votre demande a bien été transmise. Un expert vous recontacte pour confirmer l’intervention. » |
| **Espace client / dashboard pro** | code seulement — routes `/espace/*`, copy vitrine `espaceClientVitrine` « bientôt » pour le grand public | Accès après validation ; suivi chantier partiellement livré | Sur vitrine : ne pas promettre suivi temps réel ; sur `/professionnels` : « suivi des commandes confirmées » uniquement si compte ouvert |
| **Tarif HT affiché dans le tunnel pro** | code seulement — `forfaitHt` dans `prepareProfessionalBenneRequest` | Adresse IDF + prestation sélectionnée | « Le tarif HT de l’offre sélectionnée s’affiche au récapitulatif avant envoi de la demande. » |
| **Stripe particulier (CB immédiate)** | testé — `embedded-checkout`, webhooks | Audience particulier uniquement | Hors page pro : « Paiement sécurisé par carte après affichage du TTC. » |

---

## Soumission formulaire : demande vs commande confirmée

| Parcours | Comportement code | Rédaction CTA recommandée | Issue réelle |
|----------|-------------------|---------------------------|--------------|
| **Particulier vitrine** | Création commande + `EmbeddedCheckout` Stripe ; succès = paiement reçu | Primaire hero / final : `Commander une benne` ; paiement : `Payer …` (montant TTC connu) | **Commande confirmée** après paiement |
| **Pro vitrine (sans compte ou demande ponctuelle)** | `submitProfessionalBenneRequest` → e-mails admin/client ; **pas** de paiement | `Transmettre une demande de benne` / `Envoyer ma demande de benne` / recap `Vérifier ma demande` | **Demande à étudier** ; confirmation humaine |
| **Pro compte validé (espace)** | `create-pro-commande` + selon mode admin facture ou CB | `Valider la commande` / facture selon dossier | **Commande enregistrée** ; paiement selon mode compte |

Ne pas utiliser « Commander » seul sur `/professionnels` si l’issue est une **demande** sans paiement intégré.

---

## CTA recommandés (alignés issue)

| Emplacement | Formulation | Cible | Justification |
|-------------|-------------|-------|---------------|
| Hero carte commande | `Transmettre une demande` ou `Préparer ma demande` | Ouverture tunnel pro | Évite promesse de commande immédiate |
| Bloc compte | `Ouvrir un compte professionnel` | `/pro` | Parcours dossier + validation |
| Header secondaire | `Déjà client ? Connexion` | `/login` | Comptes existants |
| CTA final page | `Transmettre une demande de benne` | Tunnel | Cohérent avec envoi sans Stripe |
| FAQ / texte léger | `Créez votre accès sur /pro` | Onboarding | Distinct de la demande ponctuelle |

---

## Title & meta (proposition — déjà en partie dans le code post `b44de8c`)

**Actuel technique attendu après déploiement :**

- Title document : `Location de benne pour professionnels en Île-de-France | CORE ENVIRONNEMENT`
- Meta : `Location de benne pour vos chantiers en Île-de-France : tarifs HT en ligne, demande professionnelle et accompagnement pour la livraison et l’enlèvement.`

**Proposé rédactionnel (meta seule) :**

`Demandez une benne pour votre chantier en Île-de-France : tarif HT visible au récapitulatif, validation par notre équipe avant intervention. Ouverture de compte pro sur `/pro`.`

**Problème résolu :** clarifie **demande** + tarif avant engagement, sans promettre paiement différé systématique.

---

## Hero et section « Comment ça fonctionne »

**Actuel (`PROFESSIONNELS_HERO_VARIANT` + `professionnelsCommentCaFonctionne`) :**

- H1 : `Location de benne pour vos chantiers en Île-de-France`
- Intro : `Préparez votre demande en ligne. Une fois votre commande confirmée, retrouvez son avancement dans votre espace client. Notre équipe organise la livraison et l’enlèvement de votre benne.`
- Section : titre `Préparez votre demande de benne en ligne` ; envoi `Vérifiez les informations, puis transmettez votre demande…`

**Proposé (complet) :**

- H1 : inchangé
- Intro : `Indiquez l’adresse de chantier, le type de déchets et le volume. Le tarif HT de l’offre choisie apparaît au récapitulatif avant l’envoi. Notre équipe confirme avec vous la livraison, l’enlèvement et le mode de règlement.`
- Section envoi : textes actuels **conservés** (déjà « transmettre votre demande »)
- Éviter d’ajouter un délai chiffré « réponse sous 24 h » tant que **confirmé métier** manque

**Problème résolu :** aligne hero sur **demande + tarif visible avant envoi** ; tempère la promesse espace client pour les visiteurs sans compte.

---

## FAQ alignement schema

Affichage : FAQ générale complète avec remplacement réponse paiement (`professionnelsFaqModalitesPaiement`).  
Schema : `faqSource="professionnels"` + `includeAggregateRating={false}` (pas de badge Google hero pro).

**Proposé :** structure FAQ inchangée ; raccourcir à terme la réponse zones si redondante avec la liste des 8 départements (copy uniquement).

---

## Drapeaux rouges avant publication finale client

- [ ] Validation juridique facturation et abonnement
- [ ] Confirmation ops sur déchetteries, ADR, rotations
- [ ] Alignement téléphone / horaires support
- [ ] Maquettes client validées (hors scope chantier actuel)

---

## Questions métier groupées (pro)

1. Quelles prestations sont **vendables aujourd’hui** sans devis manuel (benne standard uniquement ?) ?
2. Délai de **réponse** après une demande vitrine pro (éviter promesse 24 h non tenue).
3. **Abonnement 35 €** : obligatoire pour toute commande facture ou cas par cas ?
4. **Paiement 30 jours** : conditions financières réelles et plafonds.
5. **BSD** : liste des documents effectivement envoyés par flux (systématique ou à la demande).
6. **Déchetteries pro** : date d’ouverture et périmètre géographique pour toute mention publique.
7. **Valorisation** : peut-on répéter l’engagement +90 % sur la page pro sans autre chiffre ?
8. **Espace client** : périmètre exact du suivi « commandes confirmées » pour un visiteur non connecté.

*Document proposition uniquement — intégration UI reportée à validation client.*
