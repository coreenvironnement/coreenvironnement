"use client"

import { useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

export type LoaderCoreProps = {
  className?: string
  message?: string
  caption?: string
  showMessage?: boolean
  /** Désactiver role="status" si le parent annonce déjà l’état (évite les landmarks imbriqués). */
  standaloneStatus?: boolean
}

export function LoaderCore({
  className,
  message = "Chargement en cours…",
  caption,
  showMessage = true,
  standaloneStatus = true,
}: LoaderCoreProps) {
  const reduceMotion = useReducedMotion()
  const src = reduceMotion
    ? "/images/core-chargement-statique.svg"
    : "/images/core-chargement.svg"

  return (
    <div
      className={cn("flex flex-col items-center gap-3 text-center", className)}
      {...(standaloneStatus
        ? {
            role: "status" as const,
            "aria-live": "polite" as const,
            "aria-busy": true,
          }
        : {})}
    >
      <img
        src={src}
        width={80}
        height={48}
        alt=""
        aria-hidden
        className="block h-12 w-20 object-contain"
      />
      {showMessage ? (
        <>
          <p className="text-sm font-medium text-brand-navy">{message}</p>
          {caption ? (
            <p className="text-[13px] leading-relaxed text-brand-muted">{caption}</p>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
