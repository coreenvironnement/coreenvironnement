/**
 * Phase 3A — PaymentIntent intégré (commande particulier)
 * Colonne nullable : les commandes Checkout existantes restent valides.
 */

ALTER TABLE public.commandes
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;

COMMENT ON COLUMN public.commandes.stripe_payment_intent_id IS
  'PaymentIntent Stripe (paiement intégré étape 5). Null pour les commandes Checkout.';

CREATE INDEX IF NOT EXISTS commandes_stripe_pi_idx
  ON public.commandes (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;
