"use client";

// El descuento cuando el cliente vuelve (pantallas 4-7 del mockup): válido con
// la hora en vivo y «Usar ahora», usado con la hora en que se usó, o vencido.
//
// Lo que distingue esto de una captura de pantalla es el reloj que avanza y el
// botón que responde. El reloj se ancla a la hora de la DB y no a la del
// celular, para que adelantar o atrasar el teléfono no cambie lo que se ve.

import { useEffect, useState } from "react";
import { leerDescuento, usarDescuento } from "../../app/actions/opinion";
import { fechaLarga, fechaYHora, relojDeHoy, type Cupon } from "../../lib/descuento";
import { Cierre, Pantalla, Tarjeta } from "./piezas";
import styles from "./opinion.module.css";

function desfase(cupon: Cupon): number {
  return Date.parse(cupon.server_now) - Date.now();
}

export default function PantallaDeDescuento({
  token,
  inicial,
}: {
  token: string;
  inicial: Cupon;
}) {
  const [cupon, setCupon] = useState(inicial);
  // null hasta montar: la hora del servidor y la del cliente no coinciden al
  // hidratar, así que el reloj solo se pinta en el cliente.
  const [ahora, setAhora] = useState<number | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [usando, setUsando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const offset = desfase(cupon);
    const tic = () => setAhora(Date.now() + offset);
    tic();
    const id = setInterval(tic, 1000);
    return () => clearInterval(id);
  }, [cupon]);

  // Volver a la pestaña o regresar con "atrás" puede mostrar una página
  // guardada. El estado se vuelve a leer de la DB para no enseñar en caja un
  // «Válido» que ya se usó en otro lado.
  useEffect(() => {
    async function releer() {
      const fresco = await leerDescuento(token).catch(() => null);
      if (fresco) setCupon(fresco);
    }
    const alVolver = () => {
      if (document.visibilityState === "visible") releer();
    };
    const alMostrar = (e: PageTransitionEvent) => {
      if (e.persisted) releer();
    };
    document.addEventListener("visibilitychange", alVolver);
    window.addEventListener("pageshow", alMostrar);
    return () => {
      document.removeEventListener("visibilitychange", alVolver);
      window.removeEventListener("pageshow", alMostrar);
    };
  }, [token]);

  async function usar() {
    setUsando(true);
    setError(null);
    // Si la llamada lanza (sin señal, o un deploy nuevo con la pestaña
    // abierta), la hoja no se puede quedar trabada en caja.
    const despues = await usarDescuento(token).catch(() => null);
    setUsando(false);
    if (!despues) {
      setError("No se pudo usar el descuento. Revisa la señal e intenta otra vez.");
      return;
    }
    setCupon(despues);
    setConfirmando(false);
  }

  // Si la pantalla se queda abierta al pasar el vencimiento, se marca vencida
  // sin esperar a recargar. La DB rechazaría el uso de todos modos.
  const estado =
    cupon.status === "valid" && ahora !== null && ahora >= Date.parse(cupon.expires_at)
      ? "expired"
      : cupon.status;
  const negocio = cupon.business_name;
  const slug = cupon.business_slug;

  if (estado === "used") {
    // La hora en que se usó va grande: `redeem_coupon` responde "used" igual si
    // lo acaba de usar quien cobra o si ya estaba usado de antes, y la hora es
    // lo que deja ver en caja cuál de las dos fue.
    return (
      <Pantalla negocio={negocio} sub="Tu descuento">
        <div className={styles.body}>
          <Tarjeta
            estado="used"
            beneficio={cupon.benefit}
            que={`Aplicado en ${negocio}`}
            cuando={cupon.redeemed_at ? fechaYHora(cupon.redeemed_at) : null}
          />
          <div className={styles.steps}>Gracias por volver a {negocio}.</div>
        </div>
        <Cierre slug={slug} negocio={negocio} />
      </Pantalla>
    );
  }

  if (estado === "expired") {
    return (
      <Pantalla negocio={negocio} sub="Tu descuento">
        <div className={styles.body}>
          <Tarjeta
            estado="expired"
            beneficio={cupon.benefit}
            que="Este descuento ya no es válido"
            cuando={`Venció el ${fechaLarga(cupon.valid_until)}`}
          />
        </div>
        <Cierre slug={slug} negocio={negocio} />
      </Pantalla>
    );
  }

  return (
    <Pantalla negocio={negocio} sub="Tu descuento">
      <div className={styles.body}>
        <Tarjeta
          estado="valid"
          beneficio={cupon.benefit}
          que={`en esta compra en ${negocio}`}
          cuando={`Válido hasta el ${fechaLarga(cupon.valid_until)}`}
        >
          <div className={styles.clock} aria-live="off">
            {ahora !== null ? relojDeHoy(ahora) : ""}
          </div>
        </Tarjeta>
        <div className={styles.steps}>
          <b>Para quien cobra:</b> toca «Usar ahora» y aplica el {cupon.benefit} a esta cuenta.
        </div>
      </div>
      <div className={styles.bottom}>
        <button
          type="button"
          className={`${styles.btn} ${styles.dark}`}
          onClick={() => {
            setError(null);
            setConfirmando(true);
          }}
        >
          Usar ahora
        </button>
        <div className={styles.hint}>Solo se puede usar una vez</div>
      </div>

      {confirmando && (
        <>
          <div className={styles.scrim} onClick={() => !usando && setConfirmando(false)} />
          <div className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="confirmar">
            <div className={styles.grabber} />
            <p className={styles.h} id="confirmar">¿Ya se está cobrando?</p>
            <div className={styles.lead}>
              Al confirmar, el descuento queda usado y ya no se puede volver a usar.
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button
              type="button"
              className={`${styles.btn} ${styles.dark}`}
              disabled={usando}
              onClick={usar}
            >
              {usando ? "Aplicando…" : `Sí, aplicar el ${cupon.benefit}`}
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.ghost}`}
              disabled={usando}
              onClick={() => setConfirmando(false)}
            >
              Todavía no
            </button>
          </div>
        </>
      )}
    </Pantalla>
  );
}
