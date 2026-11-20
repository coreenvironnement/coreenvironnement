import { Mail, Phone } from "lucide-react"

import { commandeMailtoHref, commandeTelHref } from "@/lib/commande/labels"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const iconBtnClass = cn(
  buttonVariants({ variant: "outline", size: "sm" }),
  "inline-flex size-8 shrink-0 items-center justify-center p-0 border-[#35A238]/25 hover:bg-[#ECF4E9]"
)

export function AdminClientPhoneCell({ phone }: { phone: string | null }) {
  const tel = phone?.trim()
  if (!tel) {
    return <span className="text-xs text-muted-foreground">Non renseigné</span>
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <a href={commandeTelHref(tel)} className={iconBtnClass} aria-label={`Appeler ${tel}`} title="Appeler">
        <Phone className="size-4 text-[#19752b]" strokeWidth={1.75} aria-hidden />
      </a>
      <a
        href={commandeTelHref(tel)}
        className="min-w-0 truncate text-sm text-brand-navy hover:text-primary hover:underline"
      >
        {tel}
      </a>
    </div>
  )
}

export function AdminClientEmailCell({ email }: { email: string }) {
  const value = email.trim()
  if (!value || value === "-") {
    return <span className="text-xs text-muted-foreground">Non renseigné</span>
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <a
        href={commandeMailtoHref(value)}
        className={iconBtnClass}
        aria-label={`Écrire à ${value}`}
        title="Écrire un e-mail"
      >
        <Mail className="size-4 text-[#19752b]" strokeWidth={1.75} aria-hidden />
      </a>
      <a
        href={commandeMailtoHref(value)}
        className="min-w-0 truncate text-sm text-brand-navy hover:text-primary hover:underline"
      >
        {value}
      </a>
    </div>
  )
}