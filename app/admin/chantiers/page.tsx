import Link from "next/link"
import { Plus } from "lucide-react"

import { createChantier } from "@/app/admin/actions"
import { requireAdmin } from "@/lib/auth/require-admin"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Chantiers · Admin",
}

export default async function AdminChantiersPage() {
  const { supabase } = await requireAdmin()

  const { data: chantiers } = await supabase
    .from("chantiers")
    .select("id, nom, adresse, code_affaire, is_active, created_at")
    .order("nom")

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-brand-navy">Chantiers</h2>
        <p className="text-sm text-muted-foreground">
          Créez un chantier et liez les e-mails des clients qui y auront accès.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="size-4" aria-hidden />
            Nouveau chantier
          </CardTitle>
          <CardDescription>Nom obligatoire · adresse et code affaire optionnels</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createChantier} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="nom" className="text-sm font-medium">
                Nom du chantier *
              </label>
              <Input id="nom" name="nom" required placeholder="Rénovation — Paris 15e" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="adresse" className="text-sm font-medium">
                Adresse
              </label>
              <Input id="adresse" name="adresse" placeholder="12 rue Example, 75015 Paris" />
            </div>
            <div className="space-y-2">
              <label htmlFor="code_affaire" className="text-sm font-medium">
                Code affaire
              </label>
              <Input id="code_affaire" name="code_affaire" placeholder="AFF-2026-001" />
            </div>
            <div className="flex items-end">
              <Button type="submit">Créer le chantier</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des chantiers</CardTitle>
          <CardDescription>{chantiers?.length ?? 0} chantier(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {chantiers?.length ? (
            <ul className="divide-y divide-border/60">
              {chantiers.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <Link
                      href={`/admin/chantiers/${c.id}`}
                      className="font-semibold text-brand-navy hover:text-primary"
                    >
                      {c.nom}
                    </Link>
                    {c.adresse ? (
                      <p className="text-sm text-muted-foreground">{c.adresse}</p>
                    ) : null}
                    {c.code_affaire ? (
                      <p className="text-xs text-muted-foreground">Code : {c.code_affaire}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        c.is_active
                          ? "bg-primary/12 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {c.is_active ? "Actif" : "Inactif"}
                    </span>
                    <Link
                      href={`/admin/chantiers/${c.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      Gérer
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun chantier pour le moment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
