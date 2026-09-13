import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building02Icon,
  ConstructionIcon,
  ContainerIcon,
  House01Icon,
  Location01Icon,
  Shield01Icon,
  Tick02Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "../utils/cn";

type IconType = typeof ContainerIcon;

const STROKE = 1.7;
const NAVY = "#183574";
const ACCENT = "#35A238";
const SIGNAL = "#269DD2";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

function ServiceCard({
  children,
  featured = false,
  className,
}: {
  children: React.ReactNode;
  featured?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const [hovering, setHovering] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    return () => cancelAnimationFrame(frame.current);
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !fine || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 4.2;
    const rotateX = (0.5 - py) * 3.2;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setTilt({ x: rotateX, y: rotateY }));
  };

  const onEnter = () => {
    if (reduced) return;
    setHovering(true);
  };

  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    setHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  const transform =
    reduced || !fine
      ? undefined
      : hovering
        ? `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-7px)`
        : "perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px)";

  return (
    <article
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onLeave}
      style={{
        transform,
        transition: reduced
          ? "none"
          : `transform ${hovering ? "140ms linear" : "380ms cubic-bezier(0.22, 1, 0.36, 1)"}, box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1), border-color 380ms ease`,
        willChange: hovering ? "transform" : undefined,
      }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[22px] border p-6 sm:p-8 lg:p-9",
        featured ? "bg-gradient-to-br from-white to-[#f4f8f5]" : "bg-white",
        hovering && fine
          ? "border-[#c5d4cc] shadow-[0_18px_40px_-24px_rgba(16,36,28,0.28),0_4px_10px_-6px_rgba(16,36,28,0.08)]"
          : featured
            ? "border-[#d7e3db] shadow-[0_1px_2px_rgba(16,36,28,0.04),0_12px_28px_-20px_rgba(16,36,28,0.14)]"
            : "border-[#E3E9E6] shadow-[0_1px_2px_rgba(16,36,28,0.04),0_12px_28px_-20px_rgba(16,36,28,0.14)]",
        !fine && !reduced && "active:translate-y-px active:shadow-[0_1px_2px_rgba(16,36,28,0.06)]",
        className,
      )}
    >
      {/* Halo intérieur très discret au hover */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(53,162,56,0.09),transparent_68%)] transition-opacity duration-500",
          hovering ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </article>
  );
}

function CardHeader({
  index,
  icon,
  title,
  titleExtra,
  description,
}: {
  index: string;
  icon: IconType;
  title: string;
  titleExtra?: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <span
          className="font-display text-[12px] font-medium tracking-[0.22em] text-ink-400"
          aria-hidden="true"
        >
          {index}
        </span>
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#eef6f1] text-[#183574] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100">
          <HugeiconsIcon icon={icon} size={22} strokeWidth={STROKE} />
        </span>
      </div>
      <h3
        className="mt-5 font-display text-[22px] font-semibold leading-[1.22] tracking-[-0.025em] sm:text-[24px]"
        style={{ color: NAVY }}
      >
        {title}
        {titleExtra && (
          <span className="mt-1 block font-semibold tracking-[-0.02em]">{titleExtra}</span>
        )}
      </h3>
      <p className="mt-3 max-w-[34rem] text-[14.5px] leading-[1.65] text-ink-500 sm:text-[15px]">
        {description}
      </p>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <HugeiconsIcon
        icon={Tick02Icon}
        size={15}
        strokeWidth={1.8}
        className="mt-[3px] shrink-0"
        color={ACCENT}
      />
      <span className="text-[14px] leading-snug text-ink-700 sm:text-[14.5px]">{children}</span>
    </li>
  );
}

function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "signal";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-[5px] font-display text-[11.5px] font-semibold tracking-[0.02em]",
        tone === "signal"
          ? "border-[#269DD2]/25 bg-[#269DD2]/[0.06] text-[#1a7aa8]"
          : "border-[#E3E9E6] bg-[#f7f9f8] text-ink-700",
      )}
    >
      {children}
    </span>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="relative scroll-mt-[72px] overflow-hidden bg-[#FAFBFA] py-20 sm:py-24 lg:py-[7.5rem]"
    >
      {/* Surfaces très légères — jamais décoratives */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[56rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(53,162,56,0.055),transparent_68%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d7e0db] to-transparent"
      />

      <div className="container-x relative">
        {/* Introduction */}
        <header className="max-w-[40rem]">
          <p className="inline-flex items-center gap-2.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: ACCENT }}
              aria-hidden="true"
            />
            <span
              className="font-sans text-[11.5px] font-medium uppercase tracking-[0.22em]"
              style={{ color: ACCENT }}
            >
              Nos services
            </span>
          </p>
          <h2
            className="mt-5 font-display text-[clamp(1.85rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.032em]"
            style={{ color: NAVY }}
          >
            Une solution pour chaque besoin
          </h2>
          <p className="mt-5 max-w-[34.5rem] text-[16px] leading-[1.7] text-ink-500 sm:mt-6 sm:text-[17px]">
            De la mise à disposition d’une benne au traitement de déchets spécifiques,
            CORE ENVIRONNEMENT simplifie la gestion de vos déchets avec un interlocuteur
            unique en Île-de-France.
          </p>
        </header>

        {/* Grille 2 × 2 */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:mt-16 lg:gap-7">
          {/* ── 01 · Service principal ── */}
          <ServiceCard featured>
            <CardHeader
              index="01"
              icon={ContainerIcon}
              title="Location de bennes"
              titleExtra="Déchets non dangereux"
              description="Mise à disposition, enlèvement et suivi digital de vos bennes — un interlocuteur unique, de la première dépose au recyclage."
            />

            <div className="relative mt-8 grid grid-cols-3 gap-3 sm:mt-9 sm:gap-4">
              <Metric value={<>8 → 30 m³</>} label="Volumes disponibles" />
              <Metric value="24h" label="Intervention rapide" divider />
              <Metric value="3 min" label="Pour commander" divider />
            </div>

            <div className="mt-7 border-t border-[#E3E9E6] pt-6 sm:mt-8">
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-400">
                Types de déchets
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                DIB, gravats, bois, végétaux, plâtres, et autres déchets non dangereux.
              </p>
              <p className="mt-3 flex items-center gap-2 text-[13.5px] font-medium text-ink-700">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={15}
                  strokeWidth={STROKE}
                  color={SIGNAL}
                />
                Toute l’Île-de-France
              </p>
            </div>
          </ServiceCard>

          {/* ── 02 ── */}
          <ServiceCard>
            <CardHeader
              index="02"
              icon={Location01Icon}
              title="Accès aux déchetteries professionnelles"
              description="Un accès simple à un réseau de centres professionnels, sans rendez-vous, avec un tarif unique et un contact unique."
            />

            <div className="mt-8 flex flex-col gap-5 sm:mt-9">
              <div className="flex flex-col gap-5 min-[420px]:flex-row min-[420px]:items-end min-[420px]:gap-8">
                <div>
                  <p
                    className="font-display text-[2.15rem] font-semibold leading-none tracking-[-0.04em]"
                    style={{ color: ACCENT }}
                  >
                    5
                  </p>
                  <p className="mt-2 text-[13.5px] leading-snug text-ink-600">
                    déchetteries
                    <span className="block text-ink-400">en cours de développement</span>
                  </p>
                </div>
                <div className="hidden h-12 w-px bg-[#E3E9E6] min-[420px]:block" aria-hidden="true" />
                <div>
                  <p
                    className="font-display text-[1.65rem] font-semibold leading-none tracking-[-0.03em]"
                    style={{ color: ACCENT }}
                  >
                    7h – 15h30
                  </p>
                  <p className="mt-2 text-[13.5px] leading-snug text-ink-600">
                    Ouvertes, sans rendez-vous
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5">
                <CheckItem>Tarif unique</CheckItem>
                <CheckItem>Sans rendez-vous</CheckItem>
                <CheckItem>Contact unique</CheckItem>
              </ul>
            </div>
          </ServiceCard>

          {/* ── 03 ── */}
          <ServiceCard>
            <CardHeader
              index="03"
              icon={Shield01Icon}
              title="Traitement des déchets dangereux"
              description="Collecte, conditionnement et traitement dans un cadre sécurisé, avec la conformité administrative et la traçabilité exigées."
            />

            <ul className="mt-7 space-y-2.5 sm:mt-8">
              <CheckItem>Location de contenants ADR</CheckItem>
              <CheckItem>Aérosols</CheckItem>
              <CheckItem>Emballages souillés</CheckItem>
              <CheckItem>Huiles noires</CheckItem>
            </ul>

            <div className="mt-auto pt-7">
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-400">
                Conformité &amp; traçabilité
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip>Gestion administrative</Chip>
                <Chip>CAP</Chip>
                <Chip tone="signal">Trackdéchets</Chip>
              </div>
            </div>
          </ServiceCard>

          {/* ── 04 ── */}
          <ServiceCard>
            <CardHeader
              index="04"
              icon={ConstructionIcon}
              title="Opérations sur mesure"
              description="Des interventions calibrées à vos contraintes de site, d’équipe et de planning — au-delà de la simple mise à disposition d’une benne."
            />

            <div className="mt-7 grid grid-cols-1 gap-2.5 sm:mt-8 sm:grid-cols-2">
              <OperationTile icon={ConstructionIcon} label="Débarras de chantier" />
              <OperationTile icon={Building02Icon} label="Débarras de bureaux" />
              <OperationTile icon={House01Icon} label="Débarras de locaux" />
              <OperationTile
                icon={UserMultiple02Icon}
                label="Mise à disposition de manutentionnaires"
              />
            </div>
          </ServiceCard>
        </div>
      </div>
    </section>
  );
}

function Metric({
  value,
  label,
  divider = false,
}: {
  value: React.ReactNode;
  label: string;
  divider?: boolean;
}) {
  return (
    <div className="relative min-w-0">
      {divider && (
        <span
          aria-hidden="true"
          className="absolute -left-1.5 top-1 hidden h-[calc(100%-4px)] w-px bg-[#E3E9E6] sm:-left-2 sm:block lg:-left-2.5"
        />
      )}
      <p
        className="font-display text-[1.35rem] font-semibold leading-none tracking-[-0.03em] sm:text-[1.55rem]"
        style={{ color: ACCENT }}
      >
        {value}
      </p>
      <p className="mt-2 text-[12px] leading-snug text-ink-500 sm:text-[12.5px]">{label}</p>
    </div>
  );
}

function OperationTile({
  icon,
  label,
}: {
  icon: IconType;
  label: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[14px] border border-[#E3E9E6] bg-[#f7f9f8] px-3.5 py-3.5">
      <HugeiconsIcon
        icon={icon}
        size={18}
        strokeWidth={STROKE}
        className="mt-0.5 shrink-0 text-[#183574]"
      />
      <span className="text-[13.5px] font-medium leading-snug text-ink-800">{label}</span>
    </div>
  );
}
