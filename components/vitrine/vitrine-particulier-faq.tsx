"use client"

import { useCallback, useId, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

import { particulierAccueil, particulierFaq } from "@/lib/cdc/contenu-vitrine"
import { cn } from "@/lib/utils"

import { CoreFaqLottie } from "./core-faq-lottie"
import { VITRINE_ICON_STROKE } from "./icons"

export function VitrineParticulierFaq() {
  const baseId = useId()
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => new Set([0]))

  const toggle = useCallback((index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }, [])

  return (
    <section
      id="faq"
      className="border-t border-brand-border/80 bg-brand-bg py-12 sm:py-16"
      aria-labelledby="faq-particulier-title"
    >
      <div className="container-x relative max-w-2xl">
        <CoreFaqLottie />
        <div className="flex min-h-14 items-center justify-center md:min-h-0 md:block">
          <p className="section-eyebrow mx-auto max-md:w-full max-md:justify-center text-center">
            FAQ
          </p>
        </div>
        <h2
          id="faq-particulier-title"
          className="section-title mt-3 text-center text-brand-navy"
        >
          {particulierAccueil.faqTitre}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-brand-muted sm:text-base">
          {particulierAccueil.faqIntro}
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-brand-border/80 bg-white shadow-sm">
          {particulierFaq.map((item, index) => {
            const isOpen = openIndices.has(index)
            const buttonId = `${baseId}-faq-${index}`
            const panelId = `${baseId}-panel-${index}`
            return (
              <div
                key={item.q}
                className="border-t border-brand-border/80 first:border-t-0"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className={cn(
                      "flex min-h-12 w-full items-start gap-3 px-4 py-3.5 text-left sm:px-5 sm:py-4",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/20",
                      isOpen ? "text-brand-navy" : "text-brand-text hover:text-brand-navy"
                    )}
                  >
                    <span className="flex-1 text-[14px] font-medium leading-snug sm:text-[15px]">
                      {item.q}
                    </span>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={16}
                      strokeWidth={VITRINE_ICON_STROKE}
                      className={cn(
                        "mt-0.5 shrink-0 transition-transform duration-200",
                        isOpen ? "rotate-180 text-brand-green" : "text-brand-muted"
                      )}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                      <p className="text-[14px] leading-relaxed text-brand-muted sm:text-[15px]">
                        {item.r}
                      </p>
                      {"linkLabel" in item && item.linkLabel && "linkHref" in item ? (
                        <p className="mt-3">
                          <a
                            href={item.linkHref}
                            className="text-[14px] font-medium text-brand-navy underline-offset-2 hover:text-brand-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2 sm:text-[15px]"
                          >
                            {item.linkLabel}
                          </a>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
