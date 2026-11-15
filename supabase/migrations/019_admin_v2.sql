-- Admin V2 : prestataires enrichis, lignes tarifaires chantier, journal d'audit

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

CREATE TABLE IF NOT EXISTS public.prestataire_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  prestataire_id uuid NOT NULL REFERENCES public.prestataires (id) ON DELETE CASCADE,
  document_kind text NOT NULL,
  storage_path text,
  file_name text,
  expires_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prestataire_documents_expiry_idx
  ON public.prestataire_documents (expires_at)
  WHERE expires_at IS NOT NULL;

ALTER TABLE public.prestataire_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prestataire_documents_admin"
  ON public.prestataire_documents FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "prestataire_documents_select_auth"
  ON public.prestataire_documents FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE TYPE public.chantier_tarif_facturation AS ENUM (
  'forfait',
  'poids'
);

CREATE TABLE IF NOT EXISTS public.chantier_lignes_tarifaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  chantier_id uuid NOT NULL REFERENCES public.chantiers (id) ON DELETE CASCADE,
  label text NOT NULL,
  dechet_type_id uuid REFERENCES public.dechets_types (id) ON DELETE SET NULL,
  facturation_traitement public.chantier_tarif_facturation NOT NULL DEFAULT 'forfait',
  transport_facture_par_rotation boolean NOT NULL DEFAULT true,
  location_unite text NOT NULL DEFAULT 'jour',
  prix_vente_traitement_ht numeric(12, 2) NOT NULL DEFAULT 0,
  prix_achat_traitement_ht numeric(12, 2) NOT NULL DEFAULT 0,
  prix_vente_transport_ht numeric(12, 2) NOT NULL DEFAULT 0,
  prix_achat_transport_ht numeric(12, 2) NOT NULL DEFAULT 0,
  prix_vente_location_ht numeric(12, 2) NOT NULL DEFAULT 0,
  prix_achat_location_ht numeric(12, 2) NOT NULL DEFAULT 0,
  tonnage_inclus_kg numeric(12, 2),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chantier_lignes_tarifaires_chantier_idx
  ON public.chantier_lignes_tarifaires (chantier_id);

ALTER TABLE public.chantier_lignes_tarifaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chantier_lignes_tarifaires_admin"
  ON public.chantier_lignes_tarifaires FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  detail jsonb,
  actor_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_log_entity_idx ON public.audit_log (entity_type, entity_id, created_at DESC);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_admin_select"
  ON public.audit_log FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "audit_log_admin_insert"
  ON public.audit_log FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

ALTER TABLE public.interventions
  ADD COLUMN IF NOT EXISTS prestataire_id uuid REFERENCES public.prestataires (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS poids_reel_kg numeric(12, 2);

CREATE INDEX IF NOT EXISTS interventions_prestataire_idx ON public.interventions (prestataire_id);