import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"

export function AuthBackLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Retour à l'accueil"
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-brand-green/35 bg-white text-brand-navy shadow-sm transition-colors hover:border-brand-green hover:bg-brand-warm-field focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green",
        className
      )}
    >
      <ArrowLeft className="size-[18px] text-brand-green" aria-hidden />
    </Link>
  )
}