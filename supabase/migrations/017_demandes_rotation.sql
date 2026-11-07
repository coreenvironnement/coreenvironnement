/**
 * Demandes de rotation benne (espace chantier) — file admin, pas d’INSERT client sur interventions.
 */

CREATE TYPE public.demande_rotation_statut AS ENUM (
  'en_attente',
  'prise_en_charge',
  'refusee'
);

CREATE TABLE public.demandes_rotation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  chantier_id uuid NOT NULL REFERENCES public.chantiers (id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  contenant_id uuid NOT NULL REFERENCES public.types_contenants (id),
  dechet_type_id uuid NOT NULL REFERENCES public.dechets_types (id),
  souhaite_le timestamptz NOT NULL,
  statut public.demande_rotation_statut NOT NULL DEFAULT 'en_attente',
  commentaire_client text,
  intervention_id uuid REFERENCES public.interventions (id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX demandes_rotation_chantier_idx ON public.demandes_rotation (chantier_id);
CREATE INDEX demandes_rotation_statut_idx ON public.demandes_rotation (statut);
CREATE INDEX demandes_rotation_profile_idx ON public.demandes_rotation (profile_id);

COMMENT ON TABLE public.demandes_rotation IS 'Demandes client de rotation benne sur un chantier (dashboard espace).';

ALTER TABLE public.demandes_rotation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "demandes_rotation_select_member_or_admin"
  ON public.demandes_rotation FOR SELECT TO authenticated
  USING (public.has_chantier_access(chantier_id) OR public.is_admin());

CREATE POLICY "demandes_rotation_insert_member"
  ON public.demandes_rotation FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = auth.uid()
    AND public.has_chantier_access(chantier_id)
  );

CREATE POLICY "demandes_rotation_admin_all"
  ON public.demandes_rotation FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
