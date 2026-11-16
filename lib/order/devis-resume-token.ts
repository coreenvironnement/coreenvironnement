import { createHmac, timingSafeEqual } from "node:crypto"

import type { ParticulierTunnelResume } from "@/lib/order/particulier-tunnel-resume"

const TTL_MS = 7 * 24 * 60 * 60 * 1000

function resumeSecret(): string | null {
  const s =
    process.env.DEVIS_RESUME_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    ""
  return s.length >= 16 ? s : null
}

type PackedToken = {
  p: ParticulierTunnelResume
  e: number
}

function sign(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url")
}

export function issueDevisResumeToken(
  resume: ParticulierTunnelResume
): string | null {
  const secret = resumeSecret()
  if (!secret) return null

  const packed: PackedToken = { p: resume, e: Date.now() + TTL_MS }
  const json = JSON.stringify(packed)
  const signature = sign(json, secret)
  return Buffer.from(JSON.stringify({ j: json, s: signature }), "utf8").toString(
    "base64url"
  )
}

export function parseDevisResumeToken(
  token: string
): ParticulierTunnelResume | null {
  const secret = resumeSecret()
  if (!secret || !token.trim()) return null

  try {
    const outer = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8")
    ) as { j?: string; s?: string }
    if (!outer.j || !outer.s) return null

    const expected = sign(outer.j, secret)
    const a = Buffer.from(expected)
    const b = Buffer.from(outer.s)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null

    const packed = JSON.parse(outer.j) as PackedToken
    if (!packed.p || packed.p.v !== 1 || typeof packed.e !== "number") return null
    if (Date.now() > packed.e) return null

    return packed.p
  } catch {
    return null
  }
}

export function buildDevisResumeUrl(token: string, appUrl: string): string {
  return `${appUrl.replace(/\/$/, "")}/?reprise=${encodeURIComponent(token)}`
}