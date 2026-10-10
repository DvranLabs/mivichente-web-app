"use client";

// Cuando no se pudo leer el descuento (sin señal en caja, o la DB no
// respondió). Sin esto el error se veía como un 404, que quien cobra lee como
// "este descuento no existe". Aquí no se sabe el estado, así que no se muestra
// ninguno: solo reintentar.

import { Pantalla } from "../../../../components/opinion/piezas";
import styles from "../../../../components/opinion/opinion.module.css";

export default function ErrorDelDescuento() {
  return (
    <Pantalla negocio="Vichente" sub="Tu descuento">
      <div className={styles.body}>
        <p className={styles.h}>No se pudo cargar el descuento</p>
        <div className={styles.lead}>Revisa la señal e intenta otra vez.</div>
      </div>
      <div className={styles.bottom}>
        {/* Recarga completa y no `reset()`: el error viene del servidor, y
            reset solo vuelve a pintar lo que ya falló. */}
        <button
          type="button"
          className={`${styles.btn} ${styles.dark}`}
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    </Pantalla>
  );
}
