-- Créneaux planifiés (date + heure) — admin → espace client

ALTER TABLE public.commandes
  ADD COLUMN IF NOT EXISTS livraison_planifiee_at timestamptz;

COMMENT ON COLUMN public.commandes.livraison_planifiee_at IS
  'Créneau de livraison confirmé par l’admin (fuseau stocké en UTC, affichage Europe/Paris).';

ALTER TABLE public.interventions
  ADD COLUMN IF NOT EXISTS planifiee_le timestamptz;

COMMENT ON COLUMN public.interventions.planifiee_le IS
  'Date et heure planifiées pour l’intervention (UTC).';

CREATE INDEX IF NOT EXISTS commandes_livraison_planifiee_at_idx
  ON public.commandes (livraison_planifiee_at DESC NULLS LAST)
  WHERE livraison_planifiee_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS interventions_planifiee_le_idx
  ON public.interventions (planifiee_le DESC NULLS LAST)
  WHERE planifiee_le IS NOT NULL;