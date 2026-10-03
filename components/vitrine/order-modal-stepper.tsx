import { cn } from "@/lib/utils"

import { ORDER_TUNNEL_STEPS } from "@/lib/order/tunnel-steps"

type OrderModalStepperProps = {
  stepIndex: number
}

export function OrderModalStepper({ stepIndex }: OrderModalStepperProps) {
  const lastIndex = ORDER_TUNNEL_STEPS.length - 1

  return (
    <div
      aria-label={`Étape ${stepIndex + 1} sur ${ORDER_TUNNEL_STEPS.length} : ${ORDER_TUNNEL_STEPS[stepIndex]?.label}`}
    >
      <div className="grid grid-cols-5">
        {ORDER_TUNNEL_STEPS.map((step, index) => {
          const active = index === stepIndex

          return (
            <div key={step.id} className="flex flex-col items-center px-0.5 sm:px-1">
              <div className="relative flex h-7 w-full items-center justify-center sm:h-8">
                {index > 0 ? (
                  <span
                    className="absolute right-1/2 top-1/2 h-px w-[calc(50%-0.8rem)] -translate-y-1/2 bg-[#E4E7EC] sm:w-[calc(50%-1rem)]"
                    aria-hidden
                  />
                ) : null}
                {index < lastIndex ? (
                  <span
                    className="absolute left-1/2 top-1/2 h-px w-[calc(50%-0.8rem)] -translate-y-1/2 bg-[#E4E7EC] sm:w-[calc(50%-1rem)]"
                    aria-hidden
                  />
                ) : null}
                <span
                  className={cn(
                    "relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-colors duration-300 sm:h-8 sm:w-8 sm:text-[13px]",
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
                  "mt-1 w-full truncate text-center text-[9px] leading-tight sm:mt-2 sm:text-[11px]",
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
