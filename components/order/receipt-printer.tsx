"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { CheckCircle2, Loader2 } from "lucide-react"
import Image from "next/image"
import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useContext,
} from "react"

import { SITE_IMAGES, TRACKDECHETS_LOGO_ALT } from "@/lib/media/site-images"
import { SITE_ORG_NAME } from "@/lib/site"
import { cn } from "@/lib/utils"

export type ReceiptPrinterStage = "processing" | "printing" | "complete"
export type ReceiptFeedMotion = "smooth" | "stepped"

const easeOut = [0.23, 1, 0.32, 1] as const
const easeInOut = [0.77, 0, 0.175, 1] as const

const receiptToothCount = 28
const receiptToothDepth = 3
const receiptToothPoints = Array.from(
  { length: receiptToothCount * 2 },
  (_, index) => {
    const x = 100 - ((index + 1) * 100) / (receiptToothCount * 2)
    const y = index % 2 === 0 ? "100%" : `calc(100% - ${receiptToothDepth}px)`
    return `${x}% ${y}`
  }
).join(", ")
const receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${receiptToothPoints})`

const printingTransformKeyframes = [
  "translateY(calc(-100% + 2px))",
  "translateY(-88%)",
  "translateY(-75%)",
  "translateY(-58%)",
  "translateY(-40%)",
  "translateY(-22%)",
  "translateY(-8%)",
  "translateY(0%)",
]
const printingKeyframeTimes = [0, 0.12, 0.28, 0.44, 0.58, 0.74, 0.9, 1]

const statusLabelsFr: Record<ReceiptPrinterStage, string> = {
  processing: "Validation en cours…",
  printing: "Édition du récapitulatif…",
  complete: "Confirmation prête",
}

type ReceiptPrinterContextValue = {
  animate: boolean
  embedded: boolean
  feedMotion: ReceiptFeedMotion
  shouldMove: boolean
  stage: ReceiptPrinterStage
}

const ReceiptPrinterContext = createContext<ReceiptPrinterContextValue | null>(null)

function useReceiptPrinter(component: string) {
  const context = useContext(ReceiptPrinterContext)
  if (!context) {
    throw new Error(`${component} doit être dans ReceiptPrinter.Root.`)
  }
  return context
}

export type ReceiptPrinterRootProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  animate?: boolean
  children: ReactNode
  embedded?: boolean
  feedMotion?: ReceiptFeedMotion
  stage: ReceiptPrinterStage
}

function ReceiptPrinterRoot({
  "aria-label": ariaLabel = "Confirmation de commande",
  animate = true,
  children,
  className,
  embedded = false,
  feedMotion = "stepped",
  stage,
  ...props
}: ReceiptPrinterRootProps) {
  const shouldReduceMotion = useReducedMotion()
  const context = {
    animate,
    embedded,
    feedMotion,
    shouldMove: animate && !shouldReduceMotion,
    stage,
  }

  return (
    <ReceiptPrinterContext.Provider value={context}>
      <section
        aria-label={ariaLabel}
        className={cn(
          "relative isolate flex w-full flex-col items-center",
          embedded ? "max-w-full" : "max-w-sm",
          className
        )}
        data-stage={stage}
        {...props}
      >
        {children}
      </section>
    </ReceiptPrinterContext.Provider>
  )
}

function ReceiptPrinterMachine({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const { embedded } = useReceiptPrinter("ReceiptPrinter.Machine")
  return (
    <div
      className={cn(
        "relative isolate w-full overflow-hidden rounded-2xl border border-brand-green/18 bg-gradient-to-b from-[#f4f9f4] to-brand-warm-field p-3 pb-7 shadow-[0_12px_32px_-16px_rgb(14_32_16/0.18)]",
        embedded && "rounded-xl",
        className
      )}
      {...props}
    >
      {children}
      <div
        aria-hidden
        className="absolute inset-x-5 bottom-3 z-40 h-1.5 rounded-sm border border-brand-navy/25 bg-brand-navy/90 shadow-inner"
      />
    </div>
  )
}

function ReceiptPrinterScreen({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "relative z-10 overflow-hidden rounded-xl border border-brand-navy/30 bg-brand-navy p-3.5 text-white shadow-[inset_0_0_20px_rgb(0_0_0/0.35)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function StatusIndicator({
  animate,
  move,
  stage,
}: {
  animate: boolean
  move: boolean
  stage: ReceiptPrinterStage
}) {
  const isComplete = stage === "complete"
  return (
    <span aria-hidden className="relative grid size-5 shrink-0 place-items-center">
      <AnimatePresence initial={false} mode="sync">
        {isComplete ? (
          <motion.span
            key="complete"
            initial={{ opacity: animate ? 0 : 1, scale: move ? 0.94 : 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: animate ? 0.16 : 0, ease: easeOut }}
            className="col-start-1 row-start-1 text-brand-green"
          >
            <CheckCircle2 className="size-[18px]" strokeWidth={2.25} />
          </motion.span>
        ) : (
          <motion.span
            key="working"
            initial={{ opacity: animate ? 0 : 1, scale: move ? 0.94 : 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: animate ? 0.16 : 0, ease: easeOut }}
            className="col-start-1 row-start-1 text-white/70"
          >
            <Loader2
              className={cn("size-[18px]", animate && "animate-spin motion-reduce:animate-none")}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

export type ReceiptPrinterStatusProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children?: ReactNode
}

function ReceiptPrinterStatus({ children, className, ...props }: ReceiptPrinterStatusProps) {
  const { animate, shouldMove, stage } = useReceiptPrinter("ReceiptPrinter.Status")
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)} {...props}>
      <StatusIndicator animate={animate} move={shouldMove} stage={stage} />
      <div aria-live="polite" className="grid min-w-0 flex-1 items-center" role="status">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={stage}
            initial={{
              opacity: animate ? 0 : 1,
              y: shouldMove ? 4 : 0,
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldMove ? -4 : 0 }}
            transition={{ duration: animate ? 0.18 : 0, ease: easeOut }}
            className="col-start-1 row-start-1 truncate text-xs font-medium leading-none text-[#9fd4a3]"
          >
            {children ?? statusLabelsFr[stage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ReceiptPrinterOutput({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const { animate, embedded, feedMotion, shouldMove, stage } = useReceiptPrinter(
    "ReceiptPrinter.Output"
  )
  const isReceiptVisible = stage !== "processing"
  const shouldUseSteppedFeed =
    feedMotion === "stepped" && stage === "printing" && shouldMove

  return (
    <div
      className={cn(
        "relative z-50 -mt-3 w-[calc(100%-1.5rem)] max-w-full overflow-hidden px-2",
        embedded ? "h-[min(52dvh,17.5rem)]" : "h-[min(58dvh,20rem)] sm:h-[22rem]"
      )}
      {...props}
    >
      {isReceiptVisible ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-2 -top-0.5 z-20 h-1.5 bg-brand-navy/60 blur-[5px]"
        />
      ) : null}
      <motion.div
        className="relative"
        initial={false}
        animate={{
          opacity: isReceiptVisible ? 1 : 0,
          transform:
            stage === "printing" && shouldMove
              ? shouldUseSteppedFeed
                ? printingTransformKeyframes
                : "translateY(0%)"
              : isReceiptVisible || !shouldMove
                ? "translateY(0%)"
                : "translateY(calc(-100% + 2px))",
        }}
        aria-hidden={stage !== "complete"}
        transition={{
          opacity: { duration: animate ? 0.16 : 0, ease: easeOut },
          transform: {
            duration: shouldMove ? 1.35 : 0,
            ease: shouldUseSteppedFeed ? "linear" : easeInOut,
            times: shouldUseSteppedFeed ? printingKeyframeTimes : undefined,
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function ReceiptPrinterPaper({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"article">) {
  return (
    <article
      className={cn(
        "relative z-10 min-h-64 bg-[#fafcf8] px-5 pt-6 pb-7 text-brand-navy shadow-[0_10px_28px_-12px_rgb(14_32_16/0.22)]",
        className
      )}
      style={{ clipPath: receiptClipPath }}
      {...props}
    >
      {children}
    </article>
  )
}

export function ReceiptTicketHeader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 border-b border-dashed border-brand-border/80 pb-3", className)}>
      <Image
        src={SITE_IMAGES.logo.headerBrand}
        alt=""
        width={120}
        height={40}
        className="h-7 w-auto object-contain"
      />
      <div className="min-w-0 flex-1 text-right">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
          {SITE_ORG_NAME}
        </p>
        <p className="text-[10px] text-brand-muted">Récapitulatif commande</p>
      </div>
    </div>
  )
}

export function ReceiptTicketBody({
  title,
  reference,
  lines,
  footerLines,
}: {
  title: string
  reference: string
  lines: { label: string; value: string; emphasize?: boolean }[]
  footerLines: string[]
}) {
  return (
  <>
      <p className="mt-3 text-center text-[11px] font-bold tracking-[0.12em] text-brand-green">
        {title}
      </p>
      <p className="mt-1 text-center font-mono text-[12px] font-semibold tracking-wide text-brand-navy">
        {reference}
      </p>
      <dl className="mt-4 space-y-2 border-t border-dashed border-brand-border/70 pt-3 text-[11px] leading-snug">
        {lines.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-3">
            <dt className="shrink-0 text-brand-muted">{row.label}</dt>
            <dd
              className={cn(
                "min-w-0 text-right text-brand-navy",
                row.emphasize && "text-[13px] font-semibold tabular-nums text-primary"
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 space-y-1 border-t border-dashed border-brand-border/70 pt-3 text-center text-[10px] leading-relaxed text-brand-muted">
        {footerLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div className="mt-3 flex justify-center opacity-80">
        <Image
          src={SITE_IMAGES.brand.trackdechetsLogo}
          alt={TRACKDECHETS_LOGO_ALT}
          width={48}
          height={48}
          className="h-9 w-9 object-contain"
        />
      </div>
    </>
  )
}

export const ReceiptPrinter = {
  Machine: ReceiptPrinterMachine,
  Output: ReceiptPrinterOutput,
  Paper: ReceiptPrinterPaper,
  Root: ReceiptPrinterRoot,
  Screen: ReceiptPrinterScreen,
  Status: ReceiptPrinterStatus,
}