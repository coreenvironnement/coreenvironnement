import { NextResponse } from "next/server"

import { isInvoiceAvailable } from "@/lib/invoice/commande-invoice"
import { ensureCommandeInvoicePdf } from "@/lib/invoice/generate-commande-invoice"
import { createServiceClient, getSupabaseServiceConfigError } from "@/lib/supabase/service"

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim()
  const url = new URL(request.url)
  const token = url.searchParams.get("secret") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")

  if (!secret || token !== secret) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  if (getSupabaseServiceConfigError()) {
    return NextResponse.json({ error: "Service indisponible" }, { status: 503 })
  }

  const supabase = createServiceClient()
  const { data: rows } = await supabase
    .from("commandes")
    .select("id, livree_at, invoice_storage_path, statut")
    .eq("statut", "livree")
    .is("invoice_storage_path", null)
    .not("livree_at", "is", null)
    .limit(50)

  let generated = 0
  for (const row of rows ?? []) {
    if (!isInvoiceAvailable(row.livree_at)) continue
    const result = await ensureCommandeInvoicePdf(supabase, row.id)
    if ("path" in result) generated += 1
  }

  return NextResponse.json({ ok: true, generated, scanned: rows?.length ?? 0 })
}