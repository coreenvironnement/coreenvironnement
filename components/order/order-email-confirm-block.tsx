import Link from "next/link"

import { safeNextPath } from "@/lib/auth/post-login-path"

type Props = {
  email: string
  needsPasswordSetup?: boolean
  passwordSetupEmailSent?: boolean
}

export function OrderEmailConfirmBlock({
  email,
  needsPasswordSetup = false,
  passwordSetupEmailSent = false,
}: Props) {
  const next = safeNextPath("/mes-commandes") ?? "/mes-commandes"
  const loginHref = `/login?next=${encodeURIComponent(next)}`

  return (
    <div className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-3 text-left">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-amber-950">
        {needsPasswordSetup ? "Activez votre espace client" : "Accéder à votre espace client"}
      </p>
      {needsPasswordSetup ? (
        <p className="mt-2 text-[13px] leading-snug text-amber-950/90">
          Compte associé à <span className="font-medium">{email}</span>.
          {passwordSetupEmailSent ? (
            <>
              {" "}
              Consultez votre boîte mail : un message CORE vous permet de{" "}
              <strong>choisir votre mot de passe</strong>.
            </>
          ) : (
            <>
              {" "}
              Un e-mail vous permet de <strong>choisir votre mot de passe</strong> (vérifiez
              vos courriers indésirables).
            </>
          )}
        </p>
      ) : (
        <p className="mt-2 text-[13px] leading-snug text-amber-950/90">
          Votre compte est associé à{" "}
          <span className="font-medium">{email}</span>. Connectez-vous avec votre{" "}
          <strong>mot de passe</strong> (ou « Mot de passe oublié ? » si besoin).
        </p>
      )}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Link
          href={loginHref}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-amber-300/80 bg-white px-3 text-sm font-medium text-amber-950 hover:bg-amber-50"
        >
          Se connecter
        </Link>
        {needsPasswordSetup ? (
          <span className="text-[12px] leading-snug text-amber-950/85">
            Déjà passé par le mail ? Utilisez « Mot de passe oublié » sur la connexion.
          </span>
        ) : (
          <Link
            href="/mes-commandes"
            className="text-center text-[13px] font-medium text-primary underline-offset-2 hover:underline sm:text-left"
          >
            Espace client
          </Link>
        )}
      </div>
    </div>
  )
}
