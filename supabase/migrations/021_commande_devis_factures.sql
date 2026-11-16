-- Devis e-mail (anti-spam), factures commande, bucket documents

ALTER TABLE public.commandes
  ADD COLUMN IF NOT EXISTS livree_at timestamptz,
  ADD COLUMN IF NOT EXISTS invoice_storage_path text,
  ADD COLUMN IF NOT EXISTS invoice_generated_at timestamptz,
  ADD COLUMN IF NOT EXISTS invoice_number text;

COMMENT ON COLUMN public.commandes.livree_at IS 'Horodatage passage au statut livree (admin).';
COMMENT ON COLUMN public.commandes.invoice_storage_path IS 'Chemin PDF facture dans bucket commande-documents.';

CREATE TABLE IF NOT EXISTS public.devis_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  email text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS devis_email_log_email_sent_idx
  ON public.devis_email_log (email, sent_at DESC);

ALTER TABLE public.devis_email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "devis_email_log_service"
  ON public.devis_email_log FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'commande-documents',
  'commande-documents',
  false,
  5242880,
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "commande_docs_select_own"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'commande-documents'
    AND EXISTS (
      SELECT 1
      FROM public.commandes c
      WHERE c.client_id = auth.uid ()
        AND c.invoice_storage_path = name
    )
  );

CREATE POLICY "commande_docs_service_write"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'commande-documents')
  WITH CHECK (bucket_id = 'commande-documents');