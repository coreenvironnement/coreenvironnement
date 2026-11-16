export const SITE_ORG_NAME = "CORE Environnement"

export const SITE_PHONE_DISPLAY = "07 53 70 57 27"
export const SITE_PHONE_HREF = "tel:+33753705727"

/** Ligne mobile conseiller (fiche contact / vCard post-commande). */
export const SITE_CONTACT_VCARD_PHONE_DISPLAY = "06 31 13 86 56"
export const SITE_CONTACT_VCARD_PHONE_E164 = "+33631138656"
export const SITE_CONTACT_VCARD_PHONE_HREF = `tel:${SITE_CONTACT_VCARD_PHONE_E164}`
export const SITE_CONTACT_VCARD_WHATSAPP_HREF = `https://wa.me/${SITE_CONTACT_VCARD_PHONE_E164.replace("+", "")}`

export function buildSiteContactVCard(): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${SITE_ORG_NAME}`,
    `ORG:${SITE_ORG_NAME}`,
    `TEL;TYPE=CELL,VOICE:${SITE_CONTACT_VCARD_PHONE_E164}`,
    "END:VCARD",
  ].join("\r\n")
}

export function downloadSiteContactVCard(): void {
  if (typeof document === "undefined") return

  const blob = new Blob([buildSiteContactVCard()], {
    type: "text/vcard;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = "core-environnement.vcf"
  anchor.rel = "noopener"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export const SITE_WHATSAPP_HREF = "https://wa.me/33753705727"

export const SITE_GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/LkAHyAqv2VRjSzNy5"
export const SITE_GOOGLE_MAPS_PIN_SRC = "/images/google-maps-pin.png"
export const SITE_GOOGLE_RATING = 4.9
export const SITE_GOOGLE_REVIEW_COUNT = 12
/** Citation affichée dans le schéma Review (avis Google). */
export const SITE_GOOGLE_SAMPLE_REVIEW_BODY =
  "Entreprise très sympathique, sérieuse et professionnelle. Service de location au top, je recommande vivement !"
export const SITE_GOOGLE_SAMPLE_REVIEW_AUTHOR = "Client Google"
