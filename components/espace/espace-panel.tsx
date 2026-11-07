import { cn } from "@/lib/utils"

export function EspacePanel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#35A238]/20 bg-white/95 p-4 shadow-sm sm:p-5",
        className
      )}
    >
      {children}
    </div>
  )
}

export function EspacePageHeader({
  title,
  meta,
  action,
}: {
  title: string
  meta?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-brand-navy sm:text-2xl">
          {title}
        </h1>
        {meta ? <p className="mt-0.5 text-sm text-muted-foreground">{meta}</p> : null}
      </div>
      {action}
    </div>
  )
}
