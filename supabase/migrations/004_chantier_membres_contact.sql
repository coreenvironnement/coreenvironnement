/**
 * Coordonnées contact sur le lien chantier ↔ personne (CDC admin)
 * Prérequis : 002_dashboard_mois1.sql
 */

ALTER TABLE public.chantier_membres
  ADD COLUMN IF NOT EXISTS contact_prenom text,
  ADD COLUMN IF NOT EXISTS contact_nom text,
  ADD COLUMN IF NOT EXISTS contact_fonction text,
  ADD COLUMN IF NOT EXISTS contact_entreprise text;

COMMENT ON COLUMN public.chantier_membres.contact_prenom IS 'Prénom du contact (optionnel, affichage admin).';
COMMENT ON COLUMN public.chantier_membres.contact_nom IS 'Nom du contact (optionnel).';
COMMENT ON COLUMN public.chantier_membres.contact_fonction IS 'Fonction ex. Chef de chantier (optionnel).';
COMMENT ON COLUMN public.chantier_membres.contact_entreprise IS 'Entreprise du contact (optionnel).';

-- Nom explicite de la FK pour les requêtes Supabase (évite l''ambiguïté avec created_by)
COMMENT ON CONSTRAINT chantier_membres_profile_id_fkey ON public.chantier_membres IS
  'Lien vers le compte client (profiles.id).';
