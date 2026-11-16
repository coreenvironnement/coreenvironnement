import Link from "next/link"

import { LogoutButton } from "@/components/auth/logout-button"
import { EspacePageHeader, EspacePanel } from "@/components/espace/espace-panel"
import { EspaceProfilForm, type ProfilFormInitial } from "@/components/espace/espace-profil-form"
import { ProfilPaymentPanel } from "@/components/espace/profil-payment-panel"

type Props = {
  formInitial: ProfilFormInitial
  hasComptePro: boolean
  hasChantier: boolean
  stripeBillingAvailable: boolean
  hasStripeCustomer: boolean
  isParticulier: boolean
}

export function EspaceProfilView({
  formInitial,
  hasComptePro,
  hasChantier,
  stripeBillingAvailable,
  hasStripeCustomer,
  isParticulier,
}: Props) {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <EspacePageHeader
        title="Mon compte"
        meta={isParticulier ? "Coordonnées" : "Coordonnées et moyens de paiement"}
      />

      <EspacePanel>
        <EspaceProfilForm initial={formInitial} />
      </EspacePanel>

      {!isParticulier ? (
        <EspacePanel>
          <ProfilPaymentPanel
            stripeBillingAvailable={stripeBillingAvailable}
            hasStripeCustomer={hasStripeCustomer}
          />
        </EspacePanel>
      ) : null}

      <EspacePanel className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Raccourcis
        </p>
        <ul className="space-y-2 text-sm">
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