import { AuthBackLink } from "@/components/auth/auth-back-link"

/** Barre auth : retour uniquement (logo dans la carte formulaire). */
export function AuthPageHeader() {
  return (
    <div className="mb-1 flex items-center pt-[max(0.25rem,env(safe-area-inset-top,0px))] sm:mb-2">
      <AuthBackLink />
    </div>
  )
}