type Props = {
  chantierId: string
  prestataireNom: string | null
  isAdmin: boolean
}

export function PrestataireAlert({ chantierId, prestataireNom, isAdmin }: Props) {
  if (prestataireNom) return null

  return (
    <div className="rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-medium">Valorisation non calculée</p>
      <p className="mt-1 text-amber-900/90">
        Aucun prestataire n&apos;est associé à ce chantier. Les taux affichés restent à 0&nbsp;%
        tant qu&apos;un exutoire (Paprec, Veolia…) n&apos;est pas renseigné.
        {isAdmin ? (
          <>
            {" "}
            Ouvrez{" "}
            <a
              href={`/admin/chantiers/${chantierId}`}
              className="font-medium underline underline-offset-2"
            >
              la fiche chantier en admin
            </a>{" "}
            et enregistrez le prestataire.
          </>
        ) : (
          " Contactez votre interlocuteur CORE ENVIRONNEMENT."
        )}
      </p>
    </div>
  )
}
