# Inventaire URL SEO (`seo-url-inventory.csv`)

- **491 lignes** : 9 pages statiques + 482 pages `/location-benne/*`.
- **Décisions par famille** (sans dupliquer les 318 fiches ville) : [`seo-url-decisions.md`](./seo-url-decisions.md).
- **Régénération :** `npx tsx scripts/generate-seo-url-inventory.ts`.
- **GSC :** colonne `gsc_note` = `statut GSC à importer` tant que les exports listés dans `seo-url-decisions.md` ne sont pas fournis.
