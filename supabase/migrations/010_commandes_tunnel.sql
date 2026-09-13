/**
 * Mois 2 — Tunnel commande benne (persistance + paiement Stripe)
 * Prérequis : 001_initial_schema.sql, 003_zones_ile_de_france.sql
 */

ALTER TABLE public.commandes
  ADD COLUMN IF NOT EXISTS audience text,
  ADD COLUMN IF NOT EXISTS prestation_id text,
  ADD COLUMN IF NOT EXISTS prestation_label text,
  ADD COLUMN IF NOT EXISTS volume_m3 numeric(6, 2),
  ADD COLUMN IF NOT EXISTS price_ht numeric(10, 2),
  ADD COLUMN IF NOT EXISTS date_livraison date,
  ADD COLUMN IF NOT EXISTS date_enlevement date,
  ADD COLUMN IF NOT EXISTS departement_code text,
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS contact_nom text,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';

ALTER TABLE public.commandes
  DROP CONSTRAINT IF EXISTS commandes_audience_check;

ALTER TABLE public.commandes
  ADD CONSTRAINT commandes_audience_check CHECK (
    audience IS NULL OR audience IN ('particulier', 'professionnel')
  );

ALTER TABLE public.commandes
  DROP CONSTRAINT IF EXISTS commandes_payment_status_check;

ALTER TABLE public.commandes
  ADD CONSTRAINT commandes_payment_status_check CHECK (
    payment_status IN ('pending', 'paid', 'waived', 'failed')
  );

COMMENT ON COLUMN public.commandes.audience IS 'Particulier (CB) ou professionnel (facture après validation compte pro).';
COMMENT ON COLUMN public.commandes.prestation_id IS 'Identifiant forfait catalogue (lib/prestations.ts).';
COMMENT ON COLUMN public.commandes.payment_status IS 'pending = en attente CB ; paid = confirmée ; waived = pro sur facture.';

CREATE INDEX IF NOT EXISTS commandes_stripe_session_idx
  ON public.commandes (stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS commandes_payment_status_idx
  ON public.commandes (payment_status);
