import { listCompteProSeats } from "@/app/espace/compte/seats-actions"
import { EspaceCompteView } from "@/components/espace/espace-compte-view"
import { createClient } from "@/lib/supabase/server"
import { isStripeConfigured } from "@/lib/stripe/server"

export const metadata = {
  title: "Entreprise · Mon espace",
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Promise<{ subscription?: string; reason?: string }>
}

export default async function EspaceComptePage({ searchParams }: PageProps) {
  const { subscription: subscriptionParam, reason: reasonParam } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: compte } = await supabase
    .from("comptes_pro")
    .select("*")
    .eq("profile_id", user.id)
    .maybeSingle()

  const seats = await listCompteProSeats()

  return (
    <EspaceCompteView
      user={user}
      compte={compte}
      seats={seats}
      stripeConfigured={isStripeConfigured()}
      subscriptionBanner={
        subscriptionParam === "success"
          ? "success"
          : subscriptionParam === "cancelled"
            ? "cancelled"
            : null
      }
      reason={reasonParam ?? null}
    />
  )
}
