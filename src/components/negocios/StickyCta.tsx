"use client";

import { useEffect, useState } from "react";
import s from "./landing.module.css";

// Barra fija que aparece al salir del hero y se retira al llegar al formulario
// (ahí el CTA real ya está en pantalla y la barra solo estorbaría).
export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    const registro = document.querySelector("#registro");
    if (!hero || !registro) return;

    let heroFuera = false;
    let registroDentro = false;
    const sync = () => setVisible(heroFuera && !registroDentro);

    const ioHero = new IntersectionObserver(
      ([e]) => {
        heroFuera = !e.isIntersecting;
        sync();
      },
      { threshold: 0.15 }
    );
    const ioRegistro = new IntersectionObserver(
      ([e]) => {
        registroDentro = e.isIntersecting;
        sync();
      },
      { threshold: 0.15 }
    );

    ioHero.observe(hero);
    ioRegistro.observe(registro);
    return () => {
      ioHero.disconnect();
      ioRegistro.disconnect();
    };
  }, []);

  return (
    <div className={`${s.sticky} ${visible ? s.stickyVisible : ""}`} aria-hidden={!visible}>
      <div className={s.stickyInner}>
        {/* Corto a propósito: cabe en una línea a 360px. Y "quiero aparecer" sirve
            a los dos caminos — el que ya está cargado y el que no. */}
        <a className={s.btnOrange} href="#registro" tabIndex={visible ? 0 : -1}>
          Quiero aparecer →
        </a>
      </div>
    </div>
  );
}
