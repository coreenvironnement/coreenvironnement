/**
 * Core Environnement — Zones d'intervention CDC
 * Remplace la zone prototype « Élancourt 20 km » par l'Île-de-France entière.
 *
 * CDC FAQ §6 : Paris (75), Seine-et-Marne (77), Yvelines (78), Essonne (91),
 * Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94), Val-d'Oise (95).
 */

CREATE TABLE IF NOT EXISTS public.departements_idf (
  code text PRIMARY KEY,
  nom text NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);

COMMENT ON TABLE public.departements_idf IS 'Départements couverts par CORE ENVIRONNEMENT (CDC).';

INSERT INTO public.departements_idf (code, nom) VALUES
  ('75', 'Paris'),
  ('77', 'Seine-et-Marne'),
  ('78', 'Yvelines'),
  ('91', 'Essonne'),
  ('92', 'Hauts-de-Seine'),
  ('93', 'Seine-Saint-Denis'),
  ('94', 'Val-de-Marne'),
  ('95', 'Val-d''Oise')
ON CONFLICT (code) DO UPDATE SET
  nom = EXCLUDED.nom,
  is_active = true;

-- Désactive l'ancienne zone prototype (001)
UPDATE public.zones_intervention
SET is_active = false
WHERE nom = 'Élancourt';

-- Zone métier unique : Île-de-France (validation adresse côté app)
INSERT INTO public.zones_intervention (nom, center_lat, center_lng, radius_km, is_active)
VALUES ('Île-de-France', 48.8566, 2.3522, 80, true)
ON CONFLICT (nom) DO UPDATE SET
  center_lat = EXCLUDED.center_lat,
  center_lng = EXCLUDED.center_lng,
  radius_km = EXCLUDED.radius_km,
  is_active = true;

ALTER TABLE public.departements_idf ENABLE ROW LEVEL SECURITY;

CREATE POLICY "departements_idf_select_public"
  ON public.departements_idf FOR SELECT TO authenticated
  USING (is_active = true OR public.is_admin());

CREATE POLICY "departements_idf_admin_write"
  ON public.departements_idf FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
