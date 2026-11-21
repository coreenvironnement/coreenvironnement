import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"

/** Bandeau tunnel pro : déchets dangereux hors commande en ligne. */
export function HazardousWasteTunnelNotice() {
  return (
    <div
      className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-3.5 py-3 text-left"
      role="status"
    >
      <p className="text-[13px] font-semibold leading-snug text-amber-950">
        Prise en charge sur étude
      </p>
      <p className="mt-1 text-[12px] leading-relaxed text-amber-900/90">
        Les déchets dangereux et contenants ADR ne peuvent pas être commandés en
        ligne. Notre équipe étudie votre besoin au cas par cas (trackdéchets,
        CAP, conditionnement).
      </p>
      <p className="mt-2 text-[12px] leading-relaxed text-amber-900/90">
        Contactez-nous au{" "}
        <a
          href={SITE_PHONE_HREF}
          className="font-semibold text-brand-green underline-offset-2 hover:underline"
        >
          {SITE_PHONE_DISPLAY}
        </a>
        .
      </p>
    </div>
  )
}