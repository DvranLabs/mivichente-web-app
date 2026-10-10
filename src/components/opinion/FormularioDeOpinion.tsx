"use client";

// Lo que abre el QR del acrílico: el formulario (pantallas 1-2 del mockup) y,
// al enviar, el descuento recién creado con el cierre (pantalla 3).
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
import { Cierre, Pantalla, Tarjeta } from "./piezas";
import styles from "./opinion.module.css";

export interface NegocioDeOpinion {
  id: string;
  slug: string;
  name: string;
  /** null = el negocio no está recibiendo opiniones (interruptor apagado). */
  benefit: string | null;
}

/** El mismo tope que la DB (`text_too_long`). */
const LARGO_MAXIMO = 1000;

type Vista =
  | { tipo: "revisando" }
  | { tipo: "formulario" }
  | { tipo: "listo"; token: string; cupon: Cupon | null }
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
    // Sin localStorage (modo privado estricto) el descuento sigue vivo en su
    // link; por eso la pantalla ofrece mandárselo por WhatsApp.
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
    const res = await enviarOpinion(negocio.slug, deviceId(), rating, liked, improve);
    setEnviando(false);

    if (res.ok) {
      guardarToken(negocio.id, res.token);
      setVista({ tipo: "listo", token: res.token, cupon: res.cupon });
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
    return <Pantalla negocio={negocio.name} sub="">{null}</Pantalla>;
  }

  if (vista.tipo === "noRecibe") {
    return (
      <Pantalla negocio={negocio.name} sub="Opiniones">
        <div className={styles.body}>
          <p className={styles.h}>Por ahora no estamos recibiendo opiniones</p>
          <div className={styles.lead}>Gracias por querer dejarnos la tuya.</div>
        </div>
        <Cierre slug={negocio.slug} negocio={negocio.name} />
      </Pantalla>
    );
  }

  if (vista.tipo === "yaOpino") {
    // El navegador perdió el token pero la DB reconoce el celular. No hay forma
    // de recuperar el descuento desde aquí (ver `claveDelToken`).
    return (
      <Pantalla negocio={negocio.name} sub="Gracias por tu opinión">
        <div className={styles.body}>
          <p className={styles.h}>Ya dejaste tu opinión</p>
          <div className={styles.lead}>
            Desde este celular ya se dejó una opinión en {negocio.name}, y hay un descuento por
            celular. Si te mandaste el link del descuento, ábrelo desde ahí.
          </div>
        </div>
        <Cierre slug={negocio.slug} negocio={negocio.name} />
      </Pantalla>
    );
  }

  if (vista.tipo === "listo") {
    const { token, cupon } = vista;
    const enlace = `${window.location.origin}${rutaDelDescuento(negocio.slug, token)}`;
    const mensaje = `Mi descuento de ${cupon?.benefit ?? beneficio} en ${negocio.name} para mi próxima visita: ${enlace}`;
    return (
      <Pantalla negocio={negocio.name} sub="Gracias por tu opinión">
        <div className={styles.body}>
          <p className={styles.h}>Tu descuento está listo</p>
          {/* Sin «Usar ahora» aquí: el descuento es para la próxima compra, y
              así no se usa en la misma visita por accidente. */}
          <Tarjeta
            estado="valid"
            beneficio={cupon?.benefit ?? beneficio}
            que={`en tu próxima compra en ${negocio.name}`}
            cuando={cupon ? `Válido hasta el ${fechaLarga(cupon.valid_until)}` : null}
          />
          <div className={styles.steps}>
            <b>¿Cómo lo uso?</b> En tu próxima visita, abre este mismo link o vuelve a escanear el
            QR, y enséñale la pantalla a quien te cobre.
          </div>
          <a
            className={styles.linkRow}
            href={`https://wa.me/?text=${encodeURIComponent(mensaje)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Mandarme el link por WhatsApp
          </a>

          <div className={styles.divider} />
          <div className={styles.nextH}>¿Se te antoja algo para después?</div>
          <div className={styles.nextS}>
            Pide a {negocio.name} desde tu celular y te lo preparan.
          </div>
        </div>
        <Cierre slug={negocio.slug} negocio={negocio.name} />
      </Pantalla>
    );
  }

  return (
    <Pantalla negocio={negocio.name} sub={`${beneficio} en tu próxima compra por tu opinión`}>
      <form
        className={styles.body}
        id="opinion"
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
      >
        <p className={styles.h}>¿Cómo te fue hoy?</p>
        <div className={styles.lead}>Dinos lo que pienses, bueno o malo. El descuento es el mismo.</div>

        <div className={styles.label} id="calificacion">Calificación</div>
        <div className={styles.rating} role="radiogroup" aria-labelledby="calificacion">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              onClick={() => setRating(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div className={styles.scale}>
          <span>Mal</span>
          <span>Excelente</span>
        </div>

        <label className={styles.label} htmlFor="liked">
          ¿Qué fue lo que más te gustó? <small>· opcional</small>
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

        <div className={styles.privacy}>
          Tu opinión le llega solo a {negocio.name} y no se publica. No te pedimos nombre ni
          teléfono.
        </div>
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
        {rating === null && <div className={styles.hint}>Elige una calificación para continuar</div>}
      </div>
    </Pantalla>
  );
}
