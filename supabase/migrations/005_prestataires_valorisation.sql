/**
 * Prestataires et taux de valorisation annuels (réponse client)
 * Prérequis : 002, 004
 *
 * Règle métier :
 * 1. tonnage_valorisé(type) = tonnage(type) × taux_prestataire(type) / 100
 * 2. total_valorisé = Σ tonnages valorisés
 * 3. taux_global = total_valorisé / tonnage_total × 100
 */

CREATE TABLE public.prestataires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  nom text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT prestataires_nom_unique UNIQUE (nom)
);

COMMENT ON TABLE public.prestataires IS 'Exutoires / filières : Paprec, Veolia, etc. Taux de valorisation propre à chaque prestataire.';

CREATE TABLE public.prestataire_taux_valorisation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  prestataire_id uuid NOT NULL REFERENCES public.prestataires (id) ON DELETE CASCADE,
  dechet_type_id uuid NOT NULL REFERENCES public.dechets_types (id) ON DELETE RESTRICT,
  annee int NOT NULL CHECK (annee >= 2020 AND annee <= 2100),
  taux_pct numeric(5, 2) NOT NULL CHECK (taux_pct >= 0 AND taux_pct <= 100),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  CONSTRAINT prestataire_taux_unique UNIQUE (prestataire_id, dechet_type_id, annee)
);

COMMENT ON TABLE public.prestataire_taux_valorisation IS 'Taux de valorisation par typologie, par prestataire, par année (mis à jour en fin d''année).';

CREATE INDEX prestataire_taux_annee_idx ON public.prestataire_taux_valorisation (annee DESC);

ALTER TABLE public.chantiers
  ADD COLUMN IF NOT EXISTS prestataire_id uuid REFERENCES public.prestataires (id) ON DELETE SET NULL;

COMMENT ON COLUMN public.chantiers.prestataire_id IS 'Prestataire/exutoire retenu pour le calcul du taux de valorisation du chantier.';

-- Seeds prestataires (exemple client)
INSERT INTO public.prestataires (nom) VALUES
  ('Paprec'),
  ('Veolia'),
  ('Bennes services'),
  ('4g environnement')
ON CONFLICT (nom) DO UPDATE SET is_active = true;

-- Seeds taux 2026 — typologies : DIB, Gravats, Plastique, Plâtre (codes dechets_types)
INSERT INTO public.prestataire_taux_valorisation (prestataire_id, dechet_type_id, annee, taux_pct)
SELECT p.id, d.id, 2026, v.taux
FROM (VALUES
  ('Paprec', 'dib', 90::numeric),
  ('Paprec', 'gravats_propres', 100),
  ('Paprec', 'plastiques', 50),
  ('Paprec', 'platres', 90),
  ('Veolia', 'dib', 86),
  ('Veolia', 'gravats_propres', 100),
  ('Veolia', 'plastiques', 37),
  ('Veolia', 'platres', 45),
  ('Bennes services', 'dib', 75),
  ('Bennes services', 'gravats_propres', 100),
  ('Bennes services', 'plastiques', 0),
  ('Bennes services', 'platres', 80),
  ('4g environnement', 'dib', 93),
  ('4g environnement', 'gravats_propres', 100),
  ('4g environnement', 'plastiques', 20),
  ('4g environnement', 'platres', 100)
) AS v(prestataire, code_dechet, taux)
JOIN public.prestataires p ON p.nom = v.prestataire
JOIN public.dechets_types d ON d.code = v.code_dechet
ON CONFLICT (prestataire_id, dechet_type_id, annee) DO UPDATE SET
  taux_pct = EXCLUDED.taux_pct,
  updated_at = now();

ALTER TABLE public.prestataires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestataire_taux_valorisation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prestataires_select_auth"
  ON public.prestataires FOR SELECT TO authenticated
  USING (is_active = true OR public.is_admin());

CREATE POLICY "prestataires_admin_write"
  ON public.prestataires FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "prestataire_taux_select_auth"
  ON public.prestataire_taux_valorisation FOR SELECT TO authenticated
  USING (public.is_admin() OR true);

CREATE POLICY "prestataire_taux_admin_write"
  ON public.prestataire_taux_valorisation FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
