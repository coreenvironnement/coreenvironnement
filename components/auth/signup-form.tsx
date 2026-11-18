"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Briefcase, LockKeyhole, Mail } from "lucide-react"

import { AuthCardBrand } from "@/components/auth/auth-card-brand"
import { AuthFormCard } from "@/components/auth/auth-form-card"
import { AuthIconField } from "@/components/auth/auth-icon-field"
import { SignupAudienceIntro } from "@/components/auth/signup-audience-intro"
import { SignupParticulierStepper } from "@/components/auth/signup-particulier-stepper"
import { SignupProStepper } from "@/components/auth/signup-pro-stepper"
import { EntrepriseLookupFields } from "@/components/forms/entreprise-lookup-fields"
import { PhoneInputWithCountry } from "@/components/forms/phone-input-with-country"
import type { OrderAudience } from "@/components/order/order-audience-toggle"
import { AuthSubmitButton } from "@/components/ui/auth-submit-button"
import { PasswordInput } from "@/components/ui/password-input"
import {
  defaultNextAfterSignup,
  parseSignupType,
  signupSourceForType,
  type SignupAccountType,
} from "@/lib/auth/signup-type"
import type { ProSignupDraft } from "@/lib/auth/pro-signup-draft"
import {
  checkSignupEmailAccountExists,
  finalizeSignupProfile,
} from "@/app/auth/signup-actions"
import { safeNextPath } from "@/lib/auth/post-login-path"
import {
  isSignUpDuplicate,
  isValidSignupEmail,
  normalizeSignupEmail,
  SIGNUP_EXISTING_EMAIL_MESSAGE,
  signUpErrorLooksLikeDuplicate,
} from "@/lib/auth/signup-validation"
import { authFieldInputClass, fieldMessageId } from "@/lib/form/auth-field-styles"
import { emailPlaceholderFromNames } from "@/lib/form/email-placeholder"
import {
  CONTACT_PHONE_INVALID_MESSAGE,
  useContactPhoneField,
} from "@/lib/phone/contact-phone-field"
import { isValidContactPhone } from "@/lib/phone/phone-value"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"


const FORM_ERROR_ID = "signup-form-error"
const EXISTING_EMAIL_STATUS_ID = "signup-existing-email-status"

function SignupExistingEmailStatus({
  loginHref,
}: {
  loginHref: string
}) {
  return (
    <p
      id={EXISTING_EMAIL_STATUS_ID}
      className="form-field-message form-field-message--status"
      role="status"
    >
      {SIGNUP_EXISTING_EMAIL_MESSAGE}{" "}
      <Link href={loginHref} className="font-medium text-[#35A238] hover:underline">
        Se connecter
      </Link>
      {" · "}
      <Link
        href="/reinitialiser-mot-de-passe"
        className="font-medium text-[#35A238] hover:underline"
      >
        Mot de passe oublié
      </Link>
    </p>
  )
}

function loginHref(nextRaw: string | null): string {
  const next = safeNextPath(nextRaw)
  const params = new URLSearchParams()
  if (next) params.set("next", next)
  const q = params.toString()
  return q ? `/login?${q}` : "/login"
}

function accountTypeFromAudience(audience: OrderAudience): SignupAccountType {
  return audience === "professionnel" ? "professionnel" : "particulier"
}

function buildAdresseSiege(
  multiline: string,
  ligne: string,
  codePostal: string,
  ville: string
): string | null {
  const fromParts = [ligne, `${codePostal} ${ville}`.trim()].filter(Boolean).join("\n")
  const value = multiline.trim() || fromParts.trim()
  return value || null
}

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextRaw = searchParams.get("next")
  const typeParam = searchParams.get("type")
  const initialType = useMemo(() => parseSignupType(typeParam), [typeParam])
  const skipAudienceIntro = typeParam === "professionnel" || typeParam === "pro"
  const [phase, setPhase] = useState<"choose" | "form">(skipAudienceIntro ? "form" : "choose")
  const [audience, setAudience] = useState<OrderAudience>(
    initialType === "professionnel" ? "professionnel" : "particulier"
  )
  const accountType = accountTypeFromAudience(audience)

  const [proStep, setProStep] = useState<1 | 2 | 3>(1)
  const [particulierStep, setParticulierStep] = useState<1 | 2>(1)
  const [phone, setPhone] = useState("")
  const phoneField = useContactPhoneField(phone)
  const [raisonSociale, setRaisonSociale] = useState("")
  const [siret, setSiret] = useState("")
  const [codeNaf, setCodeNaf] = useState("")
  const [adresseLigne, setAdresseLigne] = useState("")
  const [codePostal, setCodePostal] = useState("")
  const [ville, setVille] = useState("")
  const [adresseSiegeMultiline, setAdresseSiegeMultiline] = useState("")
  const [fonction, setFonction] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [prenom, setPrenom] = useState("")
  const [nom, setNom] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [emailAccountExists, setEmailAccountExists] = useState(false)
  const [emailCheckLoading, setEmailCheckLoading] = useState(false)

  const passwordErrorId = fieldMessageId("signup-password")
  const passwordConfirmErrorId = fieldMessageId("signup-password-confirm")
  const signupPhoneProErrorId = fieldMessageId("signup-phone-pro")
  const signupPhoneErrorId = fieldMessageId("signup-phone")
  const emailPlaceholder = useMemo(
    () => emailPlaceholderFromNames(prenom, nom),
    [prenom, nom]
  )

  useEffect(() => {
    if (audience === "particulier") {
      setProStep(1)
    } else {
      setParticulierStep(1)
    }
  }, [audience])

  function selectAudience(next: OrderAudience) {
    setAudience(next)
    setProStep(1)
    setParticulierStep(1)
    clearFieldErrors()
    setInfo(null)
    resetEmailAccountExists()
    setPhase("form")
  }

  function backToAudienceChoice() {
    clearFieldErrors()
    setInfo(null)
    resetEmailAccountExists()
    setPhase("choose")
  }

  function clearFieldErrors() {
    setFormError(null)
    setPasswordError(null)
    setPasswordConfirmError(null)
  }

  function resetEmailAccountExists() {
    setEmailAccountExists(false)
  }

  function onEmailChange(value: string) {
    setEmail(value)
    if (emailAccountExists) resetEmailAccountExists()
  }

  async function verifyEmailNotRegistered(normalizedEmail: string): Promise<boolean> {
    setEmailCheckLoading(true)
    try {
      const { exists } = await checkSignupEmailAccountExists(normalizedEmail)
      setEmailAccountExists(exists)
      return !exists
    } finally {
      setEmailCheckLoading(false)
    }
  }

  async function handleEmailBlur() {
    const normalizedEmail = normalizeSignupEmail(email)
    if (!normalizedEmail || !isValidSignupEmail(normalizedEmail)) {
      resetEmailAccountExists()
      return
    }
    await verifyEmailNotRegistered(normalizedEmail)
  }

  function buildProDraft(contactEmail: string): ProSignupDraft {
    return {
      raison_sociale: raisonSociale.trim(),
      siret: siret.replace(/\s/g, "").trim() || null,
      code_naf: codeNaf.trim() || null,
      adresse_siege: buildAdresseSiege(adresseSiegeMultiline, adresseLigne, codePostal, ville),
      contact_fonction: fonction.trim() || null,
      contact_nom: [prenom.trim(), nom.trim()].filter(Boolean).join(" "),
      contact_email: contactEmail,
      contact_telephone: phone.trim() || null,
    }
  }

  async function continueParticulierStep() {
    clearFieldErrors()
    setInfo(null)
    if (!prenom.trim() || !nom.trim()) {
      setFormError("Indiquez votre prénom et votre nom.")
      return
    }
    const normalizedEmail = normalizeSignupEmail(email)
    if (!normalizedEmail || !isValidSignupEmail(normalizedEmail)) {
      setFormError("Indiquez une adresse e-mail valide.")
      return
    }
    if (!isValidContactPhone(phone)) {
      phoneField.markSubmitted()
      return
    }
    const available = await verifyEmailNotRegistered(normalizedEmail)
    if (!available) return
    setParticulierStep(2)
  }

  async function continueProStep() {
    clearFieldErrors()
    setInfo(null)
    if (proStep === 1) {
      if (!raisonSociale.trim()) {
        setFormError("Indiquez le nom de la société.")
        return
      }
      const siretDigits = siret.replace(/\D/g, "")
      if (siretDigits.length > 0 && siretDigits.length !== 14) {
        setFormError("Le SIRET doit comporter 14 chiffres.")
        return
      }
      setProStep(2)
      return
    }
    if (proStep === 2) {
      if (!prenom.trim() || !nom.trim()) {
        setFormError("Indiquez votre prénom et votre nom.")
        return
      }
      const normalizedEmail = normalizeSignupEmail(email)
      if (!normalizedEmail || !isValidSignupEmail(normalizedEmail)) {
        setFormError("Indiquez une adresse e-mail valide.")
        return
      }
      if (!isValidContactPhone(phone)) {
        phoneField.markSubmitted()
        return
      }
      const available = await verifyEmailNotRegistered(normalizedEmail)
      if (!available) return
      setProStep(3)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (accountType === "particulier" && particulierStep < 2) {
      continueParticulierStep()
      return
    }
    if (accountType === "professionnel" && proStep < 3) {
      continueProStep()
      return
    }

    clearFieldErrors()
    setInfo(null)

    if (password.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }
    if (password !== passwordConfirm) {
      const mismatch = "Les mots de passe ne correspondent pas."
      setPasswordError(mismatch)
      setPasswordConfirmError(mismatch)
      return
    }

    const normalizedEmail = normalizeSignupEmail(email)
    if (!normalizedEmail) {
      setFormError("Indiquez votre adresse e-mail.")
      return
    }
    if (!isValidSignupEmail(normalizedEmail)) {
      setFormError("Indiquez une adresse e-mail valide.")
      return
    }
    if (!isValidContactPhone(phone)) {
      phoneField.markSubmitted()
      if (accountType === "particulier") setParticulierStep(1)
      if (accountType === "professionnel") setProStep(2)
      return
    }

    if (accountType === "professionnel" && !raisonSociale.trim()) {
      setFormError("Complétez les informations entreprise.")
      setProStep(1)
      return
    }

    setLoading(true)
    const supabase = createClient()
    const next = safeNextPath(nextRaw) ?? defaultNextAfterSignup(accountType)
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

    const fullName = [prenom.trim(), nom.trim()].filter(Boolean).join(" ") || null
    const proDraft =
      accountType === "professionnel" ? buildProDraft(normalizedEmail) : undefined

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: fullName,
          signup_source: signupSourceForType(accountType),
          signup_phone: phone.trim(),
          ...(proDraft ? { pro_signup_draft: proDraft } : {}),
        },
      },
    })

    setLoading(false)

    if (signUpError) {
      const msg = signUpError.message ?? ""
      if (signUpErrorLooksLikeDuplicate(msg)) {
        setEmailAccountExists(true)
        if (accountType === "particulier") setParticulierStep(1)
        if (accountType === "professionnel") setProStep(2)
        return
      }
      setFormError("Impossible de créer le compte. Vérifiez vos informations.")
      return
    }

    if (isSignUpDuplicate(data)) {
      setEmailAccountExists(true)
      if (accountType === "particulier") setParticulierStep(1)
      if (accountType === "professionnel") setProStep(2)
      return
    }

    if (data.session) {
      await finalizeSignupProfile(accountType)
      router.push(next)
      router.refresh()
      return
    }

    setInfo(
      accountType === "professionnel"
        ? "Compte créé. Confirmez votre e-mail : vos informations entreprise sont enregistrées ; complétez KBIS et RIB dans l’espace client."
        : "Compte créé. Consultez votre e-mail pour confirmer l’adresse, puis commandez depuis votre espace."
    )
  }

  if (phase === "choose") {
    return (
      <AuthFormCard>
        <AuthCardBrand compact />
        <h2 className="mt-1 text-center text-base font-semibold tracking-tight text-brand-navy sm:text-lg">
          Créer un compte
        </h2>
        <p className="mt-0.5 text-center text-[13px] font-semibold text-brand-navy">Vous êtes…</p>
        <SignupAudienceIntro
          loginHref={loginHref(nextRaw)}
          onSelect={selectAudience}
        />
      </AuthFormCard>
    )
  }

  return (
    <AuthFormCard>
      <AuthCardBrand compact />
      <div className="mt-0.5 text-center">
        <h2 className="text-base font-semibold tracking-tight text-brand-navy sm:text-[17px]">
          {accountType === "professionnel" ? "Compte professionnel" : "Compte particulier"}
        </h2>
        <button
          type="button"
          onClick={backToAudienceChoice}
          className="mt-0.5 text-[11px] font-medium text-[#35A238] hover:underline sm:text-[12px]"
        >
          Changer de profil
        </button>
      </div>

      {accountType === "professionnel" ? (
        <SignupProStepper step={proStep} />
      ) : (
        <SignupParticulierStepper step={particulierStep} />
      )}

      <form
        onSubmit={handleSubmit}
        className="auth-form-compact mt-2.5 space-y-2.5"
        aria-describedby={formError ? FORM_ERROR_ID : undefined}
        noValidate
      >
        {accountType === "professionnel" && proStep === 1 ? (
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-sm font-medium text-brand-navy">
              <Briefcase className="size-4 text-[#35A238]" strokeWidth={1.75} aria-hidden />
              Votre entreprise
            </p>
            <EntrepriseLookupFields
              nativeInputs
              inputClassName={authFieldInputClass}
              raisonSociale={{
                id: "signup-raison",
                name: "raison_sociale",
                label: "Nom de la société",
                required: true,
                placeholder: "Rechercher une entreprise…",
              }}
              siret={{
                id: "signup-siret",
                name: "siret",
                label: "Numéro SIRET",
                placeholder: "123 456 789 00012",
              }}
              raisonSocialeValue={raisonSociale}
              siretValue={siret}
              onRaisonSocialeChange={setRaisonSociale}
              onSiretChange={setSiret}
              onExtra={(extra) => {
                if (extra.codeNaf) setCodeNaf(extra.codeNaf)
                if (extra.adresseMultiligne) setAdresseSiegeMultiline(extra.adresseMultiligne)
                else if (extra.adresseSiege) setAdresseSiegeMultiline(extra.adresseSiege)
              }}
              adresseFields={{
                adresse: { id: "signup-adresse", name: "adresse_ligne" },
                codePostal: { id: "signup-cp", name: "code_postal" },
                ville: { id: "signup-ville", name: "ville" },
                values: {
                  adresse: adresseLigne,
                  codePostal,
                  ville,
                },
                onAdresseChange: setAdresseLigne,
                onCodePostalChange: setCodePostal,
                onVilleChange: setVille,
              }}
            />
          </div>
        ) : null}

        {accountType === "professionnel" && proStep === 2 ? (
          <>
            <div className="space-y-2">
              <label htmlFor="signup-fonction" className="text-sm font-medium text-brand-navy">
                Poste dans l&apos;entreprise
              </label>
              <input
                id="signup-fonction"
                type="text"
                autoComplete="organization-title"
                value={fonction}
                onChange={(e) => setFonction(e.target.value)}
                placeholder="Chef de chantier, acheteur…"
                className={authFieldInputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 max-[320px]:grid-cols-1">
              <div className="space-y-2">
                <label htmlFor="signup-prenom" className="text-sm font-medium text-brand-navy">
                  Prénom
                </label>
                <input
                  id="signup-prenom"
                  type="text"
                  autoComplete="given-name"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Votre prénom"
                  className={authFieldInputClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-nom" className="text-sm font-medium text-brand-navy">
                  Nom
                </label>
                <input
                  id="signup-nom"
                  type="text"
                  autoComplete="family-name"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Votre nom"
                  className={authFieldInputClass}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-brand-navy">
                E-mail professionnel
              </label>
              <AuthIconField icon={Mail}>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  onBlur={() => void handleEmailBlur()}
                  placeholder={emailPlaceholder}
                  className={cn(authFieldInputClass, "pl-11")}
                  aria-invalid={emailAccountExists ? true : undefined}
                  aria-describedby={emailAccountExists ? EXISTING_EMAIL_STATUS_ID : undefined}
                />
              </AuthIconField>
            </div>
            <div className="space-y-2">
              <label htmlFor="signup-phone-pro" className="text-sm font-medium text-brand-navy">
                Téléphone
              </label>
              <PhoneInputWithCountry
                id="signup-phone-pro"
                value={phone}
                onChange={setPhone}
                variant="vitrine"
                warmSurface={false}
                invalid={phoneField.invalid}
                onBlur={phoneField.onBlur}
                onInternationalInput={phoneField.onInternationalInput}
                aria-describedby={
                  phoneField.showError ? signupPhoneProErrorId : undefined
                }
              />
              {phoneField.showError ? (
                <p
                  id={signupPhoneProErrorId}
                  className="form-field-message form-field-message--error"
                  role="alert"
                >
                  {CONTACT_PHONE_INVALID_MESSAGE}
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        {accountType === "professionnel" && proStep === 3 ? (
          <>
            <p className="rounded-xl border border-[#35A238]/15 bg-[#ECF4E9]/50 px-3 py-2 text-[12px] leading-snug text-brand-navy sm:text-[13px]">
              Dernière étape : choisissez un mot de passe pour sécuriser votre espace client.
              Vous ajouterez KBIS et RIB depuis{" "}
              <span className="font-semibold">Mon compte</span> après validation de l&apos;e-mail.
            </p>
            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm font-medium text-brand-navy">
                Mot de passe
              </label>
              <AuthIconField icon={LockKeyhole}>
                <PasswordInput
                  variant="vitrine"
                  id="signup-password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) setPasswordError(null)
                  }}
                  placeholder="8 caractères minimum"
                  inputClassName={cn(authFieldInputClass, "pl-11")}
                  aria-invalid={passwordError ? true : undefined}
                  aria-describedby={passwordError ? passwordErrorId : undefined}
                />
              </AuthIconField>
              {passwordError ? (
                <p
                  id={passwordErrorId}
                  className="form-field-message form-field-message--error"
                  role="alert"
                >
                  {passwordError}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="signup-password-confirm"
                className="text-sm font-medium text-brand-navy"
              >
                Confirmer le mot de passe
              </label>
              <AuthIconField icon={LockKeyhole}>
                <PasswordInput
                  variant="vitrine"
                  id="signup-password-confirm"
                  autoComplete="new-password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value)
                    if (passwordConfirmError) setPasswordConfirmError(null)
                  }}
                  placeholder="Retapez le mot de passe"
                  inputClassName={cn(authFieldInputClass, "pl-11")}
                  aria-invalid={passwordConfirmError ? true : undefined}
                  aria-describedby={passwordConfirmError ? passwordConfirmErrorId : undefined}
                />
              </AuthIconField>
              {passwordConfirmError ? (
                <p
                  id={passwordConfirmErrorId}
                  className="form-field-message form-field-message--error"
                  role="alert"
                >
                  {passwordConfirmError}
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        {accountType === "particulier" && particulierStep === 1 ? (
          <>
            <div className="grid grid-cols-2 gap-3 max-[320px]:grid-cols-1">
              <div className="space-y-2">
                <label htmlFor="signup-prenom" className="text-sm font-medium text-brand-navy">
                  Prénom
                </label>
                <input
                  id="signup-prenom"
                  type="text"
                  autoComplete="given-name"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Votre prénom"
                  className={authFieldInputClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-nom" className="text-sm font-medium text-brand-navy">
                  Nom
                </label>
                <input
                  id="signup-nom"
                  type="text"
                  autoComplete="family-name"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Votre nom"
                  className={authFieldInputClass}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-brand-navy">
                E-mail
              </label>
              <AuthIconField icon={Mail}>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  onBlur={() => void handleEmailBlur()}
                  placeholder={emailPlaceholder}
                  className={cn(authFieldInputClass, "pl-11")}
                  aria-invalid={emailAccountExists || formError ? true : undefined}
                  aria-describedby={
                    [emailAccountExists ? EXISTING_EMAIL_STATUS_ID : null, formError ? FORM_ERROR_ID : null]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                />
              </AuthIconField>
            </div>
            <div className="space-y-2">
              <label htmlFor="signup-phone" className="text-sm font-medium text-brand-navy">
                Téléphone
              </label>
              <PhoneInputWithCountry
                id="signup-phone"
                value={phone}
                onChange={setPhone}
                variant="vitrine"
                warmSurface={false}
                invalid={phoneField.invalid}
                onBlur={phoneField.onBlur}
                onInternationalInput={phoneField.onInternationalInput}
                aria-describedby={phoneField.showError ? signupPhoneErrorId : undefined}
              />
              {phoneField.showError ? (
                <p
                  id={signupPhoneErrorId}
                  className="form-field-message form-field-message--error"
                  role="alert"
                >
                  {CONTACT_PHONE_INVALID_MESSAGE}
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        {accountType === "particulier" && particulierStep === 2 ? (
          <>
            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm font-medium text-brand-navy">
                Mot de passe
              </label>
              <AuthIconField icon={LockKeyhole}>
                <PasswordInput
                  variant="vitrine"
                  id="signup-password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) setPasswordError(null)
                  }}
                  placeholder="8 caractères minimum"
                  inputClassName={cn(authFieldInputClass, "pl-11")}
                  aria-invalid={passwordError ? true : undefined}
                  aria-describedby={passwordError ? passwordErrorId : undefined}
                />
              </AuthIconField>
              {passwordError ? (
                <p
                  id={passwordErrorId}
                  className="form-field-message form-field-message--error"
                  role="alert"
                >
                  {passwordError}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="signup-password-confirm"
                className="text-sm font-medium text-brand-navy"
              >
                Confirmer le mot de passe
              </label>
              <AuthIconField icon={LockKeyhole}>
                <PasswordInput
                  variant="vitrine"
                  id="signup-password-confirm"
                  autoComplete="new-password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value)
                    if (passwordConfirmError) setPasswordConfirmError(null)
                  }}
                  placeholder="Retapez le mot de passe"
                  inputClassName={cn(authFieldInputClass, "pl-11")}
                  aria-invalid={passwordConfirmError ? true : undefined}
                  aria-describedby={passwordConfirmError ? passwordConfirmErrorId : undefined}
                />
              </AuthIconField>
              {passwordConfirmError ? (
                <p
                  id={passwordConfirmErrorId}
                  className="form-field-message form-field-message--error"
                  role="alert"
                >
                  {passwordConfirmError}
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        {formError ? (
          <p id={FORM_ERROR_ID} className="form-field-message form-field-message--error" role="alert">
            {formError}
          </p>
        ) : null}
        {emailAccountExists ? (
          <SignupExistingEmailStatus loginHref={loginHref(nextRaw)} />
        ) : null}
        {info ? (
          <p className="form-field-message form-field-message--status" role="status">
            {info}
          </p>
        ) : null}

        <div
          className={cn(
            "flex flex-col gap-2.5",
            ((accountType === "professionnel" && proStep > 1) ||
              (accountType === "particulier" && particulierStep > 1)) &&
              "sm:flex-row"
          )}
        >
          {accountType === "professionnel" && proStep > 1 ? (
            <button
              type="button"
              className="btn btn-ghost-dark order-2 min-h-12 w-full sm:order-1 sm:flex-1"
              onClick={() => {
                clearFieldErrors()
                setProStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))
              }}
            >
              Retour
            </button>
          ) : null}
          {accountType === "particulier" && particulierStep > 1 ? (
            <button
              type="button"
              className="btn btn-ghost-dark order-2 min-h-12 w-full sm:order-1 sm:flex-1"
              onClick={() => {
                clearFieldErrors()
                setParticulierStep(1)
              }}
            >
              Retour
            </button>
          ) : null}
          {(accountType === "professionnel" && proStep < 3) ||
          (accountType === "particulier" && particulierStep < 2) ? (
            <button
              type="submit"
              className="btn btn-accent order-1 min-h-12 w-full sm:order-2 sm:flex-[1.4]"
              disabled={emailAccountExists || emailCheckLoading}
              aria-busy={emailCheckLoading || undefined}
            >
              {emailCheckLoading ? "Vérification…" : "Continuer"}
            </button>
          ) : (
            <AuthSubmitButton
              loading={loading}
              loadingLabel="Création…"
              className={
                (accountType === "professionnel" && proStep > 1) ||
                (accountType === "particulier" && particulierStep > 1)
                  ? "sm:flex-[1.4]"
                  : undefined
              }
            >
              Créer mon compte
            </AuthSubmitButton>
          )}
        </div>
      </form>

      <p className="mt-3 text-center text-[12px] text-brand-muted sm:text-[13px]">
        Déjà un compte ?{" "}
        <Link href={loginHref(nextRaw)} className="font-medium text-[#35A238] hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthFormCard>
  )
}