import { NextResponse } from "next/server"

import { loadUnifiedClients } from "@/lib/admin/clients-unified"
import { buildExcelBuffer } from "@/lib/admin/admin-excel"
import { requireAdmin } from "@/lib/auth/require-admin"

export async function GET() {
  const { supabase } = await requireAdmin()
  const clients = await loadUnifiedClients(supabase)

  const buffer = buildExcelBuffer(clients, [
    { header: "Nom", value: (c) => c.label },
    { header: "Type", value: (c) => (c.kind === "professionnel" ? "Pro" : "Particulier") },
    { header: "E-mail", value: (c) => c.email },
    { header: "SIRET", value: (c) => c.siret },
    { header: "Dernière activité", value: (c) => c.lastActivity?.slice(0, 10) },
  ])

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="clients-core.xlsx"',
    },
  })
}