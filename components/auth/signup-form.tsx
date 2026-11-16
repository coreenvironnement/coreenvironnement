"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import {
  OrderAudienceToggle,
  type OrderAudience,
} from "@/components/order/order-audience-toggle"
import { AuthSubmitButton } from "@/components/ui/auth-submit-button"
import { PasswordInput } from "@/components/ui/password-input"
import {
  defaultNextAfterSignup,
  parseSignupType,
  signupSourceForType,
  type SignupAccountType,
} from "@/lib/auth/signup-type"
import { finalizeSignupProfile } from "@/app/auth/signup-actions"
import { safeNextPath } from "@/lib/auth/post-login-path"
import { authFieldInputClass, fieldMessageId } from "@/lib/form/auth-field-styles"
import { createClient } from "@/lib/supabase/client"

const FORM_ERROR_ID = "signup-form-error"

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

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextRaw = searchParams.get("next")
  const initialType = useMemo(
    () => parseSignupType(searchParams.get("type")),
    [searchParams]
  )
  const [audience, setAudience] = useState<OrderAudience>(
    initialType === "professionnel" ? "professionnel" : "particulier"
  )
  const accountType = accountTypeFromAudience(audience)

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

  const passwordErrorId = fieldMessageId("signup-password")
  const passwordConfirmErrorId = fieldMessageId("signup-password-confirm")

  function clearFieldErrors() {
    setFormError(null)
    setPasswordError(null)
    setPasswordConfirmError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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

    setLoading(true)
    const supabase = createClient()
    const next =
      safeNextPath(nextRaw) ?? defaultNextAfterSignup(accountType)
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

    const fullName = [prenom.trim(), nom.trim()].filter(Boolean).join(" ") || null

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: fullName,
          signup_source: signupSourceForType(accountType),
        },
      },
    })

    setLoading(false)

    if (signUpError) {
      const msg = signUpError.message ?? ""
      if (/already|registered|exists/i.test(msg)) {
        setInfo(
          "Un compte existe déjà pour cet e-mail (par exemple après une commande). Utilisez « Mot de passe oublié ? » sur la page de connexion pour choisir votre mot de passe."
        )
        return
      }
      setFormError("Impossible de créer le compte. Vérifiez vos informations.")
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
        ? "Compte créé. Confirmez votre e-mail, puis complétez votre dossier professionnel."
        : "Compte créé. Consultez votre e-mail pour confirmer l’adresse, puis commandez depuis votre espace."
    )
  }

  return (
    <div className="rounded-2xl border border-[#35A238]/14 bg-white p-5 shadow-[0_8px_32px_-12px_rgb(14_32_16/0.12)] sm:p-7">
      <h2 className="text-center text-lg font-semibold text-brand-navy">
        Créer un compte
      </h2>

      <fieldset className="mt-5 space-y-2.5 border-0 p-0">
        <legend className="w-full text-left text-[14px] font-semibold leading-snug text-brand-navy">
          Vous êtes&nbsp;:
        </legend>
        <OrderAudienceToggle
          variant="hero"
          audience={audience}
          onChange={setAudience}
        />
      </fieldset>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4"
        aria-describedby={formError ? FORM_ERROR_ID : undefined}
        noValidate
      >
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
              className={authFieldInputClass}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="signup-email" className="text-sm font-medium text-brand-navy">
            E-mail
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom.nom@email.com"
            className={authFieldInputClass}
            aria-invalid={formError ? true : undefined}
            aria-describedby={formError ? FORM_ERROR_ID : undefined}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="signup-password" className="text-sm font-medium text-brand-navy">
            Mot de passe
          </label>
          <PasswordInput
            id="signup-password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (passwordError) setPasswordError(null)
            }}
            placeholder="••••••••"
            inputClassName={authFieldInputClass}
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={passwordError ? passwordErrorId : undefined}
          />
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
          <PasswordInput
            id="signup-password-confirm"
            autoComplete="new-password"
            required
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.target.value)
              if (passwordConfirmError) setPasswordConfirmError(null)
            }}
            placeholder="••••••••"
            inputClassName={authFieldInputClass}
            aria-invalid={passwordConfirmError ? true : undefined}
            aria-describedby={passwordConfirmError ? passwordConfirmErrorId : undefined}
          />
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

        {accountType === "professionnel" ? (
          <p className="text-xs leading-snug text-muted-foreground">
            Après validation de l’e-mail, vous compléterez votre dossier entreprise (KBIS, RIB)
            depuis l’espace client.
          </p>
        ) : null}

        {formError ? (
          <p id={FORM_ERROR_ID} className="form-field-message form-field-message--error" role="alert">
            {formError}
          </p>
        ) : null}
        {info ? (
          <p className="form-field-message form-field-message--status" role="status">
            {info}
          </p>
        ) : null}

        <AuthSubmitButton loading={loading} loadingLabel="Création…">
          Créer mon compte
        </AuthSubmitButton>
      </form>

      <p className="mt-5 text-center text-sm text-brand-muted">
        Déjà un compte ?{" "}
        <Link href={loginHref(nextRaw)} className="font-medium text-[#35A238] hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}