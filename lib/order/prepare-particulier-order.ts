import { dechetCodeForFamily, priceTtcFromHt } from "@/lib/order/prestation-mapping"
import {
  extractDepartementFromAddress,
  isAddressInIdf,
  isDepartementInIdf,
  isPostcodeInIdf,
} from "@/lib/geo/idf"
import { prestationById, type Prestation } from "@/lib/prestations"
import {
  createServiceClient,
  getSupabaseServiceConfigError,
} from "@/lib/supabase/service"
import type { OrderCheckoutInput } from "@/lib/order/checkout-input"
import {
  isValidDeliveryDate,
  isValidPickupDate,
} from "@/lib/order/delivery-dates"

export type PreparedParticulierOrder = {
  commandeId: string
  prestation: Prestation
  amountTtcCents: number
  email: string
  phone: string
  deptCode: string
  alreadyPaid: boolean
  stripePaymentIntentId: string | null
}

export async function prepareParticulierOrder(
  input: OrderCheckoutInput & { existingCommandeId?: string }
): Promise<{ error: string } | PreparedParticulierOrder> {
  if (input.audience === "professionnel") {
    return {
      error:
        "Les professionnels validés commandent sur facture depuis leur espace client. Créez votre compte pro sur /pro.",
    }
  }

  const address = input.address.trim()
  if (!address.length) {
    return { error: "Indiquez l'adresse de livraison." }
  }

  const postcode = input.postcode?.trim() ?? ""
  const departementFromInput = input.departementCode?.trim() ?? ""

  const idfFromPostcode = postcode.length > 0 && isPostcodeInIdf(postcode)
  const idfFromDept =
    departementFromInput.length > 0 && isDepartementInIdf(departementFromInput)
  const idfFromAddress = isAddressInIdf(address)

  if (!idfFromPostcode && !idfFromDept && !idfFromAddress) {
    return {
      error:
        "Adresse hors Île-de-France. Nous intervenons sur les 8 départements IDF (75, 77, 78, 91, 92, 93, 94, 95).",
    }
  }

  const prestation = prestationById(input.prestationId)
  if (!prestation) {
    return { error: "Forfait sélectionné introuvable." }
  }

  if (!input.deliveryDate.length) {
    return { error: "Indiquez une date de livraison souhaitée." }
  }

  if (!isValidDeliveryDate(input.deliveryDate)) {
    return {
      error:
        "La date de livraison doit être au moins 24 h après votre commande (fuseau Europe/Paris).",
    }
  }

  if (
    input.pickupDate?.length &&
    !isValidPickupDate(input.deliveryDate, input.pickupDate)
  ) {
    return {
      error:
        "La date d'enlèvement ne peut pas être antérieure à la date de livraison.",
    }
  }

  const email = input.contactEmail.trim()
  if (!email.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Indiquez une adresse e-mail valide pour la confirmation." }
  }

  const phone = input.contactPhone?.trim() ?? ""
  const phoneDigits = phone.replace(/\D/g, "")
  if (phoneDigits.length < 10) {
    return { error: "Indiquez un numéro de téléphone valide." }
  }

  const deptCode =
    (idfFromDept ? departementFromInput : null) ??
    (idfFromPostcode ? postcode.slice(0, 2) : null) ??
    extractDepartementFromAddress(address)
  if (!deptCode || !isDepartementInIdf(deptCode)) {
    return { error: "Code postal IDF introuvable dans l'adresse." }
  }

  const supabaseConfigError = getSupabaseServiceConfigError()
  if (supabaseConfigError) {
    console.error("[prepareParticulierOrder]", supabaseConfigError)
    return {
      error:
        "Commande indisponible : configuration serveur incomplète (Supabase). Contactez-nous par téléphone.",
    }
  }

  const supabase = createServiceClient()
  const amountTtcCents = priceTtcFromHt(prestation.priceHt)

  if (input.existingCommandeId) {
    const { data: existing } = await supabase
      .from("commandes")
      .select(
        "id, payment_status, statut, contact_email, prestation_id, price_ht, stripe_payment_intent_id"
      )
      .eq("id", input.existingCommandeId)
      .maybeSingle()

    if (existing) {
      if (existing.payment_status === "paid") {
        return {
          commandeId: existing.id,
          prestation,
          amountTtcCents,
          email,
          phone,
          deptCode,
          alreadyPaid: true,
          stripePaymentIntentId: existing.stripe_payment_intent_id ?? null,
        }
      }

      const sameDraft =
        existing.payment_status === "pending" &&
        existing.contact_email === email &&
        existing.prestation_id === prestation.id

      if (sameDraft) {
        await supabase
          .from("commandes")
          .update({
            adresse_complete: address,
            date_livraison: input.deliveryDate,
            date_enlevement: input.pickupDate?.length ? input.pickupDate : null,
            contact_nom: input.contactName?.trim() || null,
            contact_telephone: phone,
            departement_code: deptCode,
            price_ht: prestation.priceHt,
          })
          .eq("id", existing.id)

        return {
          commandeId: existing.id,
          prestation,
          amountTtcCents,
          email,
          phone,
          deptCode,
          alreadyPaid: false,
          stripePaymentIntentId: existing.stripe_payment_intent_id ?? null,
        }
      }
    }
  }

  const dechetCode = dechetCodeForFamily(prestation.family)
  const { data: dechetType, error: dechetError } = await supabase
    .from("dechets_types")
    .select("id")
    .eq("code", dechetCode)
    .maybeSingle()

  if (dechetError) {
    console.error("[prepareParticulierOrder] dechets_types lookup:", dechetCode, dechetError)
    return { error: "Type de déchet indisponible. Réessayez plus tard." }
  }

  if (!dechetType) {
    return {
      error:
        "Type de déchet indisponible (catalogue non initialisé). Contactez-nous par téléphone.",
    }
  }

  const { data: commande, error: insertError } = await supabase
    .from("commandes")
    .insert({
      adresse_complete: address,
      type_dechet_id: dechetType.id,
      statut: "brouillon",
      payment_status: "pending",
      audience: input.audience,
      prestation_id: prestation.id,
      prestation_label: prestation.label,
      volume_m3: prestation.volumeM3,
      price_ht: prestation.priceHt,
      date_livraison: input.deliveryDate,
      date_enlevement: input.pickupDate?.length ? input.pickupDate : null,
      departement_code: deptCode,
      contact_email: email,
      contact_nom: input.contactName?.trim() || null,
      contact_telephone: phone,
    })
    .select("id")
    .single()

  if (insertError || !commande) {
    console.error("Insert commande:", insertError)
    return { error: "Impossible d'enregistrer la commande. Réessayez." }
  }

  return {
    commandeId: commande.id,
    prestation,
    amountTtcCents,
    email,
    phone,
    deptCode,
    alreadyPaid: false,
    stripePaymentIntentId: null,
  }
}
