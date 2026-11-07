"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

import { Input } from "./input"

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  inputClassName?: string
}

export function PasswordInput({
  className,
  inputClassName,
  id,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={cn("relative", className)}>
      <Input
        id={id}
        type={visible ? "text" : "password"}
        className={cn("pr-11", inputClassName)}
        {...props}
      />
      <button
        type="button"
        aria-pressed={visible}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-brand-muted transition-colors hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? (
          <EyeOff className="size-[18px]" strokeWidth={1.75} aria-hidden />
        ) : (
          <Eye className="size-[18px]" strokeWidth={1.75} aria-hidden />
        )}
      </button>
    </div>
  )
}
