export type SignupAccountType = "particulier" | "professionnel"

export function parseSignupType(raw: string | null): SignupAccountType {
  if (raw === "pro" || raw === "professionnel") return "professionnel"
  return "particulier"
}

export function signupSourceForType(type: SignupAccountType): string {
  return type === "professionnel" ? "pro_signup" : "particulier_signup"
}

export function defaultNextAfterSignup(type: SignupAccountType): string {
  return type === "professionnel" ? "/espace/compte" : "/espace/commandes"
}
