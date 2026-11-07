import Link from "next/link"

import { CommandesList } from "@/components/client/commandes-list"
import { CommandesParticulierLive } from "@/components/espace/commandes-particulier-live"
import { EspacePageHeader, EspacePanel } from "@/components/espace/espace-panel"
import { Button } from "@/components/ui/button"
import type { CommandeSnapshotRow } from "@/app/espace/commandes/actions"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Commandes · Mon espace",
  robots: { index: false, follow: false },
}

export default async function EspaceCommandesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const emailConfirmed = Boolean(user.email_confirmed_at)

  const { data: commandes } = await supabase
    .from("commandes")
    .select(
      "id, statut, payment_status, prestation_label, prestation_id, volume_m3, date_livraison, date_creation, adresse_complete, audience"
    )
    .eq("client_id", user.id)
    .order("date_creation", { ascending: false })

  const list = (commandes ?? []) as CommandeSnapshotRow[]
  const professionnel = list.filter((c) => c.audience === "professionnel")
  const particulier = list.filter((c) => c.audience === "particulier")

  const { data: comptePro } = await supabase
    .from("comptes_pro")
    .select("status")
    .eq("profile_id", user.id)
    .maybeSingle()

  const proPending =
    professionnel.length > 0 && comptePro && comptePro.status !== "approved"

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-2">
      <EspacePageHeader
        title="Commandes"
        meta={`${list.length} commande${list.length === 1 ? "" : "s"}`}
        action={
          <Link href="/">
            <Button size="sm" className="bg-[#35A238] hover:bg-[#2d8a30]">
              Nouvelle commande
            </Button>
          </Link>
        }
      />

      {!emailConfirmed ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm">
          E-mail non confirmé.
        </p>
      ) : null}

      {proPending ? (
        <p className="rounded-xl border border-[#35A238]/20 bg-white px-3 py-2 text-sm">
          Dossier pro en validation.{" "}
          <Link href="/espace/compte" className="font-medium text-[#35A238] hover:underline">
            Voir Entreprise
          </Link>
        </p>
      ) : null}

      {list.length === 0 ? (
        <EspacePanel className="text-center">
          <p className="font-medium">Aucune commande</p>
          <Link href="/" className="mt-4 inline-block">
            <Button className="bg-[#35A238] hover:bg-[#2d8a30]">Commander</Button>
          </Link>
        </EspacePanel>
      ) : (
        <>
          {particulier.length > 0 ? (
            <CommandesParticulierLive initial={particulier} />
          ) : null}
          {professionnel.length > 0 ? (
            <CommandesList title="Professionnel" count={professionnel.length} rows={professionnel} />
          ) : null}
        </>
      )}
    </div>
  )
}
