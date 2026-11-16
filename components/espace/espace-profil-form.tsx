"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { Loader2 } from "lucide-react"

import {
  saveProfilCompteProContact,
  saveProfilParticulier,
} from "@/app/espace/profil/actions"
import {
  deliveryAddressPartsFromBanHit,
  type DeliveryAddressParts,
} from "@/lib/espace/delivery-address"
import { profilPrefillFingerprint, type ProfilPrefill } from "@/lib/espace/profil-prefill"
import { AddressAutocomplete } from "@/components/order/address-autocomplete"
import type { AddressGeocodeHit } from "@/lib/geo/ban-api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authFieldInputClass } from "@/lib/form/auth-field-styles"
import { cn } from "@/lib/utils"

const textareaClass =
  "w-full min-h-20 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export type ProfilFormInitial = ProfilPrefill & {
  compte: {
    raison_sociale: string
    siret: string | null
    status: string
    contact_nom: string | null
    contact_fonction: string | null
    contact_telephone: string | null
    contact_email: string
    adresse_siege: string | null
  } | null
}

type Props = {
  initial: ProfilFormInitial
}

type FormFields = {
  prenom: string
  nom: string
  phone: string
  delivery: DeliveryAddressParts
}

function fieldStateFromInitial(initial: ProfilFormInitial): FormFields {
  return {
    prenom: initial.prenom,
    nom: initial.nom,
    phone: initial.phone,
    delivery: { ...initial.delivery },
  }
}

function Field({
  id,
  label,
  children,
  hint,
}: {
  id: string
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-brand-navy">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function EspaceProfilForm({ initial }: Props) {
  const isPro = Boolean(initial.compte)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [fields, setFields] = useState<FormFields>(() => fieldStateFromInitial(initial))
  const [deliveryAddressQuery, setDeliveryAddressQuery] = useState(
    () => initial.delivery.ligne
  )
  const serverFingerprint = profilPrefillFingerprint(initial)
  const lastSyncedFingerprint = useRef(serverFingerprint)
  const dirtyRef = useRef(false)

  useEffect(() => {
    if (serverFingerprint === lastSyncedFingerprint.current) return
    if (dirtyRef.current) return
    lastSyncedFingerprint.current = serverFingerprint
    const next = fieldStateFromInitial(initial)
    setFields(next)
    setDeliveryAddressQuery(next.delivery.ligne)
  }, [serverFingerprint, initial])

  function patchFields(patch: Partial<FormFields>) {
    dirtyRef.current = true
    setSaved(false)
    setFields((prev) => ({ ...prev, ...patch }))
  }

  function patchDelivery(patch: Partial<DeliveryAddressParts>) {
    dirtyRef.current = true
    setSaved(false)
    setFields((prev) => ({
      ...prev,
      delivery: { ...prev.delivery, ...patch },
    }))
  }

  function handleDeliveryAddressSelect(hit: AddressGeocodeHit) {
    const parts = deliveryAddressPartsFromBanHit(hit)
    setDeliveryAddressQuery(parts.ligne)
    patchDelivery(parts)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = isPro
        ? await saveProfilCompteProContact(formData)
        : await saveProfilParticulier(formData)

      if ("error" in result) {
        setError(result.error)
        return
      }
      dirtyRef.current = false
      setSaved(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="rounded-lg border border-[#35A238]/30 bg-[#ECF4E9] px-3 py-2 text-sm text-brand-navy">
          Modifications enregistrées.
        </p>
      ) : null}

      <Field id="email" label="E-mail de connexion" hint="Pour changer d'e-mail, contactez le support.">
        <Input
          id="email"
          name="email"
          type="email"
          value={initial.email}
          readOnly
          disabled
          className={authFieldInputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="prenom" label="Prénom">
          <Input
            id="prenom"
            name="prenom"
            required
            minLength={1}
            value={fields.prenom}
            onChange={(e) => patchFields({ prenom: e.target.value })}
            className={authFieldInputClass}
            autoComplete="given-name"
          />
        </Field>
        <Field id="nom" label="Nom">
          <Input
            id="nom"
            name="nom"
            value={fields.nom}
            onChange={(e) => patchFields({ nom: e.target.value })}
            className={authFieldInputClass}
            autoComplete="family-name"
          />
        </Field>
      </div>

      <Field id="phone" label="Téléphone">
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={fields.phone}
          onChange={(e) => patchFields({ phone: e.target.value })}
          className={authFieldInputClass}
          autoComplete="tel"
        />
      </Field>

      {!isPro ? (
        <div className="space-y-4 border-t border-[#35A238]/12 pt-4">
          <p className="text-sm font-medium text-brand-navy">Adresse de livraison par défaut</p>
          <Field
            id="adresse_livraison_ligne"
            label="Rue et complément"
            hint="Saisissez l’adresse et choisissez une suggestion (Île-de-France)."
          >
            <input
              type="hidden"
              name="adresse_livraison_ligne"
              value={fields.delivery.ligne}
            />
            <AddressAutocomplete
              id="adresse_livraison_ligne"
              value={deliveryAddressQuery}
              selected={null}
              onValueChange={(next) => {
                setDeliveryAddressQuery(next)
                patchDelivery({ ligne: next })
              }}
              onSelect={handleDeliveryAddressSelect}
              onClearSelection={() => {}}
              placeholder="Numéro, rue, code postal ou ville"
              inputClassName={cn(
                authFieldInputClass,
                "h-auto min-h-0 rounded-lg border border-input bg-transparent pl-10 pr-10 text-sm shadow-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              )}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="adresse_livraison_code_postal" label="Code postal">
              <Input
                id="adresse_livraison_code_postal"
                name="adresse_livraison_code_postal"
                inputMode="numeric"
                maxLength={5}
                value={fields.delivery.codePostal}
                onChange={(e) => patchDelivery({ codePostal: e.target.value })}
                className={authFieldInputClass}
                autoComplete="postal-code"
              />
            </Field>
            <Field id="adresse_livraison_ville" label="Ville">
              <Input
                id="adresse_livraison_ville"
                name="adresse_livraison_ville"
                value={fields.delivery.ville}
                onChange={(e) => patchDelivery({ ville: e.target.value })}
                className={authFieldInputClass}
                autoComplete="address-level2"
              />
            </Field>
          </div>
          <p className="text-xs text-muted-foreground">
            Utilisée pour préremplir vos prochaines commandes. Vous pouvez la modifier à chaque commande.
          </p>
        </div>
      ) : null}

      {isPro && initial.compte ? (
        <div className="space-y-4 border-t border-[#35A238]/12 pt-4">
          <div>
            <p className="text-sm font-medium text-brand-navy">Entreprise</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {initial.compte.status === "approved"
                ? "Raison sociale et SIRET : modifiez le dossier depuis Entreprise & abonnement si besoin."
                : "Dossier en cours — vous pouvez aussi compléter le formulaire sur la page Entreprise."}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="raison_sociale_ro" label="Raison sociale">
              <Input
                id="raison_sociale_ro"
                value={initial.compte.raison_sociale}
                readOnly
                disabled
                className={authFieldInputClass}
              />
            </Field>
            <Field id="siret_ro" label="SIRET">
              <Input
                id="siret_ro"
                value={initial.compte.siret ?? ""}
                readOnly
                disabled
                className={authFieldInputClass}
              />
            </Field>
          </div>

          <Field id="adresse_siege" label="Adresse du siège">
            <textarea
              id="adresse_siege"
              name="adresse_siege"
              className={textareaClass}
              defaultValue={initial.compte.adresse_siege ?? ""}
              rows={3}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="contact_nom" label="Nom du contact">
              <Input
                id="contact_nom"
                name="contact_nom"
                required
                defaultValue={initial.compte.contact_nom ?? ""}
                className={authFieldInputClass}
              />
            </Field>
            <Field id="contact_fonction" label="Fonction">
              <Input
                id="contact_fonction"
                name="contact_fonction"
                defaultValue={initial.compte.contact_fonction ?? ""}
                className={authFieldInputClass}
              />
            </Field>
            <Field id="contact_telephone" label="Téléphone contact">
              <Input
                id="contact_telephone"
                name="contact_telephone"
                type="tel"
                defaultValue={initial.compte.contact_telephone ?? ""}
                className={authFieldInputClass}
              />
            </Field>
            <Field id="contact_email" label="E-mail professionnel">
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                required
                defaultValue={initial.compte.contact_email}
                className={authFieldInputClass}
              />
            </Field>
          </div>
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="h-11 w-full bg-[#35A238] hover:bg-[#2d8a30] sm:w-auto sm:min-w-40"
      >
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Enregistrer
      </Button>
    </form>
  )
}