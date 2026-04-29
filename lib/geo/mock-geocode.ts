/**
 * Géocodage simulé pour la démo locale (sans Google / Supabase).
 * En production, remplacer par Places + cache côté serveur.
 */

export type MockGeocodeHit = {
  label: string
  lat: number
  lng: number
}

/** Règles simples : villes / patterns → coordonnées représentatives */
const RULES: Array<{
  test: RegExp
  coords: { lat: number; lng: number }
  label: string
}> = [
  /* --- Hors zone (grandes distances) --- */
  {
    test:
      /\b(paris|7500[1-9]|75\s*0\d{3}|lyon|6900|marseille|1300|lille|5900|bordeaux|3300|toulouse|3100|nice|0600|chartres|2800|rouen|7600)\b/i,
    coords: { lat: 48.8566, lng: 2.3522 },
    label: "Paris (démo géocodage)",
  },
  /* --- Proches / Yvelines souvent dans la bulle 20 km --- */
  {
    test: /\b(élancourt|elancourt|78280)\b/i,
    coords: { lat: 48.7725, lng: 1.962 },
    label: "Élancourt",
  },
  {
    test: /\btrappes\b/i,
    coords: { lat: 48.7776, lng: 1.9975 },
    label: "Trappes",
  },
  {
    test: /\b(guyancourt|montigny|versailles|78000)\b/i,
    coords: { lat: 48.7892, lng: 2.058 },
    label: "Versailles (secteur)",
  },
  {
    test: /\bla verri[èe]re|verriere\b/i,
    coords: { lat: 48.7546, lng: 1.9547 },
    label: "La Verrière",
  },
]

/** Dernier recours pour la démo : point volontairement hors zone (>20 km depuis Élancourt). */
const FALLBACK_FAR = {
  lat: 48.8534,
  lng: 2.3488,
  label: "Adresse géocodée (hors périmètre démo)",
} as const

/**
 * Retourne des coordonnées pour l’UI. Matching par ordre de règles.
 * Chaîne trop vague → position éloignée pour illustrer « hors zone » sans API.
 */
export function mockGeocodeAddress(raw: string): MockGeocodeHit {
  const q = raw.trim()
  if (!q) {
    return { ...FALLBACK_FAR }
  }

  for (const r of RULES) {
    if (r.test.test(q)) {
      return { lat: r.coords.lat, lng: r.coords.lng, label: r.label }
    }
  }

  /* Démo : un code postal 78 hors bulle très rare mais testable — utilise fallback proche ÎdF encore hors rayon strict si besoin */
  if (/^78\d{3}$/.test(q.replace(/\s/g, ""))) {
    /* Mantes-la-Jolie ~25 km ligne droite depuis Élancourt — approx hors 20 selon axe */
    return { lat: 48.9896, lng: 1.7097, label: `${q} — Yvelines` }
  }

  return {
    lat: FALLBACK_FAR.lat,
    lng: FALLBACK_FAR.lng,
    label: FALLBACK_FAR.label,
  }
}
