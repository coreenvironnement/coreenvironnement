import Link from "next/link"

import { LogoutButton } from "@/components/auth/logout-button"
import { EspacePageHeader, EspacePanel } from "@/components/espace/espace-panel"

type Props = {
  displayName: string
  email: string
  hasComptePro: boolean
  hasChantier: boolean
}

export function EspaceProfilView({
  displayName,
  email,
  hasComptePro,
  hasChantier,
}: Props) {
  return (
    <div className="mx-auto max-w-lg space-y-5">
      <EspacePageHeader title="Mon compte" meta="Session et déconnexion" />

      <EspacePanel className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Connecté en tant que
          </p>
          <p className="mt-1 text-lg font-semibold text-brand-navy">{displayName}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{email}</p>
        </div>

        <ul className="space-y-2 border-t border-[#35A238]/12 pt-4 text-sm">
          <li>
            <Link href="/espace/commandes" className="font-medium text-[#35A238] hover:underline">
              Mes commandes
            </Link>
          </li>
          {hasComptePro ? (
            <li>
              <Link href="/espace/compte" className="font-medium text-[#35A238] hover:underline">
                Entreprise & abonnement
              </Link>
            </li>
          ) : null}
          {hasChantier ? (
            <li>
              <Link href="/espace/chantier" className="font-medium text-[#35A238] hover:underline">
                Suivi chantier
              </Link>
            </li>
          ) : null}
        </ul>
      </EspacePanel>

      <EspacePanel>
        <p className="text-sm text-muted-foreground">
          Vous quittez votre espace client. Vous pourrez vous reconnecter à tout moment.
        </p>
        <LogoutButton
          variant="outline"
          size="default"
          className="mt-4 h-11 w-full justify-center border-[#35A238]/30 bg-white hover:bg-[#ECF4E9]"
        />
      </EspacePanel>
    </div>
  )
}
