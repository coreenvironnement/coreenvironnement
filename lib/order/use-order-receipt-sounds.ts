"use client"

import { useReducedMotion } from "framer-motion"
import { useCallback, useEffect, useRef } from "react"

import { ORDER_RECEIPT_AUDIO } from "@/lib/media/order-receipt-audio"

import type { ReceiptPrinterStage } from "@/components/order/receipt-printer"

export type OrderReceiptSoundMode =
  | "particulier_paid"
  | "professionnel_paid"
  | "professionnel_demande"

const VOLUME = {
  thermal: 0.65,
  success: 0.85,
  successDemande: 0.5,
} as const

function canPlayWebm(): boolean {
  if (typeof document === "undefined") return false
  const a = document.createElement("audio")
  return a.canPlayType('audio/webm; codecs="opus"') !== ""
}

function createAudio(src: string): HTMLAudioElement {
  const audio = new Audio(src)
  audio.preload = "auto"
  return audio
}

export function useOrderReceiptSounds(enabled: boolean) {
  const reduceMotion = useReducedMotion()
  const thermalRef = useRef<HTMLAudioElement | null>(null)
  const successRef = useRef<HTMLAudioElement | null>(null)
  const successPlayedRef = useRef(false)
  const thermalStartedRef = useRef(false)

  const ensureLoaded = useCallback(() => {
    if (thermalRef.current && successRef.current) return
    const useWebm = canPlayWebm()
    thermalRef.current = createAudio(
      useWebm ? ORDER_RECEIPT_AUDIO.thermal.webm : ORDER_RECEIPT_AUDIO.thermal.mp3
    )
    successRef.current = createAudio(
      useWebm ? ORDER_RECEIPT_AUDIO.success.webm : ORDER_RECEIPT_AUDIO.success.mp3
    )
    thermalRef.current.volume = VOLUME.thermal
    successRef.current.volume = VOLUME.success
  }, [])

  const playSuccess = useCallback(
    (mode: OrderReceiptSoundMode) => {
      if (reduceMotion || !enabled || successPlayedRef.current) return
      ensureLoaded()
      const el = successRef.current
      if (!el) return
      el.volume =
        mode === "professionnel_demande" ? VOLUME.successDemande : VOLUME.success
      el.currentTime = 0
      successPlayedRef.current = true
      void el.play().catch(() => undefined)
    },
    [enabled, ensureLoaded, reduceMotion]
  )

  const playForStage = useCallback(
    (stage: ReceiptPrinterStage, mode: OrderReceiptSoundMode) => {
      if (reduceMotion || !enabled) return

      if (mode === "professionnel_demande") {
        if (stage === "complete") {
          playSuccess(mode)
        }
        return
      }

      if (stage === "printing") {
        if (thermalStartedRef.current) return
        ensureLoaded()
        const thermal = thermalRef.current
        const success = successRef.current
        if (!thermal || !success) return
        thermalStartedRef.current = true
        const onEnded = () => {
          thermal.removeEventListener("ended", onEnded)
          playSuccess(mode)
        }
        thermal.addEventListener("ended", onEnded)
        thermal.currentTime = 0
        void thermal.play().catch(() => {
          thermal.removeEventListener("ended", onEnded)
        })
      }
    },
    [enabled, ensureLoaded, playSuccess, reduceMotion]
  )

  useEffect(() => {
    return () => {
      thermalRef.current?.pause()
      successRef.current?.pause()
    }
  }, [])

  const resetSounds = useCallback(() => {
    successPlayedRef.current = false
    thermalStartedRef.current = false
    thermalRef.current?.pause()
    successRef.current?.pause()
  }, [])

  return { playForStage, resetSounds, preload: ensureLoaded }
}