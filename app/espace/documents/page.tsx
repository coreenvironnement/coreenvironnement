import { DocumentsLibraryView } from "@/components/espace/documents-library-view"
import { getClientNavContext } from "@/lib/auth/client-nav-context"
import { loadUserDocumentsLibrary } from "@/lib/dashboard/documents-library"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Documents · Mon espace",
  robots: { index: false, follow: false },
}

export default async function EspaceDocumentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const ctx = await getClientNavContext(supabase, user.id)
  const locked = ctx.isLoggedIn && !ctx.canViewDocuments

  const documents =
    ctx.isLoggedIn && ctx.canViewDocuments
      ? await loadUserDocumentsLibrary(supabase, user.id)
      : []

  return <DocumentsLibraryView documents={documents} locked={locked} />
}
