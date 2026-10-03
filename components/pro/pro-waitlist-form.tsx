"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"

import { submitProWaitlist } from "@/app/pro/waitlist-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const fieldClass = "space-y-2"

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
      <div className="rounded-2xl border border-primary/25 bg-primary/10 p-8 text-center">
        <p className="text-lg font-semibold text-brand-navy">Demande bien reçue</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Merci. Notre équipe vous recontacte dès l&apos;ouverture de l&apos;espace professionnel.
          Aucun compte n&apos;a été créé.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className={fieldClass}>
        <label htmlFor="societe" className="text-sm font-medium text-brand-navy">
          Nom de la société *
        </label>
        <Input id="societe" name="societe" required autoComplete="organization" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={fieldClass}>
          <label htmlFor="nom" className="text-sm font-medium text-brand-navy">
            Nom *
          </label>
          <Input id="nom" name="nom" required autoComplete="family-name" />
        </div>
        <div className={fieldClass}>
          <label htmlFor="prenom" className="text-sm font-medium text-brand-navy">
            Prénom *
          </label>
          <Input id="prenom" name="prenom" required autoComplete="given-name" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={fieldClass}>
          <label htmlFor="email" className="text-sm font-medium text-brand-navy">
            E-mail *
          </label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className={fieldClass}>
          <label htmlFor="telephone" className="text-sm font-medium text-brand-navy">
            Téléphone *
          </label>
          <Input
            id="telephone"
            name="telephone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      <div className={fieldClass}>
        <label htmlFor="siret" className="text-sm font-medium text-brand-navy">
          SIRET <span className="font-normal text-muted-foreground">(optionnel)</span>
        </label>
        <Input id="siret" name="siret" inputMode="numeric" placeholder="12345678900012" />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Envoyer ma demande
      </Button>
    </form>
  )
}
