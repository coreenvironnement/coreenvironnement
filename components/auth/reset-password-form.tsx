"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { getPostLoginDestination } from "@/app/auth/post-login-actions"
import { createClient } from "@/lib/supabase/client"
import { AuthSubmitButton } from "@/components/ui/auth-submit-button"
import { PasswordInput } from "@/components/ui/password-input"
import { authFieldInputClass, fieldMessageId } from "@/lib/form/auth-field-styles"

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const passwordErrorId = fieldMessageId("new-password")
  const passwordConfirmErrorId = fieldMessageId("new-password-confirm")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setPasswordError(null)
    setPasswordConfirmError(null)

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
    const { error: updateError } = await supabase.auth.updateUser({
      password,
      data: {
        password_initialized_at: new Date().toISOString(),
      },
    })

    setLoading(false)
    if (updateError) {
      setFormError(
        "Impossible de mettre à jour le mot de passe. Recommencez depuis le lien reçu par e-mail."
      )
      return
    }

    const destination = await getPostLoginDestination(null)
    router.push(destination)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="new-password" className="text-sm font-medium text-brand-navy">
          Nouveau mot de passe
        </label>
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError(null)
          }}
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
        <label htmlFor="new-password-confirm" className="text-sm font-medium text-brand-navy">
          Confirmer le mot de passe
        </label>
        <PasswordInput
          id="new-password-confirm"
          autoComplete="new-password"
          required
          minLength={8}
          value={passwordConfirm}
          onChange={(e) => {
            setPasswordConfirm(e.target.value)
            if (passwordConfirmError) setPasswordConfirmError(null)
          }}
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
      {formError ? (
        <p className="form-field-message form-field-message--error" role="alert">
          {formError}
        </p>
      ) : null}
      <AuthSubmitButton loading={loading} loadingLabel="Enregistrement…">
        Enregistrer le mot de passe
      </AuthSubmitButton>
    </form>
  )
}
