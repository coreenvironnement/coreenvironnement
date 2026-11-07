"use client"

import { useEffect, useState } from "react"

import type { OrderAudience } from "@/components/order/order-audience-toggle"
import { resolveOrderAudienceForUser } from "@/lib/auth/order-audience-for-user"
import { createClient } from "@/lib/supabase/client"

export type OrderAudienceSessionState = {
  loading: boolean
  audience: OrderAudience | null
  locked: boolean
}

export function useOrderAudienceSession(): OrderAudienceSessionState {
  const [state, setState] = useState<OrderAudienceSessionState>({
    loading: true,
    audience: null,
    locked: false,
  })

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    const load = () => {
      void supabase.auth.getUser().then(async ({ data: { user } }) => {
        const resolved = await resolveOrderAudienceForUser(supabase, user?.id)
        if (!cancelled) {
          setState({
            loading: false,
            audience: resolved.audience,
            locked: resolved.locked,
          })
        }
      })
    }

    load()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      setState((prev) => ({ ...prev, loading: true }))
      load()
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  return state
}
