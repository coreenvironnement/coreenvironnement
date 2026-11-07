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
    id: "google-celina-h",
    quote:
      "Personne très sympathique, sérieuse et professionnelle. Service au top, je recommande vivement !",
    author: "Celina H.",
    role: "Particulier · Avis Google",
    segment: "particulier",
  },
  {
    id: "google-michel-doralus",
    quote: "Super expérience. Je recommande fortement !!",
    author: "Michel Doralus",
    role: "Particulier · Avis Google",
    segment: "particulier",
  },
  {
    id: "google-vcp-idf",
    quote:
      "Excellente expérience ! Le commercial s'est déplacé le matin même de la dépose pour vérifier que tout était parfait. La benne est déjà pleine, plus qu'à demander la rotation 😄",
    author: "VCP IDF",
    role: "Particulier · Avis Google",
    segment: "particulier",
  },
  {
    id: "google-touria-h",
    quote:
      "Au top. Troisième chantier avec la location de benne, ça se passe super bien.",
    author: "Touria H.",
    role: "Particulier · Avis Google",
    segment: "particulier",
  },
  {
    id: "google-ines-loulou",
    quote:
      "Très satisfaite des services de CORE ENVIRONNEMENT ! Entreprise sérieuse, professionnelle et réactive. Le service de location de bennes est au top, avec un travail efficace et des prestations de qualité. Équipe sympathique et à l'écoute des besoins du client. Je recommande vivement cette entreprise pour son sérieux et son professionnalisme !",
    author: "inès loulou",
    role: "Particulier · Avis Google",
    segment: "particulier",
  },
  {
    id: "google-habib-s",
    quote:
      "Benne louée pour évacuer les gravats d'un petit chantier de démolition. Vraiment pratique de pouvoir tout commander et payer directement depuis son téléphone. RAS",
    author: "Habib S.",
    role: "Particulier · Avis Google",
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
