/**
 * Core Environnement — Cahier des charges (Mois 1)
 * Prérequis : 001_initial_schema.sql
 *
 * Source de vérité : CDC client — Île-de-France, espace client, dashboard.
 * Ne pas hériter des choix techniques du prototype vitrine (Élancourt, etc.).
 *
 * Mois 1 :
 * - Auth email / mot de passe
 * - Admin lie chantiers ↔ emails (N-N)
 * - Dashboard : sélecteur chantier, graphiques, historique interventions
 * - Upload admin des documents (BI, pesée, BSD)
 * - Numérotation auto unique des interventions
 */

-- ---------------------------------------------------------------------------
-- Types énumérés
-- ---------------------------------------------------------------------------
CREATE TYPE public.user_role AS ENUM ('admin', 'client');

CREATE TYPE public.pro_account_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE public.payment_mode AS ENUM (
  'cb_required',
  'invoice'
);

CREATE TYPE public.intervention_status AS ENUM (
  'en_cours_programmation',
  'programme',
  'annulee',
  'realisee',
  'passage_a_vide'
);

CREATE TYPE public.document_type AS ENUM (
  'bon_intervention',
  'bon_pesee',
  'bsd'
);

-- ---------------------------------------------------------------------------
-- Profils (extension de auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  role public.user_role NOT NULL DEFAULT 'client',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_email_unique UNIQUE (email)
);

COMMENT ON TABLE public.profiles IS 'Profil applicatif lié à auth.users. Rôle admin ou client.';

CREATE INDEX profiles_role_idx ON public.profiles (role);

-- Auto-création du profil à l''inscription Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user ()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'client');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user ();

-- ---------------------------------------------------------------------------
-- Comptes professionnels (structure Mois 2, schéma posé dès Mois 1)
-- ---------------------------------------------------------------------------
CREATE TABLE public.comptes_pro (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  raison_sociale text NOT NULL,
  siret text,
  code_naf text,
  adresse_siege text,
  contact_nom text,
  contact_fonction text,
  contact_telephone text,
  contact_email text NOT NULL,
  kbis_storage_path text,
  rib_storage_path text,
  status public.pro_account_status NOT NULL DEFAULT 'pending',
  payment_mode public.payment_mode,
  subscription_active boolean NOT NULL DEFAULT false,
  subscription_montant_ht numeric(8, 2) NOT NULL DEFAULT 35.00,
  reviewed_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT comptes_pro_profile_unique UNIQUE (profile_id)
);

COMMENT ON TABLE public.comptes_pro IS 'Demande / dossier compte pro. payment_mode défini manuellement par l''admin après validation.';
COMMENT ON COLUMN public.comptes_pro.payment_mode IS 'Validation manuelle admin : cb_required OU invoice (30 j fin de mois).';
COMMENT ON COLUMN public.comptes_pro.subscription_montant_ht IS 'Abonnement espace client pro : 35 € HT / mois (CDC).';

-- ---------------------------------------------------------------------------
-- Chantiers
-- ---------------------------------------------------------------------------
CREATE TABLE public.chantiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  nom text NOT NULL,
  adresse text,
  code_affaire text,
  is_active boolean NOT NULL DEFAULT true,
  notes_internes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.chantiers IS 'Chantier suivi côté client. Un chantier peut avoir plusieurs utilisateurs.';

CREATE INDEX chantiers_is_active_idx ON public.chantiers (is_active);

-- ---------------------------------------------------------------------------
-- Accès chantier ↔ utilisateur (N-N)
-- ---------------------------------------------------------------------------
CREATE TABLE public.chantier_membres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  chantier_id uuid NOT NULL REFERENCES public.chantiers (id) ON DELETE CASCADE,
  profile_id uuid REFERENCES public.profiles (id) ON DELETE CASCADE,
  invited_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  CONSTRAINT chantier_membres_profile_or_email CHECK (
    profile_id IS NOT NULL OR invited_email IS NOT NULL
  )
);

COMMENT ON TABLE public.chantier_membres IS 'Lien N-N chantier / utilisateur. invited_email pour invitation avant création de compte.';

CREATE UNIQUE INDEX chantier_membres_chantier_profile_uidx
  ON public.chantier_membres (chantier_id, profile_id)
  WHERE profile_id IS NOT NULL;

CREATE UNIQUE INDEX chantier_membres_chantier_email_uidx
  ON public.chantier_membres (chantier_id, lower(invited_email))
  WHERE invited_email IS NOT NULL;

CREATE INDEX chantier_membres_profile_idx ON public.chantier_membres (profile_id);
CREATE INDEX chantier_membres_chantier_idx ON public.chantier_membres (chantier_id);

-- Rattache automatique des invitations en attente quand le profil est créé
CREATE OR REPLACE FUNCTION public.link_pending_chantier_invites ()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.chantier_membres
  SET profile_id = NEW.id,
      invited_email = NULL
  WHERE profile_id IS NULL
    AND invited_email IS NOT NULL
    AND lower(invited_email) = lower(NEW.email);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_link_invites
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.link_pending_chantier_invites ();

-- ---------------------------------------------------------------------------
-- Référentiels métier (interventions)
-- ---------------------------------------------------------------------------
CREATE TABLE public.types_intervention (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  code text NOT NULL,
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT types_intervention_code_unique UNIQUE (code)
);

-- CDC : 5 types d'intervention
INSERT INTO public.types_intervention (code, label, sort_order) VALUES
  ('depose', 'Dépose', 1),
  ('rotation', 'Rotation', 2),
  ('retrait', 'Retrait', 3),
  ('chargement_sur_place', 'Chargement sur place', 4),
  ('deplacement', 'Déplacement', 5);

CREATE TABLE public.statuts_intervention (
  code text PRIMARY KEY,
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

COMMENT ON TABLE public.statuts_intervention IS 'Libellés CDC des statuts affichés dans l''historique client.';

INSERT INTO public.statuts_intervention (code, label, sort_order) VALUES
  ('en_cours_programmation', 'En cours de programmation', 1),
  ('programme', 'Programmé', 2),
  ('annulee', 'Annulée', 3),
  ('realisee', 'Réalisée', 4),
  ('passage_a_vide', 'Passage à vide', 5);

CREATE TABLE public.types_contenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  code text NOT NULL,
  label text NOT NULL,
  volume_m3 numeric(6, 2),
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT types_contenants_code_unique UNIQUE (code)
);

-- CDC : 7 types de contenants
INSERT INTO public.types_contenants (code, label, volume_m3, sort_order) VALUES
  ('benne_8m3', 'Benne 8 m³', 8, 1),
  ('benne_10m3', 'Benne 10 m³', 10, 2),
  ('benne_15m3', 'Benne 15 m³', 15, 3),
  ('benne_20m3', 'Benne 20 m³', 20, 4),
  ('benne_30m3', 'Benne 30 m³', 30, 5),
  ('caisse_palette_600l', 'Caisse palette 600 litres', NULL, 6),
  ('fut_200l', 'Fut 200 litres', NULL, 7);

-- Enrichissement du catalogue déchets existant (001)
ALTER TABLE public.dechets_types
  ADD COLUMN IF NOT EXISTS code text,
  ADD COLUMN IF NOT EXISTS categorie text,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS sort_order int NOT NULL DEFAULT 0;

ALTER TABLE public.dechets_types
  DROP CONSTRAINT IF EXISTS dechets_types_categorie_check;

ALTER TABLE public.dechets_types
  ADD CONSTRAINT dechets_types_categorie_check CHECK (
    categorie IS NULL OR categorie IN ('non_dangereux', 'dangereux')
  );

CREATE UNIQUE INDEX IF NOT EXISTS dechets_types_code_uidx
  ON public.dechets_types (code)
  WHERE code IS NOT NULL;

-- CDC : 9 déchets non dangereux + 7 déchets dangereux
INSERT INTO public.dechets_types (code, nom, categorie, sort_order) VALUES
  ('dib', 'Déchets non dangereux en mélange (DIB)', 'non_dangereux', 1),
  ('gravats_propres', 'Gravats propres', 'non_dangereux', 2),
  ('bois_a', 'Bois A', 'non_dangereux', 3),
  ('bois_b', 'Bois B', 'non_dangereux', 4),
  ('platres', 'Plâtres', 'non_dangereux', 5),
  ('plastiques', 'Plastiques', 'non_dangereux', 6),
  ('dechets_ultimes', 'Déchets ultimes', 'non_dangereux', 7),
  ('ferrailles', 'Ferrailles', 'non_dangereux', 8),
  ('carton_papiers', 'Carton & papiers', 'non_dangereux', 9),
  ('aerosols', 'Aérosols', 'dangereux', 10),
  ('emballages_souilles', 'Emballages standards souillés', 'dangereux', 11),
  ('materiels_souilles', 'Matériels standards souillés', 'dangereux', 12),
  ('peinture', 'Peinture', 'dangereux', 13),
  ('pateux', 'Pâteux', 'dangereux', 14),
  ('huiles_noires', 'Huiles noires', 'dangereux', 15),
  ('huiles_claires', 'Huiles claires', 'dangereux', 16)
ON CONFLICT (nom) DO UPDATE SET
  code = EXCLUDED.code,
  categorie = EXCLUDED.categorie,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

-- ---------------------------------------------------------------------------
-- Interventions
-- ---------------------------------------------------------------------------
CREATE TABLE public.intervention_numero_counters (
  year int PRIMARY KEY,
  last_number int NOT NULL DEFAULT 0
);

CREATE OR REPLACE FUNCTION public.generate_intervention_numero ()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_year int := extract(year FROM now())::int;
  next_num int;
BEGIN
  INSERT INTO public.intervention_numero_counters AS c (year, last_number)
  VALUES (current_year, 1)
  ON CONFLICT (year) DO UPDATE
  SET last_number = c.last_number + 1
  RETURNING last_number INTO next_num;

  RETURN 'INT-' || current_year || '-' || lpad(next_num::text, 5, '0');
END;
$$;

CREATE TABLE public.interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  numero text NOT NULL DEFAULT public.generate_intervention_numero (),
  chantier_id uuid NOT NULL REFERENCES public.chantiers (id) ON DELETE RESTRICT,
  type_intervention_id uuid NOT NULL REFERENCES public.types_intervention (id),
  contenant_id uuid NOT NULL REFERENCES public.types_contenants (id),
  dechet_type_id uuid NOT NULL REFERENCES public.dechets_types (id),
  statut public.intervention_status NOT NULL DEFAULT 'en_cours_programmation',
  date_demande date NOT NULL DEFAULT current_date,
  date_souhaitee date,
  date_reelle date,
  commentaire text,
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT interventions_numero_unique UNIQUE (numero)
);

COMMENT ON TABLE public.interventions IS 'Demandes d''intervention opérationnelles visibles dans l''historique client.';

CREATE INDEX interventions_chantier_idx ON public.interventions (chantier_id);
CREATE INDEX interventions_statut_idx ON public.interventions (statut);
CREATE INDEX interventions_date_demande_idx ON public.interventions (date_demande DESC);

-- ---------------------------------------------------------------------------
-- Documents d''intervention (fichiers dans Supabase Storage)
-- ---------------------------------------------------------------------------
CREATE TABLE public.intervention_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  intervention_id uuid NOT NULL REFERENCES public.interventions (id) ON DELETE CASCADE,
  document_type public.document_type NOT NULL,
  storage_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  file_size_bytes bigint,
  uploaded_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT intervention_documents_unique_type UNIQUE (intervention_id, document_type)
);

COMMENT ON TABLE public.intervention_documents IS 'Métadonnées des BI / bons de pesée / BSD. Bucket Storage : intervention-documents.';

CREATE INDEX intervention_documents_intervention_idx ON public.intervention_documents (intervention_id);

-- ---------------------------------------------------------------------------
-- Statistiques dashboard (saisie admin → graphiques client)
-- ---------------------------------------------------------------------------
CREATE TABLE public.chantier_stats_dechets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  chantier_id uuid NOT NULL REFERENCES public.chantiers (id) ON DELETE CASCADE,
  dechet_type_id uuid NOT NULL REFERENCES public.dechets_types (id),
  tonnage_t numeric(12, 3) NOT NULL CHECK (tonnage_t >= 0),
  periode_debut date,
  periode_fin date,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  CONSTRAINT chantier_stats_dechets_unique UNIQUE (chantier_id, dechet_type_id, periode_debut, periode_fin)
);

COMMENT ON TABLE public.chantier_stats_dechets IS 'Tonnages par typologie — alimente le diagramme du dashboard.';

CREATE TABLE public.chantier_stats_valorisation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  chantier_id uuid NOT NULL REFERENCES public.chantiers (id) ON DELETE CASCADE,
  valorisation_pct numeric(5, 2) NOT NULL CHECK (valorisation_pct >= 0 AND valorisation_pct <= 100),
  elimination_pct numeric(5, 2) NOT NULL CHECK (elimination_pct >= 0 AND elimination_pct <= 100),
  periode_debut date,
  periode_fin date,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  CONSTRAINT chantier_stats_valorisation_pct_sum CHECK (valorisation_pct + elimination_pct <= 100.01)
);

COMMENT ON TABLE public.chantier_stats_valorisation IS 'Camemberts valorisation / élimination du dashboard.';

CREATE UNIQUE INDEX chantier_stats_valorisation_period_uidx
  ON public.chantier_stats_valorisation (chantier_id, periode_debut, periode_fin);

-- ---------------------------------------------------------------------------
-- Helpers sécurité (RLS)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin ()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_chantier_access (p_chantier_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.chantier_membres cm
      WHERE cm.chantier_id = p_chantier_id
        AND cm.profile_id = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.can_access_intervention (p_intervention_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.interventions i
      WHERE i.id = p_intervention_id
        AND public.has_chantier_access(i.chantier_id)
    );
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comptes_pro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chantiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chantier_membres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.types_intervention ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statuts_intervention ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.types_contenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chantier_stats_dechets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chantier_stats_valorisation ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

-- Comptes pro : lecture/écriture par le titulaire ; gestion admin
CREATE POLICY "comptes_pro_select_own_or_admin"
  ON public.comptes_pro FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "comptes_pro_insert_own"
  ON public.comptes_pro FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "comptes_pro_update_own_or_admin"
  ON public.comptes_pro FOR UPDATE TO authenticated
  USING (profile_id = auth.uid() OR public.is_admin())
  WITH CHECK (profile_id = auth.uid() OR public.is_admin());

-- Chantiers
CREATE POLICY "chantiers_select_member_or_admin"
  ON public.chantiers FOR SELECT TO authenticated
  USING (public.has_chantier_access(id));

CREATE POLICY "chantiers_admin_all"
  ON public.chantiers FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Membres chantier
CREATE POLICY "chantier_membres_select_member_or_admin"
  ON public.chantier_membres FOR SELECT TO authenticated
  USING (public.has_chantier_access(chantier_id));

CREATE POLICY "chantier_membres_admin_all"
  ON public.chantier_membres FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Référentiels : lecture pour tous les authentifiés
CREATE POLICY "types_intervention_select_auth"
  ON public.types_intervention FOR SELECT TO authenticated
  USING (is_active = true OR public.is_admin());

CREATE POLICY "types_intervention_admin_write"
  ON public.types_intervention FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "statuts_intervention_select_auth"
  ON public.statuts_intervention FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "types_contenants_select_auth"
  ON public.types_contenants FOR SELECT TO authenticated
  USING (is_active = true OR public.is_admin());

CREATE POLICY "types_contenants_admin_write"
  ON public.types_contenants FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- dechets_types : élargir la lecture publique authentifiée (déjà en 001)
DROP POLICY IF EXISTS "dechets_types_lecture_authentifie" ON public.dechets_types;
CREATE POLICY "dechets_types_select_auth"
  ON public.dechets_types FOR SELECT TO authenticated
  USING (is_active = true OR public.is_admin());

CREATE POLICY "dechets_types_admin_write"
  ON public.dechets_types FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Interventions
CREATE POLICY "interventions_select_member_or_admin"
  ON public.interventions FOR SELECT TO authenticated
  USING (public.has_chantier_access(chantier_id));

CREATE POLICY "interventions_admin_write"
  ON public.interventions FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Documents
CREATE POLICY "intervention_documents_select_member_or_admin"
  ON public.intervention_documents FOR SELECT TO authenticated
  USING (public.can_access_intervention(intervention_id));

CREATE POLICY "intervention_documents_admin_write"
  ON public.intervention_documents FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Stats dashboard
CREATE POLICY "chantier_stats_dechets_select_member_or_admin"
  ON public.chantier_stats_dechets FOR SELECT TO authenticated
  USING (public.has_chantier_access(chantier_id));

CREATE POLICY "chantier_stats_dechets_admin_write"
  ON public.chantier_stats_dechets FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "chantier_stats_valorisation_select_member_or_admin"
  ON public.chantier_stats_valorisation FOR SELECT TO authenticated
  USING (public.has_chantier_access(chantier_id));

CREATE POLICY "chantier_stats_valorisation_admin_write"
  ON public.chantier_stats_valorisation FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin : accès complet aux commandes widget (001)
CREATE POLICY "commandes_admin_all"
  ON public.commandes FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage (à créer dans le dashboard Supabase si absent)
-- Bucket : intervention-documents (privé)
-- Politiques recommandées (appliquer via dashboard ou migration Storage) :
--   - SELECT : can_access_intervention via chemin {intervention_id}/...
--   - INSERT/UPDATE/DELETE : is_admin()
-- ---------------------------------------------------------------------------
