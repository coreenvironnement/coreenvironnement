"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { getPostLoginDestination } from "@/app/auth/post-login-actions"
import { createClient } from "@/lib/supabase/client"
import { safeNextPath } from "@/lib/auth/post-login-path"

const fieldClass =
  "h-12 w-full rounded-[10px] border border-brand-border bg-white px-3.5 text-[15px] text-brand-text shadow-[var(--shadow-vitrine-soft)] outline-none transition-colors placeholder:text-brand-muted/70 focus-visible:border-brand-green focus-visible:ring-3 focus-visible:ring-brand-green/20"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)

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

    const rawNext = searchParams.get("next")
    setLoading(false)
    const destination = await getPostLoginDestination(rawNext)
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
    const next = safeNextPath(searchParams.get("next")) ?? "/mes-commandes"
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
    setInfo("Un lien de connexion vient de vous être envoyé. Consultez votre boîte e-mail.")
  }

  return (
    <div className="card-vitrine p-6 sm:p-8">
      <h2 className="text-lg text-brand-navy">Connexion</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
        Mot de passe ou lien magique par e-mail.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
            placeholder="vous@entreprise.fr"
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-brand-navy">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
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
        <button type="submit" className="btn btn-accent w-full" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>
        <button
          type="button"
          className="btn btn-outline w-full"
          disabled={magicLoading || loading}
          onClick={() => void handleMagicLink()}
        >
          {magicLoading ? "Envoi…" : "Recevoir un lien par e-mail"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-brand-muted">
        Professionnel ?{" "}
        <Link href="/pro" className="link-digital">
          Ouvrir un compte professionnel
        </Link>
        {" · "}
        <Link href="/" className="link-digital">
          Accueil
        </Link>
      </p>
    </div>
  )
}
