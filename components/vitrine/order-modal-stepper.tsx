import { cn } from "@/lib/utils"

import { getOrderTunnelSteps } from "@/lib/order/tunnel-steps"

type OrderModalStepperProps = {
  stepIndex: number
  audience?: "particulier" | "professionnel"
}

export function OrderModalStepper({
  stepIndex,
  audience = "particulier",
}: OrderModalStepperProps) {
  const steps = getOrderTunnelSteps(audience)
  const lastIndex = steps.length - 1
  const current = steps[stepIndex]
  const progress = ((stepIndex + 1) / steps.length) * 100

  return (
    <div
      className="order-tunnel-stepper min-w-0"
      aria-label={`Étape ${stepIndex + 1} sur ${steps.length} : ${current?.label}`}
    >
      <div className="md:hidden">
        <p className="text-center text-[12px] font-medium leading-snug text-brand-navy">
          Étape {stepIndex + 1} sur {steps.length} — {current?.label}
        </p>
        <div
          className="mx-auto mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-brand-green/12"
          role="progressbar"
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={`Étape ${stepIndex + 1} sur ${steps.length}`}
        >
          <div
            className="h-full rounded-full bg-brand-green transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="hidden md:block">
        <div className="grid w-full min-w-0 grid-cols-5">
          {steps.map((step, index) => {
            const active = index === stepIndex

            return (
              <div
                key={step.id}
                className="flex min-w-0 flex-col items-center px-0.5 sm:px-1"
              >
                <div className="relative flex h-8 w-full items-center justify-center">
                  {index > 0 ? (
                    <span
                      className="absolute right-1/2 top-1/2 h-px w-[calc(50%-16px)] -translate-y-1/2 bg-brand-warm-muted"
                      aria-hidden
                    />
                  ) : null}
                  {index < lastIndex ? (
                    <span
                      className="absolute left-1/2 top-1/2 h-px w-[calc(50%-16px)] -translate-y-1/2 bg-brand-warm-muted"
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={cn(
                      "order-tunnel-stepper__node relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums transition-colors duration-300",
                      active
                        ? "bg-brand-green text-white shadow-sm shadow-brand-green/25"
                        : "bg-brand-warm-muted text-brand-navy/45"
                    )}
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                </div>
                <p
                  className={cn(
                    "order-tunnel-stepper__label mt-1.5 w-full max-w-full text-center text-[11px] leading-tight",
                    "line-clamp-2 break-words [overflow-wrap:anywhere]",
                    active
                      ? "font-semibold text-brand-navy"
                      : "font-medium text-brand-navy/42"
                  )}
                >
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
