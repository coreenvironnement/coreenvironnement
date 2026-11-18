/**
 * Vérifie parsing / normalisation téléphone (collage +33, E.164, autres pays).
 * Usage : npx tsx scripts/test-phone-value.ts
 */
import {
  buildInternationalPhone,
  isValidContactPhone,
  normalizeContactPhoneForStorage,
  parseContactPhone,
  resolvePhoneNationalFieldInput,
} from "../lib/phone/phone-value"

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`)
    process.exit(1)
  }
}

const cases: { input: string; dial: string; e164: string; valid?: boolean }[] = [
  { input: "+33 6 12 34 56 78", dial: "33", e164: "+33612345678", valid: true },
  { input: "0033612345678", dial: "33", e164: "+33612345678", valid: true },
  { input: "33612345678", dial: "33", e164: "+33612345678", valid: true },
  { input: "06 12 34 56 78", dial: "33", e164: "+33612345678", valid: true },
  { input: "+32 470 12 34 56", dial: "32", e164: "+32470123456", valid: true },
  { input: "+1 415 555 0199", dial: "1", e164: "+14155550199", valid: true },
]

for (const c of cases) {
  const parsed = parseContactPhone(c.input)
  assert(parsed.dial === c.dial, `parseContactPhone dial ${c.input}`)
  const built = buildInternationalPhone(parsed.dial, parsed.national)
  assert(built === c.e164, `build E.164 ${c.input} → ${built}`)
  if (c.valid !== undefined) {
    assert(isValidContactPhone(built) === c.valid, `valid ${c.input}`)
  }
}

const frPaste = resolvePhoneNationalFieldInput("+33612345678", "33")
assert(frPaste.dial === "33" && frPaste.national === "0612345678", "resolve +33 autofill FR")

const frPasteDup = resolvePhoneNationalFieldInput("33612345678", "33")
assert(
  buildInternationalPhone(frPasteDup.dial, frPasteDup.national) === "+33612345678",
  "resolve 33… sans +"
)

const beSwitch = resolvePhoneNationalFieldInput("+32470123456", "33")
assert(beSwitch.dial === "32", "resolve bascule BE")

const partial = resolvePhoneNationalFieldInput("612", "33")
assert(partial.dial === "33" && partial.national === "612", "saisie partielle inchangée")

assert(
  normalizeContactPhoneForStorage("+33 6 12 34 56 78") === "+33612345678",
  "normalize storage"
)

console.log("OK: phone-value")