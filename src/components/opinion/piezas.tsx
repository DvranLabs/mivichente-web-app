// Piezas que comparten la pantalla de opinión y la del descuento. Sin estado.

import type { ReactNode } from "react";
import type { EstadoCupon } from "../../lib/descuento";
import { nunito } from "./fuente";
import styles from "./opinion.module.css";

export function Pantalla({
  negocio,
  sub,
  children,
}: {
  negocio: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <div className={`${styles.page} ${nunito.variable}`}>
      <header className={styles.top}>
        <div className={styles.k}>{negocio}</div>
        <div className={styles.sub}>{sub}</div>
      </header>
      {children}
    </div>
  );
}

const ETIQUETA: Record<EstadoCupon, string> = {
  valid: "Válido",
  used: "Usado ✓",
  expired: "Vencido",
};

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
 * Los dos botones de cierre. Ninguno invita a dejar otra opinión: eso empujaría
 * opiniones hechas solo por el descuento (decisión del usuario, 2026-10-10).
 *
 * Llevan `src` para contar en `qr_scans` cuánta gente sigue la invitación del
 * final: la decisión del piloto pide registrarlo, aunque no decide si funcionó.
 * Ninguno empieza con `opinion-qr`, o la DB los contaría como scans del QR del
 * acrílico.
 */
export function Cierre({ slug, negocio }: { slug: string; negocio: string }) {
  return (
    <div className={styles.bottom}>
      <a className={`${styles.btn} ${styles.primary}`} href={`/${slug}/ordenar?src=opinion-pide`}>
        Pide en {negocio} desde Vichente
      </a>
      {/* <a> y no <Link>, como en BannerApp: la navegación client-side no
          dispara el App Link de Android que resuelve /app. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className={`${styles.btn} ${styles.ghost}`} href="/app?src=opinion-app">
        Conoce Vichente
      </a>
    </div>
  );
}
