"use client"

import { useEffect, useRef, useState } from "react"
import {
  Lottie,
  LottieHandle,
  LottieSubscription,
} from "lottie-react"
import { useReducedMotion } from "framer-motion"

const PACK_BASE = "/images/core-preparation-pack"

export type PreparationAnimationId = "01-volume" | "02-acces" | "03-dechets"

type PreparationLottieArtProps = {
  animation: PreparationAnimationId
  variant?: "default" | "waste"
}

export function PreparationLottieArt({
  animation,
  variant = "default",
}: PreparationLottieArtProps) {
  const reduceMotion = useReducedMotion()
  const figureRef = useRef<HTMLElement>(null)
  const lottieRef = useRef<LottieHandle>(null)
  const [shouldPlay, setShouldPlay] = useState(false)
  const [ready, setReady] = useState(false)
  const playedRef = useRef(false)

  useEffect(() => {
    const el = figureRef.current
    if (!el || reduceMotion) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect()
            setShouldPlay(true)
          }
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduceMotion])

  const holdLastFrame = () => {
    lottieRef.current?.seek({ percent: 100 })
  }

  const artClass =
    variant === "waste" ? "cp-art cp-art--waste" : "cp-art"
  const posterHeight = variant === "waste" ? 300 : 400

  return (
    <figure
      ref={figureRef}
      className={`${artClass}${ready ? " is-ready" : ""}`}
      aria-hidden
    >
      <img
        className="cp-poster"
        src={`${PACK_BASE}/posters/${animation}.svg`}
        alt=""
        width={800}
        height={posterHeight}
        decoding="async"
      />
      {shouldPlay && !reduceMotion ? (
        <div className="cp-lottie">
          <Lottie
            src={`${PACK_BASE}/animations/${animation}.json`}
            autoplay={false}
            loop={false}
            lottieRef={lottieRef}
            subscriptions={{
              [LottieSubscription.ready]: () => {
                if (playedRef.current) return
                playedRef.current = true
                setReady(true)
                lottieRef.current?.stop()
                lottieRef.current?.play()
              },
              [LottieSubscription.complete]: () => {
                holdLastFrame()
              },
            }}
          />
        </div>
      ) : null}
    </figure>
  )
}
