import { Mail, MapPin, Phone } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  ville: string | null
  email: string | null
  telephone: string | null
  isActive: boolean | null
  compact?: boolean
}

export function AdminPrestataireListMeta({
  ville,
  email,
  telephone,
  isActive,
  compact = false,
}: Props) {
  const villeLabel = ville?.trim() || "Ville non renseignée"
  const emailVal = email?.trim()
  const telVal = telephone?.trim()

  const contactShort = emailVal
    ? emailVal
    : telVal
      ? telVal
      : "Contact non renseigné"

  const align = compact ? "justify-start" : "justify-center"
  const textSize = compact ? "text-xs" : "text-sm"

  return (
    <div className={cn(compact ? "mt-1" : "mt-3 space-y-2")}>
      <ul
        className={cn(
          compact ? "flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:gap-x-3" : "space-y-1.5",
          textSize,
          "text-muted-foreground"
        )}
      >
        <li className={cn("flex items-center gap-1.5 leading-snug", align)}>
          <MapPin className="size-3 shrink-0 text-[#52A67A]" strokeWidth={1.75} aria-hidden />
          <span className="line-clamp-1">{villeLabel}</span>
        </li>
        <li className={cn("flex items-center gap-1.5 leading-snug", align)}>
          {emailVal ? (
            <Mail className="size-3 shrink-0 text-[#52A67A]" strokeWidth={1.75} aria-hidden />
          ) : telVal ? (
            <Phone className="size-3 shrink-0 text-[#52A67A]" strokeWidth={1.75} aria-hidden />
          ) : (
            <Mail className="size-3 shrink-0 text-muted-foreground/70" strokeWidth={1.75} aria-hidden />
          )}
          <span className="line-clamp-1" title={contactShort}>
            {contactShort}
          </span>
        </li>
      </ul>
      {isActive === false ? (
        <p
          className={cn(
            "text-xs font-medium text-slate-500",
            compact ? "mt-1 text-left" : "text-center"
          )}
        >
          Inactif
        </p>
      ) : null}
    </div>
  )
}