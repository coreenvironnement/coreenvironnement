/** Guide déchet / volume (langage client, aligné tunnel CORE). */
export const WASTE_VOLUME_ROWS = [
  {
    dechet: "Gravats propres (béton, tuiles, terre propre)",
    volume: "8 à 10 m³",
    note: "Flux dense : le bon volume évite une benne surdimensionnée.",
  },
  {
    dechet: "Gravats mélangés ou mélange non dangereux",
    volume: "8 à 15 m³",
    note: "Respectez les catégories proposées dans le tunnel de commande.",
  },
  {
    dechet: "Débarras, bois, emballages (flux léger)",
    volume: "10 à 15 m³",
    note: "Ne mélangez pas de déchets dangereux ou de plâtre non autorisé.",
  },
] as const
