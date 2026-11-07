import { redirect } from "next/navigation"

type PageProps = {
  searchParams: Promise<{ chantier?: string }>
}

export default async function DashboardRedirect({ searchParams }: PageProps) {
  const { chantier } = await searchParams
  const q = chantier ? `?chantier=${encodeURIComponent(chantier)}` : ""
  redirect(`/espace/chantier${q}`)
}
