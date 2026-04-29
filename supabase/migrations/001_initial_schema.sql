/**
 * Core Environnement — schéma initial Supabase (PostgreSQL + PostGIS)
 * Appliquez via : SQL Editor dans le dashboard ou `supabase db push`.
 */

-- Géospatial (pour colonne geography sur commandes.coords).
-- Sur Supabase : activer aussi l’extension « postgis » dans Dashboard → Database → Extensions si besoin.
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

-- ---------------------------------------------------------------------------
-- Zones d’intervention (scalable multi-zones plus tard)
-- ---------------------------------------------------------------------------
CREATE TABLE public.zones_intervention (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  nom text NOT NULL,
  center_lat double precision NOT NULL,
  center_lng double precision NOT NULL,
  radius_km numeric(8, 2) NOT NULL CHECK (radius_km > 0),
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT zones_intervention_nom_unique UNIQUE (nom)
);

COMMENT ON TABLE public.zones_intervention IS 'Centre + rayon métier pour valider une adresse (extensible plusieurs zones).';

INSERT INTO public.zones_intervention (nom, center_lat, center_lng, radius_km, is_active)
VALUES ('Élancourt', 48.775, 1.947, 20, true);

-- ---------------------------------------------------------------------------
-- Types de déchets (catalogue)
-- ---------------------------------------------------------------------------
CREATE TABLE public.dechets_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  nom text NOT NULL,
  description text,
  icone_url text,
  prix_unitaire_estime numeric(12, 2),
  CONSTRAINT dechets_types_nom_unique UNIQUE (nom)
);

COMMENT ON TABLE public.dechets_types IS 'Catalogue métier pour les filtres/commandes.';

-- ---------------------------------------------------------------------------
-- Commandes
-- ---------------------------------------------------------------------------
CREATE TABLE public.commandes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  client_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  adresse_complete text NOT NULL,
  coords geography (Point, 4326),
  type_dechet_id uuid NOT NULL REFERENCES public.dechets_types (id),
  statut text NOT NULL DEFAULT 'brouillon',
  date_creation timestamptz NOT NULL DEFAULT now (),
  CONSTRAINT commandes_statut_check CHECK (
    statut IN ('brouillon', 'confirmee', 'en_cours', 'livree', 'annulee')
  )
);

COMMENT ON COLUMN public.commandes.coords IS 'Coordonnées WGS84 (SRID 4326) géocodées pour contrôle zone.';

CREATE INDEX commandes_coords_gix ON public.commandes USING GIST (coords);
CREATE INDEX commandes_client_id_idx ON public.commandes (client_id);
CREATE INDEX commandes_statut_idx ON public.commandes (statut);
CREATE INDEX commandes_date_creation_idx ON public.commandes (date_creation DESC);

-- ---------------------------------------------------------------------------
-- RLS — à ajuster selon vos politiques métier (ex. service_role côté API)
-- ---------------------------------------------------------------------------
ALTER TABLE public.zones_intervention ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dechets_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;

-- Lecture catalogue / zones pour tout utilisateur authentifié (adaptable en public lecture seule si besoin)
CREATE POLICY "zones_lecture_authentifie"
  ON public.zones_intervention
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "dechets_types_lecture_authentifie"
  ON public.dechets_types
  FOR SELECT
  TO authenticated
  USING (true);

-- Une commande : lecture/écriture par son propriétaire (client_id)
CREATE POLICY "commandes_select_proprio"
  ON public.commandes
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid ());

CREATE POLICY "commandes_insert_proprio"
  ON public.commandes
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid ());

CREATE POLICY "commandes_update_proprio"
  ON public.commandes
  FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid ())
  WITH CHECK (client_id = auth.uid ());
