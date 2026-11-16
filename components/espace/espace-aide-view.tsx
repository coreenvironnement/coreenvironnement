import type { ReactNode } from "react"
import { Clock, LifeBuoy, MessageCircle, Phone } from "lucide-react"

import { EspacePageHeader, EspacePanel } from "@/components/espace/espace-panel"
import {
  SITE_CONTACT_VCARD_PHONE_DISPLAY,
  SITE_CONTACT_VCARD_PHONE_HREF,
  SITE_CONTACT_VCARD_WHATSAPP_HREF,
} from "@/lib/site"
import { cn } from "@/lib/utils"

const ctaBase =
  "flex w-full min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-4 py-3 text-center transition-colors sm:min-h-[48px]"

function ContactCta({
  href,
  external,
  ariaLabel,
  icon,
  title,
  subtitle,
  variant,
}: {
  href: string
  external?: boolean
  ariaLabel: string
  icon: ReactNode
  title: string
  subtitle: string
  variant: "phone" | "whatsapp"
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cn(
        ctaBase,
        "shadow-[inset_0_0_0_1px_transparent]",
        variant === "phone" &&
          "bg-[#35A238] text-white hover:bg-[#2d8a30] shadow-sm",
        variant === "whatsapp" &&
          "border border-[#35A238]/25 bg-white text-brand-navy hover:bg-[#ECF4E9]"
      )}
    >
      <span className="flex items-center gap-2 text-[15px] font-semibold leading-tight">
        {icon}
        {title}
      </span>
      <span
        className={cn(
          "text-sm font-medium tabular-nums tracking-wide",
          variant === "phone" ? "text-white/90" : "text-muted-foreground"
        )}
      >
        {subtitle}
      </span>
    </a>
  )
}

export function EspaceAideView() {
  return (
    <div className="mx-auto max-w-lg space-y-5">
      <EspacePageHeader
        className="flex-col items-center justify-center text-center"
        title="Besoin d'aide ?"
        meta="Commande, chantier ou facturation : contactez votre conseiller."
      />

      <EspacePanel className="space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-navy/[0.04] shadow-[inset_0_0_0_1px_rgba(53,162,56,0.22)]"
            aria-hidden
          >
            <LifeBuoy className="size-6 text-[#35A238]" strokeWidth={1.85} />
          </span>
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ligne conseiller
            </p>
            <p className="text-base font-semibold text-brand-navy">
              Parlons de votre besoin
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Même numéro que sur la fiche contact reçue après votre commande.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <ContactCta
            href={SITE_CONTACT_VCARD_PHONE_HREF}
            ariaLabel={`Appeler le conseiller au ${SITE_CONTACT_VCARD_PHONE_DISPLAY}`}
            title="Appeler"
            subtitle={SITE_CONTACT_VCARD_PHONE_DISPLAY}
            variant="phone"
            icon={<Phone className="size-[18px]" strokeWidth={2} aria-hidden />}
          />
          <ContactCta
            href={SITE_CONTACT_VCARD_WHATSAPP_HREF}
            external
            ariaLabel={`Écrire sur WhatsApp au ${SITE_CONTACT_VCARD_PHONE_DISPLAY}`}
            title="WhatsApp"
            subtitle={SITE_CONTACT_VCARD_PHONE_DISPLAY}
            variant="whatsapp"
            icon={
              <MessageCircle
                className="size-[18px] text-[#128C7E]"
                strokeWidth={2}
                aria-hidden
              />
            }
          />
        </div>

        <div className="space-y-2 border-t border-[#35A238]/15 pt-5 text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-medium leading-snug text-brand-navy">
            <Clock
              className="size-4 shrink-0 text-[#35A238]"
              strokeWidth={2}
              aria-hidden
            />
            <span>
              Lundi au Samedi&nbsp;: 8h00-20h00
              <span className="text-muted-foreground"> · Fermé le dimanche</span>
            </span>
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Hors créneaux, laissez un message&nbsp;: nous vous rappelons dès que possible.
          </p>
        </div>
      </EspacePanel>
    </div>
  )
}