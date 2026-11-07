"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import {
  OrderAudienceToggle,
  type OrderAudience,
} from "@/components/order/order-audience-toggle"
import { PasswordInput } from "@/components/ui/password-input"
import {
  defaultNextAfterSignup,
  parseSignupType,
  signupSourceForType,
  type SignupAccountType,
} from "@/lib/auth/signup-type"
import { safeNextPath } from "@/lib/auth/post-login-path"
import { createClient } from "@/lib/supabase/client"

const fieldClass =
  "h-12 w-full rounded-xl border border-[#35A238]/18 bg-white px-3.5 text-[15px] text-brand-navy shadow-sm outline-none transition-colors placeholder:text-brand-muted/70 focus-visible:border-[#35A238] focus-visible:ring-3 focus-visible:ring-[#35A238]/20"

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
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)

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
    const next =
      safeNextPath(nextRaw) ?? defaultNextAfterSignup(accountType)
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: fullName.trim() || null,
          signup_source: signupSourceForType(accountType),
        },
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message || "Impossible de créer le compte.")
      return
    }

    if (data.session) {
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
      <h2 className="text-lg font-semibold text-brand-navy">Créer un compte</h2>
      <p className="mt-1.5 text-sm leading-snug text-brand-muted">
        Choisissez votre profil, puis renseignez vos identifiants.
      </p>

      <div className="mt-5">
        <OrderAudienceToggle
          variant="hero"
          audience={audience}
          onChange={setAudience}
        />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="signup-name" className="text-sm font-medium text-brand-navy">
            Nom {accountType === "particulier" ? "(optionnel)" : "du contact"}
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={fieldClass}
          />
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
            placeholder="vous@exemple.fr"
            className={fieldClass}
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
            onChange={(e) => setPassword(e.target.value)}
            inputClassName={fieldClass}
          />
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
            onChange={(e) => setPasswordConfirm(e.target.value)}
            inputClassName={fieldClass}
          />
        </div>

        {accountType === "professionnel" ? (
          <p className="text-xs leading-snug text-muted-foreground">
            Après validation de l’e-mail, vous compléterez votre dossier entreprise (KBIS, RIB)
            depuis l’espace client.
          </p>
        ) : null}

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="text-sm text-brand-navy" role="status">
            {info}
          </p>
        ) : null}

        <button
          type="submit"
          className="btn btn-accent min-h-12 w-full rounded-xl text-[15px] font-semibold"
          disabled={loading}
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>
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
