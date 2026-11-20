/** Fichiers audio confirmation commande - lazy-load uniquement (hors chemin LCP). */
export const ORDER_RECEIPT_AUDIO = {
  thermal: {
    webm: "/audio/commande-receipt-thermal.webm",
    mp3: "/audio/commande-receipt-thermal.mp3",
  },
  success: {
    webm: "/audio/commande-success.webm",
    mp3: "/audio/commande-success.mp3",
  },
} as const