"use client"

import { Trash2 } from "lucide-react"

import { deletePrestataire } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"

export function AdminDeletePrestataireButton({
  prestataireId,
  label,
  returnTo = "/admin/prestataires",
}: {
  prestataireId: string
  label: string
  returnTo?: string
}) {
  const action = deletePrestataire.bind(null, prestataireId)

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Supprimer définitivement le prestataire « ${label} » ? Cette action est irréversible.`
          )
        ) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="returnTo" value={returnTo} />
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="border-destructive/30 text-destructive hover:bg-destructive/10"
        aria-label={`Supprimer ${label}`}
      >
        <Trash2 className="size-3.5" aria-hidden />
      </Button>
    </form>
  )
}