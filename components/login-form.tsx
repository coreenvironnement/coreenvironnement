"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { createClient } from "@/lib/supabase/client"

function safeNextPath(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null
  return raw
}

const fieldClass =
  "h-12 w-full rounded-[10px] border border-brand-border bg-white px-3.5 text-[15px] text-brand-text shadow-[var(--shadow-vitrine-soft)] outline-none transition-colors placeholder:text-brand-muted/70 focus-visible:border-brand-green focus-visible:ring-3 focus-visible:ring-brand-green/20"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
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

    const next = safeNextPath(searchParams.get("next"))
    if (next) {
      setLoading(false)
      router.push(next)
      router.refresh()
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle()

    setLoading(false)
    router.push(profile?.role === "admin" ? "/admin/commandes" : "/dashboard")
    router.refresh()
  }

  return (
    <div className="card-vitrine p-6 sm:p-8">
      <h2 className="text-lg text-brand-navy">Connexion</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
        Accès réservé aux comptes déjà activés.
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
        <button type="submit" className="btn btn-accent w-full" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-brand-muted">
        Professionnel ?{" "}
        <Link href="/pro" className="link-digital">
          Demande d&apos;accès (bientôt disponible)
        </Link>
        {" · "}
        <Link href="/" className="link-digital">
          Accueil
        </Link>
      </p>
    </div>
  )
}
