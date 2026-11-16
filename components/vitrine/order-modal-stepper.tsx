import { Fragment } from "react"

import { cn } from "@/lib/utils"

import { getOrderTunnelSteps } from "@/lib/order/tunnel-steps"

import {
  OrderTunnelStepDoneIcon,
  OrderTunnelStepIcon,
} from "./order-tunnel-step-icons"

type OrderModalStepperProps = {
  stepIndex: number
  audience?: "particulier" | "professionnel"
  /** Étape « Quelle benne » : barre de progression compacte (sans 5 tuiles). */
  compact?: boolean
}

export function OrderModalStepper({
  stepIndex,
  audience = "particulier",
  compact = false,
}: OrderModalStepperProps) {
  const steps = getOrderTunnelSteps(audience)
  const current = steps[stepIndex]
  const progress = ((stepIndex + 1) / steps.length) * 100

  return (
    <div
      className="order-tunnel-stepper min-w-0"
      aria-label={`Étape ${stepIndex + 1} sur ${steps.length} : ${current?.label}`}
    >
      <div className={cn(compact ? "block" : "md:hidden")}>
        <p className="text-center text-[12px] font-medium leading-snug text-brand-navy">
          Étape {stepIndex + 1} sur {steps.length} · {current?.label}
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

      <div className={cn(compact ? "hidden" : "hidden md:block")}>
        <div className="order-tunnel-stepper__track flex w-full min-w-0 items-start">
          {steps.map((step, index) => {
            const active = index === stepIndex
            const done = index < stepIndex
            const connectorDone = index > 0 && stepIndex >= index

            return (
              <Fragment key={step.id}>
                {index > 0 ? (
                  <div
                    className={cn(
                      "order-tunnel-stepper__connector",
                      connectorDone && "order-tunnel-stepper__connector--done"
                    )}
                    aria-hidden
                  />
                ) : null}
                <div
                  className={cn(
                    "order-tunnel-stepper__cell flex shrink-0 flex-col items-center",
                    active && "order-tunnel-stepper__cell--active"
                  )}
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
                      "order-tunnel-stepper__label mt-1.5 max-w-[5.75rem] text-center text-[10px] leading-tight sm:max-w-[6.25rem] sm:text-[11px]",
                      "whitespace-nowrap",
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
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
