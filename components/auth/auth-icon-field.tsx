import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function AuthIconField({
  icon: Icon,
  className,
  children,
}: {
  icon: LucideIcon
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("relative", className)}>
      <span
        className="pointer-events-none absolute left-3.5 top-1/2 z-[1] flex -translate-y-1/2 text-[#35A238]/85"
        aria-hidden
      >
        <Icon className="size-[18px]" strokeWidth={1.75} />
      </span>
      {children}
    </div>
  )
}