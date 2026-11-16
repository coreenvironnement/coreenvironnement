import { readFileSync, existsSync } from "node:fs"

const paths = process.argv.slice(2)
if (!paths.length) {
  console.error("Usage: node compare-hero-lighthouse.mjs <report.json> [...]")
  process.exit(1)
}

for (const path of paths) {
  if (!existsSync(path)) {
    console.log(path, "MISSING")
    continue
  }
  const report = JSON.parse(readFileSync(path, "utf8"))
  const a = report.audits
  const heroes = (a["network-requests"]?.details?.items ?? []).filter((i) =>
    /hero-(mobile|desktop)/.test(i.url ?? "")
  )
  const metrics = {
    LCP: a["largest-contentful-paint"]?.numericValue,
    FCP: a["first-contentful-paint"]?.numericValue,
    TBT: a["total-blocking-time"]?.numericValue,
    TBT_err: a["total-blocking-time"]?.errorMessage ?? null,
    CLS: a["cumulative-layout-shift"]?.numericValue,
  }
  const lcpInsight = a["lcp-breakdown-insight"]?.details?.items ?? []
  console.log("\n===", path, "===")
  console.log("url", report.requestedUrl, "LH", report.lighthouseVersion)
  console.log("warnings", report.runWarnings)
  console.log("metrics", metrics)
  console.log(
    "hero",
    heroes.map((h) => ({
      variant: h.url.includes("mobile") ? "mobile" : "desktop",
      url: h.url,
      w: new URL(h.url).searchParams.get("w"),
      q: new URL(h.url).searchParams.get("q"),
      priority: h.priority,
      preload: !!h.isLinkPreload,
      transferSize: h.transferSize,
      resourceSize: h.resourceSize,
      mime: h.mimeType,
      startMs: h.networkRequestTime,
      endMs: h.networkEndTime,
    }))
  )
  if (lcpInsight.length) console.log("lcp-breakdown", JSON.stringify(lcpInsight, null, 2))
}