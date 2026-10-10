"use server";

// Opinión con descuento: las tres llamadas que hace la landing. Pasan por
// server action porque la URL y la anon key de Supabase no se exponen al
// navegador en este repo (no son NEXT_PUBLIC_).
//
// Nada aquí lee ni escribe tablas: anon no tiene grants sobre `coupons` ni
// `business_feedback`. Todo va por las tres funciones `security definer` de la
// DB, que son las que deciden quién obtiene un descuento. Estas acciones no
// agregan permisos: quien las llama puede lo mismo que llamando la función con
// la anon key, y nada más.

import type { Cupon } from "../../lib/descuento";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

type Respuesta<T> = { ok: true; data: T } | { ok: false; mensaje: string | null };

async function rpc<T>(funcion: string, args: Record<string, unknown>): Promise<Respuesta<T>> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${funcion}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      // El estado del descuento se lee en el momento: un "Válido" cacheado es
      // justo lo que no debe pasar en caja.
      cache: "no-store",
    });
    if (res.ok) return { ok: true, data: (await res.json()) as T };
    // PostgREST devuelve el `raise exception` de la función en `message`.
    const error = (await res.json().catch(() => null)) as { message?: string } | null;
    return { ok: false, mensaje: error?.message ?? null };
  } catch {
    return { ok: false, mensaje: null };
  }
}

export type ResultadoOpinion =
  | { ok: true; token: string; cupon: Cupon | null }
  | { ok: false; error: "already_submitted" | "feedback_not_accepted" | "invalido" | "red" };

export async function enviarOpinion(
  slug: string,
  deviceId: string,
  rating: number,
  liked: string,
  improve: string,
): Promise<ResultadoOpinion> {
  const res = await rpc<string>("submit_business_feedback", {
    p_slug: slug,
    p_device_id: deviceId,
    p_rating: rating,
    p_liked: liked,
    p_improve: improve,
  });

  if (!res.ok) {
    if (res.mensaje === "already_submitted" || res.mensaje === "feedback_not_accepted") {
      return { ok: false, error: res.mensaje };
    }
    // invalid_rating, invalid_device_id o text_too_long: el formulario ya los
    // impide, así que aquí solo llega alguien que no usó el formulario.
    return { ok: false, error: res.mensaje ? "invalido" : "red" };
  }

  // La opinión ya quedó guardada. Si leer el descuento falla, el token basta:
  // la pantalla se pinta sin la fecha y el link sigue sirviendo.
  const cupon = await leerDescuento(res.data).catch(() => null);
  return { ok: true, token: res.data, cupon };
}

/**
 * El descuento del token, o null si el token no existe. Si la DB o la red
 * fallan, lanza: en caja, un error pasajero no puede verse como "este
 * descuento no existe".
 */
export async function leerDescuento(token: string): Promise<Cupon | null> {
  const res = await rpc<Cupon[]>("get_coupon", { p_token: token });
  if (!res.ok) throw new Error("No se pudo leer el descuento");
  return res.data[0] ?? null;
}

/**
 * Marca el descuento como usado. Devuelve el estado después del intento: si ya
 * estaba usado o vencido, la DB no cambia nada y lo dice igual.
 */
export async function usarDescuento(token: string): Promise<Cupon | null> {
  const res = await rpc<Cupon[]>("redeem_coupon", { p_token: token });
  return res.ok ? (res.data[0] ?? null) : null;
}
