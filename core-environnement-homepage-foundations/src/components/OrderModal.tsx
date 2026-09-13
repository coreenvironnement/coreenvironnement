import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ChevronDownIcon,
  Clock01Icon,
  TruckIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "../utils/cn";

const STROKE = 1.7;

const WASTE_TYPES = [
  "Déchets mixtes / tout-venant",
  "Gravats",
  "Bois",
  "Déchets verts",
  "Métaux",
  "Cartons & DIB",
  "Déchets dangereux (sur étude)",
];

const VOLUMES = ["8 m³", "10 m³", "15 m³", "30 m³"];

export default function OrderModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [volume, setVolume] = useState("10 m³");
  const formRef = useRef<HTMLFormElement>(null);

  /* Verrouillage du scroll + Échap */
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  /* Réinitialisation après fermeture */
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setSent(false);
        setVolume("10 m³");
        formRef.current?.reset();
      }, 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div
        className={cn(
          "fixed inset-0 z-[70]",
          open ? "" : "pointer-events-none",
        )}
        aria-hidden={!open}
        inert={!open}
      >
      {/* Fond */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink-950/55 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Conteneur : feuille mobile basse / fenêtre desktop */}
      <div className="absolute inset-0 flex items-end justify-center sm:items-center sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Commander une benne"
          className={cn(
            "relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-2xl border border-ink-900/[0.06] bg-white shadow-pop transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-w-[468px] sm:rounded-2xl",
            open
              ? "translate-y-0 opacity-100 sm:scale-100"
              : "translate-y-8 opacity-0 sm:translate-y-4 sm:scale-[0.97]",
          )}
        >
          {/* En-tête */}
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
            <div className="flex items-center gap-3.5">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <HugeiconsIcon icon={TruckIcon} size={22} strokeWidth={STROKE} />
              </span>
              <div>
                <h2 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-ink-900">
                  Commander une benne
                </h2>
                <p className="mt-0.5 text-[13px] leading-snug text-ink-500">
                  Réponse et intervention sous 24h en Île-de-France
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-ink-500 transition-colors hover:bg-paper hover:text-ink-900"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={STROKE} />
            </button>
          </div>

          {sent ? (
            /* ── Confirmation ── */
            <div className="animate-pop-in flex flex-col items-center px-6 py-12 text-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-forest-50 text-forest-700">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={34}
                  strokeWidth={1.5}
                />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-ink-900">
                Demande envoyée
              </h3>
              <p className="mt-2.5 max-w-[21rem] text-[14.5px] leading-relaxed text-ink-500">
                Un conseiller CORE ENVIRONNEMENT vous recontacte sous 24h ouvrées
                pour confirmer la dépose de votre benne et son suivi digital.
              </p>
              <button type="button" onClick={onClose} className="btn btn-primary mt-7">
                Fermer
              </button>
            </div>
          ) : (
            /* ── Formulaire ── */
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="overflow-y-auto px-6 py-6"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="waste-type" className="field-label">
                    Type de déchets
                  </label>
                  <div className="relative">
                    <select
                      id="waste-type"
                      name="wasteType"
                      required
                      defaultValue=""
                      className="field appearance-none pr-10"
                    >
                      <option value="" disabled>
                        Sélectionner…
                      </option>
                      {WASTE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <HugeiconsIcon
                      icon={ChevronDownIcon}
                      size={17}
                      strokeWidth={STROKE}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                    />
                  </div>
                </div>

                <div>
                  <span className="field-label">Volume de la benne</span>
                  <div className="grid grid-cols-4 gap-2">
                    {VOLUMES.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVolume(v)}
                        aria-pressed={volume === v}
                        className={cn(
                          "h-10 rounded-[10px] border font-display text-[13.5px] font-semibold transition-all duration-200",
                          volume === v
                            ? "border-forest-700 bg-forest-800 text-white shadow-xs"
                            : "border-line bg-surface text-ink-700 hover:border-forest-400 hover:text-forest-800",
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="field-label">
                    Lieu d’intervention
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    placeholder="Ville ou code postal — ex. 75011 Paris"
                    className="field"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="field-label">
                    Date de dépose souhaitée
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    className="field"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="field-label">
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="06 12 34 56 78"
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="field-label">
                      E-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="vous@entreprise.fr"
                      className="field"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary group mt-6 w-full">
                Envoyer ma demande
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={17}
                  strokeWidth={STROKE}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>
              <p className="mt-3.5 flex items-center justify-center gap-1.5 text-center text-[12.5px] text-ink-400">
                <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={STROKE} />
                Rappel sous 24h ouvrées — sans engagement
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
