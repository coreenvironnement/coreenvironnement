"use client"

import { useState } from "react"
import { ChevronDown, Plus } from "lucide-react"

import { AdminChantierCreateForm } from "@/components/admin/admin-chantier-create-form"
import { cn } from "@/lib/utils"

export function AdminChantierCreateSection() {
  const [open, setOpen] = useState(false)

  return (
    <section className="border-b border-[#35A238]/12">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="admin-chantier-create-panel"
        className={cn(
          "relative flex w-full flex-col items-center gap-2 border-b border-[#35A238]/10 bg-[#F7FAF5]/55 px-4 py-4 text-center transition-colors sm:px-6",
          "hover:bg-[#ECF4E9]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35A238]/35 focus-visible:ring-offset-2"
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#35A238]/12 text-[#19752b]">
          <Plus className="size-4" aria-hidden />
        </span>
        <span className="min-w-0 max-w-xl">
          <span className="block text-base font-semibold leading-snug text-brand-navy">
            Nouveau chantier
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
            Nom et adresse sont requis. Le code affaire reste facultatif.
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-[#19752b] transition-transform duration-200 sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2",
            open && "rotate-180"
          )}
          strokeWidth={2}
          aria-hidden
        />
      </button>

      {open ? (
        <div id="admin-chantier-create-panel" className="bg-[#F7FAF5]/45 px-4 py-6 sm:px-6">
          <AdminChantierCreateForm />
        </div>
      ) : null}
    </section>
  )
}