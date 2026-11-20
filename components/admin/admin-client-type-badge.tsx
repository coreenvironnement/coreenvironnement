import { cn } from "@/lib/utils"

export function AdminClientTypeBadge({
  kind,
}: {
  kind: "particulier" | "professionnel"
}) {
  const isPro = kind === "professionnel"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-none tracking-wide",
        isPro
          ? "border-[#35A238]/30 bg-[#ECF4E9] text-[#19752b]"
          : "border-slate-200/90 bg-slate-100/90 text-slate-800"
      )}
    >
      {isPro ? "Pro" : "Particulier"}
    </span>
  )
}