// next/image revienta con un 500 si el host de la foto no está en
// `images.remotePatterns`. Las photo_url las cargan admins y scrapers, así que
// pueden venir de cualquier host: filtramos contra la misma allowlist que
// next.config.ts en vez de arriesgar que una foto tumbe la página entera.

const HOSTS_PERMITIDOS = [
  /\.supabase\.co$/,
  /^100\.96\.221\.80$/,
  /^images\.unsplash\.com$/,
];

export function fotoUsable(url: string | null): string | null {
  if (!url) return null;
  try {
    const { hostname } = new URL(url);
    return HOSTS_PERMITIDOS.some((h) => h.test(hostname)) ? url : null;
  } catch {
    return null;
  }
}
