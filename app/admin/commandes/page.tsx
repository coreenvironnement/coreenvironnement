import { redirect } from "next/navigation"

type PageProps = {
  searchParams: Promise<{ q?: string; vue?: string; audience?: string }>
}

export default async function AdminCommandesRedirect({ searchParams }: PageProps) {
  const params = await searchParams
  const qs = new URLSearchParams()
  if (params.vue) qs.set("vue", params.vue)
  if (params.q) qs.set("q", params.q)
  if (params.audience) qs.set("audience", params.audience)
  const query = qs.toString()
  redirect(query ? `/admin/interventions?${query}` : "/admin/interventions")
}