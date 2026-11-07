import Link from "next/link"
import { CreditCard } from "lucide-react"

import { EspacePanel } from "@/components/espace/espace-panel"
import { Button } from "@/components/ui/button"
import { ABONNEMENT_PRO_HT } from "@/lib/cdc/referentiels"

export function ChantierSubscriptionGate() {
  return (
    <EspacePanel className="border-amber-200/80 bg-[#ECF4E9]/60">
      <div className="flex flex-wrap items-start gap-4">
        <CreditCard className="size-8 shrink-0 text-[#35A238]" aria-hidden />
        <div className="min-w-0 flex-1 space-y-3">
          <p className="font-medium text-brand-navy">Abonnement requis pour le suivi chantier</p>
          <p className="text-sm text-muted-foreground">
            Activez l&apos;abonnement entreprise ({ABONNEMENT_PRO_HT} € HT / mois / utilisateur)
            pour accéder aux statistiques, documents et exports.
          </p>
          <Link href="/espace/compte">
            <Button className="bg-[#35A238] hover:bg-[#2d8a30]">Gérer l&apos;abonnement</Button>
          </Link>
        </div>
      </div>
    </EspacePanel>
  )
}
