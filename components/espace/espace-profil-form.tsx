"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { Loader2, Mail, User } from "lucide-react"

import {
  saveProfilCompteProContact,
  saveProfilParticulier,
} from "@/app/espace/profil/actions"
import {
  deliveryAddressPartsFromBanHit,
  type DeliveryAddressParts,
} from "@/lib/espace/delivery-address"
import { profilPrefillFingerprint, type ProfilPrefill } from "@/lib/espace/profil-prefill"
import { AuthIconField } from "@/components/auth/auth-icon-field"
import { PhoneInputWithCountry } from "@/components/forms/phone-input-with-country"
import { AddressAutocomplete } from "@/components/order/address-autocomplete"
import type { AddressGeocodeHit } from "@/lib/geo/ban-api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  espaceFieldHintClass,
  espaceFieldLabelClass,
  espaceProfilInputClass,
  espaceProfilReadonlyInputClass,
  fieldMessageId,
} from "@/lib/form/auth-field-styles"
import {
  CONTACT_PHONE_INVALID_MESSAGE,
  useContactPhoneField,
} from "@/lib/phone/contact-phone-field"
import { isValidContactPhone } from "@/lib/phone/phone-value"
import { cn } from "@/lib/utils"

const profilTextareaClass = "espace-profil-textarea"

const addressInputClassName = cn(
  espaceProfilInputClass,
  "!h-11 min-h-0 !rounded-xl !border-brand-green/18 !bg-white !pl-11 !pr-10 !text-[15px] !shadow-sm",
  "!ring-0 focus-visible:!border-[#35A238] focus-visible:!shadow-[0_0_0_3px_rgb(53_162_56/0.2)]"
)

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
    <div className="space-y-2">
      <label htmlFor={id} className={espaceFieldLabelClass}>
        {label}
      </label>
      {children}
      {hint ? <p className={espaceFieldHintClass}>{hint}</p> : null}
    </div>
  )
}

export function EspaceProfilForm({ initial }: Props) {
  const isPro = Boolean(initial.compte)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [fields, setFields] = useState<FormFields>(() => fieldStateFromInitial(initial))
  const phoneField = useContactPhoneField(fields.phone)
  const phoneErrorId = fieldMessageId("phone")
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

    if (!isValidContactPhone(fields.phone)) {
      phoneField.markSubmitted()
      setError(null)
      return
    }

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
    <form
      onSubmit={handleSubmit}
      className="espace-profil-form auth-form-compact space-y-4"
    >
      {error ? (
        <p
          className="form-field-message form-field-message--error rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {saved ? (
        <p
          className="form-field-message form-field-message--status rounded-xl border border-[#35A238]/30 bg-[#ECF4E9] px-3 py-2.5"
          role="status"
        >
          Modifications enregistrées.
        </p>
      ) : null}

      <Field
        id="email"
        label="E-mail de connexion"
        hint="Cet e-mail sert à vous connecter. Pour le modifier, contactez le support."
      >
        <AuthIconField icon={Mail}>
          <Input
            id="email"
            name="email"
            type="email"
            value={initial.email}
            readOnly
            disabled
            tabIndex={-1}
            className={cn(espaceProfilReadonlyInputClass, "pl-11")}
            autoComplete="email"
          />
        </AuthIconField>
      </Field>

      <div className="grid grid-cols-2 gap-3 max-[320px]:grid-cols-1">
        <Field id="prenom" label="Prénom">
          <AuthIconField icon={User}>
            <Input
              id="prenom"
              name="prenom"
              required
              minLength={1}
              value={fields.prenom}
              onChange={(e) => patchFields({ prenom: e.target.value })}
              className={cn(espaceProfilInputClass, "pl-11")}
              autoComplete="given-name"
              placeholder="Votre prénom"
            />
          </AuthIconField>
        </Field>
        <Field id="nom" label="Nom">
          <Input
            id="nom"
            name="nom"
            value={fields.nom}
            onChange={(e) => patchFields({ nom: e.target.value })}
            className={espaceProfilInputClass}
            autoComplete="family-name"
            placeholder="Votre nom"
          />
        </Field>
      </div>

      <Field
        id="phone"
        label="Téléphone"
        hint="Obligatoire, utile pour le suivi de vos livraisons."
      >
        <PhoneInputWithCountry
          id="phone"
          value={fields.phone}
          onChange={(next) => patchFields({ phone: next })}
          variant="espace"
          warmSurface={false}
          className="espace-profil-phone"
          invalid={phoneField.invalid}
          onBlur={phoneField.onBlur}
          onInternationalInput={phoneField.onInternationalInput}
          aria-describedby={phoneField.showError ? phoneErrorId : undefined}
        />
        {phoneField.showError ? (
          <p
            id={phoneErrorId}
            className="form-field-message form-field-message--error"
            role="alert"
          >
            {CONTACT_PHONE_INVALID_MESSAGE}
          </p>
        ) : null}
        <input type="hidden" name="phone" value={fields.phone} />
      </Field>

      {!isPro ? (
        <div className="space-y-4 border-t border-[#35A238]/12 pt-4">
          <div className="space-y-1">
            <p className={espaceFieldLabelClass}>Adresse de livraison par défaut</p>
            <p className={espaceFieldHintClass}>
              Utilisée pour préremplir vos prochaines commandes. Vous pouvez la modifier à chaque
              commande.
            </p>
          </div>
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
              warmSurface={false}
              inputClassName={addressInputClassName}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3 max-[320px]:grid-cols-1">
            <Field id="adresse_livraison_code_postal" label="Code postal">
              <Input
                id="adresse_livraison_code_postal"
                name="adresse_livraison_code_postal"
                inputMode="numeric"
                maxLength={5}
                value={fields.delivery.codePostal}
                onChange={(e) => patchDelivery({ codePostal: e.target.value })}
                className={espaceProfilInputClass}
                autoComplete="postal-code"
                placeholder="75001"
              />
            </Field>
            <Field id="adresse_livraison_ville" label="Ville">
              <Input
                id="adresse_livraison_ville"
                name="adresse_livraison_ville"
                value={fields.delivery.ville}
                onChange={(e) => patchDelivery({ ville: e.target.value })}
                className={espaceProfilInputClass}
                autoComplete="address-level2"
                placeholder="Paris"
              />
            </Field>
          </div>
        </div>
      ) : null}

      {isPro && initial.compte ? (
        <div className="space-y-4 border-t border-[#35A238]/12 pt-4">
          <div className="space-y-1">
            <p className={espaceFieldLabelClass}>Entreprise</p>
            <p className={espaceFieldHintClass}>
              {initial.compte.status === "approved"
                ? "Raison sociale et SIRET : modifiez le dossier depuis Entreprise & abonnement si besoin."
                : "Dossier en cours (vous pouvez aussi compléter le formulaire sur la page Entreprise)."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 max-[320px]:grid-cols-1">
            <Field id="raison_sociale_ro" label="Raison sociale">
              <Input
                id="raison_sociale_ro"
                value={initial.compte.raison_sociale}
                readOnly
                disabled
                tabIndex={-1}
                className={espaceProfilReadonlyInputClass}
              />
            </Field>
            <Field id="siret_ro" label="SIRET">
              <Input
                id="siret_ro"
                value={initial.compte.siret ?? ""}
                readOnly
                disabled
                tabIndex={-1}
                className={espaceProfilReadonlyInputClass}
              />
            </Field>
          </div>

          <Field id="adresse_siege" label="Adresse du siège">
            <textarea
              id="adresse_siege"
              name="adresse_siege"
              className={profilTextareaClass}
              defaultValue={initial.compte.adresse_siege ?? ""}
              rows={3}
              placeholder="Numéro, rue, code postal, ville"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3 max-[320px]:grid-cols-1">
            <Field id="contact_nom" label="Nom du contact">
              <Input
                id="contact_nom"
                name="contact_nom"
                required
                defaultValue={initial.compte.contact_nom ?? ""}
                className={espaceProfilInputClass}
                placeholder="Nom du référent"
              />
            </Field>
            <Field id="contact_fonction" label="Fonction">
              <Input
                id="contact_fonction"
                name="contact_fonction"
                defaultValue={initial.compte.contact_fonction ?? ""}
                className={espaceProfilInputClass}
                placeholder="Ex. responsable chantier"
              />
            </Field>
            <Field id="contact_telephone" label="Téléphone contact">
              <Input
                id="contact_telephone"
                name="contact_telephone"
                type="tel"
                defaultValue={initial.compte.contact_telephone ?? ""}
                className={espaceProfilInputClass}
                autoComplete="tel"
                placeholder="6 12 34 56 78"
              />
            </Field>
            <Field id="contact_email" label="E-mail professionnel">
              <AuthIconField icon={Mail}>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  required
                  defaultValue={initial.compte.contact_email}
                  className={cn(espaceProfilInputClass, "pl-11")}
                  autoComplete="work email"
                  placeholder="contact@entreprise.fr"
                />
              </AuthIconField>
            </Field>
          </div>
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="form-submit-btn h-11 w-full bg-[#35A238] font-[family-name:var(--font-display)] hover:bg-[#2d8a30] sm:w-auto sm:min-w-40"
      >
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Enregistrer
      </Button>
    </form>
  )
}