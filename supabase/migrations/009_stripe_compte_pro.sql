/**
 * Stripe — abonnement espace client pro (Mois 2)
 * Prérequis : 002_dashboard_mois1.sql
 */

ALTER TABLE public.comptes_pro
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS subscription_status text,
  ADD COLUMN IF NOT EXISTS subscription_current_period_end timestamptz;

COMMENT ON COLUMN public.comptes_pro.stripe_customer_id IS 'Client Stripe lié au dossier compte pro.';
COMMENT ON COLUMN public.comptes_pro.stripe_subscription_id IS 'Abonnement Stripe actif ou dernier connu.';
COMMENT ON COLUMN public.comptes_pro.subscription_status IS 'Statut Stripe : active, past_due, canceled, etc.';
COMMENT ON COLUMN public.comptes_pro.subscription_current_period_end IS 'Fin de période de facturation en cours.';

CREATE INDEX IF NOT EXISTS comptes_pro_stripe_customer_idx
  ON public.comptes_pro (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;
