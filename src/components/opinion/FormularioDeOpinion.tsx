"use client";

// Lo que abre el QR del acrílico: el formulario (pantallas 1-2 del mockup) y,
// al enviar, el aviso de que el descuento quedó guardado (pantalla 3). El aviso
// no es el cupón: el cupón solo se ve al volver a escanear, en la siguiente
// visita (decisión del 2026-10-12).
//
// Antes de pintar nada revisa si este navegador ya tiene un descuento de este
// negocio. Si lo tiene, reescanear el QR lleva a ese descuento en el estado que
// tenga, nunca a un formulario nuevo. Por eso el formulario no sale en el HTML
// del servidor: no se sabe hasta leer `localStorage`.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { enviarOpinion } from "../../app/actions/opinion";
import {
  claveDelToken,
  fechaLarga,
  rutaDelDescuento,
  type Cupon,
} from "../../lib/descuento";
import { getOrCreateDeviceId } from "../../lib/device-id";
import { Estrella, LetreroConQr, Palomita } from "./dibujos";
import { Cierre, Pantalla, Pasos } from "./piezas";
import styles from "./opinion.module.css";

export interface NegocioDeOpinion {
  id: string;
  slug: string;
  name: string;
  /** null = el negocio no está recibiendo opiniones (interruptor apagado). */
  benefit: string | null;
  /** Primera foto del perfil (ver `logoDelNegocio`); null = sin foto. */
  logo: string | null;
}

/** El mismo tope que la DB (`text_too_long`). */
const LARGO_MAXIMO = 1000;

type Vista =
  | { tipo: "revisando" }
  | { tipo: "formulario" }
  | { tipo: "listo"; cupon: Cupon | null }
  | { tipo: "yaOpino" }
  | { tipo: "noRecibe" };

function leerToken(businessId: string): string | null {
  try {
    return localStorage.getItem(claveDelToken(businessId));
  } catch {
    return null;
  }
}

function guardarToken(businessId: string, token: string) {
  try {
    localStorage.setItem(claveDelToken(businessId), token);
  } catch {
    // Sin localStorage (modo privado estricto) el descuento se pierde al
    // cerrar la pestaña. Es el riesgo aceptado el 2026-10-12: no hay otra
    // forma de volver a él.
  }
}

function deviceId(): string {
  try {
    return getOrCreateDeviceId();
  } catch {
    // Sin localStorage no hay identificador estable. La regla de uno por
    // celular se debilita en este navegador, que ya aceptaba saltarse al
    // borrar los datos.
    return crypto.randomUUID();
  }
}

export default function FormularioDeOpinion({ negocio }: { negocio: NegocioDeOpinion }) {
  const router = useRouter();
  const [vista, setVista] = useState<Vista>({ tipo: "revisando" });
  const [rating, setRating] = useState<number | null>(null);
  const [liked, setLiked] = useState("");
  const [improve, setImprove] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = leerToken(negocio.id);
    if (token) {
      // replace y no push: "atrás" desde el descuento no debe volver aquí.
      router.replace(rutaDelDescuento(negocio.slug, token));
      return;
    }
    setVista({ tipo: negocio.benefit ? "formulario" : "noRecibe" });
  }, [negocio.id, negocio.slug, negocio.benefit, router]);

  async function enviar() {
    if (rating === null || enviando) return;
    setEnviando(true);
    setError(null);
    // La acción ya traduce los errores de la DB. Lo que lanza es la llamada
    // misma: sin señal, o una pestaña abierta desde antes de un deploy.
    const res = await enviarOpinion(negocio.slug, deviceId(), rating, liked, improve).catch(
      () => ({ ok: false, error: "red" }) as const,
    );
    setEnviando(false);

    if (res.ok) {
      guardarToken(negocio.id, res.token);
      setVista({ tipo: "listo", cupon: res.cupon });
      return;
    }
    if (res.error === "already_submitted") return setVista({ tipo: "yaOpino" });
    if (res.error === "feedback_not_accepted") return setVista({ tipo: "noRecibe" });
    setError(
      res.error === "red"
        ? "No se pudo enviar. Revisa tu señal e intenta otra vez."
        : "No se pudo enviar. Intenta otra vez.",
    );
  }

  const beneficio = negocio.benefit ?? "";

  if (vista.tipo === "revisando") {
    return <Pantalla negocio={negocio.name} logo={negocio.logo} sub="">{null}</Pantalla>;
  }

  if (vista.tipo === "noRecibe") {
    return (
      <Pantalla negocio={negocio.name} logo={negocio.logo} sub="Opiniones">
        <div className={styles.body}>
          <p className={styles.h}>Por ahora no estamos recibiendo opiniones</p>
          <div className={styles.lead}>Gracias por querer dejarnos la tuya.</div>
        </div>
        <Cierre />
      </Pantalla>
    );
  }

  if (vista.tipo === "yaOpino") {
    // El navegador perdió el token pero la DB reconoce el celular. No hay forma
    // de recuperar el descuento desde aquí (ver `claveDelToken`).
    return (
      <Pantalla negocio={negocio.name} logo={negocio.logo} sub="Gracias por tu opinión">
        <div className={styles.body}>
          <p className={styles.h}>Ya dejaste tu opinión desde este celular</p>
          <div className={styles.lead}>Gracias por ayudarnos a mejorar.</div>
        </div>
        <Cierre />
      </Pantalla>
    );
  }

  if (vista.tipo === "listo") {
    const { cupon } = vista;
    return (
      <Pantalla negocio={negocio.name} logo={negocio.logo} sub="Gracias por tu opinión">
        <div className={styles.body}>
          <Pasos estados={["done", "now", "todo"]} />
          <div className={styles.aviso}>
            <div className={styles.avisoIcono}>
              <Palomita tamano={32} color="#fff" />
            </div>
            <p className={styles.h}>
              ¡Listo! Tu {cupon?.benefit ?? beneficio} te espera en tu próxima visita
            </p>
            {cupon && (
              <div className={styles.lead}>
                Quedó guardado en este celular hasta el {fechaLarga(cupon.valid_until)}.
              </div>
            )}
          </div>
          <div className={styles.dibujo}>
            <LetreroConQr />
            <p>
              <b>Cuando regreses</b>, escanea este mismo letrero para ver tu descuento.
            </p>
          </div>
        </div>
        <Cierre />
      </Pantalla>
    );
  }

  return (
    <Pantalla negocio={negocio.name} logo={negocio.logo} sub={`${beneficio} en tu próxima compra por tu opinión`}>
      <form
        className={styles.body}
        id="opinion"
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
      >
        <Pasos estados={["now", "todo", "todo"]} />
        <p className={styles.h} id="calificacion">¿Cómo te fue hoy?</p>
        <div className={styles.lead}>Tu opinión sincera nos ayuda a mejorar.</div>

        <div className={styles.rating} role="radiogroup" aria-labelledby="calificacion">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} de 5`}
              onClick={() => setRating(n)}
            >
              <Estrella llena={rating !== null && n <= rating} />
            </button>
          ))}
        </div>
        <div className={styles.scale}>
          <span>Mal</span>
          <span>Excelente</span>
        </div>

        <label className={styles.label} htmlFor="liked">
          ¿Qué te gustó? <small>· opcional</small>
        </label>
        <textarea
          id="liked"
          className={styles.area}
          placeholder="Escribe aquí…"
          maxLength={LARGO_MAXIMO}
          value={liked}
          onChange={(e) => setLiked(e.target.value)}
        />

        <label className={styles.label} htmlFor="improve">
          ¿Qué mejorarías? <small>· opcional</small>
        </label>
        <textarea
          id="improve"
          className={styles.area}
          placeholder="Escribe aquí…"
          maxLength={LARGO_MAXIMO}
          value={improve}
          onChange={(e) => setImprove(e.target.value)}
        />

        <div className={styles.privacy}>Solo la lee {negocio.name}. No se publica.</div>
      </form>
      <div className={styles.bottom}>
        {error && <div className={styles.error}>{error}</div>}
        <button
          type="submit"
          form="opinion"
          className={`${styles.btn} ${styles.primary}`}
          disabled={rating === null || enviando}
        >
          {enviando ? "Enviando…" : `Obtener mi ${beneficio}`}
        </button>
        {rating === null && <div className={styles.hint}>Toca las estrellas para calificar</div>}
      </div>
    </Pantalla>
  );
}
