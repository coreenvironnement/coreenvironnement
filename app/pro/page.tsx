import type { Metadata } from "next"

import { ProWaitlistForm } from "@/components/pro/pro-waitlist-form"
import { comptePro } from "@/lib/cdc/contenu-vitrine"
import { publicPageMetadata } from "@/lib/seo/public-page"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = publicPageMetadata(
  "Compte professionnel — bientôt disponible",
  "L'espace professionnel CORE ENVIRONNEMENT arrive bientôt. Laissez les coordonnées de votre entreprise pour être recontacté, sans création de compte ni paiement.",
  "/pro",
)

export default function ProPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Espace professionnel
          </p>
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-navy">
            Bientôt disponible
          </span>
        </div>
        <h1 className="text-3xl font-bold text-brand-navy">{comptePro.titre}</h1>
        <p className="text-lg text-muted-foreground">{comptePro.sousTitre}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{comptePro.description}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          La connexion, la création de compte, le paiement et l&apos;abonnement ne sont pas encore
          ouverts. Déposez simplement vos coordonnées : nous vous prévenons à l&apos;ouverture.
        </p>
      </div>

      <Card className="mt-8 border-brand-navy/12">
        <CardHeader>
          <CardTitle>{comptePro.reassurance.titre}</CardTitle>
          <CardDescription>Avantages prévus pour les entreprises partenaires</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {comptePro.reassurance.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-8 border-brand-navy/12">
        <CardHeader>
          <CardTitle>Être recontacté</CardTitle>
          <CardDescription>
            Formulaire entreprise uniquement. Aucun compte n&apos;est créé, aucun paiement n&apos;est
            demandé.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProWaitlistForm />
        </CardContent>
      </Card>
    </div>
  )
}
