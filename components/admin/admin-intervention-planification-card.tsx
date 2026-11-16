"use client"

import { planifierIntervention, reporterIntervention } from "@/app/admin/actions"
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
  interventionId: string
  chantierId: string
  reference: string
  telephone: string | null
  dateSouhaitee: string | null
  planifieeLe: string | null
  canPlan: boolean
  returnTo: string
}

export function AdminInterventionPlanificationCard({
  interventionId,
  chantierId,
  reference,
  telephone,
  dateSouhaitee,
  planifieeLe,
  canPlan,
  returnTo,
}: Props) {
  const creneauLabel = formatCreneauFrShort(planifieeLe)
  const planAction = planifierIntervention.bind(null, interventionId, chantierId)
  const reportAction = reporterIntervention.bind(null, interventionId, chantierId)

  return (
    <Card className="border-[#35A238]/25 bg-[#ECF4E9]/40">
      <CardHeader>
        <CardTitle>Planification</CardTitle>
        <CardDescription>
          {creneauLabel
            ? `Créneau confirmé : ${creneauLabel}`
            : "Programmez date et heure pour le client chantier."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        {canPlan && !planifieeLe ? (
          <AdminCreneauPlanDialog
            title="Planifier l'intervention"
            submitLabel="Planifier"
            defaultDate={dateSouhaitee}
            returnTo={returnTo}
            action={planAction}
          />
        ) : planifieeLe ? (
          <AdminCreneauPlanDialog
            title="Reporter l'intervention"
            submitLabel="Reporter"
            defaultDate={planifieeLe.slice(0, 10)}
            variant="outline"
            returnTo={returnTo}
            action={reportAction}
          />
        ) : null}
        <AdminClientContactMenu
          telephone={telephone}
          reference={reference}
          creneauLabel={creneauLabel}
        />
      </CardContent>
    </Card>
  )
}