import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { requireAdmin } from "@/lib/auth/require-admin"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDateFr } from "@/lib/format/date"
import { statutCompteProLabel } from "@/lib/compte-pro/labels"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ kind?: string }>
}

export default async function AdminClientFichePage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { kind } = await searchParams
  const { supabase } = await requireAdmin()

  if (kind === "professionnel") {
    const { data: compte } = await supabase
      .from("comptes_pro")
      .select("*")
      .eq("id", id)
      .single()
    if (!compte) notFound()

    return (
      <ClientFicheShell title={compte.raison_sociale} subtitle="Client professionnel">
        <Card>
          <CardHeader>
            <CardTitle>Facturation & contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>SIRET : {compte.siret ?? "-"}</p>
            <p>Contact : {compte.contact_nom ?? "-"}</p>
            <p>E-mail : {compte.contact_email}</p>
            <p>Téléphone : {compte.contact_telephone ?? "-"}</p>
            <p>Statut dossier : {statutCompteProLabel(compte.status)}</p>
            <p>Créé le : {formatDateFr(compte.created_at.slice(0, 10))}</p>
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/interventions?audience=professionnel&q=${encodeURIComponent(compte.contact_email)}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Interventions
          </Link>
          <Link href={`/admin/comptes-pro/${compte.id}`} className={cn(buttonVariants())}>
            Dossier compte pro
          </Link>
        </div>
      </ClientFicheShell>
    )
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, created_at")
    .eq("id", id)
    .maybeSingle()

  const { data: commandes } = await supabase
    .from("commandes")
    .select("id, date_creation, prestation_label, statut, contact_nom, contact_email")
    .or(profile ? `client_id.eq.${id}` : `contact_email.ilike.%${id}%`)
    .eq("audience", "particulier")
    .order("date_creation", { ascending: false })
    .limit(20)

  if (!profile && !commandes?.length) notFound()

  const title = profile?.full_name ?? commandes?.[0]?.contact_nom ?? "Client particulier"
  const email = profile?.email ?? "-"

  return (
    <ClientFicheShell title={title} subtitle="Client particulier">
      <Card>
        <CardHeader>
          <CardTitle>Coordonnées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>E-mail : {email}</p>
          {profile?.created_at ? (
            <p>Compte créé le : {formatDateFr(profile.created_at.slice(0, 10))}</p>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {commandes?.length ? (
            <ul className="space-y-2 text-sm">
              {commandes.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/interventions/${c.id}`}
                    className="text-primary hover:underline"
                  >
                    {c.prestation_label ?? "Commande"} - {formatDateFr(c.date_creation.slice(0, 10))}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune commande.</p>
          )}
        </CardContent>
      </Card>
      <Link
        href={`/admin/interventions?audience=particulier&q=${encodeURIComponent(email)}`}
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Toutes les interventions
      </Link>
    </ClientFicheShell>
  )
}

function ClientFicheShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour aux clients
        </Link>
        <h2 className="mt-2 text-xl font-bold text-brand-navy">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}