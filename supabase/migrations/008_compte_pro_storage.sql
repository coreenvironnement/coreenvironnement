/**
 * Bucket Storage pour dossiers compte pro (KBIS, RIB)
 * Prérequis : 002_dashboard_mois1.sql
 *
 * Chemins : {profile_id}/kbis/... et {profile_id}/rib/...
 */

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'compte-pro-documents',
  'compte-pro-documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "compte_pro_docs_select_own_or_admin" ON storage.objects;
DROP POLICY IF EXISTS "compte_pro_docs_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "compte_pro_docs_admin_write" ON storage.objects;

CREATE POLICY "compte_pro_docs_select_own_or_admin"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'compte-pro-documents'
    AND (
      public.is_admin()
      OR (storage.foldername(name))[1] = auth.uid()::text
    )
  );

CREATE POLICY "compte_pro_docs_insert_own"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'compte-pro-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "compte_pro_docs_admin_write"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'compte-pro-documents' AND public.is_admin())
  WITH CHECK (bucket_id = 'compte-pro-documents' AND public.is_admin());
