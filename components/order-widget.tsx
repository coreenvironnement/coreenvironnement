"use client"

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Circle,
  Headphones,
  Info,
  Loader2,
  MapPin,
  MapPinOff,
  Pencil,
} from "lucide-react"

import {
  AddressAutocomplete,
  type AddressGeocodeHit,
} from "@/components/order/address-autocomplete"

import {
  OrderAudienceToggle,
  type OrderAudience,
} from "@/components/order/order-audience-toggle"
import { useVitrineOrder } from "@/components/vitrine/order-context"
import { VITRINE_ICON_STROKE } from "@/components/vitrine/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CheckoutReassuranceBanner } from "@/components/order/checkout-reassurance-banner"
import { EmbeddedCheckout } from "@/components/order/embedded-checkout"
import { OrderDateField } from "@/components/order/order-date-field"
import { OrderTunnelContinueButton } from "@/components/order/order-tunnel-continue-button"
import { ParticulierVolumeStep } from "@/components/order/particulier-volume-step"
import { ParticulierWastePicker } from "@/components/order/particulier-waste-picker"
import { WasteFamilySelect } from "@/components/order/waste-situation-picker"
import {
  particulierWasteOptionById,
  type ParticulierWasteOptionId,
} from "@/lib/order/particulier-waste-options"
import { prestationIdForFamilyVolume } from "@/lib/order/volume-estimator"
import { formatOrderDatePicker } from "@/lib/format/date"
import { submitProfessionalBenneRequest } from "@/app/order/actions"
import { createClient } from "@/lib/supabase/client"
import {
  type BenneFamily,
  type BenneSystem,
  type Prestation,
  FAMILY_LABELS,
  prestationsByFamily,
  prestationById,
  systemLabel,
} from "@/lib/prestations"
import { priceBreakdownFromHt } from "@/lib/order/prestation-mapping"
import type { ProReorderSeed } from "@/lib/espace/pro-reorder-prefill"
import { useOrderAudienceSession } from "@/lib/auth/use-order-audience-session"
import {
  ORDER_TUNNEL_STEPS,
  getOrderTunnelSteps,
  type OrderTunnelStepId,
} from "@/lib/order/tunnel-steps"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import {
  DELIVERY_DATE_INVALID_MESSAGE,
  isValidDeliveryDate,
  isValidPickupDate,
  minDeliveryDateISO,
} from "@/lib/order/delivery-dates"
import { BENNE_VISUAL_BY_VOLUME } from "@/lib/commande/benne-visual"
import { cn } from "@/lib/utils"

export { ORDER_TUNNEL_STEPS } from "@/lib/order/tunnel-steps"

const ORDER_SECTION_LABEL =
  "text-left text-[14px] font-semibold leading-snug text-brand-navy"

const ORDER_HELP_TEXT =
  "flex items-start gap-1.5 text-[11px] leading-snug text-brand-muted sm:text-[12px]"

const ORDER_TUNNEL_CARD = "order-tunnel-card"

function orderFieldBg(embedded: boolean) {
  return embedded ? "bg-brand-warm-field text-brand-navy" : "bg-white"
}

function orderOutlineBtn(embedded: boolean) {
  return embedded ? "order-tunnel-outline-btn h-11 rounded-xl" : "h-11 rounded-xl"
}

type Audience = OrderAudience

type IntentPhase = "location" | "waste" | "volume"

type AfterLocationTarget = "waste" | "volume" | "forfait"

function fmtHt(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n)
}

function OrderStepProgress({
  currentStepIdx,
  steps,
}: {
  currentStepIdx: number
  steps: ReadonlyArray<{ id: OrderTunnelStepId; label: string }>
}) {
  const current = steps[currentStepIdx]
  const progress = ((currentStepIdx + 1) / steps.length) * 100

  return (
    <div className="mx-auto mb-2.5 max-w-md text-center" aria-live="polite">
      <p className="text-[0.625rem] font-medium leading-snug text-brand-navy/42">
        <span>
          Étape {currentStepIdx + 1} sur {steps.length} :{" "}
          <span className="text-brand-navy/58">{current.label}</span>
        </span>
      </p>
      <div
        className="mx-auto mt-1 h-[2px] w-full max-w-[200px] overflow-hidden rounded-full bg-brand-green/12 sm:max-w-[240px]"
        role="progressbar"
        aria-valuenow={currentStepIdx + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-label={`Étape ${currentStepIdx + 1} sur ${steps.length} : ${current.label}`}
      >
        <div
          className="h-full rounded-full bg-[#35A238] transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

type OrderWidgetProps = {
  variant?: "default" | "embedded"
  open?: boolean
  entryMode?: "default" | "pro-reorder"
  proReorderSeed?: ProReorderSeed | null
  onStepIndexChange?: (index: number) => void
  onAudienceChange?: (audience: Audience) => void
  onClose?: () => void
  scrollContainerRef?: React.RefObject<HTMLElement | null>
}

export function OrderWidget({
  variant = "default",
  open = true,
  entryMode = "default",
  proReorderSeed = null,
  onStepIndexChange,
  onAudienceChange,
  onClose,
  scrollContainerRef,
}: OrderWidgetProps) {
  const embedded = variant === "embedded"
  const { draft, patchDraft, resolveIntentPhase, intentStart } = useVitrineOrder()
  const sessionAudience = useOrderAudienceSession()
  const audienceLocked =
    sessionAudience.locked && sessionAudience.audience !== null
  const modalWasOpen = useRef(false)
  const proReorderBootstrapped = useRef(false)
  const prefersReducedMotion = useReducedMotion()
  const t = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }

  const [step, setStep] = useState<OrderTunnelStepId>("intent")
  const [intentPhase, setIntentPhase] = useState<IntentPhase>("location")
  const [afterLocationTarget, setAfterLocationTarget] =
    useState<AfterLocationTarget>("waste")
  const [audience, setAudience] = useState<Audience>("particulier")
  const [address, setAddress] = useState("")
  const [selectedAddress, setSelectedAddress] = useState<AddressGeocodeHit | null>(
    null
  )
  const [addressError, setAddressError] = useState<string | null>(null)
  const [deliveryDateError, setDeliveryDateError] = useState<string | null>(null)
  const deliveryDateRef = useRef<HTMLDivElement>(null)

  const focusDeliveryDateField = () => {
    const root = deliveryDateRef.current
    if (!root) return
    const btn = root.querySelector("button")
    btn?.focus({ preventScroll: true })
  }
  const [family, setFamily] = useState<BenneFamily | null>(null)
  const [particulierWasteId, setParticulierWasteId] =
    useState<ParticulierWasteOptionId | null>(null)
  const [volumeHintM3, setVolumeHintM3] = useState<number | null>(null)
  const [volumeHintOrigin, setVolumeHintOrigin] = useState<
    "estimated" | "chosen" | "unknown"
  >("unknown")
  /** Particulier : ouvre l’étape volume directement sur l’estimateur (pas le choix connaître / estimer). */
  const [volumeEstimateOnly, setVolumeEstimateOnly] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [selectedPrestationId, setSelectedPrestationId] = useState<
    string | null
  >(null)
  const [contactFirstName, setContactFirstName] = useState("")
  const [contactLastName, setContactLastName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [proContactName, setProContactName] = useState("")
  const [siret, setSiret] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [draftCommandeId, setDraftCommandeId] = useState<string | null>(null)

  const handleAudienceChange = useCallback(
    (next: Audience) => {
      if (next === audience) return
      setDraftCommandeId(null)
      if (step === "payment") {
        setStep("recap")
      }
      setAudience(next)
      patchDraft({ audience: next })
    },
    [audience, step, patchDraft]
  )

  const [proRequestSent, setProRequestSent] = useState(false)
  const [proClientEmailSent, setProClientEmailSent] = useState(false)
  const [proReference, setProReference] = useState<string | null>(null)
  const [proCompte, setProCompte] = useState<{
    status: string
    payment_mode: string | null
  } | null>(null)
  const [proCompteLoading, setProCompteLoading] = useState(false)
  const [proSessionUserId, setProSessionUserId] = useState<string | null>(null)
  const [isSubmittingPro, startProSubmit] = useTransition()
  const prestation = useMemo(
    () => (selectedPrestationId ? prestationById(selectedPrestationId) : null),
    [selectedPrestationId]
  )

  const filteredPrestations = useMemo(
    () => (family ? prestationsByFamily(family) : []),
    [family]
  )

  const clearAddressSelection = () => {
    setSelectedAddress(null)
  }

  const handleAddressSelect = (hit: AddressGeocodeHit) => {
    setAddress(hit.label)
    setSelectedAddress(hit)
    setAddressError(null)
  }

  const zoneOk = selectedAddress !== null
  const canLeaveIntentWaste =
    audience === "particulier" ? particulierWasteId !== null : family !== null

  const syncDraftFromWidget = () => {
    if (!embedded) return
    patchDraft({ audience, address, selectedAddress })
  }

  const applyDraft = (source: typeof draft) => {
    setAudience(source.audience)
    setAddress(source.address)
    setSelectedAddress(source.selectedAddress)
    if (source.particulierWasteId) {
      setParticulierWasteId(source.particulierWasteId)
      const mapped = particulierWasteOptionById(source.particulierWasteId)
      if (mapped) setFamily(mapped.family)
    } else if (source.family) {
      setFamily(source.family)
    }
    if (source.volumeHintM3 != null && source.volumeHintM3 > 0) {
      setVolumeHintM3(source.volumeHintM3)
      setVolumeHintOrigin(source.volumeHintOrigin ?? "unknown")
      const fam =
        source.family ??
        (source.particulierWasteId
          ? particulierWasteOptionById(source.particulierWasteId)?.family
          : null)
      if (fam) {
        const pid = prestationIdForFamilyVolume(fam, source.volumeHintM3)
        if (pid) setSelectedPrestationId(pid)
      }
    }
  }

  const advanceFromLocation = () => {
    setAddressError(null)
    if (!address.trim().length) {
      setAddressError("Indiquez l’adresse de livraison de la benne.")
      return
    }
    if (!selectedAddress) {
      setAddressError(
        "Sélectionnez une adresse dans la liste (Île-de-France uniquement)."
      )
      return
    }
    syncDraftFromWidget()

    const resume = afterLocationTarget
    setAfterLocationTarget("waste")

    if (resume === "forfait" && canLeaveIntentWaste) {
      setStep("forfait")
      scrollContainerRef?.current?.scrollTo({ top: 0, behavior: "auto" })
      return
    }
    if (canLeaveIntentWaste) {
      setIntentPhase("volume")
      scrollContainerRef?.current?.scrollTo({ top: 0, behavior: "auto" })
      return
    }
    setIntentPhase("waste")
    scrollContainerRef?.current?.scrollTo({ top: 0, behavior: "auto" })
  }

  const goToIntentVolume = (options?: { estimateOnly?: boolean }) => {
    setAddressError(null)
    if (audience === "particulier") {
      if (!particulierWasteId) {
        setAddressError("Choisissez ce que vous souhaitez jeter.")
        return
      }
    } else if (!family) {
      setAddressError("Choisissez un type de déchet dans la liste.")
      return
    }
    if (audience === "particulier") {
      setVolumeEstimateOnly(options?.estimateOnly === true)
    } else {
      setVolumeEstimateOnly(false)
    }
    syncDraftFromWidget()
    setIntentPhase("volume")
    scrollContainerRef?.current?.scrollTo({ top: 0, behavior: "auto" })
  }

  const goToForfait = (
    preselectVolumeM3?: number | null,
    volumeOrigin?: "estimated" | "chosen"
  ) => {
    setAddressError(null)
    if (audience === "particulier") {
      if (!particulierWasteId) {
        setAddressError("Choisissez ce que vous souhaitez jeter.")
        return
      }
    } else if (!family) {
      setAddressError("Choisissez un type de déchet dans la liste.")
      return
    }
    if (preselectVolumeM3 != null && family) {
      setVolumeHintM3(preselectVolumeM3)
      setVolumeHintOrigin(volumeOrigin ?? "unknown")
      const pid = prestationIdForFamilyVolume(family, preselectVolumeM3)
      if (pid) setSelectedPrestationId(pid)
    }
    if (!zoneOk) {
      setAfterLocationTarget("forfait")
      setIntentPhase("location")
      setAddressError(
        "Indiquez l’adresse de livraison pour poursuivre votre commande."
      )
      scrollContainerRef?.current?.scrollTo({ top: 0, behavior: "auto" })
      return
    }
    syncDraftFromWidget()
    setStep("forfait")
    scrollContainerRef?.current?.scrollTo({ top: 0, behavior: "auto" })
  }

  const goToInfos = () => {
    if (!selectedPrestationId) {
      setAddressError(
        audience === "particulier"
          ? "Sélectionnez une benne pour continuer."
          : "Sélectionnez un forfait pour continuer."
      )
      return
    }
    setAddressError(null)
    setStep("infos")
  }

  const scrollToDeliveryDateField = () => {
    const field = deliveryDateRef.current
    const container = scrollContainerRef?.current
    if (field && container) {
      const offset =
        field.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop
      container.scrollTo({ top: Math.max(0, offset - 8), behavior: "smooth" })
    } else {
      field?.scrollIntoView({ block: "start", behavior: "smooth" })
    }
  }

  const goToPayment = () => {
    if (!deliveryDate.length) {
      setDeliveryDateError("Veuillez sélectionner une date de livraison.")
      setAddressError(null)
      requestAnimationFrame(() => {
        scrollToDeliveryDateField()
        focusDeliveryDateField()
      })
      return
    }
    if (!isValidDeliveryDate(deliveryDate)) {
      setDeliveryDateError(DELIVERY_DATE_INVALID_MESSAGE)
    setAddressError(null)
      requestAnimationFrame(() => {
        scrollToDeliveryDateField()
        focusDeliveryDateField()
      })
      return
    }
    if (
      pickupDate.length &&
      !isValidPickupDate(deliveryDate, pickupDate)
    ) {
      setAddressError(
        "La date d'enlèvement ne peut pas être antérieure à la date de livraison."
      )
      setDeliveryDateError(null)
      return
    }
    setDeliveryDateError(null)
    if (audience === "professionnel") {
      if (!companyName.trim()) {
        setAddressError("Indiquez le nom de l’entreprise.")
        return
      }
      if (!proContactName.trim()) {
        setAddressError("Indiquez le nom et le prénom du contact.")
        return
      }
      const siretDigits = siret.replace(/\s/g, "")
      if (siretDigits.length > 0 && !/^\d{14}$/.test(siretDigits)) {
        setAddressError("Le SIRET doit contenir 14 chiffres, ou rester vide.")
        return
      }
    } else {
      if (!contactFirstName.trim()) {
        setAddressError("Indiquez votre prénom.")
        return
      }
      if (!contactLastName.trim()) {
        setAddressError("Indiquez votre nom.")
        return
      }
    }
    const phoneDigits = contactPhone.replace(/\D/g, "")
    if (phoneDigits.length < 10) {
      setAddressError("Indiquez un numéro de téléphone valide.")
      return
    }
    const email = contactEmail.trim()
    if (!email.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAddressError("Indiquez une adresse e-mail valide.")
      return
    }
    setAddressError(null)
    setStep("recap")
  }

  const sendProRequest = () => {
    if (!prestation || !selectedAddress || !family) {
      setAddressError("Votre demande est incomplète. Revenez aux étapes précédentes.")
      return
    }
    setAddressError(null)
    startProSubmit(async () => {
      const result = await submitProfessionalBenneRequest({
        audience: "professionnel",
        companyName: companyName.trim(),
        contactName: proContactName.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        siret: siret.trim() || undefined,
        address: selectedAddress.label,
        addressLabel: selectedAddress.label,
        postcode: selectedAddress.postcode,
        departementCode: selectedAddress.departementCode,
        prestationId: prestation.id,
        wasteFamily: family,
        deliveryDate,
        pickupDate: pickupDate || undefined,
      })
      if ("error" in result) {
        setAddressError(result.error)
        return
      }
      setProReference(result.reference)
      setProClientEmailSent(result.clientEmailSent)
      setProRequestSent(true)
    })
  }

  const contactName =
    audience === "professionnel"
      ? proContactName.trim()
      : [contactFirstName.trim(), contactLastName.trim()].filter(Boolean).join(" ")

  const steps = getOrderTunnelSteps(audience)
  const currentStepIdx = steps.findIndex((s) => s.id === step)

  useEffect(() => {
    if (!open) return
    onStepIndexChange?.(currentStepIdx)
  }, [currentStepIdx, onStepIndexChange, open])

  useEffect(() => {
    onAudienceChange?.(audience)
  }, [audience, onAudienceChange])

  useEffect(() => {
    if (sessionAudience.loading || entryMode === "pro-reorder") return
    if (!audienceLocked || !sessionAudience.audience) return
    if (audience === sessionAudience.audience) return
    setAudience(sessionAudience.audience)
    patchDraft({ audience: sessionAudience.audience })
  }, [
    sessionAudience.loading,
    sessionAudience.audience,
    audienceLocked,
    entryMode,
    audience,
    patchDraft,
  ])

  useEffect(() => {
    if (audience !== "professionnel") {
      setProCompte(null)
      setProCompteLoading(false)
      setProSessionUserId(null)
      return
    }

    let cancelled = false
    const supabase = createClient()

    const loadProCompte = () => {
      if (cancelled) return
      setProCompteLoading(true)
      void supabase.auth.getUser().then(({ data: { user } }) => {
        if (cancelled) return
        if (!user) {
          setProCompte(null)
          setProSessionUserId(null)
          setProCompteLoading(false)
          return
        }
        setProSessionUserId(user.id)
        void supabase
          .from("comptes_pro")
          .select("status, payment_mode")
          .eq("profile_id", user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (cancelled) return
            setProCompte(
              data
                ? { status: data.status, payment_mode: data.payment_mode }
                : null
            )
            setProCompteLoading(false)
          })
      })
    }

    loadProCompte()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadProCompte()
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [audience])

  useEffect(() => {
    if (entryMode !== "pro-reorder" || !proReorderSeed || !embedded || !open) return
    const prestation = prestationById(proReorderSeed.prestationId)
    if (!prestation) return

    setAudience("professionnel")
    setAddress(proReorderSeed.addressLabel)
    setCompanyName(proReorderSeed.companyName)
    setProContactName(proReorderSeed.proContactName)
    setContactPhone(proReorderSeed.contactPhone)
    setContactEmail(proReorderSeed.contactEmail)
    setSiret(proReorderSeed.siret ?? "")
    setSelectedPrestationId(proReorderSeed.prestationId)
    setFamily(prestation.family)
    if (proReorderSeed.deliveryDate) setDeliveryDate(proReorderSeed.deliveryDate)
    if (proReorderSeed.pickupDate) setPickupDate(proReorderSeed.pickupDate)

    if (draft.selectedAddress) {
      setSelectedAddress(draft.selectedAddress)
      setStep("recap")
      proReorderBootstrapped.current = true
    } else if (!proReorderBootstrapped.current) {
      setStep("intent")
      setIntentPhase("location")
      setAfterLocationTarget("waste")
    }
  }, [
    entryMode,
    proReorderSeed,
    embedded,
    open,
    draft.selectedAddress,
  ])

  useEffect(() => {
    if (!embedded) return
    if (entryMode === "pro-reorder") return
    if (open && !modalWasOpen.current) {
      applyDraft(draft)
      setAddressError(null)
      setDraftCommandeId(null)
      setProRequestSent(false)
      setProReference(null)
      setProClientEmailSent(false)
      setAfterLocationTarget("waste")

      if (
        intentStart === "estimator" &&
        draft.volumeHintM3 != null &&
        draft.particulierWasteId
      ) {
        if (draft.selectedAddress) {
          setStep("forfait")
          setIntentPhase("volume")
        } else {
          setStep("intent")
          setAfterLocationTarget("forfait")
          setIntentPhase("location")
        }
      } else {
        setStep("intent")
        const phase = resolveIntentPhase()
        setIntentPhase(phase === "volume" ? "volume" : phase)
      }
    }
    modalWasOpen.current = open
  }, [open, embedded, intentStart, draft, resolveIntentPhase])

  useEffect(() => {
    if (!embedded || !open) return
    patchDraft({ audience, address, selectedAddress })
  }, [embedded, open, audience, address, selectedAddress, patchDraft])

  useEffect(() => {
    if (step !== "infos") return

    scrollContainerRef?.current?.scrollTo({ top: 0, behavior: "auto" })

    const minDate = minDeliveryDateISO()
    setDeliveryDate((current) => (current.length && current < minDate ? "" : current))
    setPickupDate((current) => {
      if (!current.length) return current
      const deliveryMin =
        deliveryDate.length && deliveryDate >= minDate ? deliveryDate : minDate
      return current < deliveryMin ? "" : current
    })

    const active = document.activeElement
    if (
      active instanceof HTMLElement &&
      (active.id === "order-contact-firstname" || active.id === "order-company-name")
    ) {
      active.blur()
    }
    // Entrée étape infos uniquement (pas à chaque changement de date).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliveryDate/pickupDate lus à l’entrée
  }, [step, scrollContainerRef])

  return (
    <Card
      className={cn(
        "relative mx-auto w-full",
        embedded
          ? "max-w-none min-w-0 overflow-x-hidden border-0 bg-transparent shadow-none ring-0"
          : "overflow-hidden max-w-xl border-white/70 bg-card/95 shadow-[0_22px_70px_-32px_color-mix(in_srgb,var(--brand-navy)_38%,transparent)] ring-1 ring-primary/15 backdrop-blur-sm"
      )}
    >
      {!embedded ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-brand-navy/[0.05]" />
      ) : null}

      <CardContent
        className={cn(
          "relative space-y-3",
          embedded ? "order-tunnel-form min-w-0 px-0 pb-0 pt-0" : "pt-8"
        )}
      >
        {!embedded ? (
          <OrderStepProgress currentStepIdx={currentStepIdx} steps={steps} />
        ) : null}

        {step === "payment" && prestation && selectedAddress ? (
          <div className="space-y-4">
              {audience === "professionnel" ? (
                proCompteLoading ? (
                  <div className="order-tunnel-card flex min-h-[140px] flex-col items-center justify-center gap-2 px-4 py-6 text-center">
                    <Loader2 className="size-8 animate-spin text-brand-green" aria-hidden />
                    <p className="text-sm text-brand-navy">Vérification de votre compte…</p>
                  </div>
                ) : proRequestSent ? (
                  <div className="order-tunnel-card space-y-4 px-4 py-5 text-center">
                    <h3 className="text-[18px] font-semibold leading-tight text-brand-navy sm:text-[20px]">
                      Demande envoyée
                    </h3>
                    <p className="text-[13px] leading-relaxed text-brand-navy/80 sm:text-sm">
                      Votre demande a bien été transmise à CORE Environnement. Un expert
                      vous recontactera prochainement pour la confirmer.
                    </p>
                    {proClientEmailSent ? (
                      <p className="text-[13px] text-brand-navy/70">
                        Un e-mail récapitulatif vient de vous être envoyé.
                      </p>
                    ) : null}
                    {proReference ? (
                      <p className="font-mono text-sm font-semibold tracking-wide text-brand-navy">
                        {proReference}
                      </p>
                    ) : null}
                    {onClose ? (
                      <Button
                        type="button"
                        className="h-11 w-full rounded-xl text-base font-semibold shadow-lg"
                        onClick={onClose}
                      >
                        Fermer
                      </Button>
                    ) : null}
                  </div>
                ) : proCompte?.status === "approved" &&
                  proCompte.payment_mode === "cb_required" ? (
                  proSessionUserId ? (
                    <EmbeddedCheckout
                      existingCommandeId={draftCommandeId ?? undefined}
                      deliveryDate={deliveryDate}
                      onCommandeId={setDraftCommandeId}
                      onBack={() => setStep("recap")}
                      onClose={onClose}
                      input={{
                        audience: "professionnel",
                        address: selectedAddress.label,
                        lat: selectedAddress.lat,
                        lng: selectedAddress.lng,
                        addressLabel: selectedAddress.label,
                        postcode: selectedAddress.postcode,
                        departementCode: selectedAddress.departementCode,
                        prestationId: prestation.id,
                        deliveryDate,
                        pickupDate: pickupDate || undefined,
                        contactEmail: contactEmail.trim(),
                        companyName: companyName.trim(),
                        contactName: proContactName.trim() || undefined,
                        contactPhone: contactPhone.trim() || undefined,
                      }}
                    />
                  ) : (
                    <div className="order-tunnel-card space-y-3 px-4 py-5 text-center">
                      <p className="text-sm font-medium text-brand-navy">
                        Connectez-vous pour payer par carte
                      </p>
                      <p className="text-[13px] leading-relaxed text-brand-navy/80">
                        Votre entreprise est en paiement par carte. Connectez-vous avec le
                        compte associé à votre dossier professionnel, puis reprenez la
                        commande.
                      </p>
                      <Link
                        href="/login"
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90"
                      >
                        Se connecter
                      </Link>
                      <Button
                        variant="outline"
                        type="button"
                        className={cn(orderOutlineBtn(embedded), "h-10 w-full")}
                        onClick={() => setStep("recap")}
                      >
                        <ArrowLeft className="mr-2 size-4" />
                        Retour
                      </Button>
                    </div>
                  )
                ) : (
                <div className="space-y-4">
                  <div className="order-tunnel-card bg-gradient-to-br from-brand-warm-field via-brand-warm-field to-brand-warm px-4 py-4">
                    <p className="text-[15px] font-semibold text-brand-navy">
                      Compte pro et suivi en ligne
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-brand-navy/80">
                      Pour le suivi digital de vos chantiers, ouvrez un compte sur{" "}
                      <a href="/pro" className="font-medium text-brand-green underline-offset-2 hover:underline">
                        /pro
                      </a>
                      . Vous pouvez aussi envoyer une demande ponctuelle ci-dessous : un
                      membre de l&apos;équipe vous recontactera pour la confirmer.
                    </p>
                  </div>
                  {addressError ? (
                    <p className="text-center text-xs font-medium text-amber-800">
                      {addressError}
                    </p>
                  ) : null}
                  <CheckoutReassuranceBanner variant="professionnel" />
                  <Button
                    type="button"
                    className="h-11 w-full rounded-xl text-base font-semibold shadow-lg"
                    disabled={isSubmittingPro}
                    onClick={sendProRequest}
                  >
                    {isSubmittingPro ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Envoi en cours…
                      </>
                    ) : (
                      "Envoyer ma demande de benne"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(orderOutlineBtn(embedded), "h-10 w-full")}
                    disabled={isSubmittingPro}
                    onClick={() => setStep("recap")}
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Retour
                  </Button>
                </div>
                )
              ) : (
                <EmbeddedCheckout
                  existingCommandeId={draftCommandeId ?? undefined}
                  deliveryDate={deliveryDate}
                  onCommandeId={setDraftCommandeId}
                  onBack={() => setStep("recap")}
                  onClose={onClose}
                  input={{
                    audience,
                    address: selectedAddress.label,
                    lat: selectedAddress.lat,
                    lng: selectedAddress.lng,
                    addressLabel: selectedAddress.label,
                    postcode: selectedAddress.postcode,
                    departementCode: selectedAddress.departementCode,
                    prestationId: prestation.id,
                    deliveryDate,
                    pickupDate: pickupDate || undefined,
                    contactEmail: contactEmail.trim(),
                    contactName: contactName.trim() || undefined,
                    contactPhone: contactPhone.trim() || undefined,
                  }}
                />
              )}
          </div>
        ) : (
        <AnimatePresence mode="wait">
          {step === "intent" && intentPhase === "location" && (
            <motion.div
              key="intent-location"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className={cn(embedded ? "" : "space-y-4")}
            >
              <div
                className={cn(
                  embedded ? "space-y-4 sm:space-y-5" : "space-y-4"
                )}
              >
                {audienceLocked ? (
                  <p className="rounded-xl border border-[#35A238]/15 bg-[#ECF4E9]/80 px-3 py-2 text-[13px] font-medium text-brand-navy">
                    {audience === "professionnel"
                      ? "Commande en tant que professionnel"
                      : "Commande en tant que particulier"}
                  </p>
                ) : (
                  <OrderAudienceToggle
                    audience={audience}
                    onChange={handleAudienceChange}
                    subdued={embedded}
                  />
                )}

                <div className="space-y-2.5">
                    <p className={ORDER_SECTION_LABEL}>Où livrer votre benne&nbsp;?</p>
                    <div className="space-y-2">
                      <label htmlFor="order-address" className="sr-only">
                        Adresse de livraison
                      </label>
                      <AddressAutocomplete
                        id="order-address"
                        value={address}
                        selected={selectedAddress}
                        onValueChange={(next) => {
                          setAddress(next)
                          setAddressError(null)
                        }}
                        onSelect={handleAddressSelect}
                        onClearSelection={clearAddressSelection}
                        aria-invalid={addressError !== null && !selectedAddress}
                      inputClassName="h-12 rounded-xl"
                      warmSurface={embedded}
                      />
                      <p className={ORDER_HELP_TEXT}>
                        <Info className="mt-0.5 size-3.5 shrink-0 opacity-55" aria-hidden />
                        <span>
                        Saisissez votre adresse en Île-de-France et choisissez une
                        suggestion.
                        </span>
                      </p>
                  </div>
                </div>

                <AnimatePresence>
                  {address.trim().length >= 3 && !selectedAddress && !addressError && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/95 to-white p-3 text-left text-xs text-amber-950"
                    >
                      <div className="flex gap-2">
                        <MapPinOff className="size-4 shrink-0 text-amber-700" aria-hidden />
                        <p>
                          Choisissez une adresse dans la liste pour confirmer la zone
                          d’intervention (75, 77, 78, 91, 92, 93, 94, 95).
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {addressError ? (
                  <p className="text-center text-xs font-medium text-amber-800">
                    {addressError}
                  </p>
                ) : null}

                <Button
                  type="button"
                  className="mt-0.5 h-11 w-full rounded-xl border-0 bg-[#35A238] px-4 text-base font-semibold text-white shadow-lg shadow-[#35A238]/25 hover:bg-[#19752B]"
                  onClick={advanceFromLocation}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span>Continuer</span>
                    <ChevronRight className="size-4 shrink-0" aria-hidden />
                  </span>
                </Button>
              </div>
            </motion.div>
          )}

          {step === "intent" && intentPhase === "waste" && (
            <motion.div
              key="intent-waste"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className={cn(embedded ? "" : "space-y-4")}
            >
              <div
                className={cn(
                  embedded ? "space-y-4 sm:space-y-5" : "space-y-4"
                )}
              >
                {audience === "particulier" ? (
                  <>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        aria-label="Retour à l’adresse de livraison"
                        className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-brand-green/35 bg-white text-brand-navy shadow-sm transition-colors hover:border-brand-green hover:bg-brand-warm-field"
                        onClick={() => {
                          setAddressError(null)
                          setIntentPhase("location")
                        }}
                      >
                        <ArrowLeft className="size-[18px] text-brand-green" aria-hidden />
                      </button>
                      <h3 className="text-[17px] font-bold leading-snug text-brand-navy sm:text-[18px]">
                        Que souhaitez-vous jeter ?
                      </h3>
                    </div>

                    <ParticulierWastePicker
                      value={particulierWasteId}
                      onChange={(id) => {
                        setParticulierWasteId(id)
                        const mapped = particulierWasteOptionById(id)
                        if (mapped) setFamily(mapped.family)
                        setSelectedPrestationId(null)
                        setAddressError(null)
                      }}
                    />
                    <p className="text-center">
                      <button
                        type="button"
                        disabled={!particulierWasteId}
                        className="text-[13px] font-medium text-brand-navy underline underline-offset-2 transition-colors hover:text-brand-green disabled:cursor-not-allowed disabled:text-brand-muted disabled:no-underline sm:text-[14px]"
                        onClick={() =>
                          goToIntentVolume({ estimateOnly: true })
                        }
                      >
                        Je ne sais pas quelle benne choisir
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    {selectedAddress ? (
                      <div
                        className={cn(
                          embedded
                            ? ORDER_TUNNEL_CARD
                            : "rounded-xl border border-primary/12 bg-white/95",
                          "flex items-start gap-2.5 px-3.5 py-3"
                        )}
                      >
                        <MapPin
                          className="mt-0.5 size-4 shrink-0 text-brand-green"
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-muted">
                            Livraison
                          </p>
                          <p className="mt-0.5 text-[13px] font-medium leading-snug text-brand-navy sm:text-sm">
                            {selectedAddress.label}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-brand-green hover:text-[#19752B]"
                          onClick={() => {
                            setAddressError(null)
                            setIntentPhase("location")
                          }}
                        >
                          <Pencil className="size-3.5" aria-hidden />
                          Modifier
                        </button>
                      </div>
                    ) : null}

                    <div className="relative z-30 space-y-2.5">
                      <p className={ORDER_SECTION_LABEL}>Type de déchet</p>
                      <WasteFamilySelect
                        family={family}
                        embedded={embedded}
                        onSelectFamily={(fid) => {
                          setFamily(fid)
                          setAddressError(null)
                        }}
                      />
                    </div>
                  </>
                )}

                {addressError ? (
                  <p className="text-center text-xs font-medium text-amber-800">
                    {addressError}
                  </p>
                ) : null}

                {audience === "particulier" ? (
                  <div
                    className={cn(
                      embedded &&
                        "sticky bottom-0 z-20 -mx-4 border-t border-primary/10 bg-gradient-to-t from-brand-warm via-brand-warm/95 to-brand-warm/80 px-4 pb-1 pt-3 sm:-mx-6 sm:px-6"
                    )}
                  >
                    <OrderTunnelContinueButton
                      onClick={goToIntentVolume}
                      disabled={!canLeaveIntentWaste}
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      embedded &&
                        "sticky bottom-0 z-20 -mx-4 border-t border-primary/10 bg-gradient-to-t from-brand-warm via-brand-warm/95 to-brand-warm/80 px-4 pb-1 pt-3 sm:-mx-6 sm:px-6"
                    )}
                  >
                    <OrderTunnelContinueButton
                      onClick={goToIntentVolume}
                      disabled={!canLeaveIntentWaste}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === "intent" &&
            intentPhase === "volume" &&
            family &&
            (audience === "particulier" ? particulierWasteId : true) ? (
            <motion.div
              key="intent-volume"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
            >
              <ParticulierVolumeStep
                embedded={embedded}
                audience={audience}
                family={family}
                wasteId={
                  audience === "particulier" ? particulierWasteId : null
                }
                addressPending={!zoneOk}
                estimateOnly={
                  audience === "particulier" && volumeEstimateOnly
                }
                onBackToWaste={() => {
                  setAddressError(null)
                  setVolumeEstimateOnly(false)
                  setIntentPhase("waste")
                }}
                onContinue={(volumeM3, volumeOrigin) =>
                  goToForfait(volumeM3, volumeOrigin)
                }
              />
            </motion.div>
          ) : null}

          {step === "forfait" && family && (
            <motion.div
              key="forfait"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className="min-w-0 space-y-3.5"
            >
              <div className="min-w-0">
                <p className={ORDER_SECTION_LABEL}>
                  {audience === "particulier" ? "Choisissez votre benne" : "Choisissez votre forfait"}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  {audience === "particulier"
                    ? "Comparez les volumes et les tarifs TTC. Le poids compris dans le tarif est précisé pour chaque benne."
                    : "Prix H.T. Détail des déchets acceptés par forfait."}
                </p>
                {audience === "particulier" ? (
                  <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                    Ne dépassez pas le bord de la benne. Au-delà du poids
                    inclus, le supplément par tonne est indiqué sur chaque
                    offre.
                  </p>
                ) : null}
                {volumeHintM3 && audience === "particulier" ? (
                  <div className="mt-2 space-y-1.5 rounded-lg border border-primary/12 bg-brand-warm-field/80 px-3 py-2.5">
                    <p className="text-[12px] leading-snug text-brand-navy">
                      {volumeHintOrigin === "estimated" ? (
                        <>
                          Votre volume estimé :{" "}
                          <strong className="tabular-nums">
                            {volumeHintM3} m³
                          </strong>
                        </>
                      ) : volumeHintOrigin === "chosen" ? (
                        <>
                          Votre volume choisi :{" "}
                          <strong className="tabular-nums">
                            {volumeHintM3} m³
                          </strong>
                        </>
                      ) : (
                        <>
                          Volume indiqué pour votre projet :{" "}
                          <strong className="tabular-nums">
                            {volumeHintM3} m³
                          </strong>
                        </>
                      )}
                    </p>
                    <p className="text-[11px] leading-snug text-brand-muted">
                      Le poids des déchets compte aussi dans le choix de votre
                      benne.
                    </p>
                  </div>
                ) : volumeHintM3 ? (
                  <p className="mt-2 rounded-lg border border-primary/12 bg-brand-warm-field/80 px-3 py-2 text-[12px] leading-snug text-brand-navy">
                    Indication volume :{" "}
                    <strong>{volumeHintM3} m³</strong> (estimation ou choix
                    personnel, sans garantie).
                  </p>
                ) : null}
              </div>

              {addressError && (
                <p className="text-center text-xs font-medium text-amber-800">
                  {addressError}
                </p>
              )}

              <div
                className={cn(
                  "grid min-w-0 gap-3 py-0.5",
                  embedded
                    ? ""
                    : "max-h-[min(60vh,420px)] overflow-y-auto pr-1 sm:max-h-[min(70vh,520px)]"
                )}
              >
                {filteredPrestations.map((p, i) => (
                  <PrestationCard
                    key={p.id}
                    prestation={p}
                    selected={selectedPrestationId === p.id}
                    recommended={
                      volumeHintM3 !== null && p.volumeM3 === volumeHintM3
                    }
                    onSelect={() => setSelectedPrestationId(p.id)}
                    delay={prefersReducedMotion ? 0 : i * 0.04}
                    t={t}
                    showTtc={audience === "particulier"}
                    warmSurface={embedded}
                  />
                ))}
              </div>

              <div className="space-y-2 pt-0.5">
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      orderOutlineBtn(embedded),
                      "border-primary/20 bg-transparent font-medium text-brand-muted hover:bg-primary/5 hover:text-brand-navy sm:flex-1",
                      embedded && "order-tunnel-outline-btn"
                    )}
                    onClick={() => {
                      setAddressError(null)
                      setStep("intent")
                      setIntentPhase("volume")
                    }}
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Retour
                  </Button>
                  <Button
                    type="button"
                    className="h-11 w-full rounded-xl border-0 bg-[#35A238] px-3 text-sm font-semibold text-white shadow-lg shadow-[#35A238]/20 hover:bg-[#19752B] disabled:pointer-events-none disabled:bg-[#D0D5DD] disabled:text-white disabled:opacity-100 disabled:shadow-none sm:flex-1"
                    disabled={!selectedPrestationId}
                    onClick={goToInfos}
                  >
                    {audience === "particulier"
                      ? "Continuer avec cette benne"
                      : "Continuer avec ce forfait"}
                    <ChevronRight className="ml-2 size-4" />
                  </Button>
                </div>
                {audience === "particulier" ? (
                  <p className="text-center text-[11px] leading-snug text-brand-muted">
                    Vous choisirez ensuite vos dates et renseignerez vos
                    coordonnées.
                  </p>
                ) : null}
              </div>
            </motion.div>
          )}

          {step === "infos" && (
            <motion.div
              key="infos"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className="space-y-4"
            >
              <div className="space-y-2.5">
                <p className={ORDER_SECTION_LABEL}>
                  Organisons la livraison de votre benne
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <p
                      id="order-delivery-date-label"
                      className="text-xs font-semibold text-brand-navy"
                    >
                      Date de livraison&nbsp;*
                    </p>
                    <OrderDateField
                      ref={deliveryDateRef}
                      id="order-delivery-date"
                      min={minDeliveryDateISO()}
                      value={deliveryDate}
                      invalid={deliveryDateError !== null}
                      warmSurface={embedded}
                      placeholder="Choisir la date de livraison"
                      onBeforeMin={() => {
                        setDeliveryDateError(DELIVERY_DATE_INVALID_MESSAGE)
                      }}
                      onChange={(next) => {
                        if (next.length && !isValidDeliveryDate(next)) {
                          setDeliveryDateError(DELIVERY_DATE_INVALID_MESSAGE)
                          return
                        }
                        setDeliveryDate(next)
                        setDeliveryDateError(null)
                        setAddressError(null)
                        if (
                          pickupDate.length &&
                          next.length &&
                          pickupDate < next
                        ) {
                          setPickupDate("")
                        }
                      }}
                    />
                    <p className={ORDER_HELP_TEXT}>
                      <Info className="mt-0.5 size-3.5 shrink-0 opacity-55" aria-hidden />
                      <span>
                        Choisissez la date qui vous convient parmi les disponibilités
                        proposées, à partir du lendemain.
                      </span>
                    </p>
                    {deliveryDateError ? (
                      <p className="text-xs font-medium text-amber-800">
                        {deliveryDateError}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-1.5">
                    <p
                      id="order-pickup-date-label"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Date d’enlèvement&nbsp;— facultative
                    </p>
                    <OrderDateField
                      id="order-pickup-date"
                      min={
                        deliveryDate.length && isValidDeliveryDate(deliveryDate)
                          ? deliveryDate
                          : minDeliveryDateISO()
                      }
                      value={pickupDate}
                      warmSurface={embedded}
                      placeholder="Choisir une date d’enlèvement"
                      optionalHint="Optionnel"
                      onChange={(next) => {
                        const pickupMin =
                          deliveryDate.length && isValidDeliveryDate(deliveryDate)
                            ? deliveryDate
                            : minDeliveryDateISO()
                        if (next.length && next < pickupMin) {
                          setAddressError(
                            deliveryDate.length && isValidDeliveryDate(deliveryDate)
                              ? "La date d'enlèvement ne peut pas être antérieure à la date de livraison."
                              : DELIVERY_DATE_INVALID_MESSAGE
                          )
                          return
                        }
                        setPickupDate(next)
                        setAddressError(null)
                      }}
                    />
                    <p className={ORDER_HELP_TEXT}>
                      <Info className="mt-0.5 size-3.5 shrink-0 opacity-55" aria-hidden />
                      <span>
                        À compléter si vous connaissez déjà la date souhaitée.
                      </span>
                    </p>
                    {pickupDate ? (
                      <button
                        type="button"
                        onClick={() => setPickupDate("")}
                        className="ml-auto block rounded-md px-1 py-0.5 text-[11px] font-medium text-brand-muted underline-offset-2 transition-colors hover:text-brand-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        Supprimer la date
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <p className={ORDER_SECTION_LABEL}>
                    {audience === "professionnel"
                      ? "Votre entreprise"
                      : "Vos coordonnées pour préparer la livraison"}
                  </p>
                  <p className={ORDER_HELP_TEXT}>
                    <span>
                      {audience === "professionnel"
                        ? "Ces informations nous permettent de confirmer votre demande et de vous contacter pour organiser la livraison."
                        : "Ces informations nous permettent de confirmer votre commande et de vous contacter pour organiser la livraison."}
                    </span>
                  </p>
                </div>
                {audience === "professionnel" ? (
                  <>
                    <div className="space-y-1.5">
                      <label htmlFor="order-company-name" className="text-xs font-semibold text-brand-navy">
                        Nom de l’entreprise&nbsp;*
                      </label>
                      <Input
                        id="order-company-name"
                        autoComplete="organization"
                        value={companyName}
                        onChange={(e) => {
                          setCompanyName(e.target.value)
                          setAddressError(null)
                        }}
                        className={cn(
                        "h-11 rounded-xl border-2 border-primary/15 px-3",
                        orderFieldBg(embedded)
                      )}
                      />
                </div>
                    <div className="space-y-1.5">
                      <label htmlFor="order-pro-contact" className="text-xs font-semibold text-brand-navy">
                        Nom et prénom du contact&nbsp;*
                      </label>
                      <Input
                        id="order-pro-contact"
                        autoComplete="name"
                        value={proContactName}
                        onChange={(e) => {
                          setProContactName(e.target.value)
                          setAddressError(null)
                        }}
                        className={cn(
                        "h-11 rounded-xl border-2 border-primary/15 px-3",
                        orderFieldBg(embedded)
                      )}
                      />
                    </div>
                  </>
                ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="order-contact-firstname" className="text-xs font-semibold text-brand-navy">
                      Prénom&nbsp;*
                    </label>
                    <Input
                      id="order-contact-firstname"
                      autoComplete="given-name"
                      value={contactFirstName}
                      onChange={(e) => {
                        setContactFirstName(e.target.value)
                        setAddressError(null)
                      }}
                      className={cn(
                        "h-11 rounded-xl border-2 border-primary/15 px-3",
                        orderFieldBg(embedded)
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="order-contact-lastname" className="text-xs font-semibold text-brand-navy">
                      Nom&nbsp;*
                    </label>
                    <Input
                      id="order-contact-lastname"
                      autoComplete="family-name"
                      value={contactLastName}
                      onChange={(e) => {
                        setContactLastName(e.target.value)
                        setAddressError(null)
                      }}
                      className={cn(
                        "h-11 rounded-xl border-2 border-primary/15 px-3",
                        orderFieldBg(embedded)
                      )}
                    />
                  </div>
                </div>
                )}
                <div className="space-y-1.5">
                  <label htmlFor="order-contact-phone" className="text-xs font-semibold text-brand-navy">
                    Téléphone&nbsp;*
                  </label>
                  <Input
                    id="order-contact-phone"
                    type="tel"
                    autoComplete="tel"
                    value={contactPhone}
                    onChange={(e) => {
                      setContactPhone(e.target.value)
                      setAddressError(null)
                    }}
                    className={cn(
                      "h-11 rounded-xl border-2 border-primary/15 px-3",
                      orderFieldBg(embedded)
                    )}
                  />
                  <p className={ORDER_HELP_TEXT}>
                    <Info className="mt-0.5 size-3.5 shrink-0 opacity-55" aria-hidden />
                    <span>
                      Pour vous joindre si une précision est nécessaire avant la livraison.
                    </span>
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="order-contact-email" className="text-xs font-semibold text-brand-navy">
                    Adresse e-mail&nbsp;*
                    </label>
                    <Input
                      id="order-contact-email"
                      type="email"
                      autoComplete="email"
                      value={contactEmail}
                      onChange={(e) => {
                        setContactEmail(e.target.value)
                      setAddressError(null)
                    }}
                    className={cn(
                      "h-11 rounded-xl border-2 border-primary/15 px-3",
                      orderFieldBg(embedded)
                    )}
                    />
                  <p className={ORDER_HELP_TEXT}>
                    <Info className="mt-0.5 size-3.5 shrink-0 opacity-55" aria-hidden />
                    <span>
                      {audience === "professionnel"
                        ? "Pour recevoir la confirmation de votre demande."
                        : "Pour recevoir la confirmation de votre commande."}
                    </span>
                  </p>
                  </div>
                {audience === "professionnel" ? (
                  <div className="space-y-1.5">
                    <label htmlFor="order-siret" className="text-xs font-medium text-muted-foreground">
                      SIRET (optionnel)
                    </label>
                    <Input
                      id="order-siret"
                      inputMode="numeric"
                      autoComplete="off"
                      value={siret}
                      onChange={(e) => {
                        setSiret(e.target.value)
                        setAddressError(null)
                      }}
                      className={cn(
                        "h-11 rounded-xl border-2 border-primary/15 px-3",
                        orderFieldBg(embedded)
                      )}
                    />
                  </div>
                ) : null}
                </div>

              {addressError && (
                <p className="text-center text-xs font-medium text-amber-800">
                  {addressError}
                </p>
              )}

              <div className="space-y-2 pt-0.5">
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(orderOutlineBtn(embedded), "sm:flex-1")}
                    onClick={() => {
                      setAddressError(null)
                      setStep("forfait")
                    }}
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Retour
                  </Button>
                  <Button
                    type="button"
                    className="h-11 rounded-xl text-base font-semibold shadow-lg sm:flex-1"
                    onClick={goToPayment}
                  >
                    {audience === "professionnel"
                      ? "Vérifier ma demande"
                      : "Vérifier ma commande"}
                    <ChevronRight className="ml-2 size-4" />
                  </Button>
                </div>
                <p className="text-center text-[11px] leading-snug text-brand-muted sm:text-[12px]">
                  {audience === "professionnel"
                    ? "Vous pourrez vérifier les détails avant d’envoyer votre demande."
                    : "Vous pourrez vérifier les détails avant de passer au paiement."}
                </p>
              </div>
            </motion.div>
          )}

          {step === "recap" && prestation && selectedAddress && (
            <motion.div
              key="recap"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className="space-y-3"
            >
              {audience === "particulier" ? (
                <div className="space-y-1">
                  <p className={ORDER_SECTION_LABEL}>
                    Un dernier coup d&apos;œil avant le paiement
                  </p>
                  <p className={ORDER_HELP_TEXT}>
                    <span>
                      Retrouvez les détails de votre commande et ajustez-les si besoin
                      avant de continuer.
                    </span>
                  </p>
                </div>
              ) : (
                <p className={ORDER_SECTION_LABEL}>Vérifiez votre demande</p>
              )}

              {audience === "professionnel" ? (
                <section
                  className={cn(
                    embedded ? ORDER_TUNNEL_CARD : "rounded-2xl border border-primary/10 bg-white/95",
                    "px-4 py-3"
                  )}
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Entreprise
                    </h3>
                    <button
                      type="button"
                      className="text-[11px] font-medium text-primary/70 hover:text-primary hover:underline"
                      onClick={() => setStep("infos")}
                    >
                      Modifier
                    </button>
                  </div>
                  <ul className="space-y-1.5 text-sm">
                    <li>
                      <span className="text-muted-foreground">Société : </span>
                      <span className="font-medium text-brand-navy">{companyName.trim()}</span>
                    </li>
                    <li>
                      <span className="text-muted-foreground">Contact : </span>
                      <span className="font-medium text-brand-navy">{proContactName.trim()}</span>
                    </li>
                    <li className="text-brand-navy">{contactPhone}</li>
                    <li className="text-brand-navy">{contactEmail.trim()}</li>
                    {siret.replace(/\s/g, "") ? (
                      <li>
                        <span className="text-muted-foreground">SIRET : </span>
                        <span className="font-medium text-brand-navy">{siret.trim()}</span>
                      </li>
                    ) : null}
                  </ul>
                </section>
              ) : null}

              <section
                className={cn(
                  embedded ? ORDER_TUNNEL_CARD : "rounded-2xl border border-primary/10 bg-white/95",
                  "px-4 py-3"
                )}
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {audience === "professionnel" ? "Demande" : "La benne choisie"}
                  </h3>
                  <button
                    type="button"
                    className="text-[11px] font-medium text-primary/70 hover:text-primary hover:underline"
                    onClick={() => setStep("forfait")}
                  >
                    {audience === "particulier" ? "Modifier la benne" : "Modifier"}
                  </button>
                </div>
                <p className="font-medium text-brand-navy">{prestation.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {audience === "particulier"
                    ? `${prestation.volumeM3} m³`
                    : `${systemLabel(prestation.system)}, ${prestation.volumeM3} m³`}
                </p>
              </section>

              <section
                className={cn(
                  embedded ? ORDER_TUNNEL_CARD : "rounded-2xl border border-primary/10 bg-white/95",
                  "px-4 py-3"
                )}
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {audience === "particulier"
                      ? "Livraison et enlèvement"
                      : "Livraison"}
                  </h3>
                  <button
                    type="button"
                    className="text-[11px] font-medium text-primary/70 hover:text-primary hover:underline"
                    onClick={() => {
                      setStep("intent")
                      setIntentPhase("waste")
                    }}
                  >
                    Modifier
                  </button>
                </div>
                <ul className="space-y-1.5 text-sm">
                  <li>
                    <span className="text-muted-foreground">
                      {audience === "particulier"
                        ? "Adresse de livraison : "
                        : "Adresse : "}
                    </span>
                    <span className="font-medium text-brand-navy">{selectedAddress.label}</span>
                  </li>
                  {family ? (
                    <li>
                      <span className="text-muted-foreground">
                        {audience === "particulier"
                          ? "Déchets à évacuer : "
                          : "Déchets : "}
                      </span>
                      <span className="font-medium text-brand-navy">
                        {FAMILY_LABELS[family].title}
                      </span>
                    </li>
                ) : null}
                  <li>
                    <span className="text-muted-foreground">
                      {audience === "particulier"
                        ? "Date de livraison : "
                        : "Livraison : "}
                    </span>
                    <span className="font-medium text-brand-navy">
                      {formatOrderDatePicker(deliveryDate)}
                    </span>
                  </li>
                  {pickupDate ? (
                    <li>
                      <span className="text-muted-foreground">
                        {audience === "particulier"
                          ? "Date d’enlèvement : "
                          : "Enlèvement : "}
                      </span>
                      <span className="font-medium text-brand-navy">
                        {formatOrderDatePicker(pickupDate)}
                      </span>
                    </li>
                  ) : null}
                </ul>
                <button
                  type="button"
                  className="mt-1.5 text-[11px] font-medium text-primary/70 hover:text-primary hover:underline"
                  onClick={() => setStep("infos")}
                >
                  Modifier les dates
                </button>
              </section>

              {audience === "particulier" ? (
              <section
                className={cn(
                  embedded ? ORDER_TUNNEL_CARD : "rounded-2xl border border-primary/10 bg-white/95",
                  "px-4 py-3"
                )}
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Vos coordonnées
                  </h3>
                  <button
                    type="button"
                    className="text-[11px] font-medium text-primary/70 hover:text-primary hover:underline"
                    onClick={() => setStep("infos")}
                  >
                    Modifier mes coordonnées
                  </button>
                </div>
                <ul className="space-y-1.5 text-sm">
                  <li className="font-medium text-brand-navy">{contactName}</li>
                  <li className="text-brand-navy">{contactPhone}</li>
                  <li className="text-brand-navy">{contactEmail.trim()}</li>
                </ul>
              </section>
              ) : null}

              {audience === "particulier" ? (
              <section
                className={cn(
                  embedded ? ORDER_TUNNEL_CARD : "rounded-2xl border border-primary/10 bg-white/95",
                  "px-4 py-3"
                )}
              >
                {(() => {
                  const breakdown = priceBreakdownFromHt(prestation.priceHt)
                  return (
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Total de votre commande
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          dont TVA {fmtHt(breakdown.tva)}
                        </p>
                      </div>
                      <p className="text-xl font-semibold tabular-nums text-primary">
                        {fmtHt(breakdown.ttc)}
                      </p>
                    </div>
                  )
                })()}
              </section>
              ) : null}

              {audience === "particulier" ? (
                <div className="space-y-2 pt-0.5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(orderOutlineBtn(embedded), "sm:flex-1")}
                      onClick={() => setStep("infos")}
                    >
                      <ArrowLeft className="mr-2 size-4" />
                      Revenir à mes informations
                    </Button>
                    <Button
                      type="button"
                      className="h-11 rounded-xl text-base font-semibold shadow-lg sm:flex-1"
                      onClick={() => setStep("payment")}
                    >
                      Passer au paiement
                      <ChevronRight className="ml-2 size-4" />
                    </Button>
                  </div>
                  <p className="text-center text-[11px] leading-snug text-brand-muted sm:text-[12px]">
                    Après confirmation, retrouvez le suivi de votre commande dans votre
                    espace client.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-0.5 sm:flex-row sm:gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(orderOutlineBtn(embedded), "sm:flex-1")}
                    onClick={() => setStep("infos")}
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Retour
                  </Button>
                  <Button
                    type="button"
                    className="h-11 rounded-xl text-base font-semibold shadow-lg sm:flex-1"
                    onClick={() => setStep("payment")}
                  >
                    Continuer
                    <ChevronRight className="ml-2 size-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </CardContent>

      {!(
        embedded &&
        audience === "particulier" &&
        step === "intent" &&
        intentPhase === "volume"
      ) ? (
        <CardFooter
          className={cn(
            "relative flex flex-col text-center",
            embedded
              ? "gap-1 border-t border-primary/12 bg-transparent px-1 pb-0 pt-2 sm:px-2 sm:pt-2.5"
              : "gap-2 border-t border-primary/5 bg-muted/30 py-4 text-[0.65rem] text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0 leading-tight",
              embedded ? "text-[11px] text-brand-muted" : ""
            )}
          >
            {embedded ? (
              <Headphones
                className="size-3.5 shrink-0 text-brand-muted"
                aria-hidden
              />
            ) : null}
            Besoin d’aide pour votre commande&nbsp;?{" "}
            <a
              href={SITE_PHONE_HREF}
              className="font-semibold text-primary hover:underline"
            >
              {SITE_PHONE_DISPLAY}
            </a>
          </span>
        </CardFooter>
      ) : null}
    </Card>
  )
}

function prestationWasteSubtitle(label: string): string {
  const comma = label.indexOf(", ")
  if (comma < 0) return ""
  const tail = label.slice(comma + 2).trim()
  if (tail.startsWith("gravats")) return `Pour les ${tail}`
  if (tail.startsWith("mélange")) return `Pour le ${tail}`
  return `Pour ${tail}`
}

function benneSystemSecondary(system: BenneSystem): string {
  return system === "chaine" ? "Benne à chaîne" : "Benne ampliroll"
}

function PrestationCard({
  prestation,
  selected,
  recommended,
  onSelect,
  delay,
  t,
  showTtc,
  warmSurface,
}: {
  prestation: Prestation
  selected: boolean
  recommended?: boolean
  onSelect: () => void
  delay: number
  t: { duration: number; ease?: readonly [number, number, number, number] }
  showTtc: boolean
  warmSurface?: boolean
}) {
  const visualSrc = BENNE_VISUAL_BY_VOLUME[prestation.volumeM3]
  const price = priceBreakdownFromHt(prestation.priceHt)
  const surcharge = priceBreakdownFromHt(prestation.surchargePerTonHt)
  const wasteSubtitle = prestationWasteSubtitle(prestation.label)

  const wastesDialog = (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="mt-1.5 h-auto min-h-7 px-0 py-0.5 text-left text-xs font-medium text-brand-navy underline-offset-2 hover:underline"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onKeyDown={(e: React.KeyboardEvent) => e.stopPropagation()}
          />
        }
      >
        <Info className="mr-1 size-3.5 shrink-0 opacity-70" />
        {showTtc
          ? "Voir les déchets acceptés et interdits"
          : "Déchets acceptés / exclus"}
      </DialogTrigger>
      <DialogContent
        overlayClassName="z-[80]"
        className="z-[80] max-h-[min(80vh,480px)] overflow-y-auto sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-brand-navy">
            {prestation.label}
          </DialogTitle>
          <div className="space-y-3 pt-2 text-left text-sm">
            <div>
              <p className="font-medium text-primary">Acceptés</p>
              <p className="text-muted-foreground">
                {prestation.acceptedSummary}
              </p>
            </div>
            <div>
              <p className="font-medium text-rose-800">Exclus</p>
              <p className="text-muted-foreground">
                {prestation.excludedSummary}
              </p>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )

  const selectionIndicator = (
    <span
      className="shrink-0 pt-0.5"
      aria-hidden={!selected}
      title={selected ? "Benne sélectionnée" : undefined}
    >
      {selected ? (
        <CheckCircle2 className="size-5 text-brand-green" strokeWidth={2.25} />
      ) : (
        <Circle className="size-5 text-primary/25" strokeWidth={2} />
      )}
    </span>
  )

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...t, delay }}
      onClick={() => onSelect()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "flex w-full min-w-0 cursor-pointer gap-2.5 overflow-hidden rounded-2xl border-2 p-3 text-left shadow-sm outline-none transition-[border-color,box-shadow,background-color] sm:gap-3 sm:p-3.5",
        "focus-visible:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green/25",
        selected
          ? warmSurface
            ? "border-brand-green bg-primary/10 shadow-md ring-2 ring-brand-green/20"
            : "border-brand-green bg-gradient-to-br from-accent to-white shadow-md ring-2 ring-brand-green/20"
          : warmSurface
            ? "border-primary/20 bg-brand-warm-field hover:border-brand-green/35 hover:bg-primary/[0.06]"
            : "border-border/80 bg-card/90 hover:border-brand-green/35"
      )}
    >
      <div className="flex h-[52px] w-[56px] shrink-0 items-center justify-center overflow-hidden sm:h-[68px] sm:w-[80px]">
        {visualSrc ? (
          <Image
            src={visualSrc}
            alt={`Benne ${prestation.volumeM3} m³`}
            width={368}
            height={207}
            className="h-full w-full object-contain object-center"
            sizes="(max-width: 640px) 56px, 80px"
          />
        ) : null}
      </div>

      {showTtc ? (
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-[15px] font-bold leading-snug text-brand-navy sm:text-base">
                  Benne de {prestation.volumeM3} m³
                </p>
                {recommended ? (
                  <span className="rounded-md border border-brand-green/25 bg-brand-green/10 px-2 py-0.5 text-[10px] font-semibold text-brand-green">
                    Volume suggéré
                  </span>
                ) : null}
              </div>
              {wasteSubtitle ? (
                <p className="mt-0.5 text-[13px] font-medium leading-snug text-brand-navy/85">
                  {wasteSubtitle}
                </p>
              ) : null}
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {benneSystemSecondary(prestation.system)}
              </p>
            </div>
            {selectionIndicator}
          </div>

          <div className="flex flex-col gap-2 border-t border-primary/8 pt-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
            <div className="min-w-0 space-y-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
              <p>
                Jusqu&apos;à {prestation.tonnageMax} tonnes au tarif affiché.
              </p>
              <p>
                Au-delà : {fmtHt(surcharge.ttc)} par tonne supplémentaire.
              </p>
            </div>
            <div className="flex w-full shrink-0 items-baseline justify-between gap-2 sm:w-auto sm:flex-col sm:items-end sm:justify-center sm:text-right">
              <span className="text-[18px] font-bold tabular-nums text-primary sm:text-xl">
                {fmtHt(price.ttc)}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                TTC
              </span>
            </div>
          </div>

          {wastesDialog}
        </div>
      ) : (
        <>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {`${systemLabel(prestation.system)}, ${prestation.volumeM3} m³`}
              </span>
              {recommended ? (
                <span className="rounded-md bg-brand-green/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-green">
                  Suggestion
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-[13px] font-semibold leading-snug text-brand-navy sm:text-sm">
              {prestation.label}
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground sm:text-xs">
              {`Jusqu'à ${prestation.tonnageMax} t inclus, dépassement ${fmtHt(surcharge.ht)}/t HT.`}
            </p>
            {wastesDialog}
          </div>

          <span className="ml-auto w-[4.75rem] shrink-0 self-center text-right sm:ml-0 sm:w-[5.75rem]">
            <span className="block text-[14px] font-bold tabular-nums text-primary sm:text-lg">
              {fmtHt(price.ht)}
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              HT
            </span>
          </span>
        </>
      )}
    </motion.div>
  )
}
