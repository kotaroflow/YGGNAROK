/**
 * Valida URLs recebidas pela API de auditoria.
 * Permite apenas http(s) e bloqueia hosts locais/privados para evitar SSRF.
 */
export function isAllowedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    // aceita apenas http ou https
    if (!['http:', 'https:'].includes(u.protocol)) return false;
    const host = u.hostname;
    // bloqueia localhost e IPs de loopback
    if (host === 'localhost' || host === '127.0.0.1') return false;
    // bloqueia redes privadas típicas
    if (/^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)) return false;
    return true;
  } catch {
    return false;
  }
}
