import { cn } from "@/lib/utils"

import { getOrderTunnelSteps } from "@/lib/order/tunnel-steps"

import {
  OrderTunnelStepDoneIcon,
  OrderTunnelStepIcon,
} from "./order-tunnel-step-icons"

type OrderModalStepperProps = {
  stepIndex: number
  audience?: "particulier" | "professionnel"
}

export function OrderModalStepper({
  stepIndex,
  audience = "particulier",
}: OrderModalStepperProps) {
  const steps = getOrderTunnelSteps(audience)
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
        <div className="grid w-full min-w-0 grid-cols-5 gap-1 sm:gap-1.5">
          {steps.map((step, index) => {
            const active = index === stepIndex
            const done = index < stepIndex

            return (
              <div
                key={step.id}
                className="flex min-w-0 flex-col items-center px-0.5 sm:px-1"
              >
                <span
                  className={cn(
                    "order-tunnel-stepper__tile",
                    done && "order-tunnel-stepper__tile--done",
                    active && "order-tunnel-stepper__tile--active",
                    !done && !active && "order-tunnel-stepper__tile--upcoming"
                  )}
                >
                  {done ? (
                    <OrderTunnelStepDoneIcon className="order-tunnel-stepper__icon" />
                  ) : (
                    <OrderTunnelStepIcon
                      stepId={step.id}
                      className="order-tunnel-stepper__icon"
                    />
                  )}
                </span>
                <p
                  className={cn(
                    "order-tunnel-stepper__label mt-1.5 w-full max-w-full text-center text-[11px] leading-tight",
                    "line-clamp-2 break-words [overflow-wrap:anywhere]",
                    active
                      ? "font-semibold text-brand-navy"
                      : done
                        ? "font-medium text-brand-navy/62"
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
