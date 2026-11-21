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

const ENGAGEMENTS_LOTTIE_LOOP_COUNT = 2

const ICON_WRAP_CLASS =
  "pro-engagements-card__icon-wrap pro-engagements-card__icon-wrap--lottie row-span-3 inline-flex size-16 shrink-0 items-center justify-center overflow-visible rounded-xl border border-brand-green/18 bg-brand-green/[0.06] sm:size-[4.25rem] lg:size-[4.5rem] lg:rounded-2xl"

type EngagementsCardLottieProps = {
  src: string
  staticSrc: string
}

export function EngagementsCardLottie({
  src,
  staticSrc,
}: EngagementsCardLottieProps) {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLSpanElement>(null)
  const lottieRef = useRef<LottieHandle>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (reduceMotion) return

    const node = rootRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduceMotion])

  if (reduceMotion) {
    return (
      <span className={ICON_WRAP_CLASS} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={staticSrc}
          alt=""
          width={160}
          height={160}
          decoding="async"
          className="pro-engagements-card__static-icon"
        />
      </span>
    )
  }

  const holdLastFrame = () => {
    lottieRef.current?.seek({ percent: 100 })
  }

  const interactions = [
    lottieInView({
      amount: 0.2,
      margin: "0px 0px -8% 0px",
    }),
  ]

  return (
    <span ref={rootRef} className={ICON_WRAP_CLASS} aria-hidden>
      {inView ? (
        <span className="pro-engagements-card__lottie-frame pro-engagements-card__lottie-frame--icon">
          <LottieInteractions interactions={interactions}>
            <Lottie
              src={src}
              autoplay={false}
              loop={ENGAGEMENTS_LOTTIE_LOOP_COUNT}
              lottieRef={lottieRef}
              className="pro-engagements-card__lottie-player"
              subscriptions={{
                [LottieSubscription.complete]: () => {
                  holdLastFrame()
                },
              }}
            />
          </LottieInteractions>
        </span>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={staticSrc}
          alt=""
          width={160}
          height={160}
          decoding="async"
          className="pro-engagements-card__static-icon"
        />
      )}
    </span>
  )
}