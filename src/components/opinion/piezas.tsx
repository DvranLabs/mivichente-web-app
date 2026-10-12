// Piezas que comparten la pantalla de opinión y la del descuento. Sin estado.

import type { ReactNode } from "react";
import type { EstadoCupon } from "../../lib/descuento";
import { IconoPaso, type IconoDePaso } from "./dibujos";
import { nunito } from "./fuente";
import styles from "./opinion.module.css";

export function Pantalla({
  negocio,
  sub,
  caja = false,
  children,
}: {
  negocio: string;
  sub: string;
  /** Encabezado verde: la pantalla que se le enseña a quien cobra. */
  caja?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`${styles.page} ${nunito.variable}`}>
      <header className={`${styles.top} ${caja ? styles.topCaja : ""}`}>
        <div className={styles.k}>{negocio}</div>
        <div className={styles.sub}>{sub}</div>
      </header>
      {children}
    </div>
  );
}

// `todo` no tiene clase propia: es el gris de `.paso`.
type EstadoDePaso = "now" | "done" | "todo";

const PASOS: { icono: IconoDePaso; nombre: string }[] = [
  { icono: "opinas", nombre: "Opinas" },
  { icono: "vuelves", nombre: "Vuelves" },
  { icono: "usas", nombre: "Lo usas" },
];

/**
 * Opinas · Vuelves · Lo usas. Dice desde el formulario que el descuento no se
 * usa en la misma visita, sin un párrafo que lo explique.
 */
export function Pasos({ estados }: { estados: [EstadoDePaso, EstadoDePaso, EstadoDePaso] }) {
  return (
    <ol className={styles.pasos}>
      {PASOS.map((paso, i) => (
        <li
          key={paso.nombre}
          className={`${styles.paso} ${styles[`paso_${estados[i]}`] ?? ""}`}
          aria-current={estados[i] === "now" ? "step" : undefined}
        >
          <span className={styles.pasoIcono}>
            <IconoPaso icono={estados[i] === "done" ? "listo" : paso.icono} />
          </span>
          {paso.nombre}
        </li>
      ))}
    </ol>
  );
}

const ETIQUETA: Record<EstadoCupon, string> = {
  valid: "Válido",
  used: "Aplicado ✓",
  expired: "Vencido",
};

/** El cupón, con forma de boleto. Solo sale cuando el cliente regresa. */
export function Tarjeta({
  estado,
  beneficio,
  que,
  cuando,
  children,
}: {
  estado: EstadoCupon;
  beneficio: string;
  que: string;
  cuando: string | null;
  children?: ReactNode;
}) {
  const largo = beneficio.length > 5;
  return (
    <div className={`${styles.coupon} ${styles[estado]}`}>
      <span className={styles.state}>{ETIQUETA[estado]}</span>
      <div className={`${styles.big} ${largo ? styles.bigLargo : ""}`}>{beneficio}</div>
      <div className={styles.what}>{que}</div>
      {cuando && <div className={styles.when}>{cuando}</div>}
      {children}
    </div>
  );
}

/**
 * Los dos links de cierre, en segundo plano: la pantalla ya tiene su propio
 * mensaje y estos no deben competir con él. No van en la pantalla de caja.
 * Ninguno invita a dejar otra opinión: eso empujaría opiniones hechas solo por
 * el descuento (decisión del usuario, 2026-10-10).
 *
 * Llevan `src` para contar en `qr_scans` cuánta gente sigue la invitación del
 * final: la decisión del piloto pide registrarlo, aunque no decide si funcionó.
 * Ninguno empieza con `opinion-qr`, o la DB los contaría como scans del QR del
 * acrílico.
 */
export function Cierre({ slug, negocio }: { slug: string; negocio: string }) {
  return (
    <div className={styles.bottom}>
      <a className={`${styles.btn} ${styles.ghost}`} href={`/${slug}/ordenar?src=opinion-pide`}>
        Pide en {negocio} desde Vichente
      </a>
      {/* <a> y no <Link>, como en BannerApp: la navegación client-side no
          dispara el App Link de Android que resuelve /app. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className={styles.textLink} href="/app?src=opinion-app">
        Conoce Vichente
      </a>
    </div>
  );
}
