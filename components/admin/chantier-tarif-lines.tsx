import {
  deactivateChantierLigneTarifaire,
  upsertChantierLigneTarifaire,
} from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatEuro } from "@/lib/format/currency"

export type ChantierTarifLine = {
  id: string
  label: string
  facturation_traitement: string
  prix_vente_traitement_ht: number
  prix_achat_traitement_ht: number
  prix_vente_transport_ht: number
  prix_achat_transport_ht: number
  prix_vente_location_ht: number
  prix_achat_location_ht: number
  tonnage_inclus_kg: number | null
  is_active: boolean
}

function margePct(vente: number, achat: number): number {
  if (vente <= 0) return 0
  return Math.round(((vente - achat) / vente) * 1000) / 10
}

type Props = {
  chantierId: string
  lignes: ChantierTarifLine[]
}

export function ChantierTarifLines({ chantierId, lignes }: Props) {
  const upsertBound = upsertChantierLigneTarifaire.bind(null, chantierId)
  const actives = lignes.filter((l) => l.is_active)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lignes tarifaires</CardTitle>
        <CardDescription>
          Traitement, transport et location - marges calculées à la volée (admin uniquement).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {actives.length ? (
          <ul className="space-y-3 text-sm">
            {actives.map((l) => {
              const margeTraitement = margePct(
                Number(l.prix_vente_traitement_ht),
                Number(l.prix_achat_traitement_ht)
              )
              return (
                <li key={l.id} className="rounded-lg border border-[#35A238]/15 bg-white p-3">
                  <p className="font-medium text-brand-navy">{l.label}</p>
                  <p className="text-muted-foreground">
                    Traitement {l.facturation_traitement} · Vente{" "}
                    {formatEuro(l.prix_vente_traitement_ht)} · Marge {margeTraitement} %
                    {l.tonnage_inclus_kg != null ? ` · ${l.tonnage_inclus_kg} kg inclus` : null}
                  </p>
                  <form action={deactivateChantierLigneTarifaire.bind(null, l.id, chantierId)}>
                    <Button type="submit" variant="ghost" size="sm" className="mt-2 px-0">
                      Désactiver
                    </Button>
                  </form>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Aucune ligne active.</p>
        )}

        <form action={upsertBound} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-medium">Intitulé</label>
            <Input name="label" required placeholder="Traitement gravats" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Traitement</label>
            <select
              name="facturation_traitement"
              className="h-9 w-full rounded-lg border border-input px-2 text-sm"
            >
              <option value="forfait">Forfait</option>
              <option value="poids">Au poids</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Vente traitement HT</label>
            <Input name="prix_vente_traitement_ht" type="number" step="0.01" defaultValue="0" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Achat traitement HT</label>
            <Input name="prix_achat_traitement_ht" type="number" step="0.01" defaultValue="0" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Vente transport HT</label>
            <Input name="prix_vente_transport_ht" type="number" step="0.01" defaultValue="0" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Achat transport HT</label>
            <Input name="prix_achat_transport_ht" type="number" step="0.01" defaultValue="0" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Vente location HT</label>
            <Input name="prix_vente_location_ht" type="number" step="0.01" defaultValue="0" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Achat location HT</label>
            <Input name="prix_achat_location_ht" type="number" step="0.01" defaultValue="0" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Tonnage inclus (kg)</label>
            <Input name="tonnage_inclus_kg" type="number" step="0.01" />
          </div>
          <div className="flex items-end">
            <Button type="submit">Ajouter la ligne</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}