import Link from "next/link"

import {
  acceptRotationDemande,
  rejectRotationDemande,
} from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export type AdminRotationDemandeRow = {
  id: string
  souhaiteLe: string
  statut: string
  commentaire: string | null
  contenantLabel: string | null
  dechetNom: string | null
  profileEmail: string | null
}

function formatParis(iso: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

const statutLabel: Record<string, string> = {
  en_attente: "En attente",
  prise_en_charge: "Prise en charge",
  refusee: "Refusée",
}

export function ChantierRotationQueue({
  chantierId,
  demandes,
  error,
}: {
  chantierId: string
  demandes: AdminRotationDemandeRow[]
  error?: string
}) {
  if (!demandes.length && !error) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rotations demandées</CardTitle>
        <CardDescription>
          Demandes envoyées depuis l&apos;espace client chantier. Créez une intervention
          type rotation après validation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {decodeURIComponent(error)}
          </p>
        ) : null}
        {!demandes.length ? (
          <p className="text-sm text-muted-foreground">Aucune demande pour ce chantier.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Souhaité le</th>
                  <th className="py-2 pr-3 font-medium">Benne / déchet</th>
                  <th className="py-2 pr-3 font-medium">Client</th>
                  <th className="py-2 pr-3 font-medium">Statut</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {demandes.map((d) => {
                  const acceptBound = acceptRotationDemande.bind(null, d.id, chantierId)
                  const rejectBound = rejectRotationDemande.bind(null, d.id, chantierId)
                  return (
                    <tr key={d.id} className="border-b border-border/40 align-top">
                      <td className="py-3 pr-3">{formatParis(d.souhaiteLe)}</td>
                      <td className="py-3 pr-3">
                        {d.contenantLabel ?? "—"}
                        {d.dechetNom ? ` · ${d.dechetNom}` : null}
                        {d.commentaire ? (
                          <p className="mt-1 text-xs text-muted-foreground">{d.commentaire}</p>
                        ) : null}
                      </td>
                      <td className="py-3 pr-3 text-xs">{d.profileEmail ?? "—"}</td>
                      <td className="py-3 pr-3 text-xs">
                        {statutLabel[d.statut] ?? d.statut}
                      </td>
                      <td className="py-3">
                        {d.statut === "en_attente" ? (
                          <div className="flex flex-wrap gap-2">
                            <form action={acceptBound}>
                              <Button type="submit" size="sm">
                                Créer rotation
                              </Button>
                            </form>
                            <form action={rejectBound}>
                              <Button type="submit" variant="outline" size="sm">
                                Refuser
                              </Button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          <Link href="/admin/chantiers" className="text-primary hover:underline">
            Tous les chantiers
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
