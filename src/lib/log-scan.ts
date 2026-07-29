// Registro de atribución por canal: de dónde viene cada visita (un sticker, un
// post de IG, un link compartido desde la app). Vive aquí y no en una page
// porque lo usan tres rutas: /app, /[slug] y /negocio/[id] — que son justo las
// que se comparten.
//
// Convención de valores de `src` (extensible a propósito):
//   sticker-<n>       sticker físico pegado en un negocio
//   post-ig-<nombre>  publicación de Instagram
//   post-fb-<nombre>  publicación de Facebook
//   share             link compartido desde la app
//
// Se lee después con: select src, count(*) from qr_scans group by src

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

// Best-effort a propósito: si el registro falla, la página renderiza igual.
// Medir el canal no debe tumbar la página de alguien parado frente a un negocio
// con mala señal.
export async function logScan(src: string, userAgent: string) {
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
