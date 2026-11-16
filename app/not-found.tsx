import type { Metadata } from "next"

import { NotFoundView } from "@/components/not-found/not-found-view"

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return <NotFoundView />
}