-- Renseigne audience pour les commandes legacy (NULL).
-- À appliquer sur Supabase prod avant de compter sur les listes admin strictes.

UPDATE public.commandes
SET audience = 'professionnel'
WHERE audience IS NULL
  AND (
    contact_nom ~ '\([^)]+\)\s*$'
    OR payment_status = 'waived'
  );

UPDATE public.commandes
SET audience = 'particulier'
WHERE audience IS NULL;

COMMENT ON COLUMN public.commandes.audience IS
  'particulier (CB B2C) ou professionnel (demande / facture pro). Backfill : 016_commandes_audience_backfill.sql';
