"use client"

import { useEffect, useRef, useState } from "react"
import {
  Lottie,
  LottieHandle,
  LottieSubscription,
} from "lottie-react"

const CORE_FAQ_LOTTIE_SRC = "/images/core-faq-pack/core-faq-lottie.json"
const CORE_FAQ_STATIC_SRC = "/images/core-faq-pack/core-faq-statique.svg"

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return reduced
}

export function CoreFaqLottie() {
  const reducedMotion = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const lottieRef = useRef<LottieHandle>(null)
  const [inView, setInView] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [jsonVerified, setJsonVerified] = useState(false)

  useEffect(() => {
    if (reducedMotion) return
    const node = rootRef.current
    if (!node) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    if (!inView || reducedMotion) return
    let cancelled = false
    fetch(CORE_FAQ_LOTTIE_SRC)
      .then((res) => {
        if (!res.ok) throw new Error("lottie unavailable")
        if (!cancelled) setJsonVerified(true)
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [inView, reducedMotion])

  const showStatic = reducedMotion || loadFailed
  const showLottie = inView && jsonVerified && !showStatic

  const holdLastFrame = () => {
    lottieRef.current?.seek({ percent: 100 })
  }

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute right-4 top-0 z-0 size-12 md:right-6 md:top-6 md:size-20"
      aria-hidden
    >
      {showStatic ? (
        <img
          src={CORE_FAQ_STATIC_SRC}
          alt=""
          width={80}
          height={80}
          className="size-full object-contain"
          decoding="async"
        />
      ) : showLottie ? (
        <Lottie
          src={CORE_FAQ_LOTTIE_SRC}
          autoplay={false}
          loop={false}
          lottieRef={lottieRef}
          className="size-full"
          subscriptions={{
            [LottieSubscription.ready]: () => {
              lottieRef.current?.play()
            },
            [LottieSubscription.complete]: () => {
              holdLastFrame()
            },
          }}
        />
      ) : (
        <span className="block size-full" />
      )}
    </div>
  )
}
