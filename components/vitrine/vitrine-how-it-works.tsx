"use client"

import Link from "next/link"
import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Calendar03Icon,
  ContainerIcon,
  CreditCardValidationIcon,
  Leaf01Icon,
  Login01Icon,
  Location01Icon,
  PackageDimensions01Icon,
  Recycle03Icon,
  Tick02Icon,
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

function StepCard({ num, label, text, icon }: Step) {
  return (
    <article className="how-step-card rounded-[0.875rem] border border-brand-border/90 bg-white p-4 sm:p-5">
      <p className="vitrine-label text-brand-green">{num}</p>
      <span className="how-step-icon-circle mt-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-green/[0.08] text-brand-green">
        <HugeiconsIcon icon={icon} size={20} strokeWidth={VITRINE_ICON_STROKE} aria-hidden />
      </span>
      <h4 className="mt-3 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[0.06em] text-brand-navy sm:text-sm">
        {label}
      </h4>
      <p className="mt-2 text-[13.5px] leading-relaxed text-brand-muted sm:text-sm sm:leading-[1.68]">
        {text}
      </p>
    </article>
  )
}

function StepsGrid({ steps, className = "" }: { steps: Step[]; className?: string }) {
  return (
    <ol className={`how-steps-grid grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 ${className}`}>
      {steps.map((step) => (
        <li key={step.num}>
          <StepCard {...step} />
        </li>
      ))}
    </ol>
  )
}

function AfterPanel({ description }: { description: string }) {
  return (
    <aside className="how-after-panel flex h-full flex-col border-t border-brand-green/10 p-6 sm:p-8 lg:border-t-0 lg:border-l lg:p-8 xl:p-10">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-green/[0.12] text-brand-green">
          <HugeiconsIcon icon={Leaf01Icon} size={18} strokeWidth={VITRINE_ICON_STROKE} aria-hidden />
        </span>
        <p className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[-0.02em] text-brand-navy">
          Et après ?
        </p>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-[15px] sm:leading-[1.72]">
        {description}
      </p>
      <ul
        aria-label="Suite du parcours après commande"
        className="how-after-tags mt-6 grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 sm:gap-3"
      >
        {AFTER_FLOW.map((step, index) => (
          <li
            key={step}
            className={index === AFTER_FLOW.length - 1 ? "min-[480px]:col-span-2" : undefined}
          >
            <span className="how-after-tag flex items-center gap-2 rounded-[0.625rem] border border-brand-green/15 bg-white/80 px-3 py-2.5 font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase leading-snug tracking-[0.05em] text-brand-navy sm:text-[11.5px]">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={14}
                strokeWidth={VITRINE_ICON_STROKE}
                className="shrink-0 text-brand-green"
                aria-hidden
              />
              {step}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function ParticulierPanel() {
  return (
    <div className="how-main-card overflow-hidden rounded-[var(--radius-card)] border border-brand-border bg-white shadow-[0_2px_4px_rgb(24_53_116/0.03),0_12px_32px_-8px_rgb(24_53_116/0.1)]">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(17.5rem,22rem)] xl:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)]">
        <div className="how-panel-main p-6 sm:p-8 lg:p-9 xl:p-10">
          <h3 className="text-lg leading-snug text-brand-navy sm:text-xl">
            {commentCaFonctionne.particulier.accroche}
          </h3>
          <StepsGrid steps={PARTICULIER_STEPS} className="mt-6 sm:mt-8" />
        </div>
        <AfterPanel description={commentCaFonctionne.particulier.suite} />
      </div>
    </div>
  )
}

function ProSidePanel() {
  return (
    <aside className="how-after-panel flex h-full flex-col border-t border-brand-green/10 p-6 sm:p-8 lg:border-t-0 lg:border-l lg:p-8 xl:p-10">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-green/[0.12] text-brand-green">
          <HugeiconsIcon icon={UserAdd01Icon} size={18} strokeWidth={VITRINE_ICON_STROKE} aria-hidden />
        </span>
        <p className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[-0.02em] text-brand-navy">
          Compte PRO
        </p>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-[15px] sm:leading-[1.72]">
        Paiement différé à 30 jours, facturation centralisée et interlocuteur dédié pour l&apos;ensemble
        de vos chantiers en Île-de-France.
      </p>
      <div className="mt-auto border-t border-brand-green/10 pt-6">
        <p className="text-sm text-brand-muted">Déjà client ?</p>
        <Link href="/login" className="how-login-link group mt-2 inline-flex items-center gap-2">
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
    </aside>
  )
}

function ProfessionnelPanel() {
  return (
    <div className="how-main-card overflow-hidden rounded-[var(--radius-card)] border border-brand-border bg-white shadow-[0_2px_4px_rgb(24_53_116/0.03),0_12px_32px_-8px_rgb(24_53_116/0.1)]">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(17.5rem,22rem)] xl:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)]">
        <div className="how-panel-main p-6 sm:p-8 lg:p-9 xl:p-10">
          <h3 className="text-lg leading-snug text-brand-navy sm:text-xl">
            {commentCaFonctionne.professionnel.accroche}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-[15px]">
            {commentCaFonctionne.professionnel.etapesIntro}
          </p>

          <p className="vitrine-label mt-8 text-brand-sky">OUVERTURE DU COMPTE</p>
          <StepsGrid steps={PRO_ACCOUNT_STEPS} className="mt-4" />

          <div className="my-7 flex flex-col items-center gap-2 sm:my-8">
            <span className="rounded-full border border-brand-green/25 bg-brand-green/[0.06] px-3 py-1 font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-green-dark">
              COMPTE VALIDÉ
            </span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              strokeWidth={VITRINE_ICON_STROKE}
              className="rotate-90 text-brand-border sm:rotate-0"
              aria-hidden
            />
            <p className="vitrine-label text-brand-navy/70">PASSER UNE COMMANDE</p>
          </div>

          <StepsGrid steps={PRO_ORDER_STEPS} />
        </div>
        <ProSidePanel />
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
          className="how-panel-wrap mx-auto mt-10 max-w-5xl sm:mt-12 lg:max-w-6xl"
        >
          <div key={profile} className="how-panel-enter">
            {profile === "particulier" ? <ParticulierPanel /> : <ProfessionnelPanel />}
          </div>
        </div>
      </div>
    </section>
  )
}
