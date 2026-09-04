// Resultados de búsqueda compartibles: vichente.com/buscar/<termino>.
//
// Vive aquí y no dentro de la page porque `opengraph-image.tsx` necesita el
// mismo dato (el conteo va en la imagen del preview) y es un archivo hermano,
// no un hijo — no puede importar de la page. Compartir esta función además
// hace que las dos peticiones se deduppen en el caché de `fetch` de Next
// durante el mismo render.
//
// El término viaja en el path y no en `?q=` a propósito: `opengraph-image.tsx`
// recibe `params` pero no `searchParams`, así que con query string la imagen
// del preview no podría leer lo que se buscó.

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export interface NegocioResultado {
  id: string;
  slug: string | null;
  name: string;
  address: string | null;
  photo_url: string | null;
  is_verified: boolean;
  has_delivery: boolean;
  categories: { id: string; name: string } | null;
}

/**
 * Convierte el segmento de la URL en el término que espera el RPC.
 * Los guiones vuelven a ser espacios: `search_businesses` tokeniza con
 * `regexp_split_to_table(term, '\s+')`, así que "barbacoa-x-kilo" entraría
 * como UN token con guiones y no matchearía nada.
 */
export function terminoDesdeRuta(segmento: string): string {
  return decodeURIComponent(segmento).replace(/-+/g, " ").replace(/\s+/g, " ").trim();
}

/** Inversa de `terminoDesdeRuta`. La app mobile arma el link con esta misma forma. */
export function rutaDesdeTermino(termino: string): string {
  return encodeURIComponent(termino.trim().toLowerCase().replace(/\s+/g, "-"));
}

export async function buscarNegocios(termino: string): Promise<NegocioResultado[]> {
  // El RPC exige >= 2 chars (`where length(q.term) >= 2`); abajo de eso
  // devuelve vacío igual, así que nos ahorramos el request.
  if (termino.length < 2) return [];

  // GET y no POST sobre el RPC: `search_businesses` es `stable`, así que
  // PostgREST lo acepta por GET — y sólo por GET el `fetch` de Next se cachea
  // (un POST se saltaría `revalidate` y pegaría a la DB en cada scrapeo de
  // Facebook). El hint `!businesses_category_id_fkey` desambigua las dos
  // relaciones businesses↔categories, igual que en /negocio/[id].
  const params = new URLSearchParams({
    search_query: termino,
    select:
      "id,slug,name,address,photo_url,is_verified,has_delivery,categories!businesses_category_id_fkey(id,name)",
  });

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/search_businesses?${params}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    // Un link compartido que falla debe mostrar "sin resultados", no un 500:
    // quien lo abrió viene de un comentario de Facebook y no tiene a dónde ir.
    return [];
  }
}

/** URL del negocio: el slug es la forma corta y bonita; el id es el fallback. */
export function urlDeNegocio(negocio: NegocioResultado): string {
  return negocio.slug ? `/${negocio.slug}` : `/negocio/${negocio.id}`;
}

/** "8 negocios" / "1 negocio" — se usa en el título, la descripción y la imagen OG. */
export function conteoLegible(total: number): string {
  return `${total} ${total === 1 ? "negocio" : "negocios"}`;
}
