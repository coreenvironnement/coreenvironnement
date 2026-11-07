"use client"

import { useCallback, useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

import {
  getMyCommandesSnapshot,
  type CommandeSnapshotRow,
} from "@/app/espace/commandes/actions"
import { CommandeTrackCard } from "@/components/espace/commande-track-card"
import { cn } from "@/lib/utils"

const POLL_MS = 30_000

type Props = {
  initial: CommandeSnapshotRow[]
}

export function CommandesParticulierLive({ initial }: Props) {
  const [rows, setRows] = useState(initial)
  const [lastSync, setLastSync] = useState(() => Date.now())
  const [syncing, setSyncing] = useState(false)
  const [pulseKey, setPulseKey] = useState(0)
  const [, setTick] = useState(0)

  const particulier = rows.filter((c) => c.audience !== "professionnel")

  const refresh = useCallback(async () => {
    setSyncing(true)
    try {
      const next = await getMyCommandesSnapshot()
      setRows((prev) => {
        const nextPart = next.filter((c) => c.audience !== "professionnel")
        const prevPart = prev.filter((c) => c.audience !== "professionnel")
        const changed =
          JSON.stringify(nextPart.map((r) => [r.id, r.statut, r.payment_status])) !==
          JSON.stringify(prevPart.map((r) => [r.id, r.statut, r.payment_status]))
        if (changed) setPulseKey((k) => k + 1)
        return next
      })
      setLastSync(Date.now())
    } finally {
      setSyncing(false)
    }
  }, [])

  useEffect(() => {
    const poll = window.setInterval(() => void refresh(), POLL_MS)
    const tick = window.setInterval(() => setTick((t) => t + 1), 1000)
    return () => {
      window.clearInterval(poll)
      window.clearInterval(tick)
    }
  }, [refresh])

  const secondsAgo = Math.max(0, Math.floor((Date.now() - lastSync) / 1000))

  if (particulier.length === 0) {
    return null
  }

  const [hero, ...rest] = particulier

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-brand-navy">
          Particulier{" "}
          <span className="font-normal text-muted-foreground">({particulier.length})</span>
        </h2>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#35A238]/25 bg-white px-3 py-1 text-xs font-medium text-brand-navy"
        >
          <RefreshCw className={cn("size-3.5 text-[#35A238]", syncing && "animate-spin")} />
          Synchronisé il y a {secondsAgo}s
        </button>
      </div>

      <div key={pulseKey} className="space-y-3">
        {hero ? <CommandeTrackCard commande={hero} variant="hero" /> : null}
        {rest.map((c) => (
          <CommandeTrackCard key={c.id} commande={c} variant="compact" />
        ))}
      </div>
    </section>
  )
}
