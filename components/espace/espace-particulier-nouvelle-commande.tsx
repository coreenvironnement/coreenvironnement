"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const OrderWidget = dynamic(
  () => import("@/components/order-widget").then((m) => ({ default: m.OrderWidget })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[280px] items-center justify-center rounded-xl border border-[#35A238]/15 bg-white/80"
        role="status"
        aria-live="polite"
        aria-busy
      >
        <p className="text-sm text-muted-foreground">Préparation du tunnel…</p>
      </div>
    ),
  }
)
import { EspacePageHeader, EspacePanel } from "@/components/espace/espace-panel"
import { VitrineOrderProvider, useVitrineOrder } from "@/components/vitrine/order-context"
import type {
  ParticulierReorderPrefill,
  ParticulierReorderSeed,
} from "@/lib/espace/particulier-reorder-prefill"
import { searchBanAddresses } from "@/lib/geo/ban-api"

function ParticulierReorderTunnel({
  seed,
  hasSavedAddress,
}: {
  seed: ParticulierReorderSeed
  hasSavedAddress: boolean
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const applied = useRef(false)
  const { patchDraft } = useVitrineOrder()
  const [ready, setReady] = useState(!hasSavedAddress)
  const [geoFailed, setGeoFailed] = useState(false)

  useEffect(() => {
    if (!hasSavedAddress) {
      patchDraft({ audience: "particulier" })
      return
    }
    if (applied.current) return
    applied.current = true

    void (async () => {
      const hits = await searchBanAddresses(seed.addressLabel, 1)
      const hit = hits[0] ?? null

      patchDraft({
        audience: "particulier",
        address: seed.addressLabel,
        selectedAddress: hit,
      })

      setGeoFailed(!hit)
      setReady(true)
    })()
  }, [hasSavedAddress, seed.addressLabel, patchDraft])

  if (!ready) {
    return (
      <EspacePanel>
        <p className="text-sm text-muted-foreground">Préparation de votre commande…</p>
      </EspacePanel>
    )
  }

  return (
    <div className="space-y-4">
      {hasSavedAddress ? (
        geoFailed ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Confirmez l&apos;adresse dans le formulaire (sélection dans la liste).
          </p>
        ) : (
          <p className="rounded-xl border border-[#35A238]/20 bg-[#ECF4E9] px-3 py-2 text-sm text-brand-navy">
            Vérifiez votre adresse enregistrée, puis continuez. Vos coordonnées sont
            préremplies depuis votre compte.
          </p>
        )
      ) : (
        <p className="rounded-xl border border-[#35A238]/20 bg-[#ECF4E9] px-3 py-2 text-sm text-brand-navy">
          Indiquez l&apos;adresse de livraison. Vos coordonnées sont préremplies depuis
          votre profil.
        </p>
      )}
      <div
        ref={scrollRef}
        className="rounded-2xl border border-[#35A238]/15 bg-[#ECF4E9]/60 p-3 sm:p-4"
      >
        <OrderWidget
          variant="embedded"
          open
          entryMode="particulier-reorder"
          particulierReorderSeed={seed}
          scrollContainerRef={scrollRef}
        />
      </div>
    </div>
  )
}

export function EspaceParticulierNouvelleCommande({
  prefill,
}: {
  prefill: ParticulierReorderPrefill
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-8">
      <EspacePageHeader
        title="Nouvelle commande"
        meta="Particulier"
        action={
          <Link
            href="/espace/commandes"
            className="text-sm font-medium text-[#35A238] hover:underline"
          >
            Retour
          </Link>
        }
      />
      <VitrineOrderProvider>
        <ParticulierReorderTunnel
          seed={prefill.seed}
          hasSavedAddress={prefill.hasSavedAddress}
        />
      </VitrineOrderProvider>
    </div>
  )
}