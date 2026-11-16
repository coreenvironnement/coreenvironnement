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

const DECHETS_ACCEPTES_LOTTIE_LOOPS = 2

type DechetsAcceptesLottieProps = {
  src: string
  label: string
}

export function DechetsAcceptesLottie({ src, label }: DechetsAcceptesLottieProps) {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.2 }
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
          amount: 0.2,
          margin: "0px 0px -8% 0px",
        }),
      ]

  return (
    <figure ref={rootRef} className="dechets-acceptes-motion">
      <div
        className="dechets-acceptes-motion__stage relative flex aspect-[440/280] w-full items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-brand-border bg-[#E9F1EC]"
        aria-hidden
      >
        {inView ? (
          <LottieInteractions interactions={interactions}>
            <Lottie
              src={src}
              autoplay={false}
              loop={reduceMotion ? false : DECHETS_ACCEPTES_LOTTIE_LOOPS}
              lottieRef={lottieRef}
              className="h-full w-full max-h-[min(220px,48vw)] max-w-[min(100%,400px)]"
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
            className="size-full min-h-[140px] animate-pulse rounded-xl bg-[#dfe9e3]/60"
            aria-hidden
          />
        )}
      </div>
      <figcaption className="mt-2 text-center text-xs text-brand-muted">{label}</figcaption>
    </figure>
  )
}