"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  Lottie,
  LottieHandle,
  LottieInteractions,
  LottieSubscription,
  lottieInView,
} from "lottie-react"
import { useReducedMotion } from "framer-motion"

import { PARCOURS_LOTTIE_BY_NUM } from "@/lib/vitrine/parcours-lottie-steps"
import { cn } from "@/lib/utils"

export type DateVisualKind = "delivery" | "pickup"

const VISUALS: Record<
  DateVisualKind,
  { image: string; lottieNum: "02" | "04"; alt: string }
> = {
  delivery: {
    image: "/images/parcours-etape-02-camion-depose-benne.webp",
    lottieNum: "02",
    alt: "",
  },
  pickup: {
    image: "/images/parcours-etape-04-enlevement-porte-benne.webp",
    lottieNum: "04",
    alt: "",
  },
}

type OrderTunnelDateVisualProps = {
  kind: DateVisualKind
  /** Intégré dans une carte date (bords hauts seulement). */
  integrated?: boolean
}

/** Bandeau compact au-dessus des champs date (image ou micro-animation). */
export function OrderTunnelDateVisual({ kind, integrated = false }: OrderTunnelDateVisualProps) {
  const reduceMotion = useReducedMotion()
  const cfg = VISUALS[kind]
  const lottieSrc = PARCOURS_LOTTIE_BY_NUM[cfg.lottieNum]
  const rootRef = useRef<HTMLDivElement>(null)
  const lottieRef = useRef<LottieHandle>(null)
  const [mountLottie, setMountLottie] = useState(false)

  useEffect(() => {
    if (reduceMotion) return
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setMountLottie(true)
      },
      { rootMargin: "0px", threshold: 0.1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduceMotion])

  const holdLastFrame = () => {
    lottieRef.current?.seek({ percent: 100 })
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "order-tunnel-date-visual relative w-full overflow-hidden bg-[#E9F1EC]",
        integrated
          ? "h-[4.25rem] border-b border-primary/10 sm:h-[4.75rem]"
          : "h-[3.25rem] rounded-xl border border-primary/10 sm:h-14"
      )}
      aria-hidden
    >
      {reduceMotion || !mountLottie ? (
        <Image
          src={cfg.image}
          alt={cfg.alt}
          fill
          sizes="(max-width: 640px) 50vw, 280px"
          className="object-cover object-center"
        />
      ) : (
        <LottieInteractions
          interactions={[
            lottieInView({
              once: true,
              amount: 0.2,
            }),
          ]}
        >
          <Lottie
            src={lottieSrc}
            autoplay={false}
            loop={false}
            lottieRef={lottieRef}
            className="h-full w-full"
            subscriptions={{
              [LottieSubscription.ready]: () => {
                lottieRef.current?.play()
              },
              [LottieSubscription.complete]: () => {
                holdLastFrame()
              },
            }}
          />
        </LottieInteractions>
      )}
    </div>
  )
}