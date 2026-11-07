"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, UserIcon } from "@hugeicons/core-free-icons"

import { getVitrineNavContext } from "@/app/vitrine/nav-context-actions"
import { cn } from "@/lib/utils"

import { VITRINE_ICON_STROKE } from "./vitrine/icons"

type AccountLink = { label: string; href: string }

import type { VitrineNavContext } from "@/app/vitrine/nav-context-actions"

function buildAccountLinks(ctx: VitrineNavContext): AccountLink[] {
  if (!ctx.isLoggedIn) {
    return [{ label: "Connexion", href: "/login?next=/espace" }]
  }
  if (ctx.isAdmin) {
    return [{ label: "Administration", href: "/admin" }]
  }
  return [{ label: "Mon espace", href: "/espace/commandes" }]
}

type VitrineAccountLinksProps = {
  solid: boolean
  variant: "desktop" | "mobile"
  onLinkClick?: () => void
}

export function VitrineAccountLinks({
  solid,
  variant,
  onLinkClick,
}: VitrineAccountLinksProps) {
  const [links, setLinks] = useState<AccountLink[] | null>(null)

  useEffect(() => {
    let cancelled = false
    getVitrineNavContext().then((ctx) => {
      if (!cancelled) setLinks(buildAccountLinks(ctx))
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (variant === "mobile") {
    if (!links) {
      return (
        <Link
          href="/login?next=/espace"
          onClick={onLinkClick}
          className="flex min-h-11 items-center justify-between border-b border-white/10 py-[15px] text-[21px] text-white/90 hover:text-white"
        >
          Connexion
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            size={18}
            strokeWidth={VITRINE_ICON_STROKE}
            className="opacity-50"
          />
        </Link>
      )
    }
    return (
      <>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className="group flex min-h-11 items-center justify-between border-b border-white/10 py-[15px] text-[21px] text-white/90 hover:text-white"
          >
            {link.label}
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              size={18}
              strokeWidth={VITRINE_ICON_STROKE}
              className="opacity-50"
            />
          </Link>
        ))}
      </>
    )
  }

  if (!links) {
    return (
      <Link
        href="/login?next=/espace"
        className={cn("btn btn-sm", solid ? "btn-ghost-sky" : "btn-ghost-light")}
      >
        <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={VITRINE_ICON_STROKE} />
        Connexion
      </Link>
    )
  }

  const link = links[0]!
  return (
    <Link
      href={link.href}
      className={cn("btn btn-sm", solid ? "btn-ghost-sky" : "btn-ghost-light")}
    >
      <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={VITRINE_ICON_STROKE} />
      {link.label}
    </Link>
  )
}

type SiteAccountLinksProps = {
  className?: string
  onItemClick?: () => void
}

export function SiteAccountLinks({ className, onItemClick }: SiteAccountLinksProps) {
  const [links, setLinks] = useState<AccountLink[] | null>(null)

  useEffect(() => {
    let cancelled = false
    getVitrineNavContext().then((ctx) => {
      if (!cancelled) setLinks(buildAccountLinks(ctx))
    })
    return () => {
      cancelled = true
    }
  }, [])

  const items = links ?? [{ label: "Connexion", href: "/login?next=/espace" }]

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onItemClick}
          className={cn(
            "rounded-xl px-3 py-2.5 text-sm font-medium text-brand-navy transition hover:bg-primary/10 hover:text-primary md:py-2",
            className
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  )
}
