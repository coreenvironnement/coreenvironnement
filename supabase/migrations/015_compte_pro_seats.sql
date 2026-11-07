-- Sièges utilisateurs facturés sur l'abonnement compte pro (35 € HT / mois / utilisateur)

CREATE TABLE public.compte_pro_seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  compte_pro_id uuid NOT NULL REFERENCES public.comptes_pro (id) ON DELETE CASCADE,
  profile_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  invited_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'revoked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT compte_pro_seats_email_lower UNIQUE (compte_pro_id, invited_email)
);

CREATE INDEX compte_pro_seats_compte_idx ON public.compte_pro_seats (compte_pro_id);

COMMENT ON TABLE public.compte_pro_seats IS
  'Utilisateurs additionnels du dossier pro ; facturation Stripe = 1 titulaire + sièges actifs.';

ALTER TABLE public.compte_pro_seats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "compte_pro_seats_select_owner_or_admin"
  ON public.compte_pro_seats FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.comptes_pro cp
      WHERE cp.id = compte_pro_id AND cp.profile_id = auth.uid()
    )
  );

CREATE POLICY "compte_pro_seats_insert_owner"
  ON public.compte_pro_seats FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.comptes_pro cp
      WHERE cp.id = compte_pro_id AND cp.profile_id = auth.uid()
    )
  );

CREATE POLICY "compte_pro_seats_update_owner_or_admin"
  ON public.compte_pro_seats FOR UPDATE TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.comptes_pro cp
      WHERE cp.id = compte_pro_id AND cp.profile_id = auth.uid()
    )
  );
