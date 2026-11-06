"use server";

// Tarjeta de sellos: las llamadas que hace la landing. Pasan por server action
// porque la URL y la anon key de Supabase no se exponen al navegador.
//
// Nada aquí lee ni escribe tablas: anon no tiene grants sobre
// `business_customers`, `physical_cards` ni las de sellos. Todo va por funciones
// `security definer` de la DB, que deciden qué token lleva a qué cliente. Estas
// acciones no agregan permisos: quien las llama puede lo mismo que llamando la
// función con la anon key, y nada más. Ninguna da sellos ni canjea: eso solo lo
// hace el dueño desde su panel.

import { rpc } from "../../lib/rpc";
import type { EntradaDeTarjeta, TarjetaDeSellos } from "../../lib/tarjeta";

export type ResultadoDeObtener =
  | { ok: true; token: string }
  | { ok: false; error: "stamp_card_not_available" | "already_has_card" | "red" };

/** QR del mostrador: crea el cliente y su tarjeta para este celular. */
export async function obtenerTarjeta(slug: string, deviceId: string): Promise<ResultadoDeObtener> {
  const res = await rpc<string>("get_or_create_stamp_card", {
    p_slug: slug,
    p_device_id: deviceId,
  });
  if (res.ok) return { ok: true, token: res.data };
  if (res.mensaje === "stamp_card_not_available" || res.mensaje === "already_has_card") {
    return { ok: false, error: res.mensaje };
  }
  // invalid_device_id solo llega si el navegador no generó uno; se trata igual
  // que un error de red: reintentar.
  return { ok: false, error: "red" };
}

/**
 * Qué es este token, o null si no existe o es de una física revocada. Si la DB
 * o la red fallan, lanza: un error pasajero no puede verse como «esta tarjeta
 * ya no se puede usar».
 */
export async function leerEntrada(token: string): Promise<EntradaDeTarjeta | null> {
  const res = await rpc<EntradaDeTarjeta[]>("get_card_entry", { p_token: token });
  if (!res.ok) throw new Error("No se pudo leer la tarjeta");
  return res.data[0] ?? null;
}

/** El estado de la tarjeta, o null si el token no es de una tarjeta asociada. Lanza si falla. */
export async function leerTarjeta(token: string): Promise<TarjetaDeSellos | null> {
  const res = await rpc<TarjetaDeSellos[]>("get_stamp_card", { p_token: token });
  if (!res.ok) throw new Error("No se pudo leer la tarjeta");
  return res.data[0] ?? null;
}

export type ErrorAlActivar =
  | "not_a_card"
  | "card_not_available"
  | "invalid_customer_token"
  | "wrong_business"
  | "card_already_linked"
  | "already_has_card"
  | "red";

const ERRORES_AL_ACTIVAR = new Set<string>([
  "not_a_card",
  "card_not_available",
  "invalid_customer_token",
  "wrong_business",
  "card_already_linked",
  "already_has_card",
]);

export type ResultadoDeActivar = { ok: true; token: string } | { ok: false; error: ErrorAlActivar };

/**
 * Asocia una tarjeta impresa al cliente de este celular. Con `customerToken`
 * (el de la digital que ya tiene guardada) la junta con esa; sin él crea el
 * cliente. Regresa el token de la digital, que es el que se guarda.
 *
 * Solo corre al tocar «Activar» o «Usar esta tarjeta»: abrir el link no cambia
 * nada, porque las vistas previas de WhatsApp y los antivirus también lo abren.
 */
export async function activarTarjeta(
  token: string,
  deviceId: string,
  customerToken: string | null,
): Promise<ResultadoDeActivar> {
  const res = await rpc<string>("link_physical_card", {
    p_token: token,
    p_device_id: deviceId,
    p_customer_token: customerToken,
  });
  if (res.ok) return { ok: true, token: res.data };
  if (res.mensaje && ERRORES_AL_ACTIVAR.has(res.mensaje)) {
    return { ok: false, error: res.mensaje as ErrorAlActivar };
  }
  return { ok: false, error: "red" };
}
