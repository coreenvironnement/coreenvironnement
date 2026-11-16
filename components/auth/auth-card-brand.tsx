import { VitrineLogo } from "@/components/vitrine/logo"

/** Logo CORE centré en tête de carte auth (connexion / inscription). */
export function AuthCardBrand({ compact }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex justify-center pb-0 pt-0" : "flex justify-center pb-1 pt-0.5"}>
      <VitrineLogo
        priority
        variant="login"
        className={
          compact
            ? "!h-8 !w-[min(62vw,176px)] sm:!h-9 sm:!max-w-[188px]"
            : "!h-9 !w-[min(68vw,200px)] sm:!h-10 sm:!max-w-[210px]"
        }
      />
    </div>
  )
}