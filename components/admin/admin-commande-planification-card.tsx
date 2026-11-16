"use client"

import {
  planifierCommandeLivraison,
  reporterCommandeLivraison,
} from "@/app/admin/actions"
import { formatCreneauFrShort } from "@/lib/planning/creneau"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { AdminClientContactMenu } from "./admin-client-contact-menu"
import { AdminCreneauPlanDialog } from "./admin-creneau-plan-dialog"

type Props = {
  commandeId: string
  reference: string
  telephone: string | null
  dateLivraison: string | null
  livraisonPlanifieeAt: string | null
  canPlan: boolean
  returnTo: string
}

export function AdminCommandePlanificationCard({
  commandeId,
  reference,
  telephone,
  dateLivraison,
  livraisonPlanifieeAt,
  canPlan,
  returnTo,
}: Props) {
  if (!canPlan && !livraisonPlanifieeAt) return null

  const creneauLabel = formatCreneauFrShort(livraisonPlanifieeAt)
  const planAction = planifierCommandeLivraison.bind(null, commandeId)
  const reportAction = reporterCommandeLivraison.bind(null, commandeId)

  return (
    <Card className="border-[#35A238]/25 bg-[#ECF4E9]/40">
      <CardHeader>
        <CardTitle>Planification livraison</CardTitle>
        <CardDescription>
          {creneauLabel
            ? `Créneau confirmé : ${creneauLabel}`
            : "Choisissez la date et l'heure — le client sera notifié par e-mail."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        {!livraisonPlanifieeAt ? (
          <AdminCreneauPlanDialog
            title="Planifier la livraison"
            submitLabel="Planifier"
            defaultDate={dateLivraison}
            returnTo={returnTo}
            action={planAction}
          />
        ) : (
          <AdminCreneauPlanDialog
            title="Reporter la livraison"
            description="En cas d'imprévu, proposez un nouveau créneau."
            submitLabel="Reporter"
            defaultDate={livraisonPlanifieeAt.slice(0, 10)}
            variant="outline"
            returnTo={returnTo}
            action={reportAction}
          />
        )}
        <AdminClientContactMenu
          telephone={telephone}
          reference={reference}
          creneauLabel={creneauLabel}
        />
      </CardContent>
    </Card>
  )
}