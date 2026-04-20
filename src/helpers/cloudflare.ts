const CF_BASE = 'https://blog.schaermu.ch/cdn-cgi/image';

/**
 * Build a Cloudflare transformation URL.
 * format=auto lets CF serve AVIF to modern browsers, WebP to older ones,
 * JPEG as fallback — based on the Accept header. No manual <source> tags needed.
 */
function getClouflareUrl(source: string, width: number, quality = 80): string {
  const params = `width=${width},quality=${quality},format=auto,fit=cover`;
  return `${CF_BASE}/${params}/${source}`;
}

export { getClouflareUrl };
