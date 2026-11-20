import { Building2, UserRound } from "lucide-react"

import { particulierAvatarStyle } from "@/lib/admin/client-avatar-colors"
import { cn } from "@/lib/utils"

const ICON_STROKE = 1.75

export function AdminClientKindIcon({
  kind,
  clientId,
  className,
}: {
  kind: "particulier" | "professionnel"
  clientId: string
  className?: string
}) {
  const isPro = kind === "professionnel"
  const label = isPro ? "Professionnel" : "Particulier"
  const particulierStyle = !isPro ? particulierAvatarStyle(clientId) : null

  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg",
        isPro
          ? "bg-[#19752b]/12 text-[#19752b]"
          : cn(particulierStyle?.chip, particulierStyle?.icon),
        className
      )}
      title={label}
      aria-hidden
    >
      {isPro ? (
        <Building2 className="size-4" strokeWidth={ICON_STROKE} />
      ) : (
        <UserRound className="size-4" strokeWidth={ICON_STROKE} />
      )}
    </span>
  )
}