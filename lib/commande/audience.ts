export type CommandeAudienceFilter = "all" | "particulier" | "professionnel"

export type CommandeAudienceValue = "particulier" | "professionnel" | null

/** Filtre strict admin / espace : pas de « fuites » via NULL ou valeurs partielles. */
export function matchesCommandeAudience(
  audience: CommandeAudienceValue,
  filter: CommandeAudienceFilter
): boolean {
  if (filter === "all") return true
  if (filter === "professionnel") return audience === "professionnel"
  return audience === "particulier"
}
