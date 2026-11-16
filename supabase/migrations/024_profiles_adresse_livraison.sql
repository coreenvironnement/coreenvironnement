-- Adresse de livraison par défaut (compte particulier), éditable depuis /espace/profil

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS adresse_livraison_ligne text,
  ADD COLUMN IF NOT EXISTS adresse_livraison_code_postal text,
  ADD COLUMN IF NOT EXISTS adresse_livraison_ville text;

COMMENT ON COLUMN public.profiles.adresse_livraison_ligne IS
  'Voie / complément d''adresse de livraison par défaut (hors CP/ville).';
COMMENT ON COLUMN public.profiles.adresse_livraison_code_postal IS
  'Code postal de livraison par défaut (IDF).';
COMMENT ON COLUMN public.profiles.adresse_livraison_ville IS
  'Ville de livraison par défaut.';