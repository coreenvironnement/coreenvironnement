export type CallingCode = {
  iso2: string
  name: string
  dial: string
}

/** Indicatifs courants (France en premier) — sans lib externe. */
export const CALLING_CODES: CallingCode[] = [
  { iso2: "FR", name: "France", dial: "33" },
  { iso2: "BE", name: "Belgique", dial: "32" },
  { iso2: "CH", name: "Suisse", dial: "41" },
  { iso2: "LU", name: "Luxembourg", dial: "352" },
  { iso2: "MC", name: "Monaco", dial: "377" },
  { iso2: "DE", name: "Allemagne", dial: "49" },
  { iso2: "ES", name: "Espagne", dial: "34" },
  { iso2: "IT", name: "Italie", dial: "39" },
  { iso2: "PT", name: "Portugal", dial: "351" },
  { iso2: "NL", name: "Pays-Bas", dial: "31" },
  { iso2: "GB", name: "Royaume-Uni", dial: "44" },
  { iso2: "IE", name: "Irlande", dial: "353" },
  { iso2: "AT", name: "Autriche", dial: "43" },
  { iso2: "PL", name: "Pologne", dial: "48" },
  { iso2: "RO", name: "Roumanie", dial: "40" },
  { iso2: "MA", name: "Maroc", dial: "212" },
  { iso2: "DZ", name: "Algérie", dial: "213" },
  { iso2: "TN", name: "Tunisie", dial: "216" },
  { iso2: "SN", name: "Sénégal", dial: "221" },
  { iso2: "CI", name: "Côte d’Ivoire", dial: "225" },
  { iso2: "CM", name: "Cameroun", dial: "237" },
  { iso2: "US", name: "États-Unis", dial: "1" },
  { iso2: "CA", name: "Canada", dial: "1" },
  { iso2: "BR", name: "Brésil", dial: "55" },
  { iso2: "IN", name: "Inde", dial: "91" },
  { iso2: "CN", name: "Chine", dial: "86" },
  { iso2: "JP", name: "Japon", dial: "81" },
  { iso2: "AE", name: "Émirats arabes unis", dial: "971" },
  { iso2: "TR", name: "Turquie", dial: "90" },
  { iso2: "GR", name: "Grèce", dial: "30" },
  { iso2: "SE", name: "Suède", dial: "46" },
  { iso2: "NO", name: "Norvège", dial: "47" },
  { iso2: "DK", name: "Danemark", dial: "45" },
  { iso2: "FI", name: "Finlande", dial: "358" },
  { iso2: "CZ", name: "Tchéquie", dial: "420" },
  { iso2: "HU", name: "Hongrie", dial: "36" },
  { iso2: "RU", name: "Russie", dial: "7" },
  { iso2: "UA", name: "Ukraine", dial: "380" },
  { iso2: "AU", name: "Australie", dial: "61" },
  { iso2: "NZ", name: "Nouvelle-Zélande", dial: "64" },
]

export const DEFAULT_CALLING_DIAL = "33"

const byDialLength = [...CALLING_CODES].sort(
  (a, b) => b.dial.length - a.dial.length
)

export function callingCodeByDial(dial: string): CallingCode | undefined {
  return CALLING_CODES.find((c) => c.dial === dial)
}

export function filterCallingCodes(query: string): CallingCode[] {
  const q = normalizeSearch(query)
  if (!q) return CALLING_CODES
  return CALLING_CODES.filter((c) => {
    const hay = normalizeSearch(`${c.name} ${c.iso2} +${c.dial} ${c.dial}`)
    return hay.includes(q)
  })
}

function normalizeSearch(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
}

export function parseDialFromDigits(digits: string): {
  dial: string
  national: string
} | null {
  for (const opt of byDialLength) {
    if (digits.startsWith(opt.dial) && digits.length > opt.dial.length) {
      return { dial: opt.dial, national: digits.slice(opt.dial.length) }
    }
  }
  return null
}