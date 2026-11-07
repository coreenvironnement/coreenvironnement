"use client"

import { Phone, X } from "lucide-react"
import { useCallback, useEffect, useId, useRef, useState } from "react"

import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import { cn } from "@/lib/utils"

function isHeroAddressElement(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  if (el.id === "hero-order-address") return true
  return Boolean(el.closest(".hero-order-card__address"))
}

export function FloatingHelpBubble() {
  const [open, setOpen] = useState(false)
  const [hiddenForAddress, setHiddenForAddress] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const cardId = useId()
  const titleId = `${cardId}-title`

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const syncAddressFocus = () => {
      const active = document.activeElement
      setHiddenForAddress(isHeroAddressElement(active))
    }

    const onFocusIn = (event: FocusEvent) => {
      if (isHeroAddressElement(event.target)) {
        setHiddenForAddress(true)
        setOpen(false)
      }
    }

    const onFocusOut = () => {
      requestAnimationFrame(syncAddressFocus)
    }

    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)
    return () => {
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
    }
  }, [])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      const root = rootRef.current
      if (!root || !(event.target instanceof Node)) return
      if (!root.contains(event.target)) {
        close()
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, close])

  return (
    <div
      ref={rootRef}
      className={cn(
        "pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 z-30 sm:left-4",
        "max-md:bottom-[max(1rem,env(safe-area-inset-bottom))]",
        hiddenForAddress && "invisible opacity-0"
      )}
      aria-hidden={hiddenForAddress}
    >
      <div className="pointer-events-auto relative flex flex-col items-start gap-2">
        {open ? (
          <div
            id={cardId}
            role="dialog"
            aria-labelledby={titleId}
            className={cn(
              "relative w-[min(calc(100vw-1.5rem),17.5rem)] rounded-2xl border border-brand-border/80",
              "bg-white p-4 shadow-[0_12px_40px_-12px_rgba(23,32,51,0.35)]",
              "sm:w-[min(calc(100vw-2rem),18rem)]"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p
                id={titleId}
                className="pr-6 text-[15px] font-semibold leading-snug text-brand-navy"
              >
                On vous aide à choisir votre benne
              </p>
              <button
                type="button"
                onClick={close}
                className="absolute right-3 top-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-brand-muted transition-colors hover:bg-brand-bg hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                aria-label="Fermer l’aide"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-[14px] leading-snug text-brand-muted">
              Un doute sur le volume ou le type de déchets ?
            </p>
            <a
              href={SITE_PHONE_HREF}
              className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-brand-green px-3 py-2.5 text-center text-[14px] font-semibold leading-snug text-white shadow-[0_6px_18px_-8px_rgb(53_162_56/0.55)] transition-colors hover:bg-brand-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 sm:text-[15px]"
            >
              Appeler le {SITE_PHONE_DISPLAY}
            </a>
          </div>
        ) : null}

        <button
          type="button"
          aria-expanded={open}
          aria-controls={open ? cardId : undefined}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-full border border-white/22",
            "bg-brand-navy px-3.5 py-2 text-left text-[14px] font-medium text-white",
            "shadow-[0_8px_24px_-10px_rgba(23,32,51,0.5)]",
            "transition-colors hover:border-white/35 hover:bg-[#1e2840]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            "sm:px-4 sm:text-[15px]"
          )}
        >
          <span
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10"
            aria-hidden
          >
            <Phone className="size-[18px] text-[#35A238]" strokeWidth={2.25} />
          </span>
          <span className="whitespace-nowrap pr-0.5">Besoin d&apos;aide ?</span>
        </button>
      </div>
    </div>
  )
}
