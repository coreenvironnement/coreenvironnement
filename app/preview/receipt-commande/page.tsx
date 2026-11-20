import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { OrderReceiptPreviewLab } from "@/components/order/order-receipt-preview-lab"

export const metadata: Metadata = {
  title: "Aperçu confirmation ticket",
  robots: { index: false, follow: false },
}

export default function ReceiptCommandePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return (
    <main className="min-h-[100svh] bg-gradient-to-b from-brand-warm-field to-white">
      <OrderReceiptPreviewLab />
    </main>
  )
}