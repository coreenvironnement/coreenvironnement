# Vérification de domaine Apple Business (core-environnement.fr)

Apple exige un enregistrement **DNS TXT** (méthode 1 — validation par domaine).  
Cela ne se fait **pas** dans le code de l’application : à créer chez le fournisseur DNS du domaine (OVH, Cloudflare, Gandi, etc.).

## Enregistrement à créer

| Champ   | Valeur |
|---------|--------|
| **Type** | `TXT` |
| **Nom / Host** | `@` (racine du domaine `core-environnement.fr`) — *si l’interface demande le nom complet, saisir `core-environnement.fr` ou laisser vide selon le registrar* |
| **Valeur / Contenu** | `apple-domain-verification=e9JDiEjkov1yFKy2` |
| **TTL** | par défaut ou 3600 s |

> Si Apple indique un **sous-domaine précis** (rare pour la méthode TXT racine), utilisez le host indiqué dans leur interface à la place de `@`.

## Après publication DNS

1. Attendre la propagation (souvent quelques minutes à quelques heures).
2. Vérifier : `nslookup -type=TXT core-environnement.fr` (ou outil en ligne) doit afficher la chaîne ci-dessus.
3. Cliquer sur **Valider** dans l’interface Apple Business.
