// Tarjeta de sellos del cliente (proyecto `j36831miv`). La DB es la dueña de las
// reglas: aquí van la forma de los datos, dónde guarda el navegador el token y
// qué pantalla toca según el estado. Lo leen el servidor y el cliente, así que
// este archivo no toca variables de entorno.
//
// Contrato de la DB (migraciones 20261103120000_stamp_cards.sql y
// 20261105120000_physical_customer_cards.sql del admin):
//   get_or_create_stamp_card(slug, device_id) → token de la digital, o error
//     stamp_card_not_available / already_has_card / invalid_device_id.
//   get_card_entry(token) → una fila `EntradaDeTarjeta`, o ninguna si el token
//     no existe o es de una física revocada.
//   get_stamp_card(token) → una fila `TarjetaDeSellos`, o ninguna si el token no
//     es de una tarjeta asociada y vigente.
//   link_physical_card(token, device_id, customer_token) → token de la digital,
//     o uno de los errores de `ErrorAlActivar`.
//
// El token es un secreto al portador: quien lo tiene ve la tarjeta y se la
// enseña al dueño para recibir sellos. Sirven igual el de la digital y el de una
// física asociada, y los dos abren la misma página, /t/{token}.

export interface EntradaDeTarjeta {
  /** `unlinked`: física impresa que nadie ha activado. */
  status: "linked" | "unlinked";
  business_name: string;
  business_slug: string;
  /** `stamp_card`, o null si el negocio no tiene nada activo. */
  active_mechanic: "stamp_card" | null;
}

export interface TarjetaDeSellos {
  business_name: string;
  business_slug: string;
  /** El negocio está activo y tiene la tarjeta prendida. */
  program_active: boolean;
  /** Copia del premio de la vuelta abierta ("frappé gratis"), sin «un». */
  reward: string | null;
  stamps_required: number;
  stamps: number;
  is_full: boolean;
  last_stamp_at: string | null;
  last_redeemed_at: string | null;
  last_redeemed_reward: string | null;
  server_now: string;
}

/** La forma de los tokens que genera la DB: 18 bytes en base64url son 24 caracteres. */
const TOKEN = /^[A-Za-z0-9_-]{16,64}$/;

/** Si vale la pena preguntarle a la DB por este token. */
export function pareceToken(token: string): boolean {
  return TOKEN.test(token);
}

/**
 * Dónde guarda el navegador el token del cliente en un negocio.
 *
 * Por `business_id` y no por slug, igual que el descuento: el slug cambia si el
 * negocio se renombra. La DB no devuelve el token de un celular que ya tiene
 * tarjeta (el `device_id` no es secreto), así que este token es la única forma
 * de volver a la tarjeta desde el QR del mostrador.
 */
export function claveDelToken(businessId: string): string {
  return `tarjeta-cliente:${businessId}`;
}

/**
 * Lo último que este celular vio de la tarjeta. Con eso la animación del sello
 * nuevo corre solo cuando el número cambió, no cada vez que se abre la página.
 */
export function claveDeLoVisto(businessId: string): string {
  return `tarjeta-cliente-visto:${businessId}`;
}

export function rutaDeLaTarjeta(token: string): string {
  return `/t/${encodeURIComponent(token)}`;
}

/**
 * La URL del QR que escanea el dueño y la del link de WhatsApp. Siempre la de
 * producción, igual que la tarjeta impresa (`urlTarjetaFisica` del admin): el
 * panel del dueño lee las dos con la misma forma.
 */
export function urlDeLaTarjeta(token: string): string {
  return `https://vichente.com${rutaDeLaTarjeta(token)}`;
}

/** El mensaje que el cliente se manda a sí mismo por WhatsApp (C1b). */
export function linkDeWhatsApp(negocio: string, token: string): string {
  const texto = `Mi tarjeta de sellos de ${negocio}: ${urlDeLaTarjeta(token)}`;
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

/**
 * El nombre del negocio con guiones que no parten la línea ("K‑fféss"), como
 * pide el mockup. Solo para pintar: el texto de WhatsApp lleva el nombre tal cual.
 */
export function nombreSinCorte(nombre: string): string {
  return nombre.replace(/-/g, "‑");
}

export type Pantalla = "nueva" | "medias" | "llena" | "canjeada" | "apagada";

/**
 * Qué pantalla del mockup toca (C1 a C5).
 *
 * Una tarjeta llena con el programa apagado sigue en «llena»: el premio ya
 * ganado se puede canjear aunque el negocio apague la tarjeta (así lo dice el
 * formulario del admin y así lo deja `owner_redeem_stamp_card`). Esconderlo
 * detrás de «no está dando tarjetas» le quitaría al cliente un premio que es suyo.
 */
export function pantallaDe(t: TarjetaDeSellos): Pantalla {
  if (t.is_full) return "llena";
  if (!t.program_active) return "apagada";
  if (t.stamps === 0) return t.last_redeemed_at ? "canjeada" : "nueva";
  return "medias";
}

/** El título de la zona del mensaje. El premio se escribe sin «un» en el admin. */
export function tituloDe(t: TarjetaDeSellos, pantalla: Pantalla): string {
  const premio = t.reward ?? "premio";
  switch (pantalla) {
    case "nueva":
      return `Junta ${t.stamps_required} sellos y llévate tu ${premio}`;
    case "medias": {
      const faltan = t.stamps_required - t.stamps;
      return faltan === 1 ? `¡Te falta 1 para tu ${premio}!` : `Te faltan ${faltan} para tu ${premio}`;
    }
    case "llena":
      return `¡Ganaste tu ${premio}!`;
    case "canjeada":
      return `Recibiste tu ${t.last_redeemed_reward ?? premio}`;
    case "apagada":
      return `${nombreSinCorte(t.business_name)} no está dando tarjetas de sellos por ahora`;
  }
}

/** Lo que cambió desde la última vez que este celular vio la tarjeta. */
export interface Cambio {
  /** Tramos que se acaban de llenar: del `desde` (exclusivo) al `hasta` (inclusivo). */
  tramos: { desde: number; hasta: number } | null;
  /** Llegó un sello: sale «¡Sello nuevo!» en la fila de aviso. */
  selloNuevo: boolean;
  /** Se acaba de llenar: confeti una sola vez. */
  seLleno: boolean;
}

export interface LoVisto {
  stamps: number;
  last_redeemed_at: string | null;
}

export function loVistoDe(t: TarjetaDeSellos): LoVisto {
  return { stamps: t.stamps, last_redeemed_at: t.last_redeemed_at };
}

const SIN_CAMBIO: Cambio = { tramos: null, selloNuevo: false, seLleno: false };

/**
 * Sin nada guardado (primera vez que se abre en este celular) no se anima nada:
 * el cliente no vio el antes, así que no hay sello «nuevo» que enseñar.
 */
export function cambioDesde(antes: LoVisto | null, ahora: TarjetaDeSellos): Cambio {
  if (!antes) return SIN_CAMBIO;
  const otraVuelta = antes.last_redeemed_at !== ahora.last_redeemed_at;
  // Si hubo canje entre medio, los sellos de la vuelta nueva cuentan desde cero.
  const base = otraVuelta ? 0 : antes.stamps;
  if (ahora.stamps <= base) return SIN_CAMBIO;
  return {
    tramos: { desde: base, hasta: ahora.stamps },
    selloNuevo: true,
    seLleno: ahora.is_full,
  };
}
