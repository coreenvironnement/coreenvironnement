import { NextResponse } from "next/server"

import {
  loadAdminUnifiedInterventions,
  parseInterventionVue,
} from "@/lib/admin/interventions-data"
import { buildExcelBuffer } from "@/lib/admin/admin-excel"
import { requireAdmin } from "@/lib/auth/require-admin"
import { matchesCommandeAudience, type CommandeAudienceFilter } from "@/lib/commande/audience"

function parseAudience(raw: string | null): CommandeAudienceFilter {
  if (raw === "professionnel") return "professionnel"
  if (raw === "particulier") return "particulier"
  return "all"
}

export async function GET(request: Request) {
  const { supabase } = await requireAdmin()
  const url = new URL(request.url)
  const q = url.searchParams.get("q")?.trim() ?? ""
  const vue = parseInterventionVue(url.searchParams.get("vue") ?? undefined)
  const audience = parseAudience(url.searchParams.get("audience"))

  const { rows } = await loadAdminUnifiedInterventions(supabase, { q, vue, audience })

  const buffer = buildExcelBuffer(rows, [
    { header: "Référence", value: (r) => r.reference },
    { header: "Source", value: (r) => (r.kind === "commande" ? "Commande web" : "Chantier") },
    { header: "Client", value: (r) => r.clientLabel },
    { header: "Chantier / adresse", value: (r) => r.chantierLabel },
    { header: "Type", value: (r) => r.typeLabel },
    { header: "Statut", value: (r) => r.statutLabel },
    { header: "Date", value: (r) => r.dateSort.slice(0, 10) },
  ])

  const filename = `interventions-core-${new Date().toISOString().slice(0, 10)}.xlsx`

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}