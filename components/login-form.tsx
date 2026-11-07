"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { getPostLoginDestination } from "@/app/auth/post-login-actions"
import {
  loginHref,
  resolveLoginEspace,
  type LoginEspaceKind,
} from "@/lib/auth/login-espace-context"
import { safeNextPath } from "@/lib/auth/post-login-path"
import { createClient } from "@/lib/supabase/client"
import { PasswordInput } from "@/components/ui/password-input"

const fieldClass =
  "h-12 w-full rounded-xl border border-[#35A238]/18 bg-white px-3.5 text-[15px] text-brand-navy shadow-sm outline-none transition-colors placeholder:text-brand-muted/70 focus-visible:border-[#35A238] focus-visible:ring-3 focus-visible:ring-[#35A238]/20"

function copyForEspace(espace: LoginEspaceKind) {
  if (espace === "professionnel") {
    return {
      title: "Connexion espace professionnel",
      lead: "Suivi chantier, commandes et documents.",
      switchLabel: "Connexion particulier",
      switchHrefEspace: "particulier" as const,
    }
  }
  return {
    title: "Connexion espace particulier",
    lead: "Retrouvez vos commandes et votre suivi.",
    switchLabel: "Compte professionnel",
    switchHrefEspace: "professionnel" as const,
  }
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)

  const nextRaw = searchParams.get("next")
  const espace = useMemo(
    () => resolveLoginEspace(searchParams.get("espace"), nextRaw),
    [searchParams, nextRaw]
  )
  const copy = copyForEspace(espace)
  const switchHref = loginHref({
    espace: copy.switchHrefEspace,
    next: nextRaw,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError || !data.user) {
      setLoading(false)
      setError("Identifiants incorrects ou compte non activé.")
      return
    }

    setLoading(false)
    const destination = await getPostLoginDestination(nextRaw)
    router.push(destination)
    router.refresh()
  }

  async function handleMagicLink() {
    const trimmed = email.trim()
    if (!trimmed.includes("@")) {
      setError("Indiquez une adresse e-mail valide.")
      return
    }
    setError(null)
    setInfo(null)
    setMagicLoading(true)

    const supabase = createClient()
    const next = safeNextPath(nextRaw) ?? "/espace/commandes"
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: redirectTo },
    })

    setMagicLoading(false)
    if (otpError) {
      setError("Impossible d’envoyer le lien. Réessayez ou contactez-nous.")
      return
    }
    setInfo("Lien envoyé. Consultez votre e-mail.")
  }

  return (
    <div className="rounded-2xl border border-[#35A238]/14 bg-white p-5 shadow-[0_8px_32px_-12px_rgb(14_32_16/0.12)] sm:p-7">
      <h2 className="text-lg font-semibold text-brand-navy">{copy.title}</h2>
      <p className="mt-1.5 text-sm leading-snug text-brand-muted">{copy.lead}</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-brand-navy">
            Mot de passe
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputClassName={fieldClass}
          />
        </div>
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
          {loading ? "Connexion…" : "Se connecter"}
        </button>
        <button
          type="button"
          className="btn btn-outline min-h-12 w-full rounded-xl text-[15px] font-medium"
          disabled={magicLoading || loading}
          onClick={() => void handleMagicLink()}
        >
          {magicLoading ? "Envoi…" : "Lien magique par e-mail"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-brand-muted">
        <Link href={switchHref} className="font-medium text-[#35A238] hover:underline">
          {copy.switchLabel}
        </Link>
        {espace === "professionnel" ? null : (
          <>
            {" · "}
            <Link href="/" className="link-digital">
              Accueil
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
