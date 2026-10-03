/**
 * Phase 2 — Persistance téléphone commande particulier
 * Colonne nullable : les commandes existantes restent valides.
 */

ALTER TABLE public.commandes
  ADD COLUMN IF NOT EXISTS contact_telephone text;

COMMENT ON COLUMN public.commandes.contact_telephone IS
  'Téléphone saisi à l’étape Informations (particulier). Null sur les commandes antérieures.';
