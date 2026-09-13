import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Site en cours de refonte",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#183574] px-6 py-16 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(38,157,210,0.22),transparent_58%),radial-gradient(90%_60%_at_100%_100%,rgba(53,162,56,0.14),transparent_55%)]"
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        <Image
          src="/images/core-environnement-logo-header-transparent.png"
          alt="CORE ENVIRONNEMENT"
          width={1983}
          height={793}
          priority
          className="h-11 w-[min(72vw,220px)] object-contain sm:h-12 sm:w-[240px]"
        />

        <p className="mt-10 text-xs font-medium uppercase tracking-[0.18em] text-[#35A238]">
          Refonte en cours
        </p>

        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(1.75rem,5vw,2.25rem)] font-semibold leading-[1.12] tracking-[-0.02em]">
          Notre site arrive très bientôt
        </h1>

        <p className="mt-5 max-w-md text-base leading-relaxed text-white/85">
          CORE ENVIRONNEMENT prépare une nouvelle expérience pour la location de bennes et
          la gestion de vos déchets en Île-de-France.
        </p>

        <div className="mt-10 w-full rounded-[1rem] border border-white/12 bg-white/[0.06] px-5 py-4 backdrop-blur-sm">
          <p className="text-sm leading-relaxed text-white/75">
            Intervention sous 24 h · Commande en ligne · Suivi digital
          </p>
        </div>

        <a
          href="mailto:contact@coreenvironnement.fr"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition hover:text-white"
        >
          contact@coreenvironnement.fr
        </a>
      </div>

      <p className="relative z-10 mt-14 text-xs text-white/45">
        © {new Date().getFullYear()} CORE ENVIRONNEMENT
      </p>
    </div>
  )
}
