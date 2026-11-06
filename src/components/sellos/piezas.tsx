// Los cinco componentes del mockup v4: encabezado, aviso, barra por etapas, QR
// (o tarjeta impresa) y par de botones, más la rejilla que los acomoda. Sin
// estado: los usan las pantallas de servidor y las de cliente.

import type { CSSProperties, ReactNode } from "react";
import { nombreSinCorte } from "../../lib/tarjeta";
import { nunitoSellos } from "./fuente";
import styles from "./sellos.module.css";

export { styles };

/** La rejilla de seis zonas. Cada hijo se asigna a su fila con su clase. */
export function Pantalla({ children }: { children: ReactNode }) {
  return <main className={`${styles.page} ${nunitoSellos.variable}`}>{children}</main>;
}

export function Encabezado({ negocio, logo }: { negocio: string; logo: string | null }) {
  return (
    <div className={styles.head}>
      {logo && (
        // <img> y no next/image, como en opiniones: un host que no esté en
        // next.config no debe tirar la pantalla. Decorativo: el nombre va al lado.
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.logo} src={logo} alt="" decoding="async" />
      )}
      <span className={styles.biz}>{nombreSinCorte(negocio)}</span>
    </div>
  );
}

/** La fila de aviso: queda reservada aunque esté vacía, así nada se mueve cuando llega uno. */
export function Aviso({ texto, error = false }: { texto: string | null; error?: boolean }) {
  return (
    <div className={styles.aviso} aria-live="polite">
      {texto && (
        <span key={texto} className={`${styles.pill} ${error ? styles.pillError : ""}`}>
          {texto}
        </span>
      )}
    </div>
  );
}

export function Mensaje({ titulo, linea }: { titulo: string; linea?: string | null }) {
  return (
    <div className={styles.msg}>
      <h1 className={styles.title}>{titulo}</h1>
      {linea && <p className={styles.sub}>{linea}</p>}
    </div>
  );
}

const REGALO = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
  </svg>
);

/**
 * La barra por etapas. `tramos` marca los que se acaban de llenar (C2b): solo
 * esos se animan, uno detrás de otro.
 */
export function Barra({
  sellos,
  total,
  tramos = null,
}: {
  sellos: number;
  total: number;
  tramos?: { desde: number; hasta: number } | null;
}) {
  const lleno = sellos >= total;
  return (
    <div className={styles.prog}>
      <div className={styles.stamps}>
        <div
          className={styles.segs}
          style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}
          role="img"
          aria-label={`${Math.min(sellos, total)} de ${total} sellos`}
        >
          {Array.from({ length: total }, (_, i) => {
            const n = i + 1;
            const nuevo = tramos !== null && n > tramos.desde && n <= tramos.hasta;
            const estilo: CSSProperties | undefined = nuevo
              ? { animationDelay: `${0.5 + (n - tramos.desde - 1) * 0.15}s` }
              : undefined;
            return (
              <div
                key={n}
                className={`${styles.seg} ${n <= sellos ? styles.segOn : ""} ${nuevo ? styles.fresh : ""}`}
                style={estilo}
              />
            );
          })}
        </div>
        <div className={styles.sep} />
        <div className={`${styles.gift} ${lleno ? styles.giftWon : ""}`}>{REGALO}</div>
      </div>
    </div>
  );
}

/** El QR que se enseña en caja. `svg` sale de `qrDeLaTarjeta`, generado en el servidor. */
export function Qr({
  svg,
  grande = false,
  leyenda,
  hastaElFondo,
}: {
  svg: string;
  grande?: boolean;
  leyenda: string;
  /** Sin botón principal, el objeto baja hasta el fondo. */
  hastaElFondo: boolean;
}) {
  return (
    <div className={`${styles.obj} ${styles.code} ${hastaElFondo ? styles.toEnd : ""}`}>
      <div className={styles.qrg}>
        <div
          className={`${styles.qr} ${grande ? styles.qrBig : ""}`}
          role="img"
          aria-label="Código de tu tarjeta"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <p className={styles.qrcap}>{leyenda}</p>
      </div>
    </div>
  );
}

/** La tarjeta impresa, como la tiene el cliente en la mano (F1, F2 y F4). */
export function TarjetaImpresa({
  negocio,
  logo,
  qr,
  hastaElFondo = false,
}: {
  /** null: F4, la tarjeta en gris y sin negocio. */
  negocio: string | null;
  logo: string | null;
  qr: string | null;
  hastaElFondo?: boolean;
}) {
  const gris = negocio === null;
  return (
    <div className={`${styles.obj} ${styles.fromMsg} ${hastaElFondo ? styles.toEnd : ""}`}>
      <div className={`${styles.pcard} ${gris ? styles.void : ""}`} aria-hidden="true">
        <div className={styles.pcardId}>
          {!gris && logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={styles.logo} src={logo} alt="" decoding="async" />
          ) : (
            <div className={styles.pcardLogoVacio} />
          )}
          <div>
            {!gris && <b className={styles.pcardNombre}>{nombreSinCorte(negocio)}</b>}
            <span className={styles.pcardTipo}>Tarjeta de cliente</span>
          </div>
        </div>
        {!gris && qr ? (
          <div className={styles.pcardQr} dangerouslySetInnerHTML={{ __html: qr }} />
        ) : (
          <div className={styles.pcardQr} />
        )}
      </div>
    </div>
  );
}

/** Las dos ranuras fijas del fondo: botón principal arriba, secundario abajo. */
export function Acciones({ children }: { children: ReactNode }) {
  return <div className={styles.act}>{children}</div>;
}

const COLORES = ["#FF6A1F", "#1F1A14", "#EAE3DA"];

/** Confeti de C3: cae una sola vez, unos cinco segundos, por detrás del QR. */
export function Confeti() {
  return (
    <div className={styles.confetti} aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${((i * 37 + 9) % 96) + 2}%`,
            background: COLORES[i % 3],
            animationDelay: `${(0.2 + ((i * 0.37) % 1.6)).toFixed(2)}s`,
            animationDuration: `${(3.6 + (i % 5) * 0.4).toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * F4: la tarjeta no se puede usar. No dice de qué negocio es ni por qué
 * (reemplazada, inexistente o activada por otra persona): el encabezado queda
 * vacío a propósito.
 */
export function TarjetaQueNoSirve() {
  return (
    <Pantalla>
      <Mensaje titulo="Esta tarjeta ya no se puede usar" linea="Pide otra en caja." />
      <TarjetaImpresa negocio={null} logo={null} qr={null} hastaElFondo />
    </Pantalla>
  );
}

/**
 * C5: el negocio no está dando tarjetas. La salida útil es su ficha, en la
 * ranura del botón de siempre. <a> y no <Link>: la navegación client-side no
 * dispara el App Link de Android que abre la ficha en la app.
 */
export function ProgramaApagado({
  negocio,
  slug,
  logo,
}: {
  negocio: string;
  slug: string;
  logo: string | null;
}) {
  return (
    <Pantalla>
      <Encabezado negocio={negocio} logo={logo} />
      <Mensaje titulo={`${nombreSinCorte(negocio)} no está dando tarjetas de sellos por ahora`} />
      <Acciones>
        <a className={styles.btn} href={`/${encodeURIComponent(slug)}`}>
          Ver {nombreSinCorte(negocio)} en Vichente
        </a>
      </Acciones>
    </Pantalla>
  );
}
