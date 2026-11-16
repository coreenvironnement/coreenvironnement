"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { getPostLoginDestination } from "@/app/auth/post-login-actions"
import { safeNextPath } from "@/lib/auth/post-login-path"
import { createClient } from "@/lib/supabase/client"
import { authFieldInputClass, fieldMessageId } from "@/lib/form/auth-field-styles"
import { AuthSubmitButton } from "@/components/ui/auth-submit-button"
import { PasswordInput } from "@/components/ui/password-input"

const FORM_ERROR_ID = "login-form-error"

function inscriptionHref(nextRaw: string | null): string {
  const next = safeNextPath(nextRaw)
  const params = new URLSearchParams()
  if (next) params.set("next", next)
  const q = params.toString()
  return q ? `/inscription?${q}` : "/inscription"
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const nextRaw = searchParams.get("next")
  const emailErrorId = fieldMessageId("email")
  const emailDescribedBy = [
    emailError ? emailErrorId : null,
    formError && !emailError ? FORM_ERROR_ID : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined

  function clearErrors() {
    setFormError(null)
    setEmailError(null)
  }

  async function finishLogin() {
    const destination = await getPostLoginDestination(nextRaw)
    router.push(destination)
    router.refresh()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearErrors()
    setInfo(null)
    setLoading(true)

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError || !data.user) {
      setLoading(false)
      setFormError("Identifiants incorrects ou compte non activé.")
      return
    }

    setLoading(false)
    await finishLogin()
  }

  async function handleForgotPassword() {
    const trimmed = email.trim()
    if (!trimmed.includes("@")) {
      clearErrors()
      setInfo(null)
      setEmailError("Indiquez votre adresse e-mail pour recevoir le lien de réinitialisation.")
      return
    }
    clearErrors()
    setInfo(null)
    setResetLoading(true)

    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reinitialiser-mot-de-passe")}`
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmed, {
      redirectTo,
    })

    setResetLoading(false)
    if (resetError) {
      setFormError("Impossible d’envoyer l’e-mail. Réessayez ou contactez-nous.")
      return
    }
    setInfo(
      "Si un compte existe pour cette adresse, vous recevrez un e-mail avec un lien pour choisir un nouveau mot de passe."
    )
  }

  return (
    <div className="rounded-2xl border border-[#35A238]/14 bg-white p-5 shadow-[0_8px_32px_-12px_rgb(14_32_16/0.12)] sm:p-7">
      <h2 className="text-center text-lg font-semibold text-brand-navy">Se connecter</h2>
      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4"
        aria-describedby={formError ? FORM_ERROR_ID : undefined}
        noValidate
      >
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-brand-navy">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError(null)
            }}
            placeholder="prenom.nom@email.com"
            className={authFieldInputClass}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailDescribedBy}
          />
          {emailError ? (
            <p id={emailErrorId} className="form-field-message form-field-message--error" role="alert">
              {emailError}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="password" className="text-sm font-medium text-brand-navy">
              Mot de passe
            </label>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#35A238] hover:underline disabled:opacity-60"
              disabled={resetLoading || loading}
              aria-busy={resetLoading || undefined}
              onClick={() => void handleForgotPassword()}
            >
              {resetLoading ? (
                <Loader2
                  className="size-3.5 shrink-0 animate-spin motion-reduce:animate-none"
                  aria-hidden
                />
              ) : null}
              {resetLoading ? "Envoi…" : "Mot de passe oublié ?"}
            </button>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            inputClassName={authFieldInputClass}
            aria-invalid={formError ? true : undefined}
            aria-describedby={formError ? FORM_ERROR_ID : undefined}
          />
        </div>
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
        <AuthSubmitButton loading={loading} loadingLabel="Connexion…" disabled={resetLoading}>
          Se connecter
        </AuthSubmitButton>
      </form>

      <p className="mt-5 text-center text-sm text-brand-muted">
        Pas encore de compte ?{" "}
        <Link
          href={inscriptionHref(nextRaw)}
          className="font-medium text-[#35A238] hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  )
}