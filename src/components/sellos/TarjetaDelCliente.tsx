"use client";

// La tarjeta del cliente (C1 a C5 del mockup v4), para el token de la digital o
// el de una impresa activada.
//
// C2b: la tarjeta se entera del sello nuevo sin recargar. Es polling a
// `get_stamp_card` y no Realtime porque anon no tiene grants sobre las tablas, y
// `postgres_changes` respeta RLS (decisión del usuario, 2026-11-06). Solo corre
// con la página visible. Lo último que se vio se guarda en este celular, así que
// la animación del tramo nuevo corre solo cuando el número cambió, no cada vez
// que se abre la página.

import { useCallback, useEffect, useRef, useState } from "react";
import { leerTarjeta } from "../../app/actions/tarjeta";
import {
  cambioDesde,
  claveDeLoVisto,
  claveDelToken,
  linkDeWhatsApp,
  loVistoDe,
  pantallaDe,
  tituloDe,
  type Cambio,
  type LoVisto,
  type TarjetaDeSellos,
} from "../../lib/tarjeta";
import { borrar, guardar, leer } from "./almacen";
import {
  Acciones,
  Aviso,
  Barra,
  Confeti,
  Encabezado,
  Mensaje,
  Pantalla,
  ProgramaApagado,
  Qr,
  TarjetaQueNoSirve,
  styles,
} from "./piezas";

const CADA = 4500;
// Sin cambios en este tiempo, el polling para hasta que el cliente vuelva a la
// pestaña. Una fila en caja no dura tanto, y una pestaña olvidada abierta no
// debe seguir llamando a la DB toda la tarde.
const HASTA = 15 * 60 * 1000;
const AVISO_MS = 4000;
const CONFETI_MS = 6500;

function firma(t: TarjetaDeSellos): string {
  return JSON.stringify([
    t.program_active,
    t.reward,
    t.stamps_required,
    t.stamps,
    t.is_full,
    t.last_redeemed_at,
  ]);
}

function leerLoVisto(clave: string): LoVisto | null {
  const crudo = leer(clave);
  if (!crudo) return null;
  try {
    const v = JSON.parse(crudo) as LoVisto;
    return typeof v.stamps === "number" ? v : null;
  } catch {
    return null;
  }
}

export default function TarjetaDelCliente({
  token,
  negocioId,
  logo,
  qr,
  inicial,
  avisoInicial = null,
}: {
  token: string;
  /** null si el negocio no se pudo leer (inactivo): no se guarda nada en el celular. */
  negocioId: string | null;
  logo: string | null;
  qr: string;
  inicial: TarjetaDeSellos;
  /** «Tarjeta activada» al venir de F1 o F2 (F3). */
  avisoInicial?: string | null;
}) {
  const [tarjeta, setTarjeta] = useState(inicial);
  const [cambio, setCambio] = useState<Cambio | null>(null);
  // Cambia con cada sello nuevo para volver a montar la barra y repetir la animación.
  const [version, setVersion] = useState(0);
  const [aviso, setAviso] = useState<string | null>(avisoInicial);
  const [confeti, setConfeti] = useState(false);
  const [hoja, setHoja] = useState(false);
  const [perdida, setPerdida] = useState(false);
  const ultimaFirma = useRef<string | null>(null);

  const claveVisto = claveDeLoVisto(negocioId ?? token);

  const aplicar = useCallback(
    (t: TarjetaDeSellos) => {
      const f = firma(t);
      if (f === ultimaFirma.current) return false;
      ultimaFirma.current = f;
      const c = cambioDesde(leerLoVisto(claveVisto), t);
      guardar(claveVisto, JSON.stringify(loVistoDe(t)));
      setTarjeta(t);
      // Cada cambio reemplaza al anterior. Si los tramos del último sello se
      // quedaran marcados, su animación (que termina en naranja) seguiría
      // pintándolos después de un canje que regresó la barra a cero.
      setCambio(c.selloNuevo ? c : null);
      if (c.selloNuevo) {
        setVersion((v) => v + 1);
        setAviso("¡Sello nuevo!");
      }
      if (c.seLleno) setConfeti(true);
      return true;
    },
    [claveVisto],
  );

  // Al abrir: guardar el token si este celular no tenía tarjeta de ese negocio
  // (una impresa activada abierta en otro celular), y comparar contra lo visto.
  // Si ya tenía una, no se toca: nunca se sobreescribe una tarjeta que exista.
  //
  // Caso conocido, aceptado a propósito (2026-11-06): `get_card_entry` no dice
  // si el token es de una digital o de una impresa, así que aquí se guarda
  // cualquiera, también la tarjeta de otra persona (el dueño que escanea con
  // la cámara el QR de un cliente, un link reenviado). Desde ese momento ese
  // celular trata la tarjeta ajena como suya: el QR del mostrador lleva a ella
  // y F2 le uniría una impresa nueva, lo que revoca la impresa del dueño real.
  // Se arregla a mano si alguien reclama por WhatsApp. Está anotado en el
  // scratchpad del área Vichente App en mikitasks.
  useEffect(() => {
    if (negocioId && !leer(claveDelToken(negocioId))) guardar(claveDelToken(negocioId), token);
    aplicar(inicial);
    // En F3 el aviso es «Tarjeta activada», aunque además haya sellos que este
    // celular no había visto: la barra sí los anima.
    if (avisoInicial) setAviso(avisoInicial);
  }, [negocioId, token, inicial, aplicar, avisoInicial]);

  useEffect(() => {
    if (!aviso) return;
    const id = setTimeout(() => setAviso(null), AVISO_MS);
    return () => clearTimeout(id);
  }, [aviso]);

  useEffect(() => {
    if (!confeti) return;
    const id = setTimeout(() => setConfeti(false), CONFETI_MS);
    return () => clearTimeout(id);
  }, [confeti]);

  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval> | null = null;
    let ultimoCambio = Date.now();
    let vivo = true;

    async function releer() {
      // Si falla la red, se espera a la siguiente vuelta: un error pasajero no
      // cambia lo que se ve.
      const t = await leerTarjeta(token).catch(() => undefined);
      if (!vivo || t === undefined) return;
      if (t === null) {
        // Revocada mientras estaba abierta (activaron otra impresa). Si era la
        // guardada en este celular, ya no sirve para volver.
        if (negocioId && leer(claveDelToken(negocioId)) === token) borrar(claveDelToken(negocioId));
        setPerdida(true);
        parar();
        return;
      }
      if (aplicar(t)) ultimoCambio = Date.now();
    }

    function arrancar() {
      if (intervalo) return;
      intervalo = setInterval(() => {
        if (Date.now() - ultimoCambio > HASTA) {
          parar();
          return;
        }
        releer();
      }, CADA);
    }

    function parar() {
      if (intervalo) clearInterval(intervalo);
      intervalo = null;
    }

    const alCambiarVisibilidad = () => {
      if (document.visibilityState === "visible") {
        ultimoCambio = Date.now();
        releer();
        arrancar();
      } else {
        parar();
      }
    };
    // Regresar con «atrás» puede mostrar una página guardada en memoria.
    const alMostrar = (e: PageTransitionEvent) => {
      if (e.persisted) alCambiarVisibilidad();
    };

    if (document.visibilityState === "visible") arrancar();
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    window.addEventListener("pageshow", alMostrar);
    return () => {
      vivo = false;
      parar();
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
      window.removeEventListener("pageshow", alMostrar);
    };
  }, [token, negocioId, aplicar]);

  useEffect(() => {
    if (!hoja) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHoja(false);
    };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [hoja]);

  if (perdida) return <TarjetaQueNoSirve />;

  const pantalla = pantallaDe(tarjeta);
  if (pantalla === "apagada") {
    return <ProgramaApagado negocio={tarjeta.business_name} slug={tarjeta.business_slug} logo={logo} />;
  }

  const llena = pantalla === "llena";

  return (
    <Pantalla>
      {confeti && <Confeti />}
      <Encabezado negocio={tarjeta.business_name} logo={logo} />
      <Aviso texto={aviso} />
      <Mensaje
        titulo={tituloDe(tarjeta, pantalla)}
        linea={pantalla === "canjeada" ? "Tu tarjeta empieza otra vez." : null}
      />
      <Barra
        key={version}
        sellos={tarjeta.stamps}
        total={tarjeta.stamps_required}
        tramos={cambio?.tramos ?? null}
      />
      <Qr
        svg={qr}
        grande={llena}
        leyenda={llena ? "Enséñalo en caja para recibirlo" : "Enséñalo en caja"}
        hastaElFondo
      />
      {/* El link de WhatsApp sale solo en la tarjeta nueva (C1). */}
      {pantalla === "nueva" && (
        <Acciones>
          <button type="button" className={styles.link} onClick={() => setHoja(true)}>
            Guardar en WhatsApp
          </button>
        </Acciones>
      )}

      {hoja && (
        <>
          <div className={styles.scrim} onClick={() => setHoja(false)} />
          <div className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="hoja-whatsapp">
            <div className={styles.grab} />
            <div>
              <h2 className={styles.title} id="hoja-whatsapp">
                Mándate tu tarjeta por WhatsApp
              </h2>
              <p className={styles.sub}>Así la encuentras en tu chat cuando vuelvas.</p>
            </div>
            <ol className={styles.steps}>
              <li>Toca «Abrir WhatsApp»</li>
              <li>Elige tu propio chat, el que dice «(Tú)»</li>
              <li>Envía el mensaje</li>
            </ol>
            <div className={styles.act}>
              {/* Sin número, para que WhatsApp pida elegir el chat. */}
              <a
                className={styles.btn}
                href={linkDeWhatsApp(tarjeta.business_name, token)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setHoja(false)}
              >
                Abrir WhatsApp
              </a>
              <button type="button" className={styles.link} onClick={() => setHoja(false)}>
                Ahora no
              </button>
            </div>
          </div>
        </>
      )}
    </Pantalla>
  );
}
