// El "logo" que se pinta en el encabezado de las pantallas de opinión.
//
// `businesses` no tiene campo de logo: se usa la primera foto del perfil, que es
// la que el negocio eligió para que lo represente. En K-fféss es su logo; en otro
// negocio puede ser la fachada, y para el piloto se aceptó así (2026-10-12).

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

interface Fila {
  business_photos: { url: string }[] | null;
}

/** URL de la primera foto del negocio, o null si no tiene o la consulta falla. */
export async function logoDelNegocio(slug: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?slug=eq.${encodeURIComponent(slug)}` +
        `&select=business_photos(url)&business_photos.order=order_index.asc` +
        `&business_photos.limit=1&limit=1`,
      {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        // El logo casi no cambia; no vale una consulta fresca en cada escaneo.
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const [fila] = (await res.json()) as Fila[];
    return fila?.business_photos?.[0]?.url ?? null;
  } catch {
    // Sin logo la pantalla sale con el nombre solo, que es suficiente.
    return null;
  }
}
