"use server";

// Búsqueda por nombre para el bloque "¿ya estás en Vichente?". El dueño escribe
// el nombre de SU negocio, así que un ilike sobre name basta y es predecible;
// no queremos el ranking difuso que usa la app (que también matchea offerings).

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

import { giroDeCategoria, type Giro } from "../../components/negocios/data";

export interface NegocioEncontrado {
  id: string;
  slug: string;
  name: string;
  municipio: string;
  photo_url: string | null;
  offerings: string[];
  /** Deducido de su categoría: al negocio que ya existe no le preguntamos su giro. */
  giro: Giro;
}

interface FilaNegocio extends Omit<NegocioEncontrado, "giro"> {
  categories: { name: string } | null;
}

export async function buscarNegocio(termino: string): Promise<NegocioEncontrado[]> {
  const q = termino.trim();
  if (q.length < 3) return [];

  // % y , rompen el filtro de PostgREST; los quitamos antes de interpolar.
  const seguro = q.replace(/[%,()*]/g, " ").trim();
  if (!seguro) return [];

  // El hint !businesses_category_id_fkey NO es opcional: hay dos relaciones
  // businesses↔categories (la FK directa category_id y la many-to-many
  // business_categories). Sin desambiguar, PostgREST responde 300 y la búsqueda
  // devuelve vacío en silencio — parece "no existe tu negocio" cuando sí existe.
  const url =
    `${SUPABASE_URL}/rest/v1/businesses` +
    `?name=ilike.*${encodeURIComponent(seguro)}*` +
    `&select=id,slug,name,municipio,photo_url,offerings,categories!businesses_category_id_fkey(name)&limit=5`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    console.error("buscarNegocio falló", res.status, await res.text());
    return [];
  }

  const filas: FilaNegocio[] = await res.json();
  return filas.map(({ categories, ...n }) => ({
    ...n,
    giro: giroDeCategoria(categories?.name),
  }));
}
