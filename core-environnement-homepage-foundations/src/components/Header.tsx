import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Cancel01Icon,
  Menu01Icon,
  TruckIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "../utils/cn";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Accueil", href: "#accueil" },
  { label: "Nos services", href: "#services" },
  { label: "Nos engagements", href: "#engagements" },
  { label: "Comment ça fonctionne", href: "#fonctionnement" },
  { label: "FAQ", href: "#faq" },
];

/* Affiché dans la navigation du menu mobile uniquement */
const MOBILE_NAV_LINKS = [
  ...NAV_LINKS.slice(0, 4),
  { label: "Espace client", href: "#espace-client" },
  ...NAV_LINKS.slice(4),
];

const STROKE = 1.7;

export default function Header({ onOrder }: { onOrder: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* État sur scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Verrouillage du scroll + touche Échap pour le menu mobile */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const openOrder = () => {
    setMenuOpen(false);
    onOrder();
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ease-out",
          scrolled
            ? "border-b border-ink-900/[0.07] bg-white/85 shadow-[0_1px_0_rgba(18,24,21,0.02)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-x flex h-[68px] items-center justify-between gap-4 lg:h-[76px]">
          {/* Logo */}
          <a
            href="#accueil"
            aria-label="CORE ENVIRONNEMENT — Accueil"
            className={cn(
              "shrink-0 transition-colors duration-500",
              scrolled ? "text-ink-900" : "text-white",
            )}
          >
            <Logo />
          </a>

          {/* Navigation desktop */}
          <nav aria-label="Navigation principale" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative text-[14.5px] font-medium transition-colors duration-300",
                  scrolled
                    ? "text-ink-600 hover:text-forest-800"
                    : "text-white/80 hover:text-white",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-[7px] left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                    scrolled ? "bg-forest-700" : "bg-white",
                  )}
                />
              </a>
            ))}
          </nav>

          {/* Actions desktop */}
          <div className="hidden items-center gap-2.5 lg:flex">
            <a
              href="#espace-client"
              className={cn(
                "btn btn-sm",
                scrolled ? "btn-ghost-dark" : "btn-ghost-light",
              )}
            >
              <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={STROKE} />
              Espace client
            </a>
            <button
              type="button"
              onClick={onOrder}
              className={cn("btn btn-sm group", scrolled ? "btn-primary" : "btn-light")}
            >
              Commander une benne
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                strokeWidth={STROKE}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {/* Actions mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={openOrder}
              className="btn btn-sm btn-light group"
              aria-label="Commander une benne"
            >
              <HugeiconsIcon icon={TruckIcon} size={17} strokeWidth={STROKE} />
              <span className="hidden min-[430px]:inline">Commander</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-[10px] border transition-colors duration-500",
                scrolled
                  ? "border-ink-900/10 bg-white text-ink-800 hover:bg-paper"
                  : "border-white/20 bg-white/[0.06] text-white backdrop-blur-md hover:bg-white/[0.12]",
              )}
            >
              <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={STROKE} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile plein écran */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          menuOpen ? "" : "pointer-events-none",
        )}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        {/* Fond */}
        <div
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink-950/60 backdrop-blur-sm transition-opacity duration-400",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Panneau */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className={cn(
            "absolute inset-x-0 top-0 flex h-[100svh] flex-col bg-forest-950 text-white shadow-pop transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(36,112,77,0.28),transparent_60%)]",
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0",
          )}
        >
          <div className="container-x flex h-[68px] items-center justify-between">
            <Logo className="text-white" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/15 bg-white/[0.05] text-white transition-colors hover:bg-white/[0.12]"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={STROKE} />
            </button>
          </div>

          <nav
            aria-label="Navigation mobile"
            className="container-x flex flex-1 flex-col justify-center"
          >
            {MOBILE_NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ animationDelay: menuOpen ? `${80 + i * 50}ms` : "0ms" }}
                className={cn(
                  "group flex items-center justify-between border-b border-white/10 py-[15px] font-display text-[21px] font-semibold tracking-[-0.02em] text-white/90 transition-colors hover:text-white",
                  menuOpen ? "animate-fade-up" : "opacity-0",
                )}
              >
                {link.label}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={18}
                  strokeWidth={STROKE}
                  className="-translate-x-1.5 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-50"
                />
              </a>
            ))}
          </nav>

          <div className="container-x space-y-2.5 pb-10 pt-6">
            <button type="button" onClick={openOrder} className="btn btn-light w-full">
              Commander une benne
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={17}
                strokeWidth={STROKE}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
            <a href="#espace-client" className="btn btn-ghost-light w-full">
              <HugeiconsIcon icon={UserIcon} size={17} strokeWidth={STROKE} />
              Espace client
            </a>
            <p className="pt-3 text-center text-[12.5px] font-medium tracking-wide text-white/45">
              Intervention 24h · Commande en 3 min · Toute l’Île-de-France
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
