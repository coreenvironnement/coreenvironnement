-- Segmentation particulier / professionnel sur le profil client
CREATE TYPE public.client_kind AS ENUM ('particulier', 'professionnel');

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS client_kind public.client_kind NOT NULL DEFAULT 'particulier';

COMMENT ON COLUMN public.profiles.client_kind IS
  'Typologie client pour l''admin : particulier ou professionnel (compte pro).';

CREATE INDEX IF NOT EXISTS profiles_client_kind_idx ON public.profiles (client_kind);

-- Admins : kind reste particulier par défaut ; le rôle admin prime dans l''UI.
UPDATE public.profiles p
SET client_kind = 'professionnel'
FROM public.comptes_pro cp
WHERE cp.profile_id = p.id;
