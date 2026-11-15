import Link from "next/link"

import { createPrestataire } from "@/app/admin/actions"
import { requireAdmin } from "@/lib/auth/require-admin"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = {
  title: "Prestataires · Admin",
}

export default async function AdminPrestatairesPage() {
  const { supabase } = await requireAdmin()

  const { data: prestataires } = await supabase
    .from("prestataires")
    .select("id, nom, raison_sociale, is_active, ville, email, telephone")
    .order("nom")

  const { data: docsExpiring } = await supabase
    .from("prestataire_documents")
    .select("prestataire_id, expires_at")
    .lte("expires_at", new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10))

  const expiringByPrest = new Map<string, number>()
  for (const d of docsExpiring ?? []) {
    expiringByPrest.set(d.prestataire_id, (expiringByPrest.get(d.prestataire_id) ?? 0) + 1)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-brand-navy">Prestataires</h2>
        <p className="text-sm text-muted-foreground">
          Filières d&apos;élimination et transport — {prestataires?.length ?? 0} prestataire
          {(prestataires?.length ?? 0) === 1 ? "" : "s"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouveau prestataire</CardTitle>
          <CardDescription>Raison sociale obligatoire</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPrestataire} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Raison sociale *</label>
              <Input name="raison_sociale" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail</label>
              <Input name="email" type="email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input name="telephone" />
            </div>
            <div>
              <Button type="submit">Créer</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste</CardTitle>
        </CardHeader>
        <CardContent>
          {prestataires?.length ? (
            <ul className="divide-y divide-border/60">
              {prestataires.map((p) => {
                const label = p.raison_sociale ?? p.nom
                const exp = expiringByPrest.get(p.id)
                return (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-medium text-brand-navy">{label}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.ville ?? "—"} · {p.email ?? p.telephone ?? "—"}
                        {!p.is_active ? " · inactif" : null}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {exp ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">
                          {exp} doc{exp > 1 ? "s" : ""} à surveiller
                        </span>
                      ) : null}
                      <Link
                        href={`/admin/prestataires/${p.id}`}
                        className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                      >
                        Fiche
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun prestataire.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}