/**
 * Mois 2 — Lien commande benne ↔ intervention opérationnelle
 * Prérequis : 002_dashboard_mois1.sql, 010_commandes_tunnel.sql
 */

ALTER TABLE public.interventions
  ADD COLUMN IF NOT EXISTS commande_id uuid REFERENCES public.commandes (id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS interventions_commande_id_uidx
  ON public.interventions (commande_id)
  WHERE commande_id IS NOT NULL;

COMMENT ON COLUMN public.interventions.commande_id IS 'Commande widget à l''origine de cette intervention (particulier CB).';
