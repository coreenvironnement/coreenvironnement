import {
  effectiveMarginPercentForRecommendation,
  extraBennesNeededForVolume,
  extraBennesMessageForCount,
  recommendBenneVolume,
  recommendedMarginPercentForWaste,
} from "../lib/order/volume-estimator"

const checks: Array<[string, boolean]> = [
  [
    "terre_cailloux recommended margin",
    recommendedMarginPercentForWaste("terre_cailloux") === 20,
  ],
  [
    "gravats default margin",
    recommendedMarginPercentForWaste("gravats") === 10,
  ],
  [
    "terre floor at 20 when user 0",
    effectiveMarginPercentForRecommendation("terre_cailloux", 0) === 20,
  ],
  [
    "gravats user margin unchanged",
    effectiveMarginPercentForRecommendation("gravats", 10) === 10,
  ],
  [
    "terre withMargin 10m3 @0% user",
    recommendBenneVolume(10, "gravats_propres", "terre_cailloux", 0)
      .withMarginM3 === 12,
  ],
  [
    "gravats withMargin 10m3 @0% user",
    recommendBenneVolume(10, "gravats_propres", "gravats", 0).withMarginM3 ===
      10,
  ],
  [
    "extra bennes 0 when within max",
    extraBennesNeededForVolume(30, 30) === 0,
  ],
  [
    "extra bennes 1 when slightly over max",
    extraBennesNeededForVolume(30.1, 30) === 1,
  ],
  [
    "extra bennes 2 when needs three max bennes",
    extraBennesNeededForVolume(61, 30) === 2,
  ],
  [
    "message singular",
    extraBennesMessageForCount(1)?.includes("1 benne supplémentaire") === true,
  ],
  [
    "message plural",
    extraBennesMessageForCount(2)?.includes("2 bennes supplémentaires") ===
      true,
  ],
  [
    "recommend sets extra when over catalog max",
    recommendBenneVolume(14, "gravats_propres", "gravats", 10)
      .extraBennesNeeded === 1,
  ],
]

const failed = checks.filter(([, ok]) => !ok)
if (failed.length > 0) {
  console.error(failed.map(([name]) => name).join("\n"))
  process.exit(1)
}

console.log("test-volume-estimator: ok")
