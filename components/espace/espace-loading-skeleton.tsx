import { ESPACE_WARM_BG } from "@/lib/client/nav-items"
import { cn } from "@/lib/utils"

function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-[#35A238]/12", className)} aria-hidden />
}

function ShellChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-brand-navy" style={{ backgroundColor: ESPACE_WARM_BG }}>
      <div className="mx-auto flex min-h-screen max-w-[1520px]">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-[#35A238]/20 bg-white/90 backdrop-blur-sm md:flex">
          <Bone className="mx-4 mt-5 h-8 w-[140px]" />
          <nav className="flex flex-1 flex-col gap-2 p-3" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Bone key={i} className="h-10 w-full rounded-xl" />
            ))}
          </nav>
          <div className="border-t border-[#35A238]/15 p-3">
            <Bone className="mb-2 h-3 w-24" />
            <Bone className="h-9 w-full rounded-xl" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-[3.75rem] items-center justify-between gap-3 border-b border-[#35A238]/15 bg-[#ECF4E9]/95 px-4 backdrop-blur-md md:px-6">
            <Bone className="h-4 w-28 md:w-24" />
            <Bone className="h-9 w-24 rounded-xl" />
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[#35A238]/20 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-hidden
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 py-2">
            <Bone className="size-5 rounded" />
            <Bone className="h-2 w-10" />
          </div>
        ))}
      </div>
      <div className="h-[4.25rem] md:hidden" aria-hidden />
    </div>
  )
}

/** Plein écran : coque espace client (premier paint / Suspense layout). */
export function EspaceShellLoadingSkeleton({
  variant = "default",
}: {
  variant?: "default" | "commandes" | "profil"
}) {
  return (
    <ShellChrome>
      <EspaceContentLoadingSkeleton variant={variant} />
    </ShellChrome>
  )
}

/** Zone main uniquement (navigation intra-espace). */
export function EspaceContentLoadingSkeleton({
  variant = "default",
}: {
  variant?: "default" | "commandes" | "profil"
}) {
  if (variant === "profil") {
    return (
      <div
        className="mx-auto max-w-2xl space-y-5"
        role="status"
        aria-live="polite"
        aria-busy
        aria-label="Chargement du profil"
      >
        <div className="mb-5 space-y-2">
          <Bone className="h-8 w-40" />
          <Bone className="h-4 w-56" />
        </div>
        <div className="rounded-2xl border border-[#35A238]/20 bg-white/95 p-5 shadow-sm space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Bone className="h-3 w-24" />
              <Bone className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-[#35A238]/20 bg-white/95 p-5 shadow-sm">
          <Bone className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (variant === "commandes") {
    return (
      <div
        className="mx-auto max-w-6xl space-y-6"
        role="status"
        aria-live="polite"
        aria-busy
        aria-label="Chargement des commandes"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Bone className="h-8 w-36" />
            <Bone className="h-4 w-28" />
          </div>
          <Bone className="h-9 w-36 rounded-md" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#35A238]/20 bg-white/95 p-4 shadow-sm sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Bone className="h-5 w-3/4 max-w-xs" />
                <Bone className="h-4 w-1/2 max-w-[200px]" />
              </div>
              <Bone className="h-6 w-20 rounded-full" />
            </div>
            <Bone className="mt-4 h-4 w-full max-w-md" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="mx-auto max-w-6xl space-y-6"
      role="status"
      aria-live="polite"
      aria-busy
      aria-label="Chargement"
    >
      <div className="space-y-2">
        <Bone className="h-8 w-48" />
        <Bone className="h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Bone className="h-32 rounded-2xl" />
        <Bone className="h-32 rounded-2xl" />
      </div>
    </div>
  )
}