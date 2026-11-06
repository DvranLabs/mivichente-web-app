"use client";

// Cuando no se pudo leer la tarjeta (sin señal en caja, o la DB no respondió).
// Sin esto el error se vería como «esta tarjeta ya no se puede usar», y el
// cliente creería que perdió sus sellos. Aquí no se sabe el estado, así que no
// se muestra ninguno: solo reintentar.

import { Acciones, Mensaje, Pantalla, styles } from "../../../components/sellos/piezas";

export default function ErrorDeLaTarjeta() {
  return (
    <Pantalla>
      <Mensaje titulo="No se pudo cargar tu tarjeta" linea="Revisa la señal e intenta otra vez." />
      <Acciones>
        {/* Recarga completa y no `reset()`: el error viene del servidor, y
            reset solo vuelve a pintar lo que ya falló. */}
        <button type="button" className={styles.btn} onClick={() => window.location.reload()}>
          Intentar otra vez
        </button>
      </Acciones>
    </Pantalla>
  );
}
