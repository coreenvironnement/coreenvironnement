"use client"

import { useCallback, useId, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

import { faq } from "@/lib/cdc/contenu-vitrine"
import { cn } from "@/lib/utils"

import { VITRINE_ICON_STROKE } from "./icons"

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function questionCountLabel(count: number) {
  return count === 1 ? "1 question" : `${count} questions`
}

function FaqQuestionItem({
  id,
  question,
  answer,
  isOpen,
  onToggle,
  baseId,
}: {
  id: string
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  baseId: string
}) {
  const buttonId = `${baseId}-${id}-trigger`
  const panelId = `${baseId}-${id}-panel`

  return (
    <div className="border-t border-brand-border/80 first:border-t-0">
      <h4>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            "flex min-h-12 w-full items-start gap-3 py-3.5 pl-1 pr-1 text-left transition-colors duration-200 sm:min-h-[3.25rem] sm:gap-4 sm:py-4",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/20 focus-visible:ring-offset-2",
            isOpen ? "text-brand-navy" : "text-brand-text hover:text-brand-navy"
          )}
        >
          <span className="flex-1 text-[14px] font-medium leading-snug sm:text-[15px]">
            {question}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={16}
            strokeWidth={VITRINE_ICON_STROKE}
            aria-hidden
            className={cn(
              "mt-0.5 shrink-0 transition-transform duration-250 ease-out",
              isOpen ? "rotate-180 text-[#35A238]" : "text-brand-muted"
            )}
          />
        </button>
      </h4>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={cn(
          "grid transition-[grid-template-rows] duration-250 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="bg-[#F6FAF6] pb-4 pl-1 pr-8 pt-0.5 sm:pb-5">
            <p className="text-sm leading-relaxed text-brand-muted sm:text-[15px]">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FaqCategoryItem({
  categorySlug,
  category,
  questionCount,
  questions,
  isOpen,
  openQuestionId,
  onToggleCategory,
  onToggleQuestion,
  baseId,
}: {
  categorySlug: string
  category: string
  questionCount: number
  questions: readonly { q: string; r: string }[]
  isOpen: boolean
  openQuestionId: string | null
  onToggleCategory: () => void
  onToggleQuestion: (questionId: string) => void
  baseId: string
}) {
  const buttonId = `${baseId}-${categorySlug}-category-trigger`
  const panelId = `${baseId}-${categorySlug}-category-panel`

  return (
    <div className="relative border-b border-brand-border last:border-b-0">
      {isOpen ? (
        <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[#35A238]" />
      ) : null}
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggleCategory}
          className={cn(
            "flex min-h-[3.25rem] w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-200 sm:min-h-14 sm:px-6",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/25 focus-visible:ring-offset-2",
            !isOpen && "hover:bg-[#35A238]/[0.035]"
          )}
        >
          <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
            <span
              className={cn(
                "font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-[-0.01em] sm:text-base",
                isOpen ? "text-[#35A238]" : "text-brand-navy"
              )}
            >
              {category}
            </span>
            <span className="font-[family-name:var(--font-body)] text-[12px] font-medium text-brand-muted sm:text-[13px]">
              {questionCountLabel(questionCount)}
            </span>
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={18}
            strokeWidth={VITRINE_ICON_STROKE}
            aria-hidden
            className={cn(
              "shrink-0 transition-transform duration-250 ease-out",
              isOpen ? "rotate-180 text-[#35A238]" : "text-brand-muted"
            )}
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={cn(
          "grid transition-[grid-template-rows] duration-250 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-brand-border/80 bg-brand-bg px-5 pb-2 sm:px-6">
            {questions.map((item) => {
              const itemId = `${categorySlug}-${slugify(item.q)}`
              return (
                <FaqQuestionItem
                  key={itemId}
                  id={itemId}
                  question={item.q}
                  answer={item.r}
                  isOpen={openQuestionId === itemId}
                  onToggle={() => onToggleQuestion(itemId)}
                  baseId={baseId}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function VitrineFaq() {
  const baseId = useId()
  const [openCategorySlug, setOpenCategorySlug] = useState<string | null>(null)
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null)

  const handleToggleCategory = useCallback((categorySlug: string) => {
    setOpenCategorySlug((current) => {
      if (current === categorySlug) {
        setOpenQuestionId(null)
        return null
      }
      setOpenQuestionId(null)
      return categorySlug
    })
  }, [])

  const handleToggleQuestion = useCallback((questionId: string) => {
    setOpenQuestionId((current) => (current === questionId ? null : questionId))
  }, [])

  return (
    <section
      id="faq"
      className="border-t border-brand-border bg-brand-bg-alt py-16 sm:py-20"
      aria-labelledby={`${baseId}-title`}
    >
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Questions fréquentes</p>
          <h2 id={`${baseId}-title`} className="section-title mt-3">
            Tout savoir avant de commander
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
            Logistique, tri, tarifs et compte pro : les réponses aux questions les plus
            courantes sur nos prestations en Île-de-France.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[var(--radius-card)] border border-brand-border bg-brand-bg">
          {faq.map((group) => {
            const categorySlug = slugify(group.categorie)
            const isOpen = openCategorySlug === categorySlug

            return (
              <FaqCategoryItem
                key={group.categorie}
                categorySlug={categorySlug}
                category={group.categorie}
                questionCount={group.questions.length}
                questions={group.questions}
                isOpen={isOpen}
                openQuestionId={isOpen ? openQuestionId : null}
                onToggleCategory={() => handleToggleCategory(categorySlug)}
                onToggleQuestion={handleToggleQuestion}
                baseId={baseId}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
