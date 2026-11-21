"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

import { CoreAccesCamionLottie } from "@/components/order/core-acces-camion-lottie"

export function CpAccesEncartLottie() {
  const reduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [playToken, setPlayToken] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (reduceMotion) {
      setMounted(true)
      setPlayToken(1)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect()
            setMounted(true)
            setPlayToken(1)
          }
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduceMotion])

  return (
    <div ref={containerRef} className="cp-acces-encart__visual" aria-hidden>
      {mounted ? <CoreAccesCamionLottie playToken={playToken} /> : null}
    </div>
  )
}