import { redirect } from "next/navigation"

type PageProps = {
  searchParams: Promise<{ token?: string; reprise?: string }>
}

/** Alias lisible : /reprise?token=… ou /reprise?reprise=… → ouverture tunnel sur la vitrine. */
export default async function RepriseAliasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const token = (params.reprise ?? params.token ?? "").trim()
  if (!token) {
    redirect("/")
  }
  redirect(`/?reprise=${encodeURIComponent(token)}`)
}