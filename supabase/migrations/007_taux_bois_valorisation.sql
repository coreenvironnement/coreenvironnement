/**
 * Taux de valorisation pour Bois A / Bois B (complément migration 005)
 * Prérequis : 005_prestataires_valorisation.sql
 */

INSERT INTO public.prestataire_taux_valorisation (prestataire_id, dechet_type_id, annee, taux_pct)
SELECT p.id, d.id, 2026, v.taux
FROM (VALUES
  ('Paprec', 'bois_a', 95::numeric),
  ('Paprec', 'bois_b', 90::numeric),
  ('Veolia', 'bois_a', 90::numeric),
  ('Veolia', 'bois_b', 85::numeric),
  ('Bennes services', 'bois_a', 80::numeric),
  ('Bennes services', 'bois_b', 75::numeric),
  ('4g environnement', 'bois_a', 95::numeric),
  ('4g environnement', 'bois_b', 90::numeric)
) AS v(prestataire, code_dechet, taux)
JOIN public.prestataires p ON p.nom = v.prestataire
JOIN public.dechets_types d ON d.code = v.code_dechet
ON CONFLICT (prestataire_id, dechet_type_id, annee) DO UPDATE SET
  taux_pct = EXCLUDED.taux_pct,
  updated_at = now();
