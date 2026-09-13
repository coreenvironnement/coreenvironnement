import { cn } from "../utils/cn";

/**
 * Monogramme CORE ENVIRONNEMENT :
 * hexagone (conteneur / benne) renfermant un « C » dont l'ouverture
 * est marquée d'un point de suivi (traçabilité / digital).
 * Style line-art, hérite de currentColor.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-current", className)}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M9.8 5.2H22.2L28.5 16L22.2 26.8H9.8L3.5 16L9.8 5.2Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M18.2 11.2A6.2 6.2 0 1 0 18.2 20.8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="20.5" cy="12.3" r="1.45" fill="currentColor" />
      </svg>
      <span className="flex items-baseline whitespace-nowrap leading-none">
        <span className="font-display text-[16.5px] font-bold tracking-[-0.02em]">
          CORE
        </span>
        <span className="ml-2 font-display text-[10.5px] font-medium tracking-[0.22em] opacity-65">
          ENVIRONNEMENT
        </span>
      </span>
    </span>
  );
}
