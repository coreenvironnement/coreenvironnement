import { NextResponse } from "next/server"

import { parseDevisResumeToken } from "@/lib/order/devis-resume-token"

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim() ?? ""
  if (!token) {
    return NextResponse.json({ error: "Lien invalide." }, { status: 400 })
  }

  const resume = parseDevisResumeToken(token)
  if (!resume) {
    return NextResponse.json(
      { error: "Ce lien a expiré ou n’est plus valide." },
      { status: 410 }
    )
  }

  return NextResponse.json({ resume })
}