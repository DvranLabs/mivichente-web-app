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
