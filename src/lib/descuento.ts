// Descuento que se gana al dejar una opinión desde el QR del local (piloto de
// K-fféss). La DB es la dueña de las reglas: aquí solo van la forma de los datos
// y cómo se pintan las fechas. Lo leen la página de opinión y la del descuento,
// en servidor y en cliente, así que este archivo no toca variables de entorno.
//
// Contrato de la DB (migración 20261010130000_business_feedback_coupons.sql):
//   submit_business_feedback → token, o error already_submitted /
//     feedback_not_accepted / invalid_rating / invalid_device_id / text_too_long
//   get_coupon(token), redeem_coupon(token) → una fila con la forma de `Cupon`,
//     o ninguna si el token no existe.

export type EstadoCupon = "valid" | "used" | "expired";

export interface Cupon {
  business_name: string;
  business_slug: string;
  /** Copia del beneficio al crearse ("10%"); no cambia si el negocio lo cambia. */
  benefit: string;
  status: EstadoCupon;
  /** Último día válido, "YYYY-MM-DD", ya en hora de Durango. */
  valid_until: string;
  expires_at: string;
  redeemed_at: string | null;
  created_at: string;
  /** Hora de la DB al leer. El reloj de la pantalla se ancla a ella, no al celular. */
  server_now: string;
}

/**
 * Dónde guarda el navegador el token del descuento de un negocio.
 *
 * Por `business_id` y no por slug: el slug cambia si el negocio se renombra, y
 * entonces reescanear el QR ya no encontraría el descuento. La DB no lo puede
 * recuperar por `device_id` a propósito (sería una segunda llave del cupón), así
 * que este token es la única forma de volver a él.
 */
export function claveDelToken(businessId: string): string {
  return `descuento-opinion:${businessId}`;
}

/** La URL que se comparte. Sin `src`: abrirla no es un scan del QR. */
export function rutaDelDescuento(slug: string, token: string): string {
  return `/${slug}/descuento/${encodeURIComponent(token)}`;
}

// Vicente Guerrero usa la hora del centro desde que México quitó el horario de
// verano. La DB calcula el vencimiento con la misma zona.
const ZONA = "America/Mexico_City";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const MESES_CORTOS = [
  "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic",
];

const partes = new Intl.DateTimeFormat("en-US", {
  timeZone: ZONA,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function enDurango(fecha: Date) {
  const p = Object.fromEntries(partes.formatToParts(fecha).map((x) => [x.type, x.value]));
  return {
    dia: Number(p.day),
    mes: Number(p.month) - 1,
    hora: `${p.hour}:${p.minute}`,
  };
}

/** "2026-11-09" → "9 de noviembre". La fecha ya viene en hora de Durango. */
export function fechaLarga(dia: string): string {
  const [, mes, d] = dia.split("-").map(Number);
  return `${d} de ${MESES[mes - 1]}`;
}

/** Cuándo se usó: "14 de octubre · 10:32". */
export function fechaYHora(instante: string): string {
  const p = enDurango(new Date(instante));
  return `${p.dia} de ${MESES[p.mes]} · ${p.hora}`;
}

/** El reloj de la tarjeta válida: "Hoy 14 oct · 10:31". */
export function relojDeHoy(ms: number): string {
  const p = enDurango(new Date(ms));
  return `Hoy ${p.dia} ${MESES_CORTOS[p.mes]} · ${p.hora}`;
}
