// Identificador anónimo persistente por navegador, mismo propósito que
// DeviceIdRepository en el Flutter: cruzar actividad del mismo dispositivo y
// poder excluir el uso propio al leer números. Sin auth, sin PII.
export function getOrCreateDeviceId(): string {
  const key = "device_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const generated = crypto.randomUUID();
  localStorage.setItem(key, generated);
  return generated;
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
  localStorage.setItem("device_id", generated);
  return generated;
}
