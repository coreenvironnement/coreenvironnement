import { cn } from "@/lib/utils"

const STEPS = [
  { id: 1, label: "Entreprise" },
  { id: 2, label: "Contact" },
  { id: 3, label: "Sécurité" },
] as const

export function SignupProStepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <nav aria-label="Étapes d'inscription professionnelle" className="mt-2">
      <ol className="flex items-center gap-1">
        {STEPS.map((s) => {
          const active = s.id === step
          const done = s.id < step
          return (
            <li key={s.id} className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[10px] font-bold tabular-nums",
                  active &&
                    "bg-[#35A238] text-white shadow-[0_4px_12px_-4px_rgb(53_162_56/0.55)]",
                  done && !active && "bg-[#35A238]/20 text-[#1e6b24]",
                  !active && !done && "bg-brand-warm-field text-brand-muted"
                )}
                aria-current={active ? "step" : undefined}
              >
                {s.id}
              </span>
              <span
                className={cn(
                  "w-full truncate text-center text-[10px] font-semibold uppercase tracking-wide",
                  active ? "text-brand-navy" : "text-brand-muted"
                )}
              >
                {s.label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}