-- Horodatage envoi devis particulier (tunnel → e-mail PDF)

ALTER TABLE public.commandes
  ADD COLUMN IF NOT EXISTS devis_sent_at timestamptz;

COMMENT ON COLUMN public.commandes.devis_sent_at IS 'Date/heure envoi du devis par e-mail (parcours particulier).';

CREATE INDEX IF NOT EXISTS commandes_devis_sent_at_idx
  ON public.commandes (devis_sent_at DESC NULLS LAST)
  WHERE devis_sent_at IS NOT NULL;