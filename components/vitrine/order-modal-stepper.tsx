import { cn } from "@/lib/utils"

import { ORDER_TUNNEL_STEPS } from "@/lib/order/tunnel-steps"

type OrderModalStepperProps = {
  stepIndex: number
}

export function OrderModalStepper({ stepIndex }: OrderModalStepperProps) {
  return (
    <div
      className="mt-3"
      aria-label={`Étape ${stepIndex + 1} sur ${ORDER_TUNNEL_STEPS.length} : ${ORDER_TUNNEL_STEPS[stepIndex]?.label}`}
    >
      <div className="flex gap-1">
        {ORDER_TUNNEL_STEPS.map((step, index) => (
          <div
            key={`segment-${step.id}`}
            className={cn(
              "h-0.5 flex-1 rounded-full transition-colors duration-300",
              index === stepIndex ? "bg-[#35A238]" : "bg-[#E4E7EC]"
            )}
            aria-hidden
          />
        ))}
      </div>

      <div className="mt-1.5 grid grid-cols-3 gap-1">
        {ORDER_TUNNEL_STEPS.map((step, index) => {
          const active = index === stepIndex

          return (
            <p
              key={step.id}
              className={cn(
                "truncate text-center text-[10px] font-medium leading-tight text-[#98A2B3]",
                active && "font-semibold text-[#475467]"
              )}
            >
              {index + 1}&nbsp;·&nbsp;{step.label}
            </p>
          )
        })}
      </div>
    </div>
  )
}
