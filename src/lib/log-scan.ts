// Registro de atribución por canal: de dónde viene cada visita (un sticker, un
// post de IG, un link compartido desde la app). Vive aquí y no en una page
// porque lo usan tres rutas: /app, /[slug] y /negocio/[id] — que son justo las
// que se comparten.
//
// Convención de valores de `src` (extensible a propósito):
//   sticker-<n>       sticker físico pegado en un negocio
//   post-ig-<nombre>  publicación de Instagram
//   post-fb-<nombre>  publicación de Facebook
//   share             link compartido desde la ficha de un negocio en la app
//   share-busqueda    link compartido desde una búsqueda en la app
//   menu-qr           QR del menú pegado en la mesa de un restaurante
//   landing-banner    banner de la propia landing que manda a /app
//
// `src` es el valor crudo tal cual venía en la URL. Para agrupar se usa
// `channel`, que la DB deriva sola de `src` (`qr_scan_channel_from_src`). El
// cliente no lo manda, a propósito: así una errata impresa cae en el bucket
// 'otro' en vez de esconderse en uno válido. Los crawlers que bajan la página
// para armar la vista previa de un link (WhatsApp, Facebook, buscadores) caen en
// el canal 'bot' según su user-agent, así que no cuentan como scans de personas.
// Se lee con: select channel, count(*) from qr_scans group by channel

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export interface DatosDeScan {
  /** Negocio dueño del QR. Sale de la ruta, no del parámetro impreso. */
  business_id?: string;
  /** Slug tal como venía impreso: el negocio se renombra, el papel no. */
  slug_at_scan?: string;
}

// Best-effort a propósito: si el registro falla, la página renderiza igual.
// Medir el canal no debe tumbar la página de alguien parado frente a un negocio
// con mala señal.
export async function logScan(src: string, userAgent: string, datos: DatosDeScan = {}) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/qr_scans`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ src, user_agent: userAgent, ...datos }),
    });
  } catch {
    // best-effort, ver comentario arriba
  }
}
