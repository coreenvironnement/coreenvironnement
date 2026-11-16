import Image from "next/image"
import Link from "next/link"

const BENNE_IMAGE = "/images/benne-gravats-vert-vue-trois-quarts.webp"

export function NotFoundView() {
  return (
    <div
      data-not-found-page
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% -20%, color-mix(in srgb, #35a238 14%, transparent), transparent 55%),
            radial-gradient(ellipse 45% 40% at 100% 10%, color-mix(in srgb, #19752b 8%, transparent), transparent 48%),
            var(--color-brand-bg, #fafbfa)
          `,
        }}
      />

      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
          Erreur 404
        </p>

        <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-[1.75rem] font-bold tracking-[-0.03em] text-brand-navy sm:text-[2rem]">
          Cette page n&apos;existe pas
        </h1>

        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-brand-muted sm:text-base">
          L&apos;adresse est peut-être incorrecte ou la page a été déplacée. Pas
          d&apos;inquiétude&nbsp;: on vous aide à reprendre votre projet.
        </p>

        <div className="not-found-benne-wrap relative mt-10 mb-8 flex h-36 w-full max-w-[220px] items-end justify-center sm:h-40">
          <div
            className="not-found-benne-art relative h-[132px] w-[168px] sm:h-[148px] sm:w-[188px]"
            aria-hidden
          >
            <Image
              src={BENNE_IMAGE}
              alt=""
              width={376}
              height={296}
              sizes="(max-width: 640px) 168px, 188px"
              className="h-full w-full object-contain object-bottom drop-shadow-[0_18px_32px_color-mix(in_srgb,#172033_18%,transparent)]"
              priority={false}
            />
          </div>
        </div>

        <NotFoundCtas />
      </div>
    </div>
  )
}

function NotFoundCtas() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-[var(--radius-btn,0.625rem)] bg-brand-green px-5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_color-mix(in_srgb,#35a238_55%,transparent)] transition-colors hover:bg-brand-green-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        Commander une benne
      </Link>
      <Link
        href="/espace/aide"
        className="inline-flex h-11 items-center justify-center rounded-[var(--radius-btn,0.625rem)] border border-brand-border bg-white px-5 text-sm font-semibold text-brand-navy shadow-sm transition-colors hover:border-brand-green/35 hover:bg-brand-warm-field focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        Besoin d&apos;aide
      </Link>
    </div>
  )
}