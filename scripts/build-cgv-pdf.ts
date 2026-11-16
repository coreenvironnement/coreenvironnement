import { writeCgvPdfToPublic } from "../lib/documents/read-cgv-pdf"

writeCgvPdfToPublic()
  .then(() => console.log("Wrote public/documents/cgv-core-environnement.pdf"))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })