import { readFileSync } from "node:fs"

const path = process.argv[2]
if (!path) {
  console.error("Usage: node summarize-lighthouse-hero.mjs <report.json>")
  process.exit(1)
}

const report = JSON.parse(readFileSync(path, "utf8"))
const a = report.audits

const metric = (id) => a[id]?.numericValue ?? null

const heroReqs = (report.audits["network-requests"]?.details?.items ?? [])
  .filter((i) => /hero-(mobile|desktop)/.test(i.url ?? ""))
  .map((i) => ({
    url: i.url,
    priority: i.priority,
    transferSize: i.transferSize,
    isLinkPreload: i.isLinkPreload,
  }))

const preloads = (report.audits["network-requests"]?.details?.items ?? []).filter(
  (i) => i.isLinkPreload && /hero/.test(i.url ?? "")
)

console.log(
  JSON.stringify(
    {
      requestedUrl: report.requestedUrl,
      lighthouseVersion: report.lighthouseVersion,
      fetchTime: report.fetchTime,
      runWarnings: report.runWarnings,
      LCP_ms: metric("largest-contentful-paint"),
      FCP_ms: metric("first-contentful-paint"),
      TBT_ms: metric("total-blocking-time"),
      TBT_error: a["total-blocking-time"]?.errorMessage ?? null,
      CLS: metric("cumulative-layout-shift"),
      perfScore: report.categories?.performance?.score,
      heroRequests: heroReqs,
      heroPreloads: preloads,
    },
    null,
    2
  )
)