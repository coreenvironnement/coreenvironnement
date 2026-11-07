import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type VitrineSectionHeaderProps = {
  eyebrow?: ReactNode
  title: ReactNode
  titleId?: string
  titleAs?: "h1" | "h2"
  intro?: ReactNode
  className?: string
  titleClassName?: string
  align?: "center" | "left"
  onDark?: boolean
}

export function VitrineSectionHeader({
  eyebrow,
  title,
  titleId,
  titleAs: TitleTag = "h2",
  intro,
  className,
  titleClassName,
  align = "center",
  onDark = false,
}: VitrineSectionHeaderProps) {
  return (
    <header
      className={cn(
        "vitrine-section-header",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "section-eyebrow",
            onDark && "section-eyebrow--inverse",
            align === "center" && "mx-auto w-fit"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <TitleTag
        id={titleId}
        className={cn(
          TitleTag === "h1"
            ? cn("vitrine-h1", onDark && "vitrine-h1--on-dark")
            : cn(
                onDark ? "vitrine-h2 vitrine-h2--on-dark" : "section-title",
                onDark ? "text-white" : "text-[#152a3b]"
              ),
          "text-balance",
          titleClassName
        )}
      >
        {title}
      </TitleTag>
      {intro ? (
        <p
          className={cn(
            "vitrine-section-intro",
            onDark && "vitrine-section-intro--on-dark",
            align === "center" && "mx-auto max-w-3xl"
          )}
        >
          {intro}
        </p>
      ) : null}
    </header>
  )
}
