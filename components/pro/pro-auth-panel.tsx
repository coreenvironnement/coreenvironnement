"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

export function ProAuthPanel() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("signup")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    const supabase = createClient()

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      setLoading(false)
      if (signInError) {
        setError("Identifiants incorrects.")
        return
      }
      router.refresh()
      return
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() || null },
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    setInfo(
      "Compte créé. Vérifiez votre e-mail si une confirmation est requise, puis complétez le formulaire ci-dessous."
    )
    router.refresh()
  }

  return (
    <div className="rounded-2xl border border-brand-navy/12 bg-background p-6 shadow-sm">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "signup" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("signup")}
        >
          Créer un accès
        </Button>
        <Button
          type="button"
          variant={mode === "login" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("login")}
        >
          Déjà inscrit
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "signup" ? (
          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium">
              Nom complet
            </label>
            <Input
              id="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jean Dupont"
            />
          </div>
        ) : null}
        <div className="space-y-2">
          <label htmlFor="auth_email" className="text-sm font-medium">
            E-mail
          </label>
          <Input
            id="auth_email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="auth_password" className="text-sm font-medium">
            Mot de passe
          </label>
          <Input
            id="auth_password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {info ? <p className="text-sm text-brand-navy">{info}</p> : null}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {mode === "login" ? "Se connecter" : "Créer mon accès"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary underline-offset-2 hover:underline">
          Connexion espace client
        </Link>
      </p>
    </div>
  )
}
