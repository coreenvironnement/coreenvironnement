"use client"

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { TonnageChartRow } from "@/lib/dashboard/chantier-data"
import type { ValorisationResult } from "@/lib/valorisation/calculate"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CHART_COLORS = ["#38a234", "#1b418f", "#5a9fd4", "#7bc96f", "#2d6a4f", "#40916c"]

type Props = {
  tonnages: TonnageChartRow[]
  valorisation: ValorisationResult
  prestataireNom: string | null
  anneeTaux: number
}

function TonnageTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: TonnageChartRow }[]
}) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-brand-navy">{row.nom}</p>
      <p>{row.tonnageT} t · {row.partPct} % du total</p>
    </div>
  )
}

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { name: string; value: number }[]
}) {
  if (!active || !payload?.length) return null
  const row = payload[0]
  return (
    <div className="rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-brand-navy">{row.name}</p>
      <p>{row.value} %</p>
    </div>
  )
}

export function WasteCharts({ tonnages, valorisation, prestataireNom, anneeTaux }: Props) {
  const pieData = [
    { name: "Valorisation", value: valorisation.tauxValorisationPct, color: "#38a234" },
    { name: "Élimination", value: valorisation.tauxEliminationPct, color: "#1b418f" },
  ]

  const hasTonnages = tonnages.some((t) => t.tonnageT > 0)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tonnages par typologie</CardTitle>
          <CardDescription>
            Total chantier : {valorisation.tonnageTotalT} t
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
          {hasTonnages ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tonnages} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
                <XAxis
                  dataKey="nom"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tick={{ fontSize: 11 }} unit=" t" />
                <Tooltip content={<TonnageTooltip />} />
                <Bar dataKey="tonnageT" name="Tonnage" radius={[6, 6, 0, 0]}>
                  {tonnages.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-brand-navy/15 bg-muted/20 px-4 text-center text-sm text-muted-foreground">
              Aucun tonnage saisi pour ce chantier. Votre administrateur CORE ENVIRONNEMENT
              alimente ces données.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Valorisation / élimination</CardTitle>
          <CardDescription>
            {prestataireNom
              ? `Calcul ${anneeTaux} · prestataire ${prestataireNom}`
              : "Aucun prestataire associé au chantier — taux à 0 %"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
          {hasTonnages ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={96}
                  paddingAngle={2}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-brand-navy/15 bg-muted/20 px-4 text-center text-sm text-muted-foreground">
              Les camemberts s&apos;affichent dès que des tonnages sont disponibles.
            </div>
          )}
        </CardContent>
      </Card>

      {hasTonnages && valorisation.details.length > 0 ? (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Détail du calcul</CardTitle>
            <CardDescription>
              Tonnage valorisé : {valorisation.tonnageValoriseT} t sur{" "}
              {valorisation.tonnageTotalT} t
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Typologie</th>
                    <th className="py-2 pr-3 font-medium">Tonnage</th>
                    <th className="py-2 pr-3 font-medium">Part</th>
                    <th className="py-2 pr-3 font-medium">Taux prestataire</th>
                    <th className="py-2 font-medium">Tonnage valorisé</th>
                  </tr>
                </thead>
                <tbody>
                  {valorisation.details.map((d) => (
                    <tr key={d.dechetTypeId} className="border-b border-border/40">
                      <td className="py-2 pr-3">{d.dechetNom ?? "—"}</td>
                      <td className="py-2 pr-3">{d.tonnageT} t</td>
                      <td className="py-2 pr-3">{d.partPct} %</td>
                      <td className="py-2 pr-3">{d.tauxPct} %</td>
                      <td className="py-2">{d.tonnageValoriseT} t</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
