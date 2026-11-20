/** Pastilles distinctes mais douces pour repérer les clients (≤ ~30 visibles, 16 teintes). */
const PARTICULIER_CHIP_STYLES = [
  { chip: "bg-sky-100", icon: "text-sky-900" },
  { chip: "bg-indigo-100", icon: "text-indigo-900" },
  { chip: "bg-violet-100", icon: "text-violet-900" },
  { chip: "bg-fuchsia-100", icon: "text-fuchsia-900" },
  { chip: "bg-rose-100", icon: "text-rose-900" },
  { chip: "bg-amber-100", icon: "text-amber-950" },
  { chip: "bg-orange-100", icon: "text-orange-950" },
  { chip: "bg-lime-100", icon: "text-lime-950" },
  { chip: "bg-emerald-100", icon: "text-emerald-900" },
  { chip: "bg-teal-100", icon: "text-teal-900" },
  { chip: "bg-cyan-100", icon: "text-cyan-950" },
  { chip: "bg-blue-100", icon: "text-blue-950" },
  { chip: "bg-slate-200", icon: "text-slate-800" },
  { chip: "bg-stone-200", icon: "text-stone-800" },
  { chip: "bg-purple-100", icon: "text-purple-900" },
  { chip: "bg-pink-100", icon: "text-pink-900" },
] as const

function hashClientKey(key: string): number {
  let h = 0
  for (let i = 0; i < key.length; i++) {
    h = (Math.imul(31, h) + key.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function particulierAvatarStyle(clientKey: string): (typeof PARTICULIER_CHIP_STYLES)[number] {
  const index = hashClientKey(clientKey) % PARTICULIER_CHIP_STYLES.length
  return PARTICULIER_CHIP_STYLES[index]!
}