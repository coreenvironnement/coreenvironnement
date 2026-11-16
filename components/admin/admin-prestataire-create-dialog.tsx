"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { createPrestataire } from "@/app/admin/actions"
import { PrestataireEntrepriseFields } from "@/components/admin/prestataire-entreprise-fields"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function AdminPrestataireCreateDialog() {
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setFormKey((k) => k + 1)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button type="button" variant="default" />}
      >
        <Plus className="size-4" aria-hidden />
        Nouveau prestataire
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau prestataire</DialogTitle>
          <DialogDescription>Raison sociale obligatoire</DialogDescription>
        </DialogHeader>
        <form
          key={formKey}
          action={async (formData) => {
            await createPrestataire(formData)
            setOpen(false)
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <PrestataireEntrepriseFields />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="prestataire-email">
              E-mail
            </label>
            <Input id="prestataire-email" name="email" type="email" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="prestataire-telephone">
              Téléphone
            </label>
            <Input id="prestataire-telephone" name="telephone" />
          </div>
          <DialogFooter className="gap-2 sm:col-span-2 sm:justify-end">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Annuler
            </DialogClose>
            <Button type="submit">Créer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}