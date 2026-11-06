"use client";

// Lo que pasa después de escanear el QR del mostrador. El servidor ya resolvió
// el negocio y registró el scan; aquí se decide a qué tarjeta llevar, porque el
// token vive en `localStorage`:
//   - si este celular ya tiene tarjeta de ese negocio, a esa misma (reescanear
//     no crea una nueva: si no, el cliente nunca junta sellos);
//   - si no, se pide una y se guarda su token.
// Esto corre en el navegador a propósito: las vistas previas de WhatsApp y los
// crawlers no ejecutan JS, así que no crean tarjetas.

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { leerEntrada, obtenerTarjeta, type ResultadoDeObtener } from "../../app/actions/tarjeta";
import { getOrCreateDeviceId, rotarDeviceId } from "../../lib/device-id";
import { claveDelToken, rutaDeLaTarjeta } from "../../lib/tarjeta";
import { borrar, guardar, leer } from "./almacen";
import { Acciones, Encabezado, Mensaje, Pantalla, ProgramaApagado, styles } from "./piezas";

const RED: ResultadoDeObtener = { ok: false, error: "red" };

export default function EntradaDelMostrador({
  negocio,
  logo,
}: {
  negocio: { id: string; slug: string; nombre: string };
  logo: string | null;
}) {
  const router = useRouter();
  const [fase, setFase] = useState<"abriendo" | "apagado" | "error">("abriendo");
  // En desarrollo React corre los efectos dos veces: dos llamadas a la vez
  // crearían una tarjeta y la segunda respondería `already_has_card`.
  const corriendo = useRef(false);

  const abrir = useCallback(async () => {
    if (corriendo.current) return;
    corriendo.current = true;
    setFase("abriendo");

    const clave = claveDelToken(negocio.id);
    const guardado = leer(clave);
    if (guardado) {
      // Se revisa antes de mandar: una impresa guardada que después se
      // reemplazó dejaría al cliente en «esta tarjeta ya no se puede usar»
      // cada vez que escanee el mostrador.
      let sirve = true;
      try {
        const entrada = await leerEntrada(guardado);
        sirve = entrada?.status === "linked";
      } catch {
        // Sin red no se sabe: se manda y la página de la tarjeta decide.
      }
      if (sirve) {
        router.replace(rutaDeLaTarjeta(guardado));
        return;
      }
      borrar(clave);
    }

    let deviceId = getOrCreateDeviceId();
    let r = await obtenerTarjeta(negocio.slug, deviceId).catch(() => RED);
    // Este celular ya tiene tarjeta pero no guardó su token (se perdió la
    // primera respuesta). La DB no lo devuelve por `device_id`, a propósito: se
    // pide otra como si fuera otro celular, una sola vez. La perdida casi seguro
    // tenía 0 sellos (decisión del usuario, 2026-11-06).
    if (!r.ok && r.error === "already_has_card") {
      deviceId = rotarDeviceId();
      r = await obtenerTarjeta(negocio.slug, deviceId).catch(() => RED);
    }

    if (r.ok) {
      guardar(clave, r.token);
      router.replace(rutaDeLaTarjeta(r.token));
      return;
    }
    corriendo.current = false;
    setFase(r.error === "stamp_card_not_available" ? "apagado" : "error");
  }, [negocio.id, negocio.slug, router]);

  useEffect(() => {
    abrir();
  }, [abrir]);

  if (fase === "apagado") {
    return <ProgramaApagado negocio={negocio.nombre} slug={negocio.slug} logo={logo} />;
  }

  return (
    <Pantalla>
      <Encabezado negocio={negocio.nombre} logo={logo} />
      {fase === "error" ? (
        <>
          <Mensaje titulo="No se pudo abrir tu tarjeta" linea="Revisa la señal e intenta otra vez." />
          <Acciones>
            <button type="button" className={styles.btn} onClick={abrir}>
              Intentar otra vez
            </button>
          </Acciones>
        </>
      ) : (
        <Mensaje titulo="Abriendo tu tarjeta…" />
      )}
    </Pantalla>
  );
}
