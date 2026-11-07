# Proposition copy — `/professionnels` (non appliquée aux composants)

**Statut** : page **publiée** en production mais **non finalisée côté client** (offre, visuels, parcours). Ce document sert de brief de rédaction ; **aucune modification** des composants `vitrine-professionnels-*` dans ce chantier.

---

## Offre : disponible vs planifiée (d’après le code)

| Fonctionnalité | Statut code / copy actuel | Rédaction autorisée |
|----------------|---------------------------|---------------------|
| Demande benne pro (formulaire / tunnel) | Présent — paiement **non** dans le flux | Oui — « demande en ligne » |
| Compte pro `/pro` (KBIS, validation admin) | Présent | Oui — avec délai validation |
| Paiement sur facture 30 jours | Décrit dans FAQ / CDC, activation manuelle | Oui — « sous réserve validation compte » |
| Espace client suivi chantiers | Partiel / « bientôt » sur vitrine | **Ne pas** promettre suivi temps réel |
| Déchetteries pro (5 centres) | `services` CDC — « en cours de développement » | Mention **future** uniquement |
| Déchets dangereux / ADR | CDC services | **Sur devis** — pas en self-service |
| BSD / traçabilité | FAQ — documents par l’équipe | Oui |

---

## Parcours visiteur cible

1. **Entrée** SEO / Ads → hero pro (H1 chantier IDF).
2. **Comprendre** : comment fonctionne la demande (section dédiée `professionnelsCommentCaFonctionne`).
3. **Preuve** : témoignages pro (`TestimonialsSection proOnly`) — pas de badge Google hero (cohérent JSON-LD sans `aggregateRating`).
4. **FAQ** : FAQ générale avec variante paiement pro.
5. **Action** : CTA demande + lien `/pro` pour compte existant.

---

## Title & meta (proposition)

| Élément | Actuel (après fix technique) | Proposition rédactionnelle |
|---------|------------------------------|----------------------------|
| Title | `Location de benne pour professionnels en Île-de-France \| CORE ENVIRONNEMENT` | **Conserver** |
| Meta | Tarifs HT, demande pro, accompagnement | *« Demandez une benne pour votre chantier en Île-de-France : tarif HT en ligne, validation par notre équipe avant intervention. Ouverture de compte pro sur demande. »* |

---

## Hero

| Champ | Actuel `PROFESSIONNELS_HERO_VARIANT` | Proposition |
|-------|--------------------------------------|-------------|
| H1 | Location de benne pour vos chantiers en Île-de-France | **Conserver** |
| Intro | Préparez demande… espace client | *« Indiquez votre chantier en ligne. Nous confirmons avec vous la livraison, l’enlèvement et les modalités de facturation. »* |
| CTA carte commande | Tunnel profil « professionnel » | *« Transmettre une demande »* (évite « commander » si paiement différé) |

---

## Section « Comment ça fonctionne »

| Actuel (`professionnelsCommentCaFonctionne`) | Proposition |
|-----------------------------------------------|-------------|
| Titre : « Préparez votre demande de benne en ligne » | **Conserver** |
| Intro validation récap | **Conserver** |
| Envoi demande | **Conserver** texte |
| Suite après envoi | Ajouter : *« Réponse sous 24 h ouvrées hors week-end. »* — **à valider métier** |

---

## Engagements / services (si bloc réactivé)

Reprendre **uniquement** les engagements vérifiables :

- Réactivité 24 h (avec footnote week-end).
- Un interlocuteur commande → enlèvement.
- Traçabilité BSD sur demande.
- Valorisation : formulation **90 % ou sans %** (cf. `copy-propositions.md`).

**Exclure** de la page tant que non livré : déchetteries sans adresses, abonnement 35 € HT si non facturé automatiquement.

---

## FAQ (alignement schema)

| Affichage | Schema (post-fix) |
|-----------|-------------------|
| FAQ catégories complète + réponse paiement pro | `faqSource="professionnels"` |

**Proposition** : conserver structure catégories ; raccourcir la réponse « zones » si redondante avec maillage local.

---

## CTAs

| Emplacement | Proposition |
|-------------|-------------|
| Hero / final | Primaire : *« Transmettre une demande de benne »* |
| Secondaire | *« Ouvrir un compte professionnel »* → `/pro` |
| Header | *« Déjà client ? Connexion »* → `/login` |

---

## Drapeaux rouges avant publication finale

- [ ] Validation juridique délai et facturation pro.
- [ ] Liste exhaustive déchets / volumes pro vs particulier.
- [ ] Captures ou maquettes validées (client a demandé de ne pas remplacer visuels en prod dans ce chantier).
- [ ] Cohérence téléphone / horaires support.

---

*Document proposition uniquement — intégration UI reportée à validation client.*
