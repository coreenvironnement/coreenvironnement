"use client"

import { useState } from "react"

import { EntrepriseLookupFields } from "@/components/forms/entreprise-lookup-fields"

type Props = {
  defaultRaison?: string
  defaultSiret?: string
  defaultAdresse?: string
  defaultCodePostal?: string
  defaultVille?: string
}

export function PrestataireEntrepriseFields({
  defaultRaison = "",
  defaultSiret = "",
  defaultAdresse = "",
  defaultCodePostal = "",
  defaultVille = "",
}: Props) {
  const [raison, setRaison] = useState(defaultRaison)
  const [siret, setSiret] = useState(defaultSiret)
  const [adresse, setAdresse] = useState(defaultAdresse)
  const [codePostal, setCodePostal] = useState(defaultCodePostal)
  const [ville, setVille] = useState(defaultVille)

  return (
    <EntrepriseLookupFields
      raisonSocialeValue={raison}
      siretValue={siret}
      onRaisonSocialeChange={setRaison}
      onSiretChange={setSiret}
      raisonSociale={{
        id: "raison_sociale",
        name: "raison_sociale",
        label: "Raison sociale",
        required: true,
      }}
      siret={{ id: "siret", name: "siret", label: "SIRET" }}
      adresseFields={{
        adresse: { id: "adresse", name: "adresse", label: "Adresse" },
        codePostal: { id: "code_postal", name: "code_postal", label: "Code postal" },
        ville: { id: "ville", name: "ville", label: "Ville" },
        values: { adresse, codePostal, ville },
        onAdresseChange: setAdresse,
        onCodePostalChange: setCodePostal,
        onVilleChange: setVille,
      }}
    />
  )
}