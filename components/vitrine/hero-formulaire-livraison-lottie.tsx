"use client"

import { useRef } from "react"
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
