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
import { LoaderCore } from "@/components/ui/loader-core"
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
import { EntrepriseLookupFields } from "@/components/forms/entreprise-lookup-fields"
import { PhoneInputWithCountry } from "@/components/forms/phone-input-with-country"
import { Input } from "@/components/ui/input"
import { CheckoutReassuranceBanner } from "@/components/order/checkout-reassurance-banner"
import { EmbeddedCheckout } from "@/components/order/embedded-checkout"
import { OrderReceiptConfirmation } from "@/components/order/order-receipt-confirmation"
import {
  OrderConfirmingState,
  OrderSuccessScreen,
} from "@/components/order/order-success-screen"
import { getOrderDemoSuccessScreenProps } from "@/lib/order/dev-order-demo"
import { OrderDateField } from "@/components/order/order-date-field"
import { OrderTunnelDateBlock } from "@/components/order/order-tunnel-date-block"
import { GravatsPropres8WasteDialog } from "@/components/order/gravats-propres-8-waste-dialog"
import { OrderTunnelContinueButton } from "@/components/order/order-tunnel-continue-button"
import { ParticulierVolumeStep } from "@/components/order/particulier-volume-step"
import { ParticulierWastePicker } from "@/components/order/particulier-waste-picker"
import {
  benneImageForVolume,
  benneVolumeImageAlt,
} from "@/lib/media/site-images"
import { WasteFamilySelect } from "@/components/order/waste-situation-picker"
import {
  subtitleFromPrestationLabel,
  tunnelFluxCardSubtitle,
  tunnelFluxRecapName,
  tunnelForfaitIntroPhrase,
} from "@/lib/order/benne-display-labels"
import {
  particulierWasteOptionById,
  type ParticulierWasteOptionId,
} from "@/lib/order/particulier-waste-options"
import { prestationIdForFamilyVolume } from "@/lib/order/volume-estimator"
import { formatOrderDatePicker } from "@/lib/format/date"
import {
  saveParticulierCommandeDraft,
  submitProfessionalBenneRequest,
} from "@/app/order/actions"
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
import type { ParticulierReorderSeed } from "@/lib/espace/particulier-reorder-prefill"
import { useOrderAudienceSession } from "@/lib/auth/use-order-audience-session"
import {
  ORDER_TUNNEL_STEPS,
  getOrderTunnelSteps,
  isTunnelInfosStep,
  recapContactStep,
  recapDatesStep,
  type OrderTunnelStepId,
} from "@/lib/order/tunnel-steps"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import {
  DELIVERY_DATE_INVALID_MESSAGE,
  isValidDeliveryDate,
  isValidPickupDate,
  minDeliveryDateISO,
} from "@/lib/order/delivery-dates"
import {
  BENNE_VISUAL_BY_VOLUME,
  benneImageAltForVolume,
} from "@/lib/commande/benne-visual"
import { TruckAccessSpaceDisclosure } from "@/components/order/truck-access-space-help"
import { DevisEmailCard } from "@/components/order/devis-email-card"
import {
  formatContactPhoneDisplay,
  isValidContactPhone,
} from "@/lib/phone/phone-value"
import {
  CONTACT_EMAIL_INVALID_MESSAGE,
  isValidContactEmailInput,
  useContactEmailField,
} from "@/lib/forms/contact-email-field"
import {
  CONTACT_PHONE_INVALID_MESSAGE,
  useContactPhoneField,
} from "@/lib/phone/contact-phone-field"
import {
  buildParticulierTunnelDraftInput,
  particulierTunnelDraftReady,
} from "@/lib/order/particulier-tunnel-draft"
import { normalizeSignupEmail } from "@/lib/auth/signup-validation"
import { isBrouillonSupprimeError } from "@/lib/order/brouillon-errors"
import { cn } from "@/lib/utils"

export { ORDER_TUNNEL_STEPS } from "@/lib/order/tunnel-steps"

const ORDER_SECTION_LABEL =
  "text-left text-[14px] font-semibold leading-snug text-brand-navy"

const ORDER_RECAP_CARD_TITLE =
  "text-[12px] font-semibold uppercase tracking-[0.04em] text-brand-navy/80"

const ORDER_RECAP_SECTION = (embedded: boolean) =>
  cn(
    embedded
      ? cn(ORDER_TUNNEL_CARD, "bg-white/[0.94] shadow-[0_1px_0_rgb(14_32_16/0.04)]")
      : "rounded-2xl border border-primary/10 bg-white/95",
    "px-4 py-4"
  )

const ORDER_RECAP_MODIFY_BTN =
  "text-[12px] font-medium text-primary underline-offset-2 hover:text-primary hover:underline"

function OrderRecapCardHead({
  title,
  actionLabel,
  onAction,
  centered = false,
}: {
  title: string
  actionLabel: string
  onAction: () => void
  centered?: boolean
}) {
  if (centered) {
  return (
      <div className="mb-3 flex flex-col items-center gap-1.5 text-center">
        <h3 className={ORDER_RECAP_CARD_TITLE}>{title}</h3>
        <button type="button" className={ORDER_RECAP_MODIFY_BTN} onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    )
  }

  return (
    <div className="mb-2.5 flex items-start justify-between gap-3">
      <h3 className={ORDER_RECAP_CARD_TITLE}>{title}</h3>
      <button type="button" className={cn("shrink-0", ORDER_RECAP_MODIFY_BTN)} onClick={onAction}>
        {actionLabel}
        </button>
    </div>
  )
}

function OrderRecapField({
  label,
  value,
  centered = false,
}: {
  label: string
  value: string
  centered?: boolean
}) {
  return (
    <li className={cn("list-none space-y-0.5", centered && "text-center")}>
      <p className="text-[12px] leading-snug text-brand-muted">{label}</p>
      <p className="text-[15px] font-medium leading-snug text-brand-navy">{value}</p>
    </li>
  )
}

const ORDER_HELP_TEXT =
  "flex items-start gap-1.5 text-[11px] leading-snug text-brand-muted sm:text-[12px]"

const ORDER_TUNNEL_CARD = "order-tunnel-card"
const ORDER_TUNNEL_STEP_NAV = "order-tunnel-step-nav"
const ORDER_TUNNEL_STEP_ACTIONS = "order-tunnel-step-actions"
const ORDER_TUNNEL_BTN_BACK = "order-tunnel-step-back"
const ORDER_TUNNEL_BTN_PRIMARY = "order-tunnel-step-primary"
const ORDER_CONTACT_PHONE_ERROR_ID = "order-contact-phone-error"
const ORDER_CONTACT_EMAIL_ERROR_ID = "order-contact-email-error"

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
  entryMode?: "default" | "pro-reorder" | "particulier-reorder"
  proReorderSeed?: ProReorderSeed | null
  particulierReorderSeed?: ParticulierReorderSeed | null
  onStepIndexChange?: (index: number) => void
  onAudienceChange?: (audience: Audience) => void
  onClose?: () => void
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  onVolumeIntentChoiceActive?: (active: boolean) => void
  onVolumeEstimatorAppearanceActive?: (active: boolean) => void
  onPostPaymentUiChange?: (active: boolean) => void
}

export function OrderWidget({
  variant = "default",
  open = true,
  entryMode = "default",
  proReorderSeed = null,
  particulierReorderSeed = null,
  onStepIndexChange,
  onAudienceChange,
  onClose,
  scrollContainerRef,
  onVolumeIntentChoiceActive,
  onVolumeEstimatorAppearanceActive,
  onPostPaymentUiChange,
}: OrderWidgetProps) {
  const embedded = variant === "embedded"
  const {
    draft,
    patchDraft,
    resolveIntentPhase,
    intentStart,
    takeTunnelResume,
    orderDemo,
  } = useVitrineOrder()
  const sessionAudience = useOrderAudienceSession()
  const audienceLocked =
    sessionAudience.locked && sessionAudience.audience !== null
  const espaceEmbeddedParticulierLocked =
    embedded &&
    (entryMode === "particulier-reorder" ||
      (sessionAudience.locked && sessionAudience.audience === "particulier"))
  const hideOrderAudienceToggle =
    entryMode === "particulier-reorder" || espaceEmbeddedParticulierLocked
  const modalWasOpen = useRef(false)
  const proReorderBootstrapped = useRef(false)
  const particulierReorderBootstrapped = useRef(false)
  const [savedAddressConfirmed, setSavedAddressConfirmed] = useState(false)
  const [editSavedAddress, setEditSavedAddress] = useState(false)
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
  /** Évite le bandeau zone au chargement si l’adresse vient du brouillon vitrine sans sélection. */
  const [locationAddressTouched, setLocationAddressTouched] = useState(false)
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
  const [volumeStepView, setVolumeStepView] = useState<string>("choice")
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
  const contactPhoneField = useContactPhoneField(contactPhone)
  const [contactEmail, setContactEmail] = useState("")
  const contactEmailField = useContactEmailField(contactEmail)
  const [draftCommandeId, setDraftCommandeId] = useState<string | null>(null)
  const lastParticulierAutosaveRef = useRef<string | null>(null)
  const particulierAutosaveInFlightRef = useRef(false)

  const handleAudienceChange = useCallback(
    (next: Audience) => {
      if (next === audience) return
      setDraftCommandeId(null)
      lastParticulierAutosaveRef.current = null
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
  const [isSavingParticulierDraft, startSaveParticulierDraft] = useTransition()
  const prestation = useMemo(
    () => (selectedPrestationId ? prestationById(selectedPrestationId) : null),
    [selectedPrestationId]
  )

  const particulierDraftContentKey = useMemo(() => {
    if (!prestation || !selectedAddress) return null
    return [
      prestation.id,
      selectedAddress.label,
      deliveryDate,
      pickupDate,
      contactFirstName.trim(),
      contactLastName.trim(),
      contactPhone.trim(),
      normalizeSignupEmail(contactEmail),
    ].join("\n")
  }, [
    prestation,
    selectedAddress,
    deliveryDate,
    pickupDate,
    contactFirstName,
    contactLastName,
    contactPhone,
    contactEmail,
  ])

  useEffect(() => {
    if (audience !== "particulier" || step !== "infos-contact") return
    if (!prestation || !selectedAddress || !particulierDraftContentKey) return

    const fields = {
      selectedAddress,
      prestationId: prestation.id,
      deliveryDate,
      pickupDate: pickupDate || undefined,
      contactFirstName,
      contactLastName,
      contactPhone,
      contactEmail,
      particulierWasteId,
    }
    if (!particulierTunnelDraftReady(fields)) return
    if (particulierDraftContentKey === lastParticulierAutosaveRef.current) return

    const timer = window.setTimeout(() => {
      if (particulierAutosaveInFlightRef.current) return
      const input = buildParticulierTunnelDraftInput(
        fields,
        draftCommandeId ?? undefined
      )
      if (!input) return
      particulierAutosaveInFlightRef.current = true
      void saveParticulierCommandeDraft(input).then((result) => {
        particulierAutosaveInFlightRef.current = false
        if ("error" in result) {
          if (isBrouillonSupprimeError(result.error)) {
            setDraftCommandeId(null)
            lastParticulierAutosaveRef.current = ""
          }
          return
        }
        setDraftCommandeId(result.commandeId)
        lastParticulierAutosaveRef.current = particulierDraftContentKey
      })
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [
    audience,
    step,
    prestation,
    selectedAddress,
    deliveryDate,
    pickupDate,
    contactFirstName,
    contactLastName,
    contactPhone,
    contactEmail,
    draftCommandeId,
    particulierDraftContentKey,
    particulierWasteId,
  ])

  const volumeHintIsSuggestion =
    volumeHintOrigin === "estimated" && volumeHintM3 !== null

  const filteredPrestations = useMemo(() => {
    if (!family) return []
    const list = prestationsByFamily(family)
    return [...list].sort((a, b) => {
      if (selectedPrestationId) {
        if (a.id === selectedPrestationId) return -1
        if (b.id === selectedPrestationId) return 1
      }
      const hint = volumeHintIsSuggestion ? volumeHintM3 : null
      const aSuggested = hint !== null && a.volumeM3 === hint
      const bSuggested = hint !== null && b.volumeM3 === hint
      if (aSuggested !== bSuggested) return aSuggested ? -1 : 1
      return a.volumeM3 - b.volumeM3
    })
  }, [family, volumeHintM3, volumeHintIsSuggestion, selectedPrestationId])

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

  const applyParticulierTunnelResume = (
    resume: import("@/lib/order/particulier-tunnel-resume").ParticulierTunnelResume
  ) => {
    setAudience("particulier")
    setAddress(resume.address)
    setSelectedAddress(resume.selectedAddress)
    setSelectedPrestationId(resume.prestationId)
    setDeliveryDate(resume.deliveryDate)
    setPickupDate(resume.pickupDate ?? "")
    setContactFirstName(resume.contactFirstName)
    setContactLastName(resume.contactLastName)
    setContactPhone(resume.contactPhone)
    setContactEmail(resume.contactEmail)
    if (resume.particulierWasteId) {
      setParticulierWasteId(resume.particulierWasteId)
      const mapped = particulierWasteOptionById(resume.particulierWasteId)
      if (mapped) setFamily(mapped.family)
    }
    patchDraft({
      audience: "particulier",
      address: resume.address,
      selectedAddress: resume.selectedAddress,
      particulierWasteId: resume.particulierWasteId,
      family: resume.particulierWasteId
        ? particulierWasteOptionById(resume.particulierWasteId)?.family ?? null
        : null,
    })
    setStep("recap")
    setIntentPhase("volume")
    setAddressError(null)
    scrollContainerRef?.current?.scrollTo({ top: 0, behavior: "auto" })
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

  const showSavedAddressConfirm =
    entryMode === "particulier-reorder" &&
    Boolean(particulierReorderSeed?.addressLabel?.trim()) &&
    selectedAddress !== null &&
    !editSavedAddress

  const advanceFromLocation = () => {
    setAddressError(null)
    if (showSavedAddressConfirm && !savedAddressConfirmed) {
      setAddressError("Cochez la case pour confirmer votre adresse de livraison.")
      return
    }
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

  const goToIntentVolume = () => {
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
    setStep(audience === "particulier" ? "infos-dates" : "infos")
  }

  const goToInfosContact = () => {
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
    if (pickupDate.length && !isValidPickupDate(deliveryDate, pickupDate)) {
      setAddressError(
        "La date d'enlèvement ne peut pas être antérieure à la date de livraison."
      )
      setDeliveryDateError(null)
      return
    }
    setDeliveryDateError(null)
    setAddressError(null)
    setStep("infos-contact")
    scrollContainerRef?.current?.scrollTo({ top: 0, behavior: "auto" })
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
    if (audience === "professionnel") {
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
      if (pickupDate.length && !isValidPickupDate(deliveryDate, pickupDate)) {
        setAddressError(
          "La date d'enlèvement ne peut pas être antérieure à la date de livraison."
        )
        setDeliveryDateError(null)
        return
      }
      setDeliveryDateError(null)
    }
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
    if (!isValidContactPhone(contactPhone)) {
      contactPhoneField.markSubmitted()
      return
    }
    if (!isValidContactEmailInput(contactEmail)) {
      contactEmailField.markSubmitted()
      return
    }
    const email = normalizeSignupEmail(contactEmail)
    setAddressError(null)

    if (audience === "particulier") {
      if (!prestation || !selectedAddress) {
        setAddressError("Votre commande est incomplète. Revenez aux étapes précédentes.")
        return
      }
      startSaveParticulierDraft(async () => {
        const result = await saveParticulierCommandeDraft({
          audience: "particulier",
          address: selectedAddress.label,
          lat: selectedAddress.lat,
          lng: selectedAddress.lng,
          addressLabel: selectedAddress.label,
          postcode: selectedAddress.postcode,
          departementCode: selectedAddress.departementCode,
          prestationId: prestation.id,
          deliveryDate,
          pickupDate: pickupDate || undefined,
          contactEmail: email,
          contactName:
            [contactFirstName.trim(), contactLastName.trim()].filter(Boolean).join(" ") ||
            undefined,
          contactFirstName: contactFirstName.trim(),
          contactLastName: contactLastName.trim(),
          contactPhone: contactPhone.trim() || undefined,
          selectedAddress,
          particulierWasteId,
          existingCommandeId: draftCommandeId ?? undefined,
        })
        if ("error" in result) {
          if (isBrouillonSupprimeError(result.error)) {
            setDraftCommandeId(null)
            lastParticulierAutosaveRef.current = ""
          }
          setAddressError(result.error)
          return
        }
        setDraftCommandeId(result.commandeId)
        if (particulierDraftContentKey) {
          lastParticulierAutosaveRef.current = particulierDraftContentKey
        }
        setStep("recap")
      })
      return
    }

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

  const volumeIntentChoiceActive =
    embedded &&
    open &&
    step === "intent" &&
    intentPhase === "volume" &&
    audience === "particulier" &&
    volumeStepView === "choice"

  const volumeEstimatorAppearanceActive =
    embedded &&
    open &&
    step === "intent" &&
    intentPhase === "volume" &&
    audience === "particulier" &&
    volumeStepView === "estimator-mode"

  useEffect(() => {
    onVolumeIntentChoiceActive?.(volumeIntentChoiceActive)
  }, [volumeIntentChoiceActive, onVolumeIntentChoiceActive])

  useEffect(() => {
    onVolumeEstimatorAppearanceActive?.(volumeEstimatorAppearanceActive)
  }, [volumeEstimatorAppearanceActive, onVolumeEstimatorAppearanceActive])

  useEffect(() => {
    onAudienceChange?.(audience)
  }, [audience, onAudienceChange])

  useEffect(() => {
    if (
      sessionAudience.loading ||
      entryMode === "pro-reorder" ||
      entryMode === "particulier-reorder"
    )
      return
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
    if (entryMode !== "particulier-reorder" || !particulierReorderSeed || !embedded || !open)
      return

    setAudience("particulier")
    setContactFirstName(particulierReorderSeed.contactFirstName)
    setContactLastName(particulierReorderSeed.contactLastName)
    setContactPhone(particulierReorderSeed.contactPhone)
    setContactEmail(particulierReorderSeed.contactEmail)

    if (particulierReorderSeed.addressLabel.trim()) {
      setAddress(particulierReorderSeed.addressLabel)
    }

    if (draft.selectedAddress) {
      setSelectedAddress(draft.selectedAddress)
      setSavedAddressConfirmed(false)
      setEditSavedAddress(false)
      if (!particulierReorderBootstrapped.current) {
        setStep("intent")
        setIntentPhase("location")
        setAfterLocationTarget("waste")
        particulierReorderBootstrapped.current = true
      }
    } else if (!particulierReorderBootstrapped.current) {
      setStep("intent")
      setIntentPhase("location")
      setAfterLocationTarget("waste")
    }
  }, [
    entryMode,
    particulierReorderSeed,
    embedded,
    open,
    draft.selectedAddress,
  ])

  useEffect(() => {
    if (!embedded) return
    if (entryMode === "pro-reorder" || entryMode === "particulier-reorder") return
    if (open && !modalWasOpen.current) {
      const resume = takeTunnelResume()
      if (resume) {
        applyParticulierTunnelResume(resume)
        modalWasOpen.current = open
        return
      }
      applyDraft(draft)
      setAddressError(null)
      setLocationAddressTouched(false)
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
  }, [
    open,
    embedded,
    intentStart,
    draft,
    resolveIntentPhase,
    takeTunnelResume,
  ])

  useEffect(() => {
    if (!embedded || !open) return
    patchDraft({ audience, address, selectedAddress })
  }, [embedded, open, audience, address, selectedAddress, patchDraft])

  useEffect(() => {
    if (!isTunnelInfosStep(step)) return

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
          ? "order-tunnel-embedded-card max-w-none min-w-0 gap-0 overflow-visible border-0 bg-transparent py-0 shadow-none ring-0"
          : "overflow-hidden max-w-xl border-white/70 bg-card/95 shadow-[0_22px_70px_-32px_color-mix(in_srgb,var(--brand-navy)_38%,transparent)] ring-1 ring-primary/15 backdrop-blur-sm"
      )}
    >
      {!embedded ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-brand-navy/[0.05]" />
      ) : null}

      <CardContent
        className={cn(
          "relative space-y-3",
          embedded
            ? "order-tunnel-form order-tunnel-embedded-body min-w-0 px-0 pb-0 pt-0"
            : "pt-8"
        )}
      >
        {!embedded ? (
          <OrderStepProgress currentStepIdx={currentStepIdx} steps={steps} />
        ) : null}

        {embedded && orderDemo === "order-success" ? (
          <OrderSuccessScreen
            {...getOrderDemoSuccessScreenProps()}
            onClose={onClose ?? (() => {})}
          />
        ) : embedded && orderDemo === "order-confirming" ? (
          <OrderConfirmingState phase="confirming" onClose={onClose} />
        ) : step === "payment" && prestation && selectedAddress ? (
          <div className="space-y-4">
              {audience === "professionnel" ? (
                proCompteLoading ? (
                  <div className="order-tunnel-card flex min-h-[140px] flex-col items-center justify-center px-4 py-6 text-center">
                    <LoaderCore caption="Vérification de votre compte…" />
                  </div>
                ) : proRequestSent && prestation && selectedAddress ? (
                  <OrderReceiptConfirmation
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
                      contactName: proContactName.trim(),
                      contactPhone: contactPhone.trim() || undefined,
                      companyName: companyName.trim(),
                    }}
                    commandeId=""
                    amountTtcCents={0}
                    referenceNumero={proReference}
                    contactEmail={contactEmail.trim()}
                    emailConfirmed={proClientEmailSent}
                    onClose={onClose ?? (() => {})}
                    mode="professionnel_demande"
                    embedded
                    autoPlay
                    soundsEnabled
                  />
                ) : proCompte?.status === "approved" &&
                  proCompte.payment_mode === "cb_required" ? (
                  proSessionUserId ? (
                    <EmbeddedCheckout
                      existingCommandeId={draftCommandeId ?? undefined}
                      deliveryDate={deliveryDate}
                      onCommandeId={setDraftCommandeId}
                      onBack={() => setStep("recap")}
                      onClose={onClose}
                      onPostPaymentUiChange={onPostPaymentUiChange}
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
                  onPostPaymentUiChange={onPostPaymentUiChange}
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
                {hideOrderAudienceToggle ? null : audienceLocked ? (
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
                    {showSavedAddressConfirm ? (
                      <div className="space-y-3">
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
                              Adresse enregistrée
                            </p>
                            <p className="mt-0.5 text-[13px] font-medium leading-snug text-brand-navy sm:text-sm">
                              {selectedAddress?.label}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-brand-green hover:text-[#19752B]"
                            onClick={() => {
                              setEditSavedAddress(true)
                              setSavedAddressConfirmed(false)
                              setAddressError(null)
                            }}
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            Modifier
                          </button>
                        </div>
                        <label
                          htmlFor="order-saved-address-confirm"
                          className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-primary/18 bg-brand-warm-field px-3 py-2.5 text-left text-[13px] leading-snug text-brand-navy"
                        >
                          <input
                            id="order-saved-address-confirm"
                            type="checkbox"
                            checked={savedAddressConfirmed}
                            onChange={(e) => {
                              setSavedAddressConfirmed(e.target.checked)
                              if (e.target.checked) setAddressError(null)
                            }}
                            className="mt-0.5 size-4 shrink-0 accent-[#35A238]"
                          />
                          <span>
                            Je confirme que cette adresse est bien le lieu de livraison de la
                            benne.
                  </span>
                        </label>
                      </div>
                    ) : (
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
                            setLocationAddressTouched(true)
                            setSavedAddressConfirmed(false)
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
                    )}
                </div>

                <AnimatePresence>
                  {locationAddressTouched &&
                    address.trim().length >= 3 &&
                    !selectedAddress &&
                    !addressError && (
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

                <div className={cn(embedded && ORDER_TUNNEL_STEP_NAV)}>
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
              className={cn(
                embedded ? "order-tunnel-step--fill" : "space-y-4"
              )}
            >
              <div
                className={cn(
                  embedded
                    ? "order-tunnel-step__stack flex min-h-0 flex-1 flex-col gap-3 sm:gap-4"
                    : "space-y-4"
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

                {!embedded ? (
                  <div>
                    <OrderTunnelContinueButton
                      onClick={goToIntentVolume}
                      disabled={!canLeaveIntentWaste}
                    />
              </div>
                ) : null}
              </div>
              {embedded ? (
                <div className={ORDER_TUNNEL_STEP_NAV}>
                  <OrderTunnelContinueButton
                    onClick={goToIntentVolume}
                    disabled={!canLeaveIntentWaste}
                  />
                </div>
              ) : null}
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
              className={cn(
                embedded && "order-tunnel-step--fill"
              )}
            >
              <ParticulierVolumeStep
                embedded={embedded}
                audience={audience}
                family={family}
                wasteId={
                  audience === "particulier" ? particulierWasteId : null
                }
                addressPending={!zoneOk}
                onViewChange={setVolumeStepView}
                onBackToWaste={() => {
                  setAddressError(null)
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
              className={cn(
                "min-w-0",
                embedded ? "order-tunnel-step--fill" : "space-y-3.5"
              )}
            >
              <div
                className={cn(
                  embedded
                    ? "order-tunnel-step__stack flex min-h-0 flex-1 flex-col gap-3"
                    : "min-w-0 space-y-3.5"
                )}
              >
              <div
                className={cn(
                  "min-w-0",
                  embedded && "text-center"
                )}
              >
                <p
                  className={cn(
                    ORDER_SECTION_LABEL,
                    embedded && "text-center text-[15px] sm:text-[16px]"
                  )}
                >
                  {audience === "particulier"
                    ? "Choisissez votre benne"
                    : "Choisissez votre forfait"}
                </p>
                {audience === "particulier" ? (
                  <div
                    className={cn(
                      "mt-2 rounded-xl border border-primary/12 bg-brand-warm-field/80 px-3 py-2 text-center",
                      embedded && "mx-auto max-w-md"
                    )}
                  >
                    <p className="text-[12px] font-semibold leading-snug text-brand-navy">
                      {particulierWasteId && family ? (
                        tunnelForfaitIntroPhrase(family, particulierWasteId)
                      ) : (
                        "Comparez les offres"
                      )}
                      {volumeHintM3 ? (
                        <>
                          {" "}
                          ·{" "}
                          <span className="tabular-nums font-bold">
                            {volumeHintM3} m³
                          </span>{" "}
                          {volumeHintOrigin === "estimated"
                            ? "estimés"
                            : volumeHintOrigin === "chosen"
                              ? "choisis"
                              : "indiqués"}
                        </>
                      ) : null}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-brand-muted">
                      Tarifs TTC et poids inclus par benne. Ne dépassez pas le
                      bord — supplément à la tonne sur chaque offre.
                </p>
              </div>
                ) : (
                  <p
                    className={cn(
                      "mt-1.5 text-[11px] leading-snug text-muted-foreground",
                      embedded && "mx-auto max-w-md text-center"
                    )}
                  >
                    Prix H.T. — détail des déchets acceptés par forfait.
                    {volumeHintM3 ? (
                      <>
                        {" "}
                        Volume indicatif :{" "}
                        <strong className="tabular-nums text-brand-navy">
                          {volumeHintM3} m³
                        </strong>
                        .
                      </>
                    ) : null}
                  </p>
                )}
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
                    ? "order-tunnel-forfait-list"
                    : "max-h-[min(60vh,420px)] overflow-y-auto pr-1 sm:max-h-[min(70vh,520px)]"
                )}
              >
                {filteredPrestations.map((p, i) => (
                  <PrestationCard
                    key={p.id}
                    prestation={p}
                    family={family}
                    particulierWasteId={
                      audience === "particulier" ? particulierWasteId : null
                    }
                    selected={selectedPrestationId === p.id}
                    recommended={
                      volumeHintIsSuggestion && p.volumeM3 === volumeHintM3
                    }
                    onSelect={() => setSelectedPrestationId(p.id)}
                    delay={prefersReducedMotion ? 0 : i * 0.04}
                    t={t}
                    showTtc={audience === "particulier"}
                    warmSurface={embedded}
                  />
                ))}
              </div>

              <div
                className={cn(
                  "space-y-2 pt-0.5",
                  embedded && ORDER_TUNNEL_STEP_NAV
                )}
              >
                <div className={ORDER_TUNNEL_STEP_ACTIONS}>
                <Button
                  variant="outline"
                  type="button"
                    className={cn(
                      orderOutlineBtn(embedded),
                      ORDER_TUNNEL_BTN_BACK,
                      "border-primary/20 bg-transparent font-medium text-brand-muted hover:bg-primary/5 hover:text-brand-navy",
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
                    className={cn(
                      ORDER_TUNNEL_BTN_PRIMARY,
                      "h-11 rounded-xl border-0 bg-[#35A238] px-3 text-sm font-semibold text-white shadow-lg shadow-[#35A238]/20 hover:bg-[#19752B] disabled:pointer-events-none disabled:bg-[#D0D5DD] disabled:text-white disabled:opacity-100 disabled:shadow-none"
                    )}
                    disabled={!selectedPrestationId}
                    onClick={goToInfos}
                  >
                    {audience === "particulier" ? "Continuer" : "Continuer avec ce forfait"}
                  <ChevronRight className="ml-2 size-4" />
                </Button>
                </div>
              </div>
              </div>
            </motion.div>
          )}

          {((audience === "particulier" &&
            (step === "infos-dates" || step === "infos-contact")) ||
            (audience === "professionnel" && step === "infos")) && (
            <motion.div
              key={step === "infos-contact" ? "infos-contact" : "infos-dates"}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className={cn(embedded && "order-tunnel-step--fill min-w-0")}
            >
              <div
                className={cn(
                  embedded
                    ? "order-tunnel-step__stack flex min-h-0 flex-1 flex-col gap-3"
                    : "space-y-4"
                )}
              >
              <div className={cn(embedded && "min-h-0 flex-1 space-y-4")}>
              {(step === "infos-dates" || (audience === "professionnel" && step === "infos")) && (
              <div className="space-y-2.5">
                <p className={cn(ORDER_SECTION_LABEL, "text-center")}>
                  Organisons la livraison de votre benne
                </p>
                <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-2.5 sm:gap-3">
                  <OrderTunnelDateBlock
                    kind="delivery"
                    labelId="order-delivery-date-label"
                    label={<>Date de livraison&nbsp;*</>}
                  >
                    <OrderDateField
                      ref={deliveryDateRef}
                      id="order-delivery-date"
                      min={minDeliveryDateISO()}
                      value={deliveryDate}
                      invalid={deliveryDateError !== null}
                      warmSurface={embedded}
                      compact
                      placeholder="Choisir la date"
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
                    <p className={cn(ORDER_HELP_TEXT, "justify-center text-center")}>
                      <Info className="mt-0.5 size-3.5 shrink-0 opacity-55" aria-hidden />
                      <span>
                        Disponibilités à partir de demain.
                      </span>
                    </p>
                    {deliveryDateError ? (
                      <p className="text-center text-xs font-medium text-amber-800">
                        {deliveryDateError}
                      </p>
                    ) : null}
                  </OrderTunnelDateBlock>
                  <OrderTunnelDateBlock
                    kind="pickup"
                    labelId="order-pickup-date-label"
                    labelClassName="font-medium text-muted-foreground"
                    label={<>Enlèvement (facultatif)</>}
                  >
                    <OrderDateField
                      id="order-pickup-date"
                      min={
                        deliveryDate.length && isValidDeliveryDate(deliveryDate)
                          ? deliveryDate
                          : minDeliveryDateISO()
                      }
                      value={pickupDate}
                      warmSurface={embedded}
                      compact
                      placeholder="Date d’enlèvement"
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
                    <p className={cn(ORDER_HELP_TEXT, "justify-center text-center")}>
                      <Info className="mt-0.5 size-3.5 shrink-0 opacity-55" aria-hidden />
                      <span>Si vous connaissez déjà la date souhaitée.</span>
                    </p>
                    {pickupDate ? (
                      <button
                        type="button"
                        onClick={() => setPickupDate("")}
                        className="mx-auto block rounded-md px-1 py-0.5 text-[11px] font-medium text-brand-muted underline-offset-2 transition-colors hover:text-brand-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        Supprimer la date
                      </button>
                    ) : null}
                  </OrderTunnelDateBlock>
              </div>
                <TruckAccessSpaceDisclosure embedded={embedded} />
              </div>
              )}

              {(step === "infos-contact" || (audience === "professionnel" && step === "infos")) && (
              <div className="space-y-2.5">
                <div
                  className={cn(
                    "space-y-1",
                    audience === "particulier" && "text-center"
                  )}
                >
                  <p
                    className={cn(
                      ORDER_SECTION_LABEL,
                      audience === "particulier" && "text-center"
                    )}
                  >
                    {audience === "professionnel"
                      ? "Votre entreprise"
                      : "Vos coordonnées pour préparer la livraison"}
                  </p>
                  <p
                    className={cn(
                      ORDER_HELP_TEXT,
                      audience === "particulier" && "justify-center text-center"
                    )}
                  >
                    <span>
                      {audience === "professionnel"
                        ? "Ces informations nous permettent de confirmer votre demande et de vous contacter pour organiser la livraison."
                        : "Ces informations nous permettent de confirmer votre commande et de vous contacter pour organiser la livraison."}
                  </span>
                  </p>
                </div>
              {audience === "professionnel" ? (
                  <>
                    <EntrepriseLookupFields
                      className="space-y-3"
                      raisonSocialeValue={companyName}
                      siretValue={siret}
                      onRaisonSocialeChange={(v) => {
                        setCompanyName(v)
                        setAddressError(null)
                      }}
                      onSiretChange={(v) => {
                        setSiret(v)
                        setAddressError(null)
                      }}
                      raisonSociale={{
                        id: "order-company-name",
                        name: "order_company_name",
                        label: "Nom de l’entreprise",
                        required: true,
                      }}
                      siret={{
                        id: "order-siret",
                        name: "order_siret",
                        label: "SIRET",
                      }}
                      inputClassName={cn(
                        "h-11 rounded-xl border-2 border-primary/15 px-3",
                        orderFieldBg(embedded)
                      )}
                      onExtra={(extra) => {
                        if (locationAddressTouched) return
                        const line =
                          extra.adresseUneLigne ??
                          extra.adresseSiege?.replace(/\n/g, ", ") ??
                          ""
                        if (line) setAddress(line)
                      }}
                    />
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
                <div className="grid grid-cols-2 gap-2 min-w-0 sm:gap-3">
                  <div className="min-w-0 space-y-1.5">
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
                  <div className="min-w-0 space-y-1.5">
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
                  <PhoneInputWithCountry
                    id="order-contact-phone"
                    value={contactPhone}
                    onChange={(next) => {
                      setContactPhone(next)
                      setAddressError(null)
                    }}
                    warmSurface={embedded}
                    variant={embedded ? "vitrine" : "default"}
                    inputClassName={orderFieldBg(embedded)}
                    invalid={contactPhoneField.invalid}
                    onBlur={contactPhoneField.onBlur}
                    onInternationalInput={contactPhoneField.onInternationalInput}
                    aria-describedby={
                      contactPhoneField.showError ? ORDER_CONTACT_PHONE_ERROR_ID : undefined
                    }
                  />
                  {contactPhoneField.showError ? (
                    <p
                      id={ORDER_CONTACT_PHONE_ERROR_ID}
                      className={cn(
                        "text-xs font-medium text-red-600",
                        embedded && "form-field-message form-field-message--error"
                      )}
                      role="alert"
                    >
                      {CONTACT_PHONE_INVALID_MESSAGE}
                    </p>
                  ) : null}
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
                      onBlur={contactEmailField.onBlur}
                      aria-invalid={contactEmailField.invalid ? true : undefined}
                      aria-describedby={
                        contactEmailField.showError ? ORDER_CONTACT_EMAIL_ERROR_ID : undefined
                      }
                      className={cn(
                        "h-11 rounded-xl border-2 border-primary/15 px-3",
                        orderFieldBg(embedded)
                      )}
                    />
                  {contactEmailField.showError ? (
                    <p
                      id={ORDER_CONTACT_EMAIL_ERROR_ID}
                      className={cn(
                        "text-xs font-medium text-red-600",
                        embedded && "form-field-message form-field-message--error"
                      )}
                      role="alert"
                    >
                      {CONTACT_EMAIL_INVALID_MESSAGE}
                    </p>
                  ) : null}
                  <p className={ORDER_HELP_TEXT}>
                    <Info className="mt-0.5 size-3.5 shrink-0 opacity-55" aria-hidden />
                    <span>
                      {audience === "professionnel"
                        ? "Pour recevoir la confirmation de votre demande."
                        : "Pour recevoir la confirmation de votre commande."}
                    </span>
                  </p>
                  </div>
                {audience === "particulier" && step === "infos-contact" && prestation && selectedAddress ? (
                  <DevisEmailCard
                    embedded={embedded}
                    email={contactEmail}
                    existingCommandeId={draftCommandeId ?? undefined}
                    onDraftCommandeId={setDraftCommandeId}
                    canSend={
                      contactFirstName.trim().length > 0 &&
                      contactLastName.trim().length > 0 &&
                      isValidContactPhone(contactPhone) &&
                      deliveryDate.length > 0
                    }
                    payload={{
                      prestationId: prestation.id,
                      address: selectedAddress.label,
                      selectedAddress,
                      particulierWasteId,
                      deliveryDate,
                      pickupDate: pickupDate || undefined,
                      contactFirstName,
                      contactLastName,
                      contactPhone,
                    }}
                  />
                ) : null}
                  </div>
              )}

              {addressError && (
                <p className="text-center text-xs font-medium text-amber-800">
                  {addressError}
                </p>
              )}
              </div>

              <div className={cn("space-y-2 pt-0.5", embedded && ORDER_TUNNEL_STEP_NAV)}>
                <div className={ORDER_TUNNEL_STEP_ACTIONS}>
                <Button
                  variant="outline"
                  type="button"
                    className={cn(orderOutlineBtn(embedded), ORDER_TUNNEL_BTN_BACK)}
                  onClick={() => {
                    setAddressError(null)
                      if (audience === "particulier" && step === "infos-contact") {
                        setStep("infos-dates")
                        return
                      }
                    setStep("forfait")
                  }}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Retour
                </Button>
                  <Button
                    type="button"
                    className={cn(
                      ORDER_TUNNEL_BTN_PRIMARY,
                      "h-11 rounded-xl text-base font-semibold shadow-lg"
                    )}
                    disabled={
                      isSavingParticulierDraft &&
                      audience === "particulier" &&
                      step === "infos-contact"
                    }
                    onClick={
                      audience === "particulier" && step === "infos-dates"
                        ? goToInfosContact
                        : goToPayment
                    }
                  >
                    {isSavingParticulierDraft &&
                    audience === "particulier" &&
                    step === "infos-contact" ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Enregistrement…
                      </>
                    ) : audience === "particulier" && step === "infos-dates" ? (
                      "Continuer"
                    ) : audience === "professionnel" ? (
                      "Vérifier ma demande"
                    ) : (
                      "Vérifier ma commande"
                    )}
                    {!isSavingParticulierDraft ||
                    audience !== "particulier" ||
                    step !== "infos-contact" ? (
                      <ChevronRight className="ml-2 size-4" />
                ) : null}
                  </Button>
                </div>
                {audience === "particulier" && step === "infos-dates" ? null : (
                  <p className="text-center text-[11px] leading-snug text-brand-muted sm:text-[12px]">
                    {audience === "professionnel"
                      ? "Vous pourrez vérifier les détails avant d’envoyer votre demande."
                      : "Vous pourrez vérifier les détails avant de passer au paiement."}
                  </p>
                )}
              </div>
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
              className="space-y-4"
            >
              {audience === "particulier" ? (
                <div className="mx-auto max-w-md space-y-2 pb-0.5 text-center">
                  <p className="text-[16px] font-semibold leading-snug text-brand-navy sm:text-[17px]">
                    Un dernier coup d&apos;œil avant le paiement
                  </p>
                  <p className="text-balance text-[13px] leading-relaxed text-brand-muted sm:text-[14px]">
                    Retrouvez les détails de votre commande et ajustez-les si besoin
                    avant de continuer.
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
                    <h3 className={ORDER_RECAP_CARD_TITLE}>Entreprise</h3>
                    <button
                      type="button"
                      className="text-[11px] font-medium text-primary/70 hover:text-primary hover:underline"
                      onClick={() => setStep(recapContactStep(audience))}
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
                    <li className="text-brand-navy">
                      {formatContactPhoneDisplay(contactPhone)}
                    </li>
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

              <section className={ORDER_RECAP_SECTION(embedded)}>
                <OrderRecapCardHead
                  centered={audience === "particulier"}
                  title={audience === "professionnel" ? "Demande" : "La benne choisie"}
                  actionLabel={audience === "particulier" ? "Modifier la benne" : "Modifier"}
                  onAction={() => setStep("forfait")}
                />
                <div
          className={cn(
                    "flex gap-3.5",
                    audience === "particulier"
                      ? "flex-col items-center text-center"
                      : "items-center"
                  )}
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-primary/10 bg-white p-1.5">
                    <Image
                      src={benneImageForVolume(prestation.volumeM3)}
                      alt={benneVolumeImageAlt(prestation.volumeM3)}
                      fill
                      className="object-contain object-center"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium leading-snug text-brand-navy">
                      {prestation.label}
                    </p>
                    {audience === "professionnel" ? (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {systemLabel(prestation.system)}, {prestation.volumeM3} m³
                      </p>
          ) : null}
                  </div>
                </div>
              </section>

              <section className={ORDER_RECAP_SECTION(embedded)}>
                <OrderRecapCardHead
                  centered={audience === "particulier"}
                  title={
                    audience === "particulier" ? "Livraison et enlèvement" : "Livraison"
                  }
                  actionLabel="Modifier"
                  onAction={() => {
                    setStep("intent")
                    setIntentPhase("waste")
                  }}
                />
                {audience === "particulier" ? (
                  <ul className="space-y-3.5">
                    <OrderRecapField
                      centered
                      label="Adresse de livraison"
                      value={selectedAddress.label}
                    />
                    {family ? (
                      <OrderRecapField
                        centered
                        label="Déchets à évacuer"
                        value={
                          particulierWasteId
                            ? tunnelFluxRecapName(family, particulierWasteId)
                            : FAMILY_LABELS[family].title
                        }
                      />
                    ) : null}
                    <OrderRecapField
                      centered
                      label="Date de livraison"
                      value={formatOrderDatePicker(deliveryDate)}
                    />
                    {pickupDate ? (
                      <OrderRecapField
                        centered
                        label="Date d’enlèvement"
                        value={formatOrderDatePicker(pickupDate)}
                      />
                    ) : null}
                  </ul>
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    <li>
                      <span className="text-muted-foreground">Adresse : </span>
                      <span className="font-medium text-brand-navy">{selectedAddress.label}</span>
                    </li>
                    {family ? (
                      <li>
                        <span className="text-muted-foreground">Déchets : </span>
                        <span className="font-medium text-brand-navy">
                          {FAMILY_LABELS[family].title}
                        </span>
                      </li>
                    ) : null}
                    <li>
                      <span className="text-muted-foreground">Livraison : </span>
                      <span className="font-medium text-brand-navy">
                        {formatOrderDatePicker(deliveryDate)}
                      </span>
                    </li>
                    {pickupDate ? (
                      <li>
                        <span className="text-muted-foreground">Enlèvement : </span>
                        <span className="font-medium text-brand-navy">
                          {formatOrderDatePicker(pickupDate)}
                        </span>
                      </li>
                    ) : null}
                  </ul>
                )}
                {audience === "particulier" ? (
                  <button
                    type="button"
                    className={cn("mx-auto mt-3 block", ORDER_RECAP_MODIFY_BTN)}
                    onClick={() => setStep(recapDatesStep(audience))}
                  >
                    Modifier les dates
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mt-1.5 text-[12px] font-medium text-primary underline-offset-2 hover:text-primary hover:underline"
                    onClick={() => setStep(recapDatesStep(audience))}
                  >
                    Modifier les dates
                  </button>
                )}
              </section>

              {audience === "particulier" ? (
              <section className={ORDER_RECAP_SECTION(embedded)}>
                <OrderRecapCardHead
                  centered
                  title="Vos coordonnées"
                  actionLabel="Modifier"
                  onAction={() => setStep(recapContactStep(audience))}
                />
                <ul className="space-y-3.5">
                  <OrderRecapField centered label="Nom" value={contactName.trim()} />
                  <OrderRecapField
                    centered
                    label="Téléphone"
                    value={formatContactPhoneDisplay(contactPhone)}
                  />
                  <OrderRecapField centered label="E-mail" value={contactEmail.trim()} />
                </ul>
              </section>
              ) : null}

              {audience === "particulier" ? (
              <section
                className={cn(
                  ORDER_RECAP_SECTION(embedded),
                  "border-primary/20 bg-white/[0.98]"
                )}
              >
                {(() => {
                  const breakdown = priceBreakdownFromHt(prestation.priceHt)
                  return (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <p className={ORDER_RECAP_CARD_TITLE}>Total de votre commande</p>
                      <p className="text-2xl font-semibold leading-none tabular-nums text-primary">
                        {fmtHt(breakdown.ttc)}
                      </p>
                      <p className="text-[13px] text-brand-muted">
                        dont TVA {fmtHt(breakdown.tva)}
                      </p>
                    </div>
                  )
                })()}
              </section>
              ) : null}

              {audience === "particulier" ? (
                <div
                  className={cn("space-y-2 pt-0.5", embedded && ORDER_TUNNEL_STEP_NAV)}
                >
                  <div className={ORDER_TUNNEL_STEP_ACTIONS}>
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(orderOutlineBtn(embedded), ORDER_TUNNEL_BTN_BACK)}
                      onClick={() => setStep(recapContactStep(audience))}
                    >
                      <ArrowLeft className="mr-1.5 size-3.5 shrink-0" />
                      <span className="truncate">Revenir à mes infos</span>
                    </Button>
                    <Button
                      type="button"
                      className={cn(
                        ORDER_TUNNEL_BTN_PRIMARY,
                        "h-11 rounded-xl text-base font-semibold shadow-lg"
                      )}
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
                <div
                  className={cn(
                    "space-y-2 pt-0.5",
                    embedded && ORDER_TUNNEL_STEP_NAV
                  )}
                >
                  <div className={ORDER_TUNNEL_STEP_ACTIONS}>
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(orderOutlineBtn(embedded), ORDER_TUNNEL_BTN_BACK)}
                      onClick={() => setStep(recapContactStep(audience))}
                    >
                      <ArrowLeft className="mr-2 size-4 shrink-0" />
                      Retour
                    </Button>
                    <Button
                      type="button"
                      className={cn(
                        ORDER_TUNNEL_BTN_PRIMARY,
                        "h-11 rounded-xl text-base font-semibold shadow-lg"
                      )}
                      onClick={() => setStep("payment")}
                    >
                      Continuer
                      <ChevronRight className="ml-2 size-4 shrink-0" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </CardContent>

      {!embedded ? (
        <CardFooter className="relative flex flex-col gap-2 border-t border-primary/5 bg-muted/30 py-4 text-center text-[0.65rem] text-muted-foreground">
          <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0 leading-tight">
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

function benneSystemSecondary(system: BenneSystem): string {
  return system === "chaine" ? "Benne à chaîne" : "Benne ampliroll"
}

function PrestationCard({
  prestation,
  family,
  particulierWasteId,
  selected,
  recommended,
  onSelect,
  delay,
  t,
  showTtc,
  warmSurface,
}: {
  prestation: Prestation
  family: BenneFamily
  particulierWasteId?: ParticulierWasteOptionId | null
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
  const wasteSubtitle = particulierWasteId
    ? tunnelFluxCardSubtitle(family, particulierWasteId)
    : subtitleFromPrestationLabel(prestation.label)

  const wastesDialog =
    prestation.id === "gp-ch-8" ? (
      <GravatsPropres8WasteDialog showTtc={showTtc} />
    ) : (
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
        "order-tunnel-prestation-card flex w-full min-w-0 cursor-pointer gap-2.5 overflow-hidden rounded-2xl border-2 p-3 text-left shadow-sm outline-none transition-[border-color,box-shadow,background-color] sm:gap-3 sm:p-3.5",
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
      <div className="order-tunnel-prestation-card__visual flex h-[52px] w-[56px] shrink-0 items-center justify-center overflow-hidden sm:h-[68px] sm:w-[80px]">
        {visualSrc ? (
          <Image
            src={visualSrc}
            alt={benneImageAltForVolume(prestation.volumeM3)}
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
