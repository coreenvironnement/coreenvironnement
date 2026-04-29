export type ClientSegment = "pro" | "particulier"

export type Testimonial = {
  id: string
  quote: string
  author: string
  role: string
  segment: ClientSegment
  /** Logo sous `/public/` pour les références entreprise (optionnel). */
  logoSrc?: string
}

export const testimonials: Testimonial[] = [
  {
    id: "michael-r",
    quote:
      "Franchement, rien à dire. Les bennes arrivent à l’heure, ce qui est rare dans le métier. Quand la benne est pleine, un coup de fil et elle est échangée. Ça permet de garder le chantier propre sans bloquer les gars.",
    author: "Michael R.",
    role: "Chef de chantier gros œuvre, Léon Grosse",
    segment: "pro",
    logoSrc: "/groupe_leon_grosse_logo.jpg",
  },
  {
    id: "aadil-m",
    quote:
      "Laissé sans solution par mon ancien prestataire en plein chantier, ils m’ont sauvé la mise avec une benne livrée l’après-midi sur mon chantier à Trappes. Très réactifs et sérieux. Je ne passe que par eux maintenant.",
    author: "Aadil M.",
    role: "Gérant de société de BTP",
    segment: "pro",
  },
  {
    id: "mohamed-e",
    quote:
      "Simple et efficace, deuxième chantier avec Core. Le commercial gère tout l’administratif, suivi des BSD, ce qui me facilite grandement la gestion administrative.",
    author: "Mohamed E.",
    role: "Conducteur de travaux, NGE",
    segment: "pro",
    logoSrc: "/logo-nge.svg",
  },
  {
    id: "lea-m",
    quote:
      "Très réactifs. Un petit retard une fois à cause des bouchons, mais j’ai été prévenue tout de suite. Je recommande.",
    author: "Léa M.",
    role: "Conductrice de travaux, GCC",
    segment: "pro",
    logoSrc: "/gcc_groupe.png",
  },
  {
    id: "lamine-t",
    quote:
      "Top pour mes évacuations de gravats. J’ai pris une petite benne pour une démolition, ils sont venus la chercher dès que j’ai fini. Des pros.",
    author: "Lamine T.",
    role: "Artisan maçon",
    segment: "pro",
  },
  {
    id: "thomas-b",
    quote:
      "Réponse très rapide pour le devis. J’avais peur que ce soit compliqué de louer une benne en tant que particulier, mais tout a été très simple : livraison le jour voulu et prix correct. Ça nous a évité 20 allers-retours à la déchetterie avec notre voiture.",
    author: "Thomas B.",
    role: "Particulier",
    segment: "particulier",
  },
]

/** Léon Grosse, NGE, GCC avec logos sous /public/ */
export const testimonialsEntreprisesAvecLogo: Testimonial[] = [
  testimonials.find((t) => t.id === "michael-r")!,
  testimonials.find((t) => t.id === "mohamed-e")!,
  testimonials.find((t) => t.id === "lea-m")!,
]

export const testimonialsParticuliers: Testimonial[] = testimonials.filter(
  (t) => t.segment === "particulier"
)
