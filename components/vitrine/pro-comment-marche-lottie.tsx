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

const WRAP_CLASS = {
  example:
    "pro-comment-marche__example-lottie inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-brand-green/15 bg-brand-green/[0.06]",
  docs:
    "pro-comment-marche__docs-lottie relative inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-green/15 bg-white sm:h-11 sm:w-11",
} as const

type ProCommentMarcheLottieVariant = keyof typeof WRAP_CLASS

type ProCommentMarcheLottieProps = {
  variant: ProCommentMarcheLottieVariant
  src: string
  staticSrc: string
}

export function ProCommentMarcheLottie({
  variant,
  src,
  staticSrc,
}: ProCommentMarcheLottieProps) {
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

  const wrapClass = WRAP_CLASS[variant]

  if (reduceMotion) {
    return (
      <span className={wrapClass} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={staticSrc}
          alt=""
          width={120}
          height={120}
          decoding="async"
          className="pro-comment-marche__lottie-static"
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
    <span ref={rootRef} className={wrapClass} aria-hidden>
      {inView ? (
        <span className="pro-comment-marche__lottie-frame">
          <LottieInteractions interactions={interactions}>
            <Lottie
              src={src}
              autoplay={false}
              loop={false}
              lottieRef={lottieRef}
              className="pro-comment-marche__lottie-player"
              subscriptions={{
                [LottieSubscription.complete]: holdLastFrame,
              }}
            />
          </LottieInteractions>
        </span>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={staticSrc}
          alt=""
          width={120}
          height={120}
          decoding="async"
          className="pro-comment-marche__lottie-static"
        />
      )}
    </span>
  )
}