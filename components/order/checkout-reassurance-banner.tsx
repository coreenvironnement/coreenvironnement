import type { ReactNode } from "react"
import {
  Mail,
  MapPin,
  Phone,
  Receipt,
  Recycle,
  Truck,
} from "lucide-react"

import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import { cn } from "@/lib/utils"

export type CheckoutReassuranceVariant = "particulier" | "professionnel"

type CheckoutReassuranceBannerProps = {
  variant: CheckoutReassuranceVariant
  className?: string
}

const ICON_STROKE = 1.75

function TruckBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#35A238] text-white sm:size-12",
        className
      )}
      aria-hidden
    >
      <Truck className="size-6 sm:size-[26px]" strokeWidth={1.65} />
    </span>
  )
}

function MiddleItem({
  icon,
  children,
}: {
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-2 text-[13px] font-semibold leading-snug text-[#1a2e22] sm:text-[14px]">
      <span className="shrink-0 text-[#35A238]">{icon}</span>
      <span className="min-w-0 text-pretty">{children}</span>
    </span>
  )
}

function PhoneRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-[#d5ddd8] bg-white px-3 py-2.5 text-center text-[13px] leading-snug text-[#1a2e22] sm:px-4 sm:py-3 sm:text-[14px]",
        className
      )}
    >
      <Phone className="size-4 shrink-0 text-[#35A238]" strokeWidth={ICON_STROKE} aria-hidden />
      <span>
        Une question ?{" "}
        <a
          href={SITE_PHONE_HREF}
          className="font-bold text-[#35A238] underline-offset-2 hover:underline"
        >
          {SITE_PHONE_DISPLAY}
        </a>
      </span>
    </div>
  )
}

export function CheckoutReassuranceBanner({
  variant,
  className,
}: CheckoutReassuranceBannerProps) {
  const isParticulier = variant === "particulier"

  return (
    <aside
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-[#c5cfc9] bg-white font-sans shadow-[0_1px_2px_rgb(14_32_16/0.04)]",
        className
      )}
      aria-label="Réassurance CORE Environnement"
    >
      <div className="flex items-start gap-3 bg-[#E9F1EC] px-3 py-3 sm:gap-3.5 sm:px-4 sm:py-3.5">
        <TruckBadge />
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[15px] font-bold leading-snug text-[#142018] sm:text-[16px]">
            {isParticulier
              ? "Livraison et enlèvement inclus"
              : "De la livraison à l'enlèvement"}
          </p>
          <p className="mt-0.5 text-[12px] font-medium leading-snug text-[#3d4f45] sm:text-[13px]">
            {isParticulier
              ? "Traitement des déchets acceptés compris"
              : "CORE organise votre location de benne."}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2.5 bg-white px-3 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-3 sm:gap-y-2 sm:px-4 sm:py-3">
        {isParticulier ? (
          <>
            <MiddleItem icon={<Receipt className="size-[18px]" strokeWidth={ICON_STROKE} />}>
              Montant TTC affiché
            </MiddleItem>
            <span
              className="hidden h-4 w-px shrink-0 bg-[#c5cfc9] sm:inline"
              aria-hidden
            />
            <MiddleItem icon={<Mail className="size-[18px]" strokeWidth={ICON_STROKE} />}>
              Confirmation par e-mail
            </MiddleItem>
          </>
        ) : (
          <>
            <MiddleItem icon={<MapPin className="size-[18px]" strokeWidth={ICON_STROKE} />}>
              Livraison sur place
            </MiddleItem>
            <span
              className="hidden h-4 w-px shrink-0 bg-[#c5cfc9] sm:inline"
              aria-hidden
            />
            <MiddleItem icon={<Recycle className="size-[18px]" strokeWidth={ICON_STROKE} />}>
              Traitement en centre agréé
            </MiddleItem>
          </>
        )}
      </div>

      <PhoneRow />
    </aside>
  )
}
