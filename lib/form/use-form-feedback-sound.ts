"use client"

/**
 * Retours sonores formulaire - opt-in via `--form-sound-enabled: 1` (CSS) ou activation future.
 * Fichiers audio non livrés : chargement paresseux et échec silencieux à brancher ici.
 */
export function useFormFeedbackSound() {
  const enabled =
    typeof document !== "undefined" &&
    getComputedStyle(document.documentElement).getPropertyValue("--form-sound-enabled").trim() === "1"

  return {
    enabled,
    playSelection: () => {
      if (!enabled) return
      // lazy import audio module when assets exist
    },
    playError: () => {
      if (!enabled) return
    },
    playSuccess: () => {
      if (!enabled) return
    },
  }
}