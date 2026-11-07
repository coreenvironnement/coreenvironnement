"use client"

import { useRef } from "react"
import {
  Lottie,
  LottieHandle,
  LottieSubscription,
} from "lottie-react"
import { useReducedMotion } from "framer-motion"

export type VolumeEstimatorMeasureMode = "regular" | "irregular" | "bags"

const MEASURE_LOTTIE_SRC: Record<VolumeEstimatorMeasureMode, string> = {
  regular: "/core-mesure-tas-regulier.json",
  irregular: "/core-mesure-tas-irregulier.json",
  bags: "/core-mesure-big-bag.json",
}

type VolumeEstimatorMeasureLottieProps = {
  mode: VolumeEstimatorMeasureMode
}

export function VolumeEstimatorMeasureLottie({
  mode,
}: VolumeEstimatorMeasureLottieProps) {
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

  const animationSrc = MEASURE_LOTTIE_SRC[mode]

  return (
    <div
      className="volume-estimator-measure-lottie mx-auto aspect-[460/330] w-full max-w-[360px] min-h-[160px] sm:min-h-[258px]"
      aria-hidden
    >
      <Lottie
        key={animationSrc}
        src={animationSrc}
        autoplay={false}
        loop={false}
        lottieRef={lottieRef}
        className="h-full w-full"
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
