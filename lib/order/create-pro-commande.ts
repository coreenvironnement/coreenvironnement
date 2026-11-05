import { dechetCodeForFamily } from "@/lib/order/prestation-mapping"
import type { ProfessionalBenneRequestInput } from "@/lib/order/pro-request"
import type { PreparedProfessionalBenneRequest } from "@/lib/order/pro-request"
import { prestationById } from "@/lib/prestations"
import {
  createServiceClient,
  getSupabaseServiceConfigError,
} from "@/lib/supabase/service"

export async function createProCommandeFromRequest(
  input: ProfessionalBenneRequestInput,
  prepared: PreparedProfessionalBenneRequest,
  options?: { clientId?: string | null }
): Promise<{ error: string } | { commandeId: string }> {
  const supabaseConfigError = getSupabaseServiceConfigError()
  if (supabaseConfigError) {
    console.error("[createProCommandeFromRequest]", supabaseConfigError)
    return {
      error:
        "Demande indisponible : configuration serveur incomplète (Supabase). Contactez-nous par téléphone.",
    }
  }

  const prestation = prestationById(input.prestationId)
  if (!prestation) {
    return { error: "Forfait sélectionné introuvable." }
  }

  const supabase = createServiceClient()
  const dechetCode = dechetCodeForFamily(prestation.family)
  const { data: dechetType, error: dechetError } = await supabase
    .from("dechets_types")
    .select("id")
    .eq("code", dechetCode)
    .maybeSingle()

  if (dechetError) {
    console.error("[createProCommandeFromRequest] dechets_types:", dechetCode, dechetError)
    return { error: "Type de déchet indisponible. Réessayez plus tard." }
  }

  if (!dechetType) {
    return {
      error:
        "Type de déchet indisponible (catalogue non initialisé). Contactez-nous par téléphone.",
    }
  }

  const contactNom = `${prepared.contactName} (${prepared.companyName})`

  const { data: commande, error: insertError } = await supabase
    .from("commandes")
    .insert({
      adresse_complete: prepared.address,
      type_dechet_id: dechetType.id,
      statut: "confirmee",
      payment_status: "waived",
      audience: "professionnel",
      prestation_id: prestation.id,
      prestation_label: prepared.prestationLabel,
      volume_m3: prestation.volumeM3,
      price_ht: prepared.forfaitHt,
      date_livraison: prepared.deliveryDate,
      date_enlevement: prepared.pickupDate ?? null,
      departement_code: prepared.departementCode ?? null,
      contact_email: prepared.contactEmail,
      contact_nom: contactNom,
      contact_telephone: prepared.contactPhone,
      client_id: options?.clientId ?? null,
    })
    .select("id")
    .single()

  if (insertError || !commande) {
    console.error("[createProCommandeFromRequest] insert:", insertError)
    return { error: "Impossible d'enregistrer votre demande. Réessayez." }
  }

  return { commandeId: commande.id }
}
