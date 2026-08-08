import Link from "next/link"
import { HardHat, Plus, Users, Wrench } from "lucide-react"

import { requireAdmin } from "@/lib/auth/require-admin"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function AdminHomePage() {
  const { supabase } = await requireAdmin()

  const [
    { count: chantiersCount },
    { count: membresCount },
    { count: interventionsCount },
  ] = await Promise.all([
    supabase.from("chantiers").select("*", { count: "exact", head: true }),
    supabase.from("chantier_membres").select("*", { count: "exact", head: true }),
    supabase.from("interventions").select("*", { count: "exact", head: true }),
  ])

  const { data: recentChantiers } = await supabase
    .from("chantiers")
    .select("id, nom, adresse, is_active, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Vue d&apos;ensemble</h2>
          <p className="text-sm text-muted-foreground">
            Gérez chantiers, accès clients et interventions.
          </p>
        </div>
        <Link href="/admin/chantiers" className={cn(buttonVariants())}>
          <Plus className="size-4" aria-hidden />
          Nouveau chantier
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-navy">
              <HardHat className="size-4" aria-hidden />
              Chantiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-navy">{chantiersCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-navy">
              <Users className="size-4" aria-hidden />
              Accès clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-navy">{membresCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-navy">
              <Wrench className="size-4" aria-hidden />
              Interventions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-navy">{interventionsCount ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chantiers récents</CardTitle>
          <CardDescription>Derniers chantiers créés</CardDescription>
        </CardHeader>
        <CardContent>
          {recentChantiers?.length ? (
            <ul className="divide-y divide-border/60">
              {recentChantiers.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <Link
                      href={`/admin/chantiers/${c.id}`}
                      className="font-medium text-brand-navy hover:text-primary"
                    >
                      {c.nom}
                    </Link>
                    {c.adresse ? (
                      <p className="text-sm text-muted-foreground">{c.adresse}</p>
                    ) : null}
                  </div>
                  <span
                    className={
                      c.is_active
                        ? "text-xs font-medium text-primary"
                        : "text-xs text-muted-foreground"
                    }
                  >
                    {c.is_active ? "Actif" : "Inactif"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucun chantier.{" "}
              <Link href="/admin/chantiers" className="text-primary hover:underline">
                Créer le premier
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
