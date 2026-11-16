"use client"

import { Trash2 } from "lucide-react"

import { deleteCommandeBrouillon } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"

export function AdminDeleteBrouillonButton({
  commandeId,
  returnTo,
  label = "Supprimer ce brouillon",
}: {
  commandeId: string
  returnTo: string
  label?: string
}) {
  const action = deleteCommandeBrouillon.bind(null, commandeId)

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !window.confirm(
            "Supprimer définitivement ce brouillon ? Cette action est irréversible."
          )
        ) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="returnTo" value={returnTo} />
      <Button type="submit" variant="destructive" size="sm">
        <Trash2 className="size-3.5" aria-hidden />
        {label}
      </Button>
    </form>
  )
}