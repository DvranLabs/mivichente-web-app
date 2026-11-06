// localStorage con red: en Safari privado o con el almacenamiento bloqueado,
// leer o escribir puede lanzar. Ahí la tarjeta se sigue viendo; lo que se
// pierde es volver a ella desde el QR del mostrador.

export function leer(clave: string): string | null {
  try {
    return localStorage.getItem(clave);
  } catch {
    return null;
  }
}

export function guardar(clave: string, valor: string): void {
  try {
    localStorage.setItem(clave, valor);
  } catch {
    // ver arriba
  }
}

export function borrar(clave: string): void {
  try {
    localStorage.removeItem(clave);
  } catch {
    // ver arriba
  }
}
