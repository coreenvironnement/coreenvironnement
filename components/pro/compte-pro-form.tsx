"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"

import { submitComptePro } from "@/app/pro/actions"
import { comptePro } from "@/lib/cdc/contenu-vitrine"
import { ABONNEMENT_PRO_HT } from "@/lib/cdc/referentiels"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const textareaClass =
  "w-full min-h-20 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

type Props = {
  defaultEmail?: string
  isResubmit?: boolean
  previousNotes?: string | null
}

export function CompteProForm({ defaultEmail, isResubmit, previousNotes }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await submitComptePro(formData)
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
        <p className="text-lg font-semibold text-brand-navy">Demande envoyée</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {comptePro.reassurance.footer}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isResubmit && previousNotes ? (
        <div className="rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">Demande précédente refusée</p>
          <p className="mt-1">{previousNotes}</p>
          <p className="mt-2">Corrigez les informations et soumettez à nouveau.</p>
        </div>
      ) : null}

      <p className="text-sm text-muted-foreground">
        Abonnement espace client pro : <strong>{ABONNEMENT_PRO_HT} € HT / mois</strong>{" "}
        (activation après validation — paiement Stripe à venir).
      </p>

      <section className="space-y-4">
        <h3 className="font-semibold text-brand-navy">{comptePro.sections[0].titre}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="raison_sociale" className="text-sm font-medium">
              Raison sociale *
            </label>
            <Input id="raison_sociale" name="raison_sociale" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="siret" className="text-sm font-medium">
              Numéro SIRET
            </label>
            <Input id="siret" name="siret" placeholder="123 456 789 00012" />
          </div>
          <div className="space-y-2">
            <label htmlFor="code_naf" className="text-sm font-medium">
              Code NAF / Activité
            </label>
            <Input id="code_naf" name="code_naf" placeholder="43.99C" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="adresse_siege" className="text-sm font-medium">
              Adresse du siège social
            </label>
            <textarea id="adresse_siege" name="adresse_siege" className={textareaClass} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-brand-navy">{comptePro.sections[1].titre}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="contact_nom" className="text-sm font-medium">
              Nom et prénom *
            </label>
            <Input id="contact_nom" name="contact_nom" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="contact_fonction" className="text-sm font-medium">
              Fonction
            </label>
            <Input id="contact_fonction" name="contact_fonction" placeholder="Chef de chantier" />
          </div>
          <div className="space-y-2">
            <label htmlFor="contact_telephone" className="text-sm font-medium">
              Téléphone direct
            </label>
            <Input id="contact_telephone" name="contact_telephone" type="tel" />
          </div>
          <div className="space-y-2">
            <label htmlFor="contact_email" className="text-sm font-medium">
              E-mail professionnel *
            </label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              required
              defaultValue={defaultEmail}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-brand-navy">{comptePro.sections[2].titre}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="kbis" className="text-sm font-medium">
              KBIS de moins de 3 mois *
            </label>
            <Input
              id="kbis"
              name="kbis"
              type="file"
              required
              accept=".pdf,image/jpeg,image/png"
              className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-sm file:font-medium"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="rib" className="text-sm font-medium">
              RIB *
            </label>
            <Input
              id="rib"
              name="rib"
              type="file"
              required
              accept=".pdf,image/jpeg,image/png"
              className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-sm file:font-medium"
            />
          </div>
        </div>
      </section>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Envoi en cours…
          </>
        ) : (
          "Envoyer ma demande de compte pro"
        )}
      </Button>
    </form>
  )
}
