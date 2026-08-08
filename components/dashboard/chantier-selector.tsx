"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

import type { ChantierSummary } from "@/lib/dashboard/chantier-data"

type Props = {
  chantiers: ChantierSummary[]
  selectedId?: string
}

export function ChantierSelector({ chantiers, selectedId }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function onChange(nextId: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (nextId) {
      params.set("chantier", nextId)
    } else {
      params.delete("chantier")
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="min-w-[240px] flex-1 space-y-2">
      <label htmlFor="chantier-select" className="text-sm font-medium text-brand-navy">
        Chantier
      </label>
      <select
        id="chantier-select"
        value={selectedId ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full max-w-md rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="">— Sélectionner un chantier —</option>
        {chantiers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nom}
            {c.adresse ? ` · ${c.adresse}` : ""}
          </option>
        ))}
      </select>
    </div>
  )
}
