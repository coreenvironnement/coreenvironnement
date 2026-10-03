import {
  extractDepartementFromAddress,
  isAddressInIdf,
  isDepartementInIdf,
  isPostcodeInIdf,
} from "@/lib/geo/idf"
import {
  isValidDeliveryDate,
  isValidPickupDate,
} from "@/lib/order/delivery-dates"
import {
  FAMILY_LABELS,
  prestationById,
  systemLabel,
  type BenneFamily,
} from "@/lib/prestations"

export type ProfessionalBenneRequestInput = {
  audience: "professionnel"
  companyName: string
  contactName: string
  contactPhone: string
  contactEmail: string
  siret?: string
  address: string
  addressLabel?: string
  postcode?: string
  departementCode?: string
  prestationId: string
  wasteFamily: BenneFamily
  deliveryDate: string
  pickupDate?: string
}

export type PreparedProfessionalBenneRequest = {
  reference: string
  companyName: string
  contactName: string
  contactPhone: string
  contactEmail: string
  siret?: string
  address: string
  postcode?: string
  departementCode?: string
  wasteLabel: string
  benneVolume: string
  prestationLabel: string
  forfaitHt: number
  deliveryDate: string
  pickupDate?: string
}

function generateProRequestReference(): string {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replace(/-/g, "")
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `PRO-${day}-${suffix}`
}

export function prepareProfessionalBenneRequest(
  input: ProfessionalBenneRequestInput
): { error: string } | PreparedProfessionalBenneRequest {
  if (input.audience !== "professionnel") {
    return { error: "Cette demande est réservée aux professionnels." }
  }

  const companyName = input.companyName.trim()
  if (!companyName.length) {
    return { error: "Indiquez le nom de l’entreprise." }
  }

  const contactName = input.contactName.trim()
  if (!contactName.length) {
    return { error: "Indiquez le nom et le prénom du contact." }
  }

  const contactPhone = input.contactPhone.trim()
  const phoneDigits = contactPhone.replace(/\D/g, "")
  if (phoneDigits.length < 10) {
    return { error: "Indiquez un numéro de téléphone valide." }
  }

  const contactEmail = input.contactEmail.trim()
  if (!contactEmail.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { error: "Indiquez une adresse e-mail valide." }
  }

  const siretDigits = (input.siret ?? "").replace(/\s/g, "")
  if (siretDigits.length > 0 && !/^\d{14}$/.test(siretDigits)) {
    return { error: "Le SIRET doit contenir 14 chiffres, ou rester vide." }
  }

  const address = (input.addressLabel?.trim() || input.address.trim())
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

  const deptCode =
    (idfFromDept ? departementFromInput : null) ??
    (idfFromPostcode ? postcode.slice(0, 2) : null) ??
    extractDepartementFromAddress(address)
  if (!deptCode || !isDepartementInIdf(deptCode)) {
    return { error: "Code postal IDF introuvable dans l'adresse." }
  }

  const prestation = prestationById(input.prestationId)
  if (!prestation) {
    return { error: "Forfait sélectionné introuvable." }
  }

  if (prestation.family !== input.wasteFamily) {
    return { error: "Le type de déchet ne correspond pas au forfait choisi." }
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

  const wasteMeta = FAMILY_LABELS[input.wasteFamily]

  return {
    reference: generateProRequestReference(),
    companyName,
    contactName,
    contactPhone,
    contactEmail,
    siret: siretDigits.length ? siretDigits : undefined,
    address,
    postcode: postcode || undefined,
    departementCode: deptCode,
    wasteLabel: wasteMeta.title,
    benneVolume: `${systemLabel(prestation.system)} ${prestation.volumeM3} m³`,
    prestationLabel: prestation.label,
    forfaitHt: prestation.priceHt,
    deliveryDate: input.deliveryDate,
    pickupDate: input.pickupDate?.length ? input.pickupDate : undefined,
  }
}
