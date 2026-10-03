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

  return (
    <div
      aria-label={`Étape ${stepIndex + 1} sur ${steps.length} : ${steps[stepIndex]?.label}`}
    >
      <div className="grid grid-cols-5">
        {steps.map((step, index) => {
          const active = index === stepIndex

          return (
            <div key={step.id} className="flex min-w-0 flex-col items-center px-0.5 sm:px-1">
              <div className="relative flex h-6 w-full items-center justify-center sm:h-8">
                {index > 0 ? (
                  <span
                    className="absolute right-1/2 top-1/2 h-px w-[calc(50%-11px)] -translate-y-1/2 bg-[#E4E7EC] sm:w-[calc(50%-16px)]"
                    aria-hidden
                  />
                ) : null}
                {index < lastIndex ? (
                  <span
                    className="absolute left-1/2 top-1/2 h-px w-[calc(50%-11px)] -translate-y-1/2 bg-[#E4E7EC] sm:w-[calc(50%-16px)]"
                    aria-hidden
                  />
                ) : null}
                <span
                  className={cn(
                    "relative z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-colors duration-300 sm:h-8 sm:w-8 sm:text-[13px]",
                    active
                      ? "bg-[#35A238] text-white"
                      : "bg-[#E4E7EC] text-[#98A2B3]"
                  )}
                  aria-hidden
                >
                  {index + 1}
                </span>
              </div>
              <p
                className={cn(
                  "mt-1 w-full max-w-full text-center text-[8px] leading-[1.15] sm:mt-1.5 sm:text-[11px] sm:leading-tight",
                  active
                    ? "font-semibold text-brand-navy"
                    : "font-medium text-[#98A2B3]"
                )}
              >
                {step.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
