"use client";

// Una tarjeta impresa que nadie ha activado (F1 y F2 del mockup v4). Qué pantalla
// toca lo decide el cliente, porque el token de la tarjeta de este celular vive
// en `localStorage`:
//   - F1, sin tarjeta de ese negocio: «Activar» crea la tarjeta y le asocia la impresa;
//   - F2, con tarjeta: «Usar esta tarjeta» junta la impresa con la que ya tiene.
// Abrir el link no cambia nada: la DB solo se toca al tocar el botón, porque las
// vistas previas de WhatsApp y los antivirus también abren los links.

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { activarTarjeta, leerTarjeta, type ResultadoDeActivar } from "../../app/actions/tarjeta";
import { getOrCreateDeviceId, rotarDeviceId } from "../../lib/device-id";
import { claveDelToken, rutaDeLaTarjeta, type TarjetaDeSellos } from "../../lib/tarjeta";
import { borrar, guardar, leer } from "./almacen";
import {
  Acciones,
  Aviso,
  Encabezado,
  Mensaje,
  Pantalla,
  ProgramaApagado,
  TarjetaImpresa,
  TarjetaQueNoSirve,
  styles,
} from "./piezas";
import TarjetaDelCliente from "./TarjetaDelCliente";

type Fase =
  | { tipo: "cargando" }
  | { tipo: "f1" }
  | { tipo: "f2"; guardado: string; sellos: number | null }
  | { tipo: "activada"; tarjeta: TarjetaDeSellos }
  | { tipo: "no-sirve" }
  | { tipo: "apagado" };

const RED: ResultadoDeActivar = { ok: false, error: "red" };

function lineaDeF2(sellos: number | null): string {
  const final = "Si tenías otra tarjeta impresa, esa deja de servir.";
  if (sellos === null || sellos === 0) return final;
  return sellos === 1 ? `Tu sello se queda. ${final}` : `Tus ${sellos} sellos se quedan. ${final}`;
}

export default function ActivarTarjeta({
  token,
  negocio,
  logo,
  qr,
}: {
  token: string;
  negocio: { id: string | null; nombre: string; slug: string };
  logo: string | null;
  qr: string;
}) {
  const router = useRouter();
  const [fase, setFase] = useState<Fase>({ tipo: "cargando" });
  const [activando, setActivando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clave = negocio.id ? claveDelToken(negocio.id) : null;

  useEffect(() => {
    const guardado = clave ? leer(clave) : null;
    if (!guardado) {
      setFase({ tipo: "f1" });
      return;
    }
    setFase({ tipo: "f2", guardado, sellos: null });
    // Los sellos de la tarjeta que ya tiene, para decirle que se quedan. Si el
    // token guardado ya no sirve, para este celular es como no tener tarjeta.
    let vivo = true;
    leerTarjeta(guardado)
      .then((t) => {
        if (!vivo) return;
        if (t) {
          setFase({ tipo: "f2", guardado, sellos: t.stamps });
        } else {
          if (clave) borrar(clave);
          setFase({ tipo: "f1" });
        }
      })
      .catch(() => {
        // Sin red: se queda en F2 sin el número.
      });
    return () => {
      vivo = false;
    };
  }, [clave]);

  async function activar() {
    setActivando(true);
    setError(null);

    let guardado = clave ? leer(clave) : null;
    let deviceId = getOrCreateDeviceId();
    const intentar = () => activarTarjeta(token, deviceId, guardado).catch(() => RED);

    let r = await intentar();
    // El token guardado no es de un cliente de este negocio: para este celular
    // es como no tener tarjeta, y se reintenta como F1.
    //
    // Caso conocido, aceptado a propósito (2026-11-06): si lo guardado es el
    // token de OTRA impresa, la DB
    // también responde `invalid_customer_token`, porque `link_physical_card`
    // solo busca `p_customer_token` en `business_customers.token`. Aquí cae en
    // este mismo reintento y nace un cliente nuevo con 0 sellos, aunque F2
    // prometió que los sellos se quedaban. Los sellos no se pierden: siguen en
    // el cliente de la impresa vieja, que no se revoca, y se pasan a mano en la
    // DB si el cliente reclama por WhatsApp. El token de una impresa queda
    // guardado por dos caminos: al abrir una impresa ya activada en un celular
    // nuevo, o cuando en F1 se pierde la respuesta del primer toque y el
    // `router.refresh()` de `card_already_linked` (abajo) pinta la tarjeta, que
    // guarda el token de la URL. Los dos piden además una segunda impresa, así
    // que es raro y no se blinda hasta que pase. Está anotado en el scratchpad
    // del área Vichente App en mikitasks.
    if (!r.ok && guardado && (r.error === "wrong_business" || r.error === "invalid_customer_token")) {
      if (clave) borrar(clave);
      guardado = null;
      r = await intentar();
    }
    // Este celular ya tiene cliente en el negocio pero no guardó su token (se
    // perdió la primera respuesta). La DB no lo devuelve por `device_id`, a
    // propósito: se pide la tarjeta como otro celular, una sola vez.
    if (!r.ok && !guardado && r.error === "already_has_card") {
      deviceId = rotarDeviceId();
      r = await intentar();
    }

    if (r.ok) {
      if (clave) guardar(clave, r.token);
      const tarjeta = await leerTarjeta(token).catch(() => null);
      if (tarjeta) {
        setFase({ tipo: "activada", tarjeta });
      } else {
        // Ya quedó activada; si no se pudo leer, el servidor la pinta al recargar.
        router.refresh();
      }
      setActivando(false);
      return;
    }

    setActivando(false);
    if (r.error === "card_already_linked") {
      // En F1 es este mismo toque que ya había entrado y cuya respuesta se
      // perdió: la tarjeta sí sirve. Decirle «pide otra en caja» lo haría
      // partirse en otro cliente. El servidor vuelve a leer y decide, igual que
      // si el cliente recargara.
      //
      // En F2 no puede ser el toque propio, porque con el token guardado del
      // mismo cliente la DB es idempotente y regresa ok. Ahí significa que otro
      // cliente la activó entre que cargó la página y el toque, y el refresh
      // pinta la tarjeta de ese otro sin avisar. Pide una carrera de segundos,
      // así que se acepta como los casos de arriba.
      router.refresh();
    } else if (r.error === "not_a_card") {
      setFase({ tipo: "no-sirve" });
    } else if (r.error === "card_not_available") {
      setFase({ tipo: "apagado" });
    } else {
      setError("No se pudo activar. Intenta otra vez.");
    }
  }

  if (fase.tipo === "activada") {
    return (
      <TarjetaDelCliente
        token={token}
        negocioId={negocio.id}
        logo={logo}
        qr={qr}
        inicial={fase.tarjeta}
        avisoInicial="Tarjeta activada"
      />
    );
  }
  if (fase.tipo === "no-sirve") return <TarjetaQueNoSirve />;
  if (fase.tipo === "apagado") {
    return <ProgramaApagado negocio={negocio.nombre} slug={negocio.slug} logo={logo} />;
  }

  const f2 = fase.tipo === "f2" ? fase : null;

  return (
    <Pantalla>
      <Encabezado negocio={negocio.nombre} logo={logo} />
      <Aviso texto={error} error />
      {fase.tipo === "cargando" ? (
        <div className={styles.msg} />
      ) : f2 ? (
        <Mensaje titulo="¿Usar esta tarjeta con la tuya?" linea={lineaDeF2(f2.sellos)} />
      ) : (
        <Mensaje
          titulo="Activa tu tarjeta"
          linea="Después, en caja, enseña la tarjeta o tu celular."
        />
      )}
      <TarjetaImpresa negocio={negocio.nombre} logo={logo} qr={qr} />
      <Acciones>
        <button
          type="button"
          className={styles.btn}
          disabled={activando || fase.tipo === "cargando"}
          onClick={activar}
        >
          {activando ? "Activando…" : f2 ? "Usar esta tarjeta" : "Activar"}
        </button>
        {f2 && (
          <button
            type="button"
            className={styles.link}
            disabled={activando}
            onClick={() => router.push(rutaDeLaTarjeta(f2.guardado))}
          >
            Ahora no
          </button>
        )}
      </Acciones>
    </Pantalla>
  );
}
