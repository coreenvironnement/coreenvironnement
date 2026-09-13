import Stripe from "stripe"

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY manquante.")
  }

  if (!stripeClient) {
    stripeClient = new Stripe(key)
  }

  return stripeClient
}

export function hasStripeBillingConfig(): boolean {
  return Boolean(
    process.env.STRIPE_PRICE_ID_PRO_MONTHLY || process.env.STRIPE_PRODUCT_ID_PRO_MONTHLY
  )
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && hasStripeBillingConfig())
}

/** Paiement one-shot (commande benne particulier) — price_data dynamique, pas de Price ID requis. */
export function isStripePaymentConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

/** Price ID explicite ou premier tarif mensuel actif du produit Stripe. */
export async function getProMonthlyPriceId(stripe: Stripe): Promise<string> {
  const explicitPrice = process.env.STRIPE_PRICE_ID_PRO_MONTHLY?.trim()
  if (explicitPrice) {
    return explicitPrice
  }

  const productId = process.env.STRIPE_PRODUCT_ID_PRO_MONTHLY?.trim()
  if (!productId) {
    throw new Error("STRIPE_PRICE_ID_PRO_MONTHLY ou STRIPE_PRODUCT_ID_PRO_MONTHLY requis.")
  }

  const { data: prices } = await stripe.prices.list({
    product: productId,
    active: true,
    type: "recurring",
    limit: 20,
  })

  const monthly =
    prices.find((p) => p.recurring?.interval === "month" && p.recurring?.interval_count === 1) ??
    prices.find((p) => p.recurring?.interval === "month")

  if (!monthly) {
    throw new Error(`Aucun tarif mensuel actif pour le produit ${productId}.`)
  }

  return monthly.id
}

export function getAppOrigin(fallbackOrigin?: string | null): string {
  return (
    fallbackOrigin ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "")
}

/** Locale FR ; moyens de paiement (CB, Apple Pay, Google Pay) gérés via le Dashboard Stripe. */
export function stripeCheckoutPaymentOptions(): Pick<
  Stripe.Checkout.SessionCreateParams,
  "locale"
> {
  return {
    locale: "fr",
  }
}
