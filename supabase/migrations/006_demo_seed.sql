#!/usr/bin/env node
/**
 * Guide prérequis Mois 1 — à exécuter dans Supabase SQL Editor si check-prerequisites échoue.
 * Ne crée pas de comptes Auth : liez un e-mail client existant ou créez-le dans Authentication → Users.
 */

-- ---------------------------------------------------------------------------
-- 1. Vérifier migrations (doivent déjà être appliquées via fichiers 004 et 005)
-- ---------------------------------------------------------------------------

-- Si erreur "column contact_prenom does not exist" → exécuter 004_chantier_membres_contact.sql
-- Si erreur "relation prestataires does not exist" → exécuter 005_prestataires_valorisation.sql

-- ---------------------------------------------------------------------------
-- 2. Données démo chantier (idempotent — ne duplique pas si nom existe)
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  v_chantier_id uuid;
  v_paprec_id uuid;
  v_dib_id uuid;
  v_gravats_id uuid;
  v_bois_id uuid;
  v_type_intervention_id uuid;
  v_contenant_id uuid;
BEGIN
  SELECT id INTO v_paprec_id FROM public.prestataires WHERE nom = 'Paprec' LIMIT 1;

  SELECT id INTO v_chantier_id FROM public.chantiers WHERE nom = 'Démo — Rénovation Paris 15e' LIMIT 1;

  IF v_chantier_id IS NULL THEN
    INSERT INTO public.chantiers (nom, adresse, code_affaire, prestataire_id, is_active)
    VALUES (
      'Démo — Rénovation Paris 15e',
      '12 rue Exemple, 75015 Paris',
      'DEMO-2026-001',
      v_paprec_id,
      true
    )
    RETURNING id INTO v_chantier_id;
  END IF;

  SELECT id INTO v_dib_id FROM public.dechets_types WHERE code = 'dib' LIMIT 1;
  SELECT id INTO v_gravats_id FROM public.dechets_types WHERE code = 'gravats_propres' LIMIT 1;
  SELECT id INTO v_bois_id FROM public.dechets_types WHERE code = 'bois_a' LIMIT 1;

  INSERT INTO public.chantier_stats_dechets (chantier_id, dechet_type_id, tonnage_t, periode_debut, periode_fin)
  VALUES
    (v_chantier_id, v_dib_id, 12.0, NULL, NULL),
    (v_chantier_id, v_gravats_id, 8.5, NULL, NULL),
    (v_chantier_id, v_bois_id, 4.0, NULL, NULL)
  ON CONFLICT (chantier_id, dechet_type_id, periode_debut, periode_fin) DO UPDATE SET
    tonnage_t = EXCLUDED.tonnage_t,
    updated_at = now();

  SELECT id INTO v_type_intervention_id FROM public.types_intervention WHERE code = 'depose' LIMIT 1;
  SELECT id INTO v_contenant_id FROM public.types_contenants WHERE code = 'benne_15m3' LIMIT 1;

  IF NOT EXISTS (
    SELECT 1 FROM public.interventions WHERE chantier_id = v_chantier_id LIMIT 1
  ) THEN
    INSERT INTO public.interventions (
      chantier_id,
      type_intervention_id,
      contenant_id,
      dechet_type_id,
      statut,
      date_demande,
      date_souhaitee,
      commentaire
    ) VALUES (
      v_chantier_id,
      v_type_intervention_id,
      v_contenant_id,
      v_dib_id,
      'realisee',
      current_date - 7,
      current_date - 5,
      'Intervention démo Mois 1'
    );
  END IF;

  RAISE NOTICE 'Chantier démo prêt : %', v_chantier_id;
  RAISE NOTICE 'Étape manuelle : lier un e-mail client dans /admin → Accès clients';
  RAISE NOTICE 'Étape manuelle : uploader 1 PDF (BI/pesée/BSD) sur l''intervention dans /admin';
END $$;

-- ---------------------------------------------------------------------------
-- 3. Lier un client par e-mail (remplacez l''adresse)
-- ---------------------------------------------------------------------------
-- Décommentez et adaptez après avoir créé le user dans Authentication :

/*
INSERT INTO public.chantier_membres (chantier_id, profile_id, contact_prenom, contact_nom, contact_fonction, contact_entreprise)
SELECT
  c.id,
  p.id,
  'Marie',
  'Demo',
  'Chef de chantier',
  'Entreprise Test SAS'
FROM public.chantiers c
CROSS JOIN public.profiles p
WHERE c.nom = 'Démo — Rénovation Paris 15e'
  AND lower(p.email) = lower('VOTRE_EMAIL_CLIENT@example.com')
ON CONFLICT DO NOTHING;
*/
