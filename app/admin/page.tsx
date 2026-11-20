import Link from "next/link"
import { Briefcase, ClipboardList, HardHat, Pencil } from "lucide-react"

import { requireAdmin } from "@/lib/auth/require-admin"
import { loadAdminDashboardMetrics } from "@/lib/admin/dashboard-metrics"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDateFr } from "@/lib/format/date"

export default async function AdminHomePage() {
  const { supabase } = await requireAdmin()
  const metrics = await loadAdminDashboardMetrics(supabase)

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Tableau de bord</h2>
          <p className="text-sm text-muted-foreground">
            Suivi opérationnel chantiers, interventions et comptes professionnels.
          </p>
        </div>
        <Link href="/admin/chantiers" className={cn(buttonVariants())}>
          Nouveau chantier
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-navy">
              <HardHat className="size-4" aria-hidden />
              Chantiers
            </CardTitle>
            <CardDescription>Actifs / total</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-navy">
              {metrics.chantiersActifs}
              <span className="text-lg font-medium text-muted-foreground">
                {" "}
                / {metrics.chantiersTotal}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-navy">
              <ClipboardList className="size-4" aria-hidden />
              Interventions
            </CardTitle>
            <CardDescription>À planifier / planifiées</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-navy">
              {metrics.interventionsAPlanifier}
              <span className="text-lg font-medium text-muted-foreground">
                {" "}
                / {metrics.interventionsPlanifiees}
              </span>
            </p>
            <Link
              href="/admin/interventions?vue=a-planifier"
              className={cn(buttonVariants({ size: "sm" }), "mt-3 w-full")}
            >
              Voir à planifier
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-navy">
              <Briefcase className="size-4" aria-hidden />
              Comptes pro
            </CardTitle>
            <CardDescription>Demandes / comptes validés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-navy">
              {metrics.comptesProPending}
              <span className="text-lg font-medium text-muted-foreground">
                {" "}
                / {metrics.comptesProActifs}
              </span>
            </p>
            <Link
              href="/admin/comptes-pro"
              className={cn(buttonVariants({ size: "sm" }), "mt-3 w-full")}
            >
              Voir les dossiers
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-navy">
              <Pencil className="size-4" aria-hidden />
              Brouillons
            </CardTitle>
            <CardDescription>Commandes non finalisées</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-navy">{metrics.brouillons}</p>
            <Link
              href="/admin/interventions?vue=brouillon"
              className={cn(buttonVariants({ size: "sm" }), "mt-3 w-full")}
            >
              Voir les brouillons
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Interventions à planifier</CardTitle>
            <CardDescription>Plus anciennes en premier</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.aPlanifierRows.length ? (
              <ul className="divide-y divide-border/60 text-sm">
                {metrics.aPlanifierRows.map((row) => (
                  <li key={`${row.kind}-${row.id}`} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-medium text-brand-navy">{row.label}</p>
                      <p className="text-muted-foreground">{row.client}</p>
                    </div>
                    <Link href={row.href} className="text-primary hover:underline">
                      {formatDateFr(row.dateSort.slice(0, 10))}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Rien à planifier pour le moment.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interventions planifiées</CardTitle>
            <CardDescription>Ordre chronologique</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.planifieesRows.length ? (
              <ul className="divide-y divide-border/60 text-sm">
                {metrics.planifieesRows.map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-medium text-brand-navy">{row.numero}</p>
                      <p className="text-muted-foreground">{row.chantier}</p>
                    </div>
                    <Link href={row.href} className="text-primary hover:underline">
                      {row.datePrevue ? formatDateFr(row.datePrevue) : "-"}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune intervention planifiée.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>À traiter</CardTitle>
          <CardDescription>Contrôles rapides sur les données existantes</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.aTraiter.length ? (
            <ul className="space-y-2 text-sm">
              {metrics.aTraiter.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="text-brand-navy hover:text-primary hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune alerte pour l&apos;instant.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}