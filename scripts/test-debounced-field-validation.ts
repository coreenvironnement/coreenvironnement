/**
 * Règles d’affichage validation debounce (téléphone / e-mail).
 * Usage : npx tsx scripts/test-debounced-field-validation.ts
 */
import { isValidContactEmailInput } from "../lib/forms/contact-email-field"
import { shouldShowFieldValidationError } from "../lib/forms/use-debounced-invalid-field"
import { isValidContactPhone } from "../lib/phone/phone-value"

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`)
    process.exit(1)
  }
}

assert(
  !shouldShowFieldValidationError(false, {
    touched: false,
    submitPing: false,
    idleInvalid: false,
  }),
  "pas d’erreur tant que pas touché / idle"
)

assert(
  shouldShowFieldValidationError(false, { touched: true, submitPing: false, idleInvalid: false }),
  "blur force erreur si invalide"
)

assert(
  shouldShowFieldValidationError(false, { touched: false, submitPing: true, idleInvalid: false }),
  "submit force erreur"
)

assert(
  shouldShowFieldValidationError(false, { touched: false, submitPing: false, idleInvalid: true }),
  "idle debounce force erreur"
)

assert(
  !shouldShowFieldValidationError(true, { touched: true, submitPing: true, idleInvalid: true }),
  "valide → jamais d’erreur"
)

assert(!isValidContactPhone("6"), "6 partiel invalide")
assert(!isValidContactPhone("06"), "06 partiel invalide")
assert(isValidContactPhone("0612345678"), "mobile FR complet")

assert(!isValidContactEmailInput(""), "e-mail vide invalide")
assert(!isValidContactEmailInput("a@"), "e-mail partiel invalide")
assert(isValidContactEmailInput("  User@Example.COM "), "e-mail normalisé valide")

console.log("OK: debounced-field-validation")