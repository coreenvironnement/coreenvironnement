import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Call02Icon,
  Leaf01Icon,
  Linkedin01Icon,
  Recycle03Icon,
  SecurityCheckIcon,
  SparklesIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons"

import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"

import { VITRINE_ICON_STROKE } from "./icons"
import { VitrineLogo } from "./logo"

const NAV_LINKS = [
  { href: "#services", label: "Nos services" },
  { href: "#engagements", label: "Nos engagements" },
  { href: "#espace-client", label: "Espace client" },
  { href: "#fonctionnement", label: "Comment ça fonctionne" },
  { href: "#faq", label: "FAQ" },
] as const

const TRUST_INDICATORS = [
  { icon: SparklesIcon, label: "Plus simple" },
  { icon: SecurityCheckIcon, label: "Plus transparent" },
  { icon: Recycle03Icon, label: "Plus responsable" },
] as const

const SOCIAL_LINKS = [
  {
    href: "https://www.linkedin.com/company/core-environnement",
    label: "LinkedIn",
    icon: Linkedin01Icon,
  },
  {
    href: "https://www.youtube.com/@coreenvironnement",
    label: "YouTube",
    icon: YoutubeIcon,
  },
  {
    href: "#engagements",
    label: "Nos engagements environnementaux",
    icon: Leaf01Icon,
  },
] as const

export function VitrineFooter() {
  return (
    <footer id="contact" className="vitrine-footer scroll-mt-[72px]">
      <div aria-hidden className="vitrine-footer__pattern vitrine-footer__pattern--curve-left" />
      <div aria-hidden className="vitrine-footer__pattern vitrine-footer__pattern--curve-right" />
      <div aria-hidden className="vitrine-footer__pattern vitrine-footer__pattern--leaf" />

      <div className="container-x relative">
        <div className="vitrine-footer__main">
          <div className="vitrine-footer__brand">
            <VitrineLogo variant="footer" />
            <p className="vitrine-footer__tagline">
              Location de bennes et suivi digital des déchets en Île-de-France.
            </p>
            <a href={SITE_PHONE_HREF} className="vitrine-footer__phone">
              <HugeiconsIcon icon={Call02Icon} size={16} strokeWidth={VITRINE_ICON_STROKE} aria-hidden />
              {SITE_PHONE_DISPLAY}
            </a>
            <ul className="vitrine-footer__values" aria-label="Nos engagements">
              {TRUST_INDICATORS.map(({ icon, label }) => (
                <li key={label} className="vitrine-footer__value">
                  <HugeiconsIcon
                    icon={icon}
                    size={16}
                    strokeWidth={VITRINE_ICON_STROKE}
                    className="shrink-0 text-brand-green"
                    aria-hidden
                  />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="vitrine-footer__columns">
            <div>
              <h3 className="vitrine-footer__column-title">Navigation</h3>
              <ul className="vitrine-footer__links">
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="vitrine-footer__column-title">Espace client</h3>
              <ul className="vitrine-footer__links">
                <li>
                  <Link href="/dashboard" className="vitrine-footer__link-accent">
                    Se connecter
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={14}
                      strokeWidth={VITRINE_ICON_STROKE}
                      aria-hidden
                    />
                  </Link>
                </li>
                <li>
                  <Link href="/pro">Compte professionnel</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="vitrine-footer__column-title">Légal</h3>
              <ul className="vitrine-footer__links">
                <li>
                  <Link href="/mentions-legales">Mentions légales</Link>
                </li>
                <li>
                  <Link href="/politique-confidentialite">Politique de confidentialité</Link>
                </li>
              </ul>
            </div>

            <aside className="vitrine-footer__cta-card">
              <span className="vitrine-footer__cta-icon">
                <HugeiconsIcon icon={Leaf01Icon} size={20} strokeWidth={VITRINE_ICON_STROKE} aria-hidden />
              </span>
              <p className="vitrine-footer__cta-text">
                Ensemble pour une île-de-France{" "}
                <span className="underline decoration-brand-green decoration-2 underline-offset-[5px]">
                  plus propre
                </span>
                .
              </p>
            </aside>
          </div>
        </div>

        <div className="vitrine-footer__bottom">
          <div className="vitrine-footer__legal">
            <p className="vitrine-footer__copyright">
              © {new Date().getFullYear()} CORE ENVIRONNEMENT — Tous droits réservés
            </p>
            <p className="vitrine-footer__credit">
              Site réalisé par{" "}
              <a
                href="https://raamdigital.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="vitrine-footer__credit-link"
              >
                Raam Digital
              </a>
            </p>
          </div>
          <div className="vitrine-footer__social">
            <span className="vitrine-footer__social-label">Suivez-nous</span>
            <ul className="vitrine-footer__social-list" aria-label="Réseaux sociaux">
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    className="vitrine-footer__social-link"
                  >
                    <HugeiconsIcon icon={icon} size={16} strokeWidth={VITRINE_ICON_STROKE} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
