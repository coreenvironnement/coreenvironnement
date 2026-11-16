"use client"

import { MessageSquare, Phone } from "lucide-react"

import { commandeTelHref } from "@/lib/commande/labels"
import { commandeSmsHref, defaultSmsPlanificationBody } from "@/lib/planning/creneau"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  telephone: string | null | undefined
  reference: string
  creneauLabel?: string | null
}

export function AdminClientContactMenu({ telephone, reference, creneauLabel }: Props) {
  const phone = telephone?.trim()
  if (!phone) {
    return <span className="text-xs text-muted-foreground">Pas de tél.</span>
  }

  const smsBody = defaultSmsPlanificationBody({
    reference,
    creneauLabel: creneauLabel ?? "prochainement",
  })

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <a
        href={commandeTelHref(phone)}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex h-8 gap-1 px-2")}
      >
        <Phone className="size-3.5" aria-hidden />
        <span className="sr-only sm:not-sr-only">Appeler</span>
      </a>
      <a
        href={commandeSmsHref(phone, smsBody)}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex h-8 gap-1 px-2")}
      >
        <MessageSquare className="size-3.5" aria-hidden />
        <span className="sr-only sm:not-sr-only">SMS</span>
      </a>
    </div>
  )
}