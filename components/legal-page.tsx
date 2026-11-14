import Link from "next/link"

import {
  type LegalParagraph,
  type LegalSection,
  mentionsLegalesSections,
  politiqueConfidentialiteSections,
} from "@/lib/legal"

function legalParagraphKey(paragraph: LegalParagraph, index: number): string {
  if (typeof paragraph === "string") return paragraph
  return `${paragraph.href}-${index}`
}

function LegalParagraphBlock({ paragraph }: { paragraph: LegalParagraph }) {
  if (typeof paragraph === "string") {
    return <p>{paragraph}</p>
  }
  return (
    <p>
      <a
        href={paragraph.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-brand-green underline underline-offset-2 transition hover:text-brand-navy"
      >
        {paragraph.label}
      </a>
    </p>
  )
}

function LegalContent({ sections }: { sections: readonly LegalSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-bold text-brand-navy">{section.title}</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {section.paragraphs.map((paragraph, index) => (
              <LegalParagraphBlock
                key={legalParagraphKey(paragraph, index)}
                paragraph={paragraph}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export function LegalPageShell({
  title,
  intro,
  sections,
}: {
  title: string
  intro: string
  sections: readonly LegalSection[]
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/"
        className="text-sm font-medium text-brand-green transition hover:text-brand-navy"
      >
        ← Retour à l&apos;accueil
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-brand-navy">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{intro}</p>
      <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <LegalContent sections={sections} />
      </div>
    </div>
  )
}

export function MentionsLegalesContent() {
  return <LegalContent sections={mentionsLegalesSections} />
}

export function PolitiqueConfidentialiteContent() {
  return <LegalContent sections={politiqueConfidentialiteSections} />
}
