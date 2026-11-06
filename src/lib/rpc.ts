// Llamada a una función de la DB con la anon key. La usan las server actions
// de opinión y de la tarjeta de sellos: la URL y la anon key de Supabase no se
// exponen al navegador en este repo (no son NEXT_PUBLIC_), así que este archivo
// solo se importa desde el servidor.
//
// Quien llama puede lo mismo que llamando la función con la anon key, y nada
// más: las reglas viven en funciones `security definer` de la DB.

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export type Respuesta<T> = { ok: true; data: T } | { ok: false; mensaje: string | null };

/**
 * `mensaje` es el `raise exception` de la función (PostgREST lo pone en
 * `message`), o null si falló la red o la respuesta no se pudo leer.
 */
export async function rpc<T>(funcion: string, args: Record<string, unknown>): Promise<Respuesta<T>> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${funcion}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      // Todo lo que pasa por aquí se lee en el momento: un descuento «Válido» o
      // una tarjeta sin el sello de hace un minuto, cacheados, es justo lo que
      // no debe verse en caja.
      cache: "no-store",
    });
    if (res.ok) return { ok: true, data: (await res.json()) as T };
    const error = (await res.json().catch(() => null)) as { message?: string } | null;
    return { ok: false, mensaje: error?.message ?? null };
  } catch {
    return { ok: false, mensaje: null };
  }
}
