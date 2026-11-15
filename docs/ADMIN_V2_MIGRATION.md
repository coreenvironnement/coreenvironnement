# Admin V2 — migration Supabase (019 + 020)

## Vérifier l’état

```bash
npm run verify:admin-v2
```

## Appliquer (recommandé)

1. Ouvrir [Supabase Dashboard](https://supabase.com/dashboard) → projet dont l’URL correspond à `NEXT_PUBLIC_SUPABASE_URL` dans `.env.local`.
2. **SQL Editor** → Nouvelle requête.
3. Coller et exécuter dans l’ordre :
   - [`supabase/migrations/019_admin_v2.sql`](../supabase/migrations/019_admin_v2.sql)
   - [`supabase/migrations/020_admin_v2_missing_columns.sql`](../supabase/migrations/020_admin_v2_missing_columns.sql) (si `verify` signale des colonnes manquantes)
4. Relancer `npm run verify:admin-v2` (6/6 OK).

## CLI (si votre compte Supabase a les droits sur le projet)

```bash
npx supabase login
npm run db:apply-admin-v2
```

En cas d’erreur **403**, le compte CLI n’est pas propriétaire du projet : utilisez le SQL Editor ci-dessus.

## Production

Répéter la même opération sur le projet Supabase **production** (celui utilisé par Vercel) avant ou juste après le déploiement Next.js.