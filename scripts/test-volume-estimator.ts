import {
  extraBennesNeededForVolume,
  extraBennesMessageForCount,
  recommendBenneVolume,
} from "../lib/order/volume-estimator"

const checks: Array<[string, boolean]> = [
  [
    "terre estimated volume unchanged",
    recommendBenneVolume(10, "gravats_propres", "terre_cailloux").estimatedM3 ===
      10,
  ],
  [
    "gravats estimated volume unchanged",
    recommendBenneVolume(10, "gravats_propres", "gravats").estimatedM3 === 10,
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
    recommendBenneVolume(14, "gravats_propres", "gravats").extraBennesNeeded ===
      1,
  ],
]

const failed = checks.filter(([, ok]) => !ok)
if (failed.length > 0) {
  console.error(failed.map(([name]) => name).join("\n"))
  process.exit(1)
}

console.log("test-volume-estimator: ok")
