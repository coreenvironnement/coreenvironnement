"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

import { Input } from "./input"

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  inputClassName?: string
  /** Champs vitrine auth (`form-field-input`, h-12) — évite le style shadcn compact. */
  variant?: "shadcn" | "vitrine"
}

function useVitrineVariant(
  variant: PasswordInputProps["variant"],
  inputClassName?: string
): boolean {
  return variant === "vitrine" || Boolean(inputClassName?.includes("form-field-input"))
}

export function PasswordInput({
  className,
  inputClassName,
  variant,
  id,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const vitrine = useVitrineVariant(variant, inputClassName)

  const toggleClass =
    "absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-brand-muted transition-colors hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"

  if (vitrine) {
    return (
      <div className={cn("relative", className)}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={cn(inputClassName, "pr-11")}
          {...props}
        />
        <button
          type="button"
          aria-pressed={visible}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className={toggleClass}
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
        className={toggleClass}
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