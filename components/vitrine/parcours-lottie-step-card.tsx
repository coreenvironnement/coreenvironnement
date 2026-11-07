"use client"

import { useEffect, useRef, useState } from "react"
import {
  Lottie,
  LottieHandle,
  LottieInteractions,
  LottieSubscription,
  lottieInView,
} from "lottie-react"
import { useReducedMotion } from "framer-motion"

const PARCOURS_LOTTIE_LOOP_COUNT = 3

type ParcoursLottieStepCardProps = {
  num: string
  titre: string
  animationSrc: string
}

export function ParcoursLottieStepCard({
  num,
  titre,
  animationSrc,
}: ParcoursLottieStepCardProps) {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLLIElement>(null)
  const lottieRef = useRef<LottieHandle>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = rootRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.15 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const holdLastFrame = () => {
    lottieRef.current?.seek({ percent: 100 })
  }

  const interactions = reduceMotion
    ? []
    : [
        lottieInView({
          amount: 0.15,
          margin: "0px 0px -6% 0px",
        }),
      ]

  return (
    <li
      ref={rootRef}
      className="parcours-lottie-card overflow-hidden rounded-2xl border border-[#dce5df] bg-white shadow-[0_1px_3px_rgb(14_32_16/0.05)]"
    >
      <div
        className="parcours-lottie-card__visual relative flex aspect-[440/238] w-full items-center justify-center overflow-hidden bg-[#E9F1EC] px-1 py-2 sm:px-2 sm:py-3"
        aria-hidden
      >
        {inView ? (
          <LottieInteractions interactions={interactions}>
            <Lottie
              src={animationSrc}
              autoplay={false}
              loop={reduceMotion ? false : PARCOURS_LOTTIE_LOOP_COUNT}
              lottieRef={lottieRef}
              className="h-full w-full max-h-[min(240px,52vw)] max-w-[min(100%,420px)]"
              subscriptions={{
                [LottieSubscription.ready]: () => {
                  if (reduceMotion) holdLastFrame()
                },
                [LottieSubscription.complete]: () => {
                  if (!reduceMotion) holdLastFrame()
                },
              }}
            />
          </LottieInteractions>
        ) : (
          <div
            className="size-full min-h-[128px] animate-pulse rounded-xl bg-[#dfe9e3]/60 sm:min-h-[150px]"
            aria-hidden
          />
        )}
      </div>
      <div className="parcours-lottie-card__caption flex min-h-[3.25rem] items-center gap-2.5 border-t border-[#e8ece9] bg-white px-3.5 py-3 sm:gap-3 sm:px-4 sm:py-3.5">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E9F1EC] font-[family-name:var(--font-body)] text-[13px] font-semibold tabular-nums text-brand-muted"
          aria-hidden
        >
          {num}
        </span>
        <h3 className="vitrine-h3">
          {titre}
        </h3>
      </div>
    </li>
  )
}
