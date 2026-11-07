"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { getPostLoginDestination } from "@/app/auth/post-login-actions"
import { createClient } from "@/lib/supabase/client"
import { PasswordInput } from "@/components/ui/password-input"

const fieldClass =
  "h-12 w-full rounded-xl border border-[#35A238]/18 bg-white px-3.5 text-[15px] text-brand-navy shadow-sm outline-none transition-colors placeholder:text-brand-muted/70 focus-visible:border-[#35A238] focus-visible:ring-3 focus-visible:ring-[#35A238]/20"

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }
    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.")
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
      setError("Impossible de mettre à jour le mot de passe. Recommencez depuis le lien reçu par e-mail.")
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
          onChange={(e) => setPassword(e.target.value)}
          inputClassName={fieldClass}
        />
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
          onChange={(e) => setPasswordConfirm(e.target.value)}
          inputClassName={fieldClass}
        />
      </div>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className="btn btn-accent min-h-12 w-full rounded-xl text-[15px] font-semibold"
        disabled={loading}
      >
        {loading ? "Enregistrement…" : "Enregistrer le mot de passe"}
      </button>
    </form>
  )
}
