export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function emailLayout(body: string): string {
  return `<!DOCTYPE html><html lang="fr"><body style="font-family:Arial,sans-serif;line-height:1.5;color:#1a2744;max-width:560px;margin:0 auto;padding:24px">${body}</body></html>`
}
