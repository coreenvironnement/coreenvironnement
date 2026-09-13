import Link from "next/link"

import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"

import { VitrineLogo } from "./logo"

export function VitrineFooter() {
  return (
    <footer id="contact" className="scroll-mt-[72px] bg-[#142F69] text-white">
      <div className="container-x pb-12 pt-10 sm:pb-16 sm:pt-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <VitrineLogo variant="footer" />
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Location de bennes et suivi digital des déchets en Île-de-France.
            </p>
            <a
              href={SITE_PHONE_HREF}
              className="mt-4 inline-block text-sm font-semibold text-brand-green hover:text-white"
            >
              {SITE_PHONE_DISPLAY}
            </a>
          </div>
          <div>
            <h3 className="vitrine-label text-white/45">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li>
                <a href="#services" className="transition hover:text-white">
                  Nos services
                </a>
              </li>
              <li>
                <a href="#engagements" className="transition hover:text-white">
                  Nos engagements
                </a>
              </li>
              <li>
                <a href="#espace-client" className="transition hover:text-white">
                  Espace client
                </a>
              </li>
              <li>
                <a href="#fonctionnement" className="transition hover:text-white">
                  Comment ça fonctionne
                </a>
              </li>
              <li>
                <a href="#faq" className="transition hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="vitrine-label text-brand-sky/80">
              Espace client
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li>
                <Link
                  href="/dashboard"
                  className="font-semibold text-brand-sky transition hover:text-white"
                >
                  Se connecter
                </Link>
              </li>
              <li>
                <Link href="/pro" className="transition hover:text-white">
                  Compte professionnel
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="vitrine-label text-white/45">
              Légal
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li>
                <Link href="/mentions-legales" className="transition hover:text-white">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="transition hover:text-white">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/45">
          © {new Date().getFullYear()} CORE ENVIRONNEMENT — Tous droits réservés
        </p>
      </div>
    </footer>
  )
}
