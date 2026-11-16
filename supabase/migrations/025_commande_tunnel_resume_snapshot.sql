-- Snapshot tunnel particulier pour reprise (e-mail, espace, liens signés)
ALTER TABLE public.commandes
  ADD COLUMN IF NOT EXISTS tunnel_resume_snapshot jsonb;

COMMENT ON COLUMN public.commandes.tunnel_resume_snapshot IS
  'ParticulierTunnelResume v1 : état tunnel pour reprise sans regéocoder (7 j via jeton).';