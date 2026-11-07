"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

import { OrderWidget } from "@/components/order-widget"
import { EspacePageHeader, EspacePanel } from "@/components/espace/espace-panel"
import { VitrineOrderProvider, useVitrineOrder } from "@/components/vitrine/order-context"
import type { ProReorderPrefill, ProReorderSeed } from "@/lib/espace/pro-reorder-prefill"
import { searchBanAddresses } from "@/lib/geo/ban-api"
import { prestationById } from "@/lib/prestations"
import { Button } from "@/components/ui/button"

function ProReorderTunnel({
  seed,
  prefill,
}: {
  seed: ProReorderSeed
  prefill: ProReorderPrefill
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const applied = useRef(false)
  const { patchDraft } = useVitrineOrder()
  const [ready, setReady] = useState(false)
  const [geoFailed, setGeoFailed] = useState(false)

  useEffect(() => {
    if (applied.current) return
    applied.current = true

    void (async () => {
      const prestation = prestationById(seed.prestationId)
      const hits = await searchBanAddresses(seed.addressLabel, 1)
      const hit = hits[0] ?? null

      patchDraft({
        audience: "professionnel",
        address: seed.addressLabel,
        selectedAddress: hit,
        family: prestation?.family ?? null,
      })

      setGeoFailed(!hit)
      setReady(true)
    })()
  }, [seed, patchDraft])

  if (!ready) {
    return (
      <EspacePanel>
        <p className="text-sm text-muted-foreground">Préparation de votre commande…</p>
      </EspacePanel>
    )
  }

  return (
    <div className="space-y-4">
      {geoFailed ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Confirmez l&apos;adresse dans le formulaire (sélection dans la liste).
        </p>
      ) : (
        <p className="rounded-xl border border-[#35A238]/20 bg-[#ECF4E9] px-3 py-2 text-sm text-brand-navy">
          Vérifiez vos informations puis continuez. Vous pouvez modifier chaque
          section avant validation.
          {!prefill.compteApproved
            ? " Votre dossier pro doit être validé pour commander."
            : null}
        </p>
      )}
      <div
        ref={scrollRef}
        className="rounded-2xl border border-[#35A238]/15 bg-[#ECF4E9]/60 p-3 sm:p-4"
      >
        <OrderWidget
          variant="embedded"
          open
          entryMode="pro-reorder"
          proReorderSeed={seed}
          scrollContainerRef={scrollRef}
        />
      </div>
    </div>
  )
}

export function EspaceProNouvelleCommande({ prefill }: { prefill: ProReorderPrefill }) {
  if (!prefill.seed) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 pb-8">
        <EspacePageHeader title="Nouvelle benne" meta="Espace professionnel" />
        <EspacePanel className="text-center">
          <p className="font-medium text-brand-navy">Aucune commande précédente</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Passez votre première commande depuis l&apos;accueil ou complétez votre dossier
            pro.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button className="bg-[#35A238] hover:bg-[#2d8a30]">Commander sur le site</Button>
            </Link>
            <Link href="/espace/commandes">
              <Button variant="outline">Retour</Button>
            </Link>
          </div>
        </EspacePanel>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-8">
      <EspacePageHeader
        title="Nouvelle benne"
        meta={
          prefill.paymentMode === "cb_required"
            ? "Paiement carte"
            : prefill.paymentMode === "invoice"
              ? "Sur facture"
              : "Professionnel"
        }
        action={
          <Link href="/espace/commandes" className="text-sm font-medium text-[#35A238] hover:underline">
            Retour
          </Link>
        }
      />
      <VitrineOrderProvider>
        <ProReorderTunnel seed={prefill.seed} prefill={prefill} />
      </VitrineOrderProvider>
    </div>
  )
}
