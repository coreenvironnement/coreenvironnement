import { NextResponse } from "next/server"

import {
  fetchEntrepriseBySiret,
  normalizeSiret,
  searchEntreprisesByName,
} from "@/lib/entreprise/recherche-entreprises"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const siretParam = searchParams.get("siret")
  const q = searchParams.get("q")?.trim() ?? ""

  if (siretParam) {
    const digits = normalizeSiret(siretParam)
    if (digits.length !== 14) {
      return NextResponse.json(
        { error: "Le SIRET doit contenir 14 chiffres." },
        { status: 400 }
      )
    }
    const entreprise = await fetchEntrepriseBySiret(digits)
    if (!entreprise) {
      return NextResponse.json({ error: "Aucune entreprise trouvée pour ce SIRET." }, { status: 404 })
    }
    return NextResponse.json({ entreprise })
  }

  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  if (/^\d+$/.test(q.replace(/\s/g, "")) && normalizeSiret(q).length === 14) {
    const entreprise = await fetchEntrepriseBySiret(q)
    if (entreprise) {
      return NextResponse.json({ results: [entreprise] })
    }
  }

  const results = await searchEntreprisesByName(q, 8)
  return NextResponse.json({ results })
}