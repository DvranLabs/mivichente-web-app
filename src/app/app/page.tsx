// Entry point universal para stickers/QR/bio: vichente.com/app.
// El sticker imprime una URL fija; el contenido de esta página puede cambiar
// (ej. cuando exista build de iOS) sin reimprimir nada.
//
// El slug 'app' está en la blocklist de public.slug_is_reserved() (DB) y en
// RESERVED_SLUGS (admin), así que ningún negocio puede tomarlo y quedar tapado
// por esta ruta estática.
//
// En Android, /app es un App Link: quien YA tiene la app instalada nunca ve esta
// página (el intent la abre en el home). Es decir, quien llega aquí es siempre
// alguien que no la tiene — por eso el secundario de Play Store le sirve.
//
// Server Component: detecta plataforma con el user-agent y delega la parte
// interactiva a <AppEntry>. Así el CTA correcto viene ya en el HTML, sin flash.

import { headers } from "next/headers";
import AppEntry, { type Platform } from "../../components/AppEntry";

export const metadata = {
  title: "Vichente — Encuentra lo que ocupas en tu pueblo",
  description:
    "El directorio de negocios de Nombre de Dios, Vicente Guerrero y Villa Unión. Busca tacos, taxi, doctor, ferretería y más.",
  openGraph: {
    title: "Vichente — Encuentra lo que ocupas en tu pueblo",
    description:
      "El directorio de negocios de Nombre de Dios, Vicente Guerrero y Villa Unión. Busca tacos, taxi, doctor, ferretería y más.",
    url: "https://vichente.com/app",
    images: [{ url: "/logo-grande.png", width: 1200, height: 630, alt: "Vichente App" }],
  },
};

// Sniffing de user-agent en el server: sin flash de CTA equivocado y sin JS.
// Es best-effort (webviews raras, UAs falseados) — por eso lo único que cambia
// según la plataforma es el enlace secundario; el CTA principal (abrir la web
// app) funciona en cualquier dispositivo, así que un fallo de detección no deja
// a nadie sin salida.
function detectPlatform(userAgent: string): Platform {
  const ua = userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  // iPadOS 13+ se anuncia como "macintosh"; no lo distinguimos a propósito: cae
  // en "other" y ahí igual ve la nota de iPhone + la web app.
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "other";
}

// Ambiental, no protagonista: aquí el contenido llega hasta abajo (a diferencia
// de BusinessLandingCard, donde la tarjeta lo deja libre), así que va atenuado
// para no competir con el link secundario que le queda encima.
const Skyline = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/skyline.png"
    alt=""
    style={{
      display: "block",
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      objectFit: "cover",
      opacity: 0.45,
      zIndex: 0,
      pointerEvents: "none",
    }}
  />
);

export default async function AppEntryPage() {
  const userAgent = (await headers()).get("user-agent") ?? "";
  const platform = detectPlatform(userAgent);

  return (
    <main
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: "40px 22px 120px",
        background: "linear-gradient(180deg, #FDF3EA 0%, #FCE9D8 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <Skyline />
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", justifyContent: "center" }}>
        <AppEntry platform={platform} />
      </div>
    </main>
  );
}
