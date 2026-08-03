// Datos del menú de mesa: el negocio y sus platillos, resueltos por slug.
//
// Vive en la landing y no en la web app de Flutter a propósito: en la mesa el
// rival es la paciencia. El bundle de Flutter descarga ~2-3 MB antes de pintar
// el primer pixel, y "el menú por QR tardaba" es justo la mala experiencia que
// originó este piloto. Aquí sale HTML en el primer viaje.

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export interface MenuItem {
  name: string;
  /** PostgREST serializa `numeric` como string ("75.00"), no como number. */
  price: string | number | null;
  description: string | null;
  image_url: string | null;
  section: string | null;
  order_index: number;
  updated_at: string;
}

export interface MenuBusiness {
  id: string;
  slug: string;
  name: string;
  photo_url: string | null;
  business_services: MenuItem[];
}

const SELECT =
  "id,slug,name,photo_url,business_services(name,price,description,image_url,section,order_index,updated_at)";

async function supabaseGet<T>(path: string): Promise<T[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch {
    return null;
  }
}

export async function getMenuBySlug(slug: string): Promise<MenuBusiness | null> {
  const rows = await supabaseGet<MenuBusiness>(
    // Se ordena solo por `order_index`: es el orden curado del menú. Agrupar por
    // sección se hace después preservando ese orden, para no reordenar el menú
    // alfabéticamente por accidente.
    `businesses?slug=eq.${encodeURIComponent(slug)}&select=${SELECT}` +
      `&business_services.order=order_index.asc&limit=1`
  );
  return rows?.[0] ?? null;
}

// Un slug que ya salió impreso no se cambia — pero el trigger de `businesses`
// lo recalcula solo cuando el negocio se renombra, y a quien tiene el QR pegado
// en la mesa no hay forma de avisarle. `business_slug_history` guarda los slugs
// viejos para poder redirigir en vez de dar 404 sobre papel ya repartido.
export async function resolveSlugFromHistory(slug: string): Promise<string | null> {
  const rows = await supabaseGet<{ businesses: { slug: string } | null }>(
    `business_slug_history?slug=eq.${encodeURIComponent(slug)}&select=businesses(slug)&limit=1`
  );
  return rows?.[0]?.businesses?.slug ?? null;
}

/** Secciones en el orden en que vienen; los platillos sin sección van juntos al inicio. */
export interface MenuSection {
  /** null = el negocio no usa secciones (o este platillo no tiene). */
  name: string | null;
  anchor: string;
  items: MenuItem[];
}

export function agruparPorSeccion(items: MenuItem[]): MenuSection[] {
  const orden: string[] = [];
  const grupos = new Map<string, MenuItem[]>();

  for (const item of items) {
    const clave = item.section?.trim() || "";
    if (!grupos.has(clave)) {
      grupos.set(clave, []);
      orden.push(clave);
    }
    grupos.get(clave)!.push(item);
  }

  return orden.map((clave, i) => ({
    name: clave || null,
    anchor: `seccion-${i}`,
    items: grupos.get(clave)!,
  }));
}

/**
 * Lo que hoy es un párrafo cortado a dos líneas se vuelve una lista de qué trae.
 *
 * El formato de captura es texto libre y nadie lo valida ("Incluye: a, b, c",
 * "Sabores: x, y", o las dos juntas). Por eso: si el texto no trae una etiqueta
 * reconocible, se devuelve tal cual como párrafo en vez de inventar una lista
 * partiendo por comas — una captura con otro formato se lee raro, no se rompe.
 */
export interface DescripcionParseada {
  grupos: { etiqueta: string; partes: string[] }[];
  /** Texto que no encajó en ningún grupo; se muestra como párrafo. */
  parrafo: string | null;
}

// Para cortar el texto en segmentos se exige los dos puntos: es lo único que
// distingue una etiqueta de verdad de la palabra suelta a media frase.
const CORTE_ETIQUETA = /(?=\b(?:Incluye|Contiene|Sabores|Sabor|Con)\s*:)/i;

// Dentro de un segmento sí se acepta la etiqueta sin dos puntos, porque ahí ya
// va al principio y no hay ambigüedad: "Incluye 2 Sabritas a elegir, elote, …"
// es de la captura real de Snacky. "Con" queda fuera de esta forma a propósito
// — arrancaría con cosas como "Con leche" y partiría un nombre en pedazos.
const ETIQUETA_SIN_DOSPUNTOS = /^(Incluye|Contiene|Sabores|Sabor)\b\s*(.+)$/i;

export function parseDescripcion(description: string | null): DescripcionParseada {
  const texto = description?.trim();
  if (!texto) return { grupos: [], parrafo: null };

  const segmentos = texto.split(CORTE_ETIQUETA).map((s) => s.trim()).filter(Boolean);
  const grupos: DescripcionParseada["grupos"] = [];
  const sueltos: string[] = [];

  for (const segmento of segmentos) {
    const corte = segmento.indexOf(":");
    let etiqueta: string;
    let resto: string;

    if (corte !== -1) {
      etiqueta = segmento.slice(0, corte).trim();
      resto = segmento.slice(corte + 1);
    } else {
      const m = segmento.match(ETIQUETA_SIN_DOSPUNTOS);
      if (!m) {
        sueltos.push(segmento);
        continue;
      }
      [, etiqueta, resto] = m;
    }

    const partes = separarLista(resto);
    if (partes.length) grupos.push({ etiqueta, partes });
    else sueltos.push(segmento);
  }

  return { grupos, parrafo: sueltos.join(" ") || null };
}

function separarLista(texto: string): string[] {
  const partes = texto
    .replace(/\.\s*$/, "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  // El último elemento suele venir unido con " y " ("queso amarillo y queso
  // blanco"). Se parte solo ahí para no romper nombres que llevan "y" adentro.
  const ultimo = partes.pop();
  if (ultimo) {
    const mitades = ultimo.split(/\s+y\s+/i).map((p) => p.trim()).filter(Boolean);
    partes.push(...(mitades.length ? mitades : [ultimo]));
  }
  return partes;
}

const PRECIO = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatearPrecio(price: string | number | null): string | null {
  if (price === null || price === undefined || price === "") return null;
  const n = typeof price === "number" ? price : Number(price);
  return Number.isFinite(n) ? PRECIO.format(n) : null;
}

const FECHA = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Monterrey",
});

/** La fecha del menú es la del platillo editado más recientemente. */
export function fechaDeActualizacion(items: MenuItem[]): string | null {
  const fechas = items
    .map((i) => new Date(i.updated_at).getTime())
    .filter((t) => Number.isFinite(t));
  if (!fechas.length) return null;
  return FECHA.format(new Date(Math.max(...fechas)));
}
