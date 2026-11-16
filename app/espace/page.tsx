import { redirect } from "next/navigation"

import { getAuthUser } from "@/lib/auth/espace-session"

export default async function EspaceHomePage() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/login?next=/espace")
  }

  redirect("/espace/commandes")
}
