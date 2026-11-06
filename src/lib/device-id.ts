// Identificador anónimo persistente por navegador, mismo propósito que
// DeviceIdRepository en el Flutter: cruzar actividad del mismo dispositivo y
// poder excluir el uso propio al leer números. Sin auth, sin PII.
//
// Con el almacenamiento bloqueado (Safari privado, cookies apagadas),
// `localStorage` lanza. Ahí se usa un id que dura lo que la pestaña: la tarjeta
// de sellos y la opinión siguen funcionando, aunque el celular no se recuerde.
const KEY = "device_id";
let enMemoria: string | null = null;

export function getOrCreateDeviceId(): string {
  try {
    const existing = localStorage.getItem(KEY);
    if (existing) return existing;
    const generated = crypto.randomUUID();
    localStorage.setItem(KEY, generated);
    return generated;
  } catch {
    enMemoria ??= crypto.randomUUID();
    return enMemoria;
  }
}

/**
 * Cambia el identificador por uno nuevo. Solo para cuando la DB responde
 * `already_has_card` y este navegador no guardó el token (se perdió la primera
 * respuesta): la DB no devuelve el token por `device_id`, a propósito, así que
 * la única salida es pedir otra tarjeta como si fuera otro celular. La perdida
 * casi seguro tenía 0 sellos. Costo: la telemetría cuenta este navegador como
 * uno nuevo.
 */
export function rotarDeviceId(): string {
  const generated = crypto.randomUUID();
  enMemoria = generated;
  try {
    localStorage.setItem(KEY, generated);
  } catch {
    // ver arriba
  }
  return generated;
}
