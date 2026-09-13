import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight02Icon,
  Calendar03Icon,
  MapPinIcon,
  TruckIcon,
} from "@hugeicons/core-free-icons";
import Logo from "./Logo";

/* Navy légèrement plus profond que le CTA final (#183574) */
const FOOTER_NAVY = "#0F2552";
const GREEN = "#35A238";

const SERVICE_LINKS = [
  { label: "Location de bennes", href: "#services" },
  { label: "Déchetteries professionnelles", href: "#services" },
  { label: "Déchets dangereux", href: "#services" },
  { label: "Opérations sur mesure", href: "#services" },
];

const COMPANY_LINKS = [
  { label: "Nos engagements", href: "#engagements" },
  { label: "Comment ça fonctionne", href: "#fonctionnement" },
  { label: "Zone d’intervention", href: "#zone" },
  { label: "FAQ", href: "#faq" },
];

const PRO_LINKS = [
  { label: "Compte PRO", href: "#compte-pro" },
  { label: "Espace client", href: "#espace-client" },
  { label: "Créer un compte", href: "#compte-pro" },
  { label: "Se connecter", href: "#espace-client" },
];

const LEGAL_LINKS = [
  { label: "Mentions légales", href: "#mentions-legales" },
  { label: "Politique de confidentialité", href: "#confidentialite" },
  { label: "Gestion des cookies", href: "#cookies" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="group inline-flex items-start gap-1 text-[13.5px] leading-snug text-white/70 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ onOrder }: { onOrder: () => void }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: FOOTER_NAVY }}
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Informations complémentaires CORE ENVIRONNEMENT
      </h2>

      {/* Séparation subtile avec le CTA final */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 72px)",
        }}
      />

      <div className="container-x relative">
        {/* ── Zone marque + navigation ── */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] lg:gap-16 lg:py-[4.5rem]">
          {/* Marque */}
          <div className="max-w-[24rem]">
            <Logo className="text-white" />

            <p className="mt-5 text-[14px] leading-[1.7] text-white/60">
              Solutions de gestion des déchets pour particuliers et professionnels en
              Île-de-France.
            </p>

            <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-display text-[12px] font-medium tracking-[0.01em] text-white/55">
              {["Location", "Collecte", "Traçabilité", "Valorisation"].map((word, i) => (
                <span key={word} className="flex items-center gap-2.5">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-white/25"
                    />
                  )}
                  {word}
                </span>
              ))}
            </p>

            <button
              type="button"
              onClick={onOrder}
              className="btn btn-accent group mt-7 w-full sm:w-auto"
            >
              Commander une benne
              <HugeiconsIcon
                icon={ArrowUpRight02Icon}
                size={16}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>

          {/* Colonnes de navigation */}
          <nav
            aria-label="Navigation du pied de page"
            className="grid grid-cols-2 gap-9 min-[480px]:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-8"
          >
            <FooterColumn title="Services" links={SERVICE_LINKS} />
            <FooterColumn title="Core Environnement" links={COMPANY_LINKS} />
            <FooterColumn title="Professionnels" links={PRO_LINKS} />

            {/* Contact — structure prête, aucune donnée inventée */}
            <div id="contact" className="scroll-mt-[96px]">
              <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                Contact
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href="#commander"
                    className="group inline-flex items-start gap-2 text-[13.5px] leading-snug text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    <HugeiconsIcon
                      icon={TruckIcon}
                      size={15}
                      strokeWidth={1.7}
                      className="mt-[2px] shrink-0 text-white/35 transition-colors duration-200 group-hover:text-white/60"
                    />
                    Demander une intervention
                  </a>
                </li>
                <li>
                  <a
                    href="#espace-client"
                    className="group inline-flex items-start gap-2 text-[13.5px] leading-snug text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    <HugeiconsIcon
                      icon={Calendar03Icon}
                      size={15}
                      strokeWidth={1.7}
                      className="mt-[2px] shrink-0 text-white/35 transition-colors duration-200 group-hover:text-white/60"
                    />
                    Suivre mes prestations
                  </a>
                </li>
              </ul>

              {/* Emplacements réservés — coordonnées non communiquées */}
              <div
                className="mt-5 rounded-[12px] border border-white/10 px-3.5 py-3"
                style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <p className="flex items-center gap-2 text-[12px] font-medium text-white/50">
                  <HugeiconsIcon
                    icon={MapPinIcon}
                    size={14}
                    strokeWidth={1.7}
                    className="shrink-0"
                    color={GREEN}
                  />
                  Île-de-France
                </p>
                <p className="mt-2 text-[11.5px] leading-relaxed text-white/60">
                  Téléphone et e-mail en cours de mise en ligne.
                </p>
              </div>
            </div>
          </nav>
        </div>

        {/* ── Barre légale ── */}
        <div
          className="flex flex-col gap-5 border-t py-7 sm:flex-row sm:items-center sm:justify-between lg:py-8"
          style={{ borderColor: "rgba(255,255,255,0.09)" }}
        >
          <p className="text-[12.5px] text-white/45">
            © CORE ENVIRONNEMENT — Tous droits réservés {year}
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[12.5px] text-white/45 transition-colors duration-200 hover:text-white/80"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
