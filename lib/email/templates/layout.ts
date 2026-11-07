import { getAppUrl } from "@/lib/email/config"

export const EMAIL_BRAND = {
  green: "#35A238",
  greenDark: "#19752B",
  navy: "#172033",
  text: "#172033",
  muted: "#667085",
  border: "#e3e9e6",
  canvas: "#f3f7f5",
  card: "#ffffff",
} as const

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function emailInset(inner: string): string {
  return `<div style="background:${EMAIL_BRAND.canvas};border:1px solid ${EMAIL_BRAND.border};border-radius:10px;padding:16px 18px;margin:18px 0;color:${EMAIL_BRAND.text};font-size:14px;line-height:1.5">
    ${inner}
  </div>`
}

export function emailCard(inner: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-collapse:separate">
  <tr>
    <td style="background:${EMAIL_BRAND.card};border:1px solid ${EMAIL_BRAND.border};border-radius:12px;padding:22px 26px;color:${EMAIL_BRAND.text};font-size:15px;line-height:1.55">
      ${inner}
    </td>
  </tr>
</table>`
}

export function emailButton(href: string, label: string): string {
  const safeHref = escapeHtml(href)
  const safeLabel = escapeHtml(label)
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;border-collapse:separate">
  <tr>
    <td style="border-radius:10px;background:${EMAIL_BRAND.green}">
      <a href="${safeHref}" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;line-height:1.2;border-radius:10px;background:${EMAIL_BRAND.green}">${safeLabel}</a>
    </td>
  </tr>
</table>`
}

export function emailFallbackLink(href: string): string {
  const safeHref = escapeHtml(href)
  return `<p style="margin:16px 0 0;font-size:13px;line-height:1.5;color:${EMAIL_BRAND.muted}">
    Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br/>
    <a href="${safeHref}" style="color:${EMAIL_BRAND.green};word-break:break-all">${safeHref}</a>
  </p>`
}

export function emailLayout(
  body: string,
  options?: { preheader?: string }
): string {
  const appUrl = getAppUrl()
  const logoUrl = `${appUrl}/images/core-environnement-logo-header-transparent.png`
  const preheader = options?.preheader?.trim()
  const hiddenPreheader = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all">${escapeHtml(preheader)}</div>`
    : ""

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="color-scheme" content="light"/>
  <meta name="supported-color-schemes" content="light"/>
  <title>CORE Environnement</title>
</head>
<body style="margin:0;padding:0;background:${EMAIL_BRAND.canvas};font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
  ${hiddenPreheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL_BRAND.canvas};border-collapse:collapse">
    <tr>
      <td align="center" style="padding:28px 16px 36px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border-collapse:collapse">
          <tr>
            <td align="center" style="padding:0 0 20px">
              <a href="${escapeHtml(appUrl)}" style="text-decoration:none">
                <img src="${escapeHtml(logoUrl)}" width="220" alt="CORE Environnement" style="display:block;height:auto;max-width:220px;border:0"/>
              </a>
            </td>
          </tr>
          <tr>
            <td style="background:${EMAIL_BRAND.card};border:1px solid ${EMAIL_BRAND.border};border-radius:14px;padding:32px 28px 28px;color:${EMAIL_BRAND.text};font-size:15px;line-height:1.55">
              ${body}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:22px 8px 0;font-size:12px;line-height:1.5;color:${EMAIL_BRAND.muted}">
              <p style="margin:0 0 6px"><strong style="color:${EMAIL_BRAND.navy}">CORE Environnement</strong> — Location de bennes en Île-de-France</p>
              <p style="margin:0"><a href="${escapeHtml(appUrl)}" style="color:${EMAIL_BRAND.green};text-decoration:none">${escapeHtml(appUrl.replace(/^https?:\/\//, ""))}</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
