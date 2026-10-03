/**
 * Cycle opérationnel minimal — remboursements + anti-double e-mail.
 * Ne droppe aucune donnée. Ne recrée pas le CHECK statut commande.
 */

ALTER TABLE public.commandes
  DROP CONSTRAINT IF EXISTS commandes_payment_status_check;

ALTER TABLE public.commandes
  ADD CONSTRAINT commandes_payment_status_check CHECK (
    payment_status IN (
      'pending',
      'paid',
      'waived',
      'failed',
      'refunded',
      'refund_pending',
      'refund_failed'
    )
  );

ALTER TABLE public.commandes
  ADD COLUMN IF NOT EXISTS stripe_refund_id text,
  ADD COLUMN IF NOT EXISTS refunded_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirmation_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS admin_notify_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancellation_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS refund_email_sent_at timestamptz;

COMMENT ON COLUMN public.commandes.payment_status IS
  'pending/paid/waived/failed + refunded/refund_pending/refund_failed.';
COMMENT ON COLUMN public.commandes.stripe_refund_id IS
  'Identifiant Refund Stripe une fois le remboursement confirmé.';
COMMENT ON COLUMN public.commandes.refunded_at IS
  'Horodatage du remboursement confirmé par webhook Stripe.';
COMMENT ON COLUMN public.commandes.confirmation_email_sent_at IS
  'Claim atomique e-mail confirmation client.';
COMMENT ON COLUMN public.commandes.admin_notify_sent_at IS
  'Claim atomique notification interne nouvelle commande.';
COMMENT ON COLUMN public.commandes.cancellation_email_sent_at IS
  'Claim atomique e-mail annulation client.';
COMMENT ON COLUMN public.commandes.refund_email_sent_at IS
  'Claim atomique e-mail remboursement client (après confirmation Stripe).';
