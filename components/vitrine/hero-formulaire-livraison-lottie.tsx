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

const HERO_FORMULAIRE_LIVRAISON_LOTTIE_SRC = "/core-formulaire-livraison.json"

export function HeroFormulaireLivraisonLottie() {
  const reduceMotion = useReducedMotion()
  const lottieRef = useRef<LottieHandle>(null)
  const [deferLottie, setDeferLottie] = useState(false)

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (
        cb: IdleRequestCallback,
        opts?: IdleRequestOptions
      ) => number
      cancelIdleCallback?: (id: number) => void
    }
    if (typeof win.requestIdleCallback === "function") {
      const id = win.requestIdleCallback(() => setDeferLottie(true), {
        timeout: 1800,
      })
      return () => win.cancelIdleCallback?.(id)
    }
    const t = window.setTimeout(() => setDeferLottie(true), 400)
    return () => window.clearTimeout(t)
  }, [])

  const holdLastFrame = () => {
    lottieRef.current?.seek({ percent: 100 })
  }

  const interactions = reduceMotion
    ? []
    : [
        lottieInView({
          once: true,
          amount: 0.01,
        }),
      ]

  if (!deferLottie) {
    return (
      <div className="hero-order-card__lottie-banner" aria-hidden />
    )
  }

  return (
    <div className="hero-order-card__lottie-banner" aria-hidden>
      <LottieInteractions interactions={interactions}>
        <Lottie
          src={HERO_FORMULAIRE_LIVRAISON_LOTTIE_SRC}
          autoplay={false}
          loop={!reduceMotion}
          lottieRef={lottieRef}
          className="hero-order-card__lottie"
          subscriptions={{
            [LottieSubscription.ready]: () => {
              if (reduceMotion) holdLastFrame()
            },
          }}
        />
      </LottieInteractions>
    </div>
  )
}
