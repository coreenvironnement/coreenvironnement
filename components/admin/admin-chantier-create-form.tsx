"use client"

import { createChantier } from "@/app/admin/actions"
import { ChantierAdresseField } from "@/components/admin/chantier-adresse-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const inputClass =
  "h-10 border-[#35A238]/20 bg-white shadow-sm focus-visible:border-[#35A238]/45"

function AdminFormField({
  id,
  label,
  hint,
  required,
  optional,
  children,
  className,
}: {
  id: string
  label: string
  hint?: string
  required?: boolean
  optional?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <label htmlFor={id} className="text-sm font-semibold text-brand-navy">
          {label}
        </label>
        {required ? (
          <span className="rounded-full bg-[#35A238]/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#19752b]">
            Obligatoire
          </span>
        ) : optional ? (
          <span className="text-xs text-muted-foreground">Facultatif</span>
        ) : null}
      </div>
      {hint ? <p className="text-[13px] leading-snug text-muted-foreground">{hint}</p> : null}
      {children}
    </div>
  )
}

export function AdminChantierCreateForm() {
  return (
    <form action={createChantier} className="mx-auto max-w-2xl space-y-6">
      <fieldset className="space-y-5 rounded-xl border border-[#35A238]/15 bg-white/90 p-4 shadow-sm sm:p-5">
        <legend className="sr-only">Informations du nouveau chantier</legend>

        <AdminFormField id="nom" label="Nom du chantier" required>
          <Input
            id="nom"
            name="nom"
            required
            placeholder=""
            className={inputClass}
            autoComplete="off"
          />
        </AdminFormField>

        <AdminFormField id="adresse" label="Adresse du chantier" required>
          <ChantierAdresseField
            id="adresse"
            name="adresse"
            required
            placeholder="Numéro, rue, code postal ou ville"
            inputClassName={inputClass}
          />
        </AdminFormField>

        <AdminFormField
          id="code_affaire"
          label="Code affaire"
          optional
          hint="Référence interne, dossier ou affaire client."
        >
          <Input
            id="code_affaire"
            name="code_affaire"
            placeholder="AFF-2026-001"
            className={cn(inputClass, "max-w-xs font-mono text-sm")}
            autoComplete="off"
          />
        </AdminFormField>
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Vous pourrez ajouter les accès clients et les interventions après la création.
        </p>
        <Button type="submit" className="h-11 w-full px-6 text-base font-semibold sm:w-auto">
          Créer le chantier
        </Button>
      </div>
    </form>
  )
}