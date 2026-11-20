/** Teintes douces pour distinguer les cartes chantier (hash stable sur l’id). */
const CHANTIER_CARD_STYLES = [
  {
    article:
      "border-sky-200/80 bg-gradient-to-br from-sky-50/90 via-white to-white shadow-[0_1px_0_rgba(14,116,144,0.12)]",
    icon: "bg-sky-100 text-sky-900",
  },
  {
    article:
      "border-indigo-200/80 bg-gradient-to-br from-indigo-50/90 via-white to-white shadow-[0_1px_0_rgba(67,56,202,0.12)]",
    icon: "bg-indigo-100 text-indigo-900",
  },
  {
    article:
      "border-violet-200/80 bg-gradient-to-br from-violet-50/90 via-white to-white shadow-[0_1px_0_rgba(109,40,217,0.12)]",
    icon: "bg-violet-100 text-violet-900",
  },
  {
    article:
      "border-fuchsia-200/80 bg-gradient-to-br from-fuchsia-50/90 via-white to-white shadow-[0_1px_0_rgba(192,38,211,0.1)]",
    icon: "bg-fuchsia-100 text-fuchsia-900",
  },
  {
    article:
      "border-rose-200/80 bg-gradient-to-br from-rose-50/90 via-white to-white shadow-[0_1px_0_rgba(225,29,72,0.1)]",
    icon: "bg-rose-100 text-rose-900",
  },
  {
    article:
      "border-amber-200/80 bg-gradient-to-br from-amber-50/95 via-white to-white shadow-[0_1px_0_rgba(217,119,6,0.1)]",
    icon: "bg-amber-100 text-amber-950",
  },
  {
    article:
      "border-orange-200/80 bg-gradient-to-br from-orange-50/95 via-white to-white shadow-[0_1px_0_rgba(234,88,12,0.1)]",
    icon: "bg-orange-100 text-orange-950",
  },
  {
    article:
      "border-lime-200/80 bg-gradient-to-br from-lime-50/95 via-white to-white shadow-[0_1px_0_rgba(101,163,13,0.12)]",
    icon: "bg-lime-100 text-lime-950",
  },
  {
    article:
      "border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 via-white to-white shadow-[0_1px_0_rgba(5,150,105,0.12)]",
    icon: "bg-emerald-100 text-emerald-900",
  },
  {
    article:
      "border-teal-200/80 bg-gradient-to-br from-teal-50/90 via-white to-white shadow-[0_1px_0_rgba(13,148,136,0.12)]",
    icon: "bg-teal-100 text-teal-900",
  },
  {
    article:
      "border-cyan-200/80 bg-gradient-to-br from-cyan-50/90 via-white to-white shadow-[0_1px_0_rgba(8,145,178,0.12)]",
    icon: "bg-cyan-100 text-cyan-950",
  },
  {
    article:
      "border-blue-200/80 bg-gradient-to-br from-blue-50/90 via-white to-white shadow-[0_1px_0_rgba(37,99,235,0.12)]",
    icon: "bg-blue-100 text-blue-950",
  },
  {
    article:
      "border-slate-200/90 bg-gradient-to-br from-slate-100/90 via-white to-white shadow-[0_1px_0_rgba(71,85,105,0.1)]",
    icon: "bg-slate-200 text-slate-800",
  },
  {
    article:
      "border-stone-200/90 bg-gradient-to-br from-stone-100/95 via-white to-white shadow-[0_1px_0_rgba(120,113,108,0.1)]",
    icon: "bg-stone-200 text-stone-800",
  },
  {
    article:
      "border-purple-200/80 bg-gradient-to-br from-purple-50/90 via-white to-white shadow-[0_1px_0_rgba(147,51,234,0.1)]",
    icon: "bg-purple-100 text-purple-900",
  },
  {
    article:
      "border-pink-200/80 bg-gradient-to-br from-pink-50/90 via-white to-white shadow-[0_1px_0_rgba(219,39,119,0.1)]",
    icon: "bg-pink-100 text-pink-900",
  },
  {
    article:
      "border-[#35A238]/22 bg-gradient-to-br from-[#ECF4E9]/70 via-white to-white shadow-[0_1px_0_rgba(53,162,56,0.12)]",
    icon: "bg-[#35A238]/12 text-[#19752b]",
  },
  {
    article:
      "border-red-200/70 bg-gradient-to-br from-red-50/80 via-white to-white shadow-[0_1px_0_rgba(220,38,38,0.08)]",
    icon: "bg-red-100 text-red-900",
  },
  {
    article:
      "border-yellow-200/80 bg-gradient-to-br from-yellow-50/95 via-white to-white shadow-[0_1px_0_rgba(202,138,4,0.1)]",
    icon: "bg-yellow-100 text-yellow-950",
  },
  {
    article:
      "border-zinc-200/90 bg-gradient-to-br from-zinc-100/95 via-white to-white shadow-[0_1px_0_rgba(113,113,122,0.1)]",
    icon: "bg-zinc-200 text-zinc-800",
  },
  {
    article:
      "border-[#19752b]/20 bg-gradient-to-br from-[#E8F5E9]/90 via-white to-white shadow-[0_1px_0_rgba(25,117,43,0.1)]",
    icon: "bg-[#D4EDD6] text-[#145a22]",
  },
  {
    article:
      "border-sky-300/60 bg-gradient-to-br from-slate-50/90 via-sky-50/40 to-white shadow-[0_1px_0_rgba(56,189,248,0.1)]",
    icon: "bg-slate-100 text-slate-800",
  },
] as const

function hashChantierId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function chantierCardStyle(chantierId: string): (typeof CHANTIER_CARD_STYLES)[number] {
  return CHANTIER_CARD_STYLES[hashChantierId(chantierId) % CHANTIER_CARD_STYLES.length]!
}