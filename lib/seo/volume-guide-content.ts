import { WASTE_VOLUME_ROWS } from "@/lib/seo/waste-volume-guide"
import { getCatalogPricingRows } from "@/lib/seo/pricing-snapshot"

export const VOLUME_GUIDE_TITLE =
  "Quel volume de benne choisir en Île-de-France ?"
export const VOLUME_GUIDE_DESCRIPTION =
  "Guide pratique : estimer m³, gravats vs débarras, catalogues 8 à 30 m³. Tarif selon adresse et déchet, commande en ligne CORE ENVIRONNEMENT."

export const VOLUME_GUIDE_SECTIONS = [
  {
    id: "principe",
    title: "Volume en m³ : ce que mesure une benne",
    paragraphs: [
      "Une benne se facture au forfait : le volume indique la capacité utile, pas le poids. Pour des gravats ou de la terre, le poids limite souvent le chargement avant que la benne ne soit « pleine » en hauteur.",
      "Dans la commande en ligne, vous pouvez estimer avec des dimensions (longueur × largeur × hauteur en mètres), un nombre de sacs, ou choisir directement une capacité si vous l’avez déjà en tête.",
    ],
  },
  {
    id: "estimation",
    title: "Estimer sans calculateur papier",
    paragraphs: [
      "Exemple dimensions : un tas de 4 m × 2 m × 1,2 m représente environ 9,6 m³. Ajoutez une marge de 10 à 15 % pour les vides entre les morceaux.",
      "Exemple sacs : 40 sacs de 100 litres ≈ 4 m³. Cette méthode convient aux déchets légers (emballages, petit débarras), moins aux gravats denses.",
      "L’estimateur du tunnel CORE propose ensuite la plus petite benne du catalogue qui couvre votre estimation, avec un rappel si le flux est lourd.",
    ],
  },
  {
    id: "catalogue",
    title: "Volumes disponibles dans le catalogue",
    paragraphs: [
      "Les forfaits affichés dépendent du type de déchet choisi. Le tableau ci-dessous reprend des exemples HT et TTC particulier issus du catalogue actuel.",
    ],
  },
  {
    id: "dechet",
    title: "Adapter le volume au type de déchet",
    paragraphs: [
      "Ne mélangez pas un flux autorisé avec des déchets interdits : cela peut entraîner un refus de chargement ou un surcoût. En cas de doute, contactez-nous avant de remplir la benne.",
    ],
  },
  {
    id: "commande",
    title: "Obtenir le tarif exact",
    paragraphs: [
      "Le montant définitif dépend de l’adresse de livraison, du déchet et du volume retenu. Il s’affiche dans le tunnel avant le paiement : pas besoin d’appeler pour un premier prix.",
      "Pour préparer votre commande, consultez aussi l’index des communes desservies en Île-de-France.",
    ],
  },
] as const

export function getVolumeGuidePricingRows() {
  return getCatalogPricingRows()
}

export function getVolumeGuideWasteRows() {
  return WASTE_VOLUME_ROWS
}
