"use client"

import { useEffect, useRef } from "react"

import { useVitrineOrder } from "./order-context"

/** Ouvre le tunnel et restaure le parcours quand ?reprise=token (e-mail devis). */
export function VitrineDevisReprise({ repriseToken }: { repriseToken?: string }) {
  const { openOrder, queueTunnelResume } = useVitrineOrder()
  const consumed = useRef<string | null>(null)

  useEffect(() => {
    const token = repriseToken?.trim()
    if (!token || consumed.current === token) return
    consumed.current = token

    void (async () => {
      try {
        const res = await fetch(
          `/api/order/devis/resume?token=${encodeURIComponent(token)}`
        )
        const json = (await res.json()) as {
          resume?: import("@/lib/order/particulier-tunnel-resume").ParticulierTunnelResume
        }
        if (!res.ok || !json.resume) return
        queueTunnelResume(json.resume)
        openOrder()
      } catch {
        /* lien expiré ou hors ligne */
      }
    })()
  }, [repriseToken, openOrder, queueTunnelResume])

  return null
}