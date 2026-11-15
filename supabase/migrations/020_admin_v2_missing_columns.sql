-- Complète 019 si les tables existent déjà sans les colonnes ALTER.
-- Idempotent : safe à ré-exécuter.

ALTER TABLE public.prestataires
  ADD COLUMN IF NOT EXISTS raison_sociale text,
  ADD COLUMN IF NOT EXISTS nom_commercial text,
  ADD COLUMN IF NOT EXISTS siret text,
  ADD COLUMN IF NOT EXISTS tva_intracom text,
  ADD COLUMN IF NOT EXISTS adresse text,
  ADD COLUMN IF NOT EXISTS code_postal text,
  ADD COLUMN IF NOT EXISTS ville text,
  ADD COLUMN IF NOT EXISTS telephone text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS site_web text,
  ADD COLUMN IF NOT EXISTS contact_nom text,
  ADD COLUMN IF NOT EXISTS contact_fonction text,
  ADD COLUMN IF NOT EXISTS contact_telephone text,
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS departements text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS dechets_acceptes text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS conditions_reglement text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE public.prestataires
SET raison_sociale = nom
WHERE raison_sociale IS NULL;

ALTER TABLE public.interventions
  ADD COLUMN IF NOT EXISTS prestataire_id uuid REFERENCES public.prestataires (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS poids_reel_kg numeric(12, 2);

CREATE INDEX IF NOT EXISTS interventions_prestataire_idx ON public.interventions (prestataire_id);