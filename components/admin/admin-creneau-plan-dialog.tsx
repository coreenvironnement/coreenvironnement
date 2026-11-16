"use client"

import { useState } from "react"
import { CalendarClock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = {
  title: string
  description?: string
  submitLabel: string
  defaultDate?: string | null
  defaultTime?: string
  returnTo: string
  action: (formData: FormData) => void | Promise<void>
  triggerClassName?: string
  variant?: "default" | "outline"
}

export function AdminCreneauPlanDialog({
  title,
  description,
  submitLabel,
  defaultDate,
  defaultTime = "08:00",
  returnTo,
  action,
  triggerClassName,
  variant = "default",
}: Props) {
  const [open, setOpen] = useState(false)
  const initialDate =
    defaultDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            size="sm"
            variant={variant === "outline" ? "outline" : "default"}
            className={cn(triggerClassName)}
          />
        }
      >
        <CalendarClock className="size-3.5" aria-hidden />
        {submitLabel}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <form
          action={async (formData) => {
            await action(formData)
            setOpen(false)
          }}
          className="space-y-4"
        >
          <input type="hidden" name="returnTo" value={returnTo} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor={`plan-date-${title}`}>
                Date
              </label>
              <Input
                id={`plan-date-${title}`}
                name="date"
                type="date"
                required
                defaultValue={initialDate}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor={`plan-time-${title}`}>
                Heure (Paris)
              </label>
              <Input
                id={`plan-time-${title}`}
                name="time"
                type="time"
                required
                defaultValue={defaultTime}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Annuler
            </DialogClose>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}