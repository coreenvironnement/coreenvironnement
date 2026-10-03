"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"

import { submitProWaitlist } from "@/app/pro/waitlist-actions"

const fieldWrap = "space-y-2"
const inputClass =
  "h-12 w-full rounded-[10px] border border-brand-border bg-white px-3.5 text-[15px] text-brand-text shadow-[var(--shadow-vitrine-soft)] outline-none transition-colors placeholder:text-brand-muted/70 focus-visible:border-brand-green focus-visible:ring-3 focus-visible:ring-brand-green/20"

export function ProWaitlistForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await submitProWaitlist(formData)
      if (result.error) {
        setError(result.error)
        return
      }
      setSuccess(true)
    })
  }

  if (success) {
    return (
      <div className="rounded-[var(--radius-card)] border border-brand-green/25 bg-brand-bg-alt p-8 text-center">
        <p className="text-lg font-semibold text-brand-navy">Demande bien reçue</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-brand-muted">
          Merci. Notre équipe vous recontacte dès l&apos;ouverture de l&apos;espace professionnel.
          Aucun compte n&apos;a été créé.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className={fieldWrap}>
        <label htmlFor="societe" className="text-sm font-medium text-brand-navy">
          Nom de la société *
        </label>
        <input
          id="societe"
          name="societe"
          required
          autoComplete="organization"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={fieldWrap}>
          <label htmlFor="nom" className="text-sm font-medium text-brand-navy">
            Nom *
          </label>
          <input id="nom" name="nom" required autoComplete="family-name" className={inputClass} />
        </div>
        <div className={fieldWrap}>
          <label htmlFor="prenom" className="text-sm font-medium text-brand-navy">
            Prénom *
          </label>
          <input
            id="prenom"
            name="prenom"
            required
            autoComplete="given-name"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={fieldWrap}>
          <label htmlFor="email" className="text-sm font-medium text-brand-navy">
            E-mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div className={fieldWrap}>
          <label htmlFor="telephone" className="text-sm font-medium text-brand-navy">
            Téléphone *
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            className={inputClass}
          />
        </div>
      </div>

      <div className={fieldWrap}>
        <label htmlFor="siret" className="text-sm font-medium text-brand-navy">
          SIRET <span className="font-normal text-brand-muted">(optionnel)</span>
        </label>
        <input
          id="siret"
          name="siret"
          inputMode="numeric"
          placeholder="12345678900012"
          className={inputClass}
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className="btn btn-accent w-full">
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Envoyer ma demande
      </button>
    </form>
  )
}
