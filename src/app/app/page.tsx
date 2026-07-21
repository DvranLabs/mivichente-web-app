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

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

// Registra el scan cuando el link trae ?src= (stickers, bio de IG, etc). No
// bloquea el render si falla: medir el canal no debe tumbar la página de
// alguien parado frente a un negocio con mala señal.
async function logScan(src: string, userAgent: string) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/qr_scans`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ src, user_agent: userAgent }),
    });
  } catch {
    // best-effort, ver comentario arriba
  }
}

export const metadata = {
  title: "Vichente — Todo tu pueblo, en una búsqueda",
  description:
    "El directorio de negocios de Nombre de Dios, Vicente Guerrero y Villa Unión. Busca tacos, taxi, doctor, ferretería y más.",
  openGraph: {
    title: "Vichente — Todo tu pueblo, en una búsqueda",
    description:
      "El directorio de negocios de Nombre de Dios, Vicente Guerrero y Villa Unión. Busca tacos, taxi, doctor, ferretería y más.",
    url: "https://vichente.com/app",
    images: [{ url: "/logo-grande.png", width: 1200, height: 630, alt: "Vichente App" }],
  },
};

// Pinta la barra de estado del navegador del color del fondo: sin esto, en
// Chrome Android queda una franja blanca arriba de una página oscura.
export const viewport = {
  themeColor: "#0B1220",
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

// Grano fino sobre el degradado. Sin esto los fondos oscuros grandes muestran
// banding en pantallas de gama baja (justo las que va a traer el sticker).
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

// El skyline (iglesia, kiosco, palmas) ya es naranja con alpha: sobre el navy
// funciona como silueta cálida sin recolorearlo.
//
// Se usa skyline-strip.png y no skyline.png: el original tiene ~60% de alto en
// relleno casi transparente, así que con bottom:0 los edificios quedaban
// flotando a media pantalla, encima de los chips. El strip es el mismo arte
// recortado a la banda de edificios, de modo que bottom:0 los pega al piso.
// La máscara los desvanece hacia arriba para que no haya un corte recto.
const Skyline = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/skyline-strip.png"
    alt=""
    style={{
      display: "block",
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(820px, 122%)",
      opacity: 0.28,
      zIndex: 0,
      pointerEvents: "none",
      // Dos máscaras intersectadas: una desvanece hacia arriba (sin ella el arte
      // corta en recto a media pantalla) y otra hacia los lados (en desktop el
      // strip no llega a los bordes y se le veía el filo).
      WebkitMaskImage:
        "linear-gradient(to top, #000 30%, transparent 92%), linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)",
      maskImage:
        "linear-gradient(to top, #000 30%, transparent 92%), linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)",
      WebkitMaskComposite: "source-in",
      maskComposite: "intersect",
    }}
  />
);

export default async function AppEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string }>;
}) {
  const userAgent = (await headers()).get("user-agent") ?? "";
  const platform = detectPlatform(userAgent);
  const { src } = await searchParams;
  if (src) await logScan(src, userAgent);

  return (
    <main
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        // El padding-bottom deja el tercio inferior para el skyline: ahí no va
        // texto, para que nada compita con la silueta del pueblo. Va en vh con
        // clamp porque el alto del skyline depende del ancho de la pantalla; un
        // valor fijo dejaba el link de Android encima de los cerros en móvil.
        padding: "40px 22px clamp(118px, 19vh, 190px)",
        overflow: "hidden",
        background:
          "radial-gradient(120% 70% at 50% -10%, rgba(240,122,44,0.26) 0%, rgba(240,122,44,0.06) 38%, transparent 68%)," +
          "linear-gradient(180deg, #0B1220 0%, #070B14 55%, #090E1A 100%)",
        color: "#F5F7FA",
        fontFamily: "var(--font-outfit), -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Capa de grano: encima del degradado, debajo de todo lo legible. */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: GRAIN,
          opacity: 0.035,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <Skyline />
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", justifyContent: "center" }}>
        <AppEntry platform={platform} />
      </div>
    </main>
  );
}
