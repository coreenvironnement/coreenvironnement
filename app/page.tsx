import { VitrineHome } from "@/components/vitrine/vitrine-home"

type PageProps = {
  searchParams: Promise<{ order?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const { order: orderParam } = await searchParams
  return <VitrineHome orderParam={orderParam} />
}
