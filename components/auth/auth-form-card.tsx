import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export const AUTH_FORM_CARD_CLASS =
  "relative overflow-hidden rounded-2xl border border-[#35A238]/32 bg-gradient-to-b from-[#f0f6f2] via-[#f7faf8] to-[#fafcfa] p-3.5 shadow-[0_8px_28px_-16px_rgb(14_32_16/0.2)] sm:p-5"

type AuthFormCardProps = {
  children: ReactNode
  className?: string
}

export function AuthFormCard({ children, className }: AuthFormCardProps) {
  return <div className={cn(AUTH_FORM_CARD_CLASS, className)}>{children}</div>
}