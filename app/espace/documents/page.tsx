import { DocumentsLibraryView } from "@/components/espace/documents-library-view"
import {
  getAuthUser,
  getCachedClientNavContext,
  getSupabaseServerClient,
} from "@/lib/auth/espace-session"
import { loadUserDocumentsLibrary } from "@/lib/dashboard/documents-library"

export const metadata = {
  title: "Documents · Mon espace",
  robots: { index: false, follow: false },
}

export default async function EspaceDocumentsPage() {
  const user = await getAuthUser()

  if (!user) return null

  const supabase = await getSupabaseServerClient()
  const ctx = await getCachedClientNavContext(user.id)
  const locked = ctx.isLoggedIn && !ctx.canViewDocuments

  const documents =
    ctx.isLoggedIn && ctx.canViewDocuments
      ? await loadUserDocumentsLibrary(supabase, user.id)
      : []

  return <DocumentsLibraryView documents={documents} locked={locked} />
}
