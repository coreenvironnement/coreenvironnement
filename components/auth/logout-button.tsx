import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type LogoutButtonProps = {
  className?: string
  size?: "default" | "sm" | "lg"
  variant?: "default" | "ghost" | "outline" | "secondary"
}

export function LogoutButton({
  className,
  size = "sm",
  variant = "ghost",
}: LogoutButtonProps) {
  return (
    <form action="/auth/logout" method="post" className="w-full">
      <Button
        type="submit"
        variant={variant}
        size={size}
        className={cn("gap-2 text-brand-navy/80", className)}
      >
        <LogOut className="size-4 text-[#35A238]" aria-hidden />
        Se déconnecter
      </Button>
    </form>
  )
}
