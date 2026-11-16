import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"

export function AuthBackLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Retour à l'accueil"
      className={cn(
        "auth-back-link inline-flex size-9 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-brand-green shadow-none",
        "transition-colors hover:bg-[#35A238]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green",
        className
      )}
    >
      <ArrowLeft className="size-[18px] text-brand-green" aria-hidden />
    </Link>
  )
}