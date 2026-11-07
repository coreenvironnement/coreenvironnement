import type { ReactElement, ReactNode, SVGProps } from "react"

import type { OrderTunnelStepId } from "@/lib/order/tunnel-steps"

const strokeProps = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

function SvgShell({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      aria-hidden
      {...strokeProps}
    >
      {children}
    </svg>
  )
}

export function OrderTunnelStepDoneIcon({
  className,
}: Pick<SVGProps<SVGSVGElement>, "className">) {
  return (
    <SvgShell className={className}>
      <path d="M14 24.5l7.5 7.5L35 18.5" />
    </SvgShell>
  )
}

export function OrderTunnelStepIconDemande({
  className,
}: Pick<SVGProps<SVGSVGElement>, "className">) {
  return (
    <SvgShell className={className}>
      <path d="M14 10H9a3 3 0 0 0-3 3v25a3 3 0 0 0 3 3h23a3 3 0 0 0 3-3v-8" />
      <rect x="14" y="7" width="15" height="7" rx="2" />
      <path d="M13 22h10M13 29h5M26 32l3-8L39 14a3 3 0 0 1 4 4L33 28zM36 17l4 4" />
    </SvgShell>
  )
}

export function OrderTunnelStepIconBenne({
  className,
}: Pick<SVGProps<SVGSVGElement>, "className">) {
  return (
    <SvgShell className={className}>
      <path d="M5 16h38l-5 21H10zM4 16l5-6h29l6 6M9 10h29M14 21l2 11M24 21v11M34 21l-2 11M10 41h28" />
      <path d="M14 37v4M34 37v4" />
    </SvgShell>
  )
}

export function OrderTunnelStepIconInformations({
  className,
}: Pick<SVGProps<SVGSVGElement>, "className">) {
  return (
    <SvgShell className={className}>
      <rect x="6" y="9" width="36" height="30" rx="4" />
      <circle cx="17" cy="21" r="4" />
      <path d="M11 32v-1a6 6 0 0 1 12 0v1M29 19h7M29 25h7M29 31h4" />
    </SvgShell>
  )
}

export function OrderTunnelStepIconRecapitulatif({
  className,
}: Pick<SVGProps<SVGSVGElement>, "className">) {
  return (
    <SvgShell className={className}>
      <rect x="9" y="7" width="30" height="34" rx="4" />
      <path d="m15 17 2 2 4-4M26 17h7m-18 9 2 2 4-4M26 26h7m-18 9 2 2 4-4M26 35h7" />
    </SvgShell>
  )
}

export function OrderTunnelStepIconPaiement({
  className,
}: Pick<SVGProps<SVGSVGElement>, "className">) {
  return (
    <SvgShell className={className}>
      <rect x="5" y="11" width="38" height="27" rx="4" />
      <path d="M5 20h38M12 30h7M24 30h4" />
    </SvgShell>
  )
}

const STEP_ICON_BY_ID: Record<
  OrderTunnelStepId,
  (props: Pick<SVGProps<SVGSVGElement>, "className">) => ReactElement
> = {
  intent: OrderTunnelStepIconDemande,
  forfait: OrderTunnelStepIconBenne,
  infos: OrderTunnelStepIconInformations,
  recap: OrderTunnelStepIconRecapitulatif,
  payment: OrderTunnelStepIconPaiement,
}

export function OrderTunnelStepIcon({
  stepId,
  className,
}: {
  stepId: OrderTunnelStepId
  className?: string
}) {
  const Icon = STEP_ICON_BY_ID[stepId]
  return <Icon className={className} />
}
