"use client"

import Link from "next/link"
import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Calendar03Icon,
  ContainerIcon,
  CreditCardValidationIcon,
  Login01Icon,
  Location01Icon,
  PackageDimensions01Icon,
  Recycle03Icon,
  Timer02Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"

import { commentCaFonctionne } from "@/lib/cdc/contenu-vitrine"

import { VITRINE_ICON_STROKE } from "./icons"

type Profile = "particulier" | "professionnel"
type StepIcon = typeof Recycle03Icon

type Step = {
  num: string
  label: string
  text: string
  icon: StepIcon
}

const PARTICULIER_STEPS: Step[] = [
  {
    num: "01",
    label: "FLUX",
    text: "Choisissez le type de déchets que vous souhaitez évacuer (DIB, gravats, bois, encombrants, etc.).",
    icon: Recycle03Icon,
  },
  {
    num: "02",
    label: "VOLUME",
    text: "Sélectionnez le volume de la benne adaptée à vos besoins.",
    icon: PackageDimensions01Icon,
  },
  {
    num: "03",
    label: "DATE & LIEU",
    text: "Indiquez la date et l'adresse d'intervention en Île-de-France.",
    icon: Location01Icon,
  },
  {
    num: "04",
    label: "PAIEMENT",
    text: "Réglez votre forfait via notre interface de paiement 100% sécurisée.",
    icon: CreditCardValidationIcon,
  },
]

const PRO_ACCOUNT_STEPS: Step[] = [
  {
    num: "01",
    label: "DEMANDE DE CRÉATION DE COMPTE",
    text: "Remplissez le formulaire dans votre espace client et joignez vos documents (KBIS de moins de 3 mois et RIB).",
    icon: UserAdd01Icon,
  },
  {
    num: "02",
    label: "VALIDATION SOUS 24H",
    text: "Après vérification, votre compte sera activé. Vous recevrez un lien par e-mail pour configurer votre mot de passe et passer vos commandes sur facture.",
    icon: Timer02Icon,
  },
]

const PRO_ORDER_STEPS: Step[] = [
  {
    num: "03",
    label: "FLUX",
    text: "Choisissez le type de déchets (DIB, gravats, bois, encombrants).",
    icon: Recycle03Icon,
  },
  {
    num: "04",
    label: "VOLUME",
    text: "Sélectionnez la taille de benne adaptée à vos besoins.",
    icon: ContainerIcon,
  },
  {
    num: "05",
    label: "DATE & LIEU",
    text: "Indiquez la date et l'adresse d'intervention en Île-de-France.",
    icon: Calendar03Icon,
  },
]

const AFTER_FLOW = [
  "COMMANDE VALIDÉE",
  "E-MAIL DE CONFIRMATION",
  "RAPPEL D'UN EXPERT",
  "POSE & SUIVI",
  "RECYCLAGE FINAL",
] as const

function ProfileToggle({
  profile,
  onChange,
}: {
  profile: Profile
  onChange: (profile: Profile) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Profil de commande"
      className="how-profile-toggle mx-auto inline-flex w-full max-w-[22rem] rounded-[var(--radius-btn)] border border-brand-border bg-white p-1 shadow-[0_1px_2px_rgb(24_53_116/0.04)] sm:max-w-[24rem]"
    >
      {(
        [
          { id: "particulier" as const, label: "Particulier" },
          { id: "professionnel" as const, label: "Professionnel" },
        ] as const
      ).map((item) => {
        const active = profile === item.id
        return (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls="how-panel"
            onClick={() => onChange(item.id)}
            className={`how-profile-toggle-btn flex-1 rounded-[0.5rem] px-4 py-2.5 font-[family-name:var(--font-display)] text-sm font-semibold tracking-[-0.01em] transition-all duration-250 ease-out ${
              active
                ? "bg-brand-navy text-white shadow-[0_2px_8px_-2px_rgba(24,53,116,0.35)]"
                : "text-brand-muted hover:text-brand-navy"
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

function StepIconBadge({ icon }: { icon: StepIcon }) {
  return (
    <span className="how-step-icon inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d8e0ec] bg-white text-brand-navy shadow-[0_2px_12px_-4px_rgba(24,53,116,0.16)] sm:h-[3.25rem] sm:w-[3.25rem]">
      <HugeiconsIcon icon={icon} size={20} strokeWidth={VITRINE_ICON_STROKE} aria-hidden />
    </span>
  )
}

function StepCopy({ num, label, text, centered = false }: Step & { centered?: boolean }) {
  return (
    <div className={centered ? "text-center" : "min-w-0"}>
      <p className="vitrine-label text-brand-green">{num}</p>
      <h4 className="mt-1.5 font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.08em] text-brand-navy sm:text-[13px]">
        {label}
      </h4>
      <p
        className={`mt-2 text-sm leading-relaxed text-brand-muted sm:text-[15px] sm:leading-[1.72] ${
          centered ? "mx-auto max-w-[14rem] text-[13.5px] leading-[1.65]" : ""
        }`}
      >
        {text}
      </p>
    </div>
  )
}

function StepsTimeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="how-steps-vertical lg:hidden">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <li key={step.num} className="relative">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4">
              <div className="flex flex-col items-center">
                <StepIconBadge icon={step.icon} />
                {!isLast ? (
                  <span
                    aria-hidden
                    className="how-step-rail mt-3 mb-1 w-[1.5px] flex-1 min-h-[2rem] bg-[#c8d4e4]"
                  />
                ) : null}
              </div>
              <div className={isLast ? "pb-0" : "pb-8"}>
                <StepCopy {...step} />
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function StepsHorizontal({ steps }: { steps: Step[] }) {
  const gridCols =
    steps.length === 2 ? "grid-cols-2" : steps.length === 3 ? "grid-cols-3" : "grid-cols-4"
  const lineInset =
    steps.length === 2
      ? "left-[25%] right-[25%]"
      : steps.length === 3
        ? "left-[16.67%] right-[16.67%]"
        : "left-[12.5%] right-[12.5%]"

  return (
    <div className="how-stepper-horizontal relative hidden lg:block">
      <div
        aria-hidden
        className={`how-stepper-line pointer-events-none absolute ${lineInset} top-[1.625rem] h-[2px] rounded-full bg-[#c8d4e4]/90`}
      />
      <ol className={`grid ${gridCols} gap-5`}>
        {steps.map((step) => (
          <li key={step.num} className="relative px-1">
            <div className="mx-auto flex w-full max-w-[11rem] flex-col items-center text-center">
              <StepIconBadge icon={step.icon} />
              <div className="mt-4">
                <StepCopy {...step} centered />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ParticulierPanel() {
  return (
    <div className="how-panel">
      <h3 className="text-lg text-brand-navy sm:text-xl">
        {commentCaFonctionne.particulier.accroche}
      </h3>

      <div className="how-stepper mt-8 lg:mt-11">
        <StepsHorizontal steps={PARTICULIER_STEPS} />
        <StepsTimeline steps={PARTICULIER_STEPS} />
      </div>

      <div className="how-after-block mt-10 rounded-[var(--radius-card)] border border-[#E3E9E6] bg-white p-5 shadow-[0_1px_2px_rgb(24_53_116/0.025),0_6px_18px_-6px_rgb(24_53_116/0.055)] sm:mt-12 sm:p-6">
        <p className="font-[family-name:var(--font-display)] text-base font-semibold tracking-[-0.01em] text-brand-navy">
          Et après ?
        </p>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-[15px] sm:leading-[1.72]">
          {commentCaFonctionne.particulier.suite}
        </p>
        <ol
          aria-label="Suite du parcours après commande"
          className="how-after-flow mt-5 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2"
        >
          {AFTER_FLOW.map((step, index) => (
            <li key={step} className="flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-center">
              <span className="rounded-[10px] border border-brand-border bg-brand-bg-alt px-3 py-2 font-[family-name:var(--font-display)] text-[12px] font-semibold uppercase leading-snug tracking-[0.06em] text-brand-navy sm:rounded-full sm:px-2.5 sm:py-1 sm:text-[11px] sm:tracking-[0.08em]">
                {step}
              </span>
              {index < AFTER_FLOW.length - 1 ? (
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={15}
                  strokeWidth={VITRINE_ICON_STROKE}
                  className="mx-auto shrink-0 rotate-90 text-brand-green sm:mx-0 sm:rotate-0"
                  aria-hidden
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function ProfessionnelPanel() {
  return (
    <div className="how-panel">
      <h3 className="text-lg text-brand-navy sm:text-xl">
        {commentCaFonctionne.professionnel.accroche}
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-[15px]">
        {commentCaFonctionne.professionnel.etapesIntro}
      </p>

      <p className="vitrine-label mt-8 text-brand-sky">OUVERTURE DU COMPTE</p>
      <div className="how-stepper mt-4">
        <StepsTimeline steps={PRO_ACCOUNT_STEPS} />
        <StepsHorizontal steps={PRO_ACCOUNT_STEPS} />
      </div>

      <div className="my-8 flex flex-col items-center gap-2 sm:my-10">
        <span className="rounded-full border border-brand-green/25 bg-brand-green/[0.06] px-3 py-1 font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-green-dark">
          COMPTE VALIDÉ
        </span>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={16}
          strokeWidth={VITRINE_ICON_STROKE}
          className="rotate-90 text-brand-border"
          aria-hidden
        />
        <p className="vitrine-label text-brand-navy/70">PASSER UNE COMMANDE</p>
      </div>

      <div className="how-stepper">
        <StepsTimeline steps={PRO_ORDER_STEPS} />
        <StepsHorizontal steps={PRO_ORDER_STEPS} />
      </div>

      <div className="mt-10 flex flex-col items-start gap-3 border-t border-brand-border/90 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brand-muted">Déjà client ?</p>
        <Link href="/login" className="how-login-link group inline-flex items-center gap-2">
          Identifiez-vous ici
          <HugeiconsIcon
            icon={Login01Icon}
            size={16}
            strokeWidth={VITRINE_ICON_STROKE}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          />
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={15}
            strokeWidth={VITRINE_ICON_STROKE}
            className="text-brand-sky transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  )
}

export function VitrineHowItWorks() {
  const [profile, setProfile] = useState<Profile>("particulier")

  return (
    <section id="fonctionnement" className="bg-[#F3F6FB] pb-16 pt-16 max-sm:pt-[5.75rem] sm:py-20 lg:py-[5.5rem]">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">Comment ça fonctionne</p>
          <h2 className="section-title mt-3">
            Louez votre benne
            <span className="block">en 3 minutes chrono</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
            {commentCaFonctionne.intro}
          </p>
          <div className="mt-8 sm:mt-9">
            <ProfileToggle profile={profile} onChange={setProfile} />
          </div>
        </div>

        <div
          id="how-panel"
          role="tabpanel"
          aria-labelledby={`tab-${profile}`}
          className="how-panel-wrap mx-auto mt-10 max-w-5xl sm:mt-12"
        >
          <div key={profile} className="how-panel-enter">
            {profile === "particulier" ? <ParticulierPanel /> : <ProfessionnelPanel />}
          </div>
        </div>
      </div>
    </section>
  )
}
