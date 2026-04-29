import Image from "next/image"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:px-6 lg:top-6">
      <div
        className="pointer-events-auto flex h-14 w-full max-w-5xl items-center justify-between rounded-2xl border border-white/40 bg-background/65 px-4 shadow-[0_8px_32px_-8px_rgba(24,47,117,0.25)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/55 dark:border-white/10 dark:bg-background/50 dark:shadow-black/40 sm:h-16 sm:px-6"
        role="banner"
      >
        <Link
          href="/"
          className="relative flex h-9 shrink-0 items-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:ring-offset-2 sm:h-10"
        >
          <Image
            src="/logo-core-environnement.png"
            alt="Core Environnement"
            width={260}
            height={72}
            sizes="(max-width: 640px) 180px, 220px"
            className="h-full w-auto max-w-[180px] object-contain object-left sm:max-w-[220px]"
            priority
          />
        </Link>

        <Link
          href="/pro"
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-full border border-brand-sky/30 bg-gradient-to-r from-primary to-primary/90 px-4 text-[0.8rem] font-medium text-primary-foreground shadow-sm transition hover:from-primary/95 hover:to-primary/85 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:h-9 sm:px-5 sm:text-sm"
        >
          Espace Pro
        </Link>
      </div>
    </header>
  )
}
