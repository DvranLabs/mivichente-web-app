// Único lugar con las URLs de las tiendas. Antes la de Play Store estaba
// copiada en seis archivos, y la de App Store no existía hasta que Apple aprobó
// la app el 2026-10-08.
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.dvrancorp.vichente";
export const APP_STORE_URL = "https://apps.apple.com/mx/app/id6782974259";

export type Platform = "android" | "ios" | "other";

// Sniffing de user-agent en el server: sin flash de CTA equivocado y sin JS.
// Es best-effort (webviews raras, UAs falseados) — por eso lo único que cambia
// según la plataforma es el enlace a la tienda; el CTA principal (abrir la web
// app) funciona en cualquier dispositivo, así que un fallo de detección no deja
// a nadie sin salida.
export function detectPlatform(userAgent: string): Platform {
  const ua = userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  // iPadOS 13+ se anuncia como "macintosh"; no lo distinguimos a propósito: cae
  // en "other" y ahí ve las dos tiendas.
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "other";
}

// La tienda que le toca a un teléfono. En "other" (computadora, iPad, UA raro)
// no hay una sola respuesta: quien llama decide si muestra las dos o ninguna.
export function storeUrlFor(platform: Platform): string | null {
  if (platform === "android") return PLAY_STORE_URL;
  if (platform === "ios") return APP_STORE_URL;
  return null;
}
