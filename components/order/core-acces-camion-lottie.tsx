"use client"

import { useRef } from "react"
import {
  Lottie,
  LottieHandle,
  LottieSubscription,
} from "lottie-react"
import { useReducedMotion } from "framer-motion"

const CORE_ACCES_CAMION_LOTTIE_SRC = "/images/core-acces-camion.json"

type CoreAccesCamionLottieProps = {
  playToken: number
}

export function CoreAccesCamionLottie({ playToken }: CoreAccesCamionLottieProps) {
  const reduceMotion = useReducedMotion()
  const lottieRef = useRef<LottieHandle>(null)

  const holdLastFrame = () => {
    lottieRef.current?.seek({ percent: 100 })
  }

  const playOnce = () => {
    if (reduceMotion) {
      holdLastFrame()
      return
    }
    lottieRef.current?.stop()
    lottieRef.current?.play()
  }

  return (
    <div
      className="truck-access-help__lottie mx-auto w-full max-w-[440px]"
      aria-hidden
    >
      <Lottie
        key={playToken}
        src={CORE_ACCES_CAMION_LOTTIE_SRC}
        autoplay={false}
        loop={false}
        lottieRef={lottieRef}
        className="truck-access-help__lottie-player h-full w-full"
        subscriptions={{
          [LottieSubscription.ready]: () => {
            playOnce()
          },
          [LottieSubscription.complete]: () => {
            holdLastFrame()
          },
        }}
      />
    </div>
  )
}
