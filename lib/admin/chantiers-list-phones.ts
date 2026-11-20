import type { SupabaseClient } from "@supabase/supabase-js"

export type ChantierRowBase = {
  id: string
  nom: string
  adresse: string | null
  code_affaire: string | null
  is_active: boolean | null
  created_at: string | null
}

export type ChantierRowWithPremierContact = ChantierRowBase & {
  premierCompteTelephone: string | null
  premierCompteEmail: string | null
}

/** @deprecated alias */
export type ChantierRowWithPhone = ChantierRowWithPremierContact

export async function attachPremierCompteTelephone(
  supabase: SupabaseClient,
  chantiers: ChantierRowBase[]
): Promise<ChantierRowWithPremierContact[]> {
  if (!chantiers.length) return []

  const ids = chantiers.map((c) => c.id)
  const { data: membres } = await supabase
    .from("chantier_membres")
    .select("chantier_id, profile_id, invited_email, created_at")
    .in("chantier_id", ids)
    .order("created_at", { ascending: true })

  const firstMemberByChantier = new Map<
    string,
    { profileId: string | null; invitedEmail: string | null }
  >()
  for (const m of membres ?? []) {
    if (!firstMemberByChantier.has(m.chantier_id)) {
      firstMemberByChantier.set(m.chantier_id, {
        profileId: m.profile_id,
        invitedEmail: m.invited_email?.trim() || null,
      })
    }
  }

  const profileIds = [
    ...new Set(
      [...firstMemberByChantier.values()]
        .map((row) => row.profileId)
        .filter((id): id is string => Boolean(id))
    ),
  ]

  const phoneByProfile = new Map<string, string>()
  const emailByProfile = new Map<string, string>()

  if (profileIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, phone, email")
      .in("id", profileIds)

    for (const p of profiles ?? []) {
      const phone = p.phone?.trim()
      if (phone) phoneByProfile.set(p.id, phone)
      const email = p.email?.trim()
      if (email) emailByProfile.set(p.id, email)
    }

    const needCompte = profileIds.filter(
      (id) => !phoneByProfile.has(id) || !emailByProfile.has(id)
    )
    if (needCompte.length > 0) {
      const { data: comptes } = await supabase
        .from("comptes_pro")
        .select("profile_id, contact_telephone, contact_email")
        .in("profile_id", needCompte)

      for (const compte of comptes ?? []) {
        const tel = compte.contact_telephone?.trim()
        if (tel && !phoneByProfile.has(compte.profile_id)) {
          phoneByProfile.set(compte.profile_id, tel)
        }
        const mail = compte.contact_email?.trim()
        if (mail && !emailByProfile.has(compte.profile_id)) {
          emailByProfile.set(compte.profile_id, mail)
        }
      }
    }
  }

  return chantiers.map((c) => {
    const member = firstMemberByChantier.get(c.id)
    const profileId = member?.profileId ?? null
    const premierCompteTelephone = profileId
      ? (phoneByProfile.get(profileId) ?? null)
      : null
    const premierCompteEmail = profileId
      ? (emailByProfile.get(profileId) ?? null)
      : member?.invitedEmail ?? null
    return { ...c, premierCompteTelephone, premierCompteEmail }
  })
}