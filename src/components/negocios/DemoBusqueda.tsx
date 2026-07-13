"use client";

import { useEffect, useRef, useState } from "react";
import s from "./landing.module.css";
import { DEMO_CASES } from "./data";

const TYPE_MS = 70;
const PAUSE_ANTES_DE_RESULTADO = 450;
const LECTURA_MS = 2800;

// La animación solo corre cuando el teléfono entra en viewport: fuera de él no
// gasta timers ni compite con el LCP del hero.
export default function DemoBusqueda() {
  const [index, setIndex] = useState(0);
  // Arranca con el primer caso ya resuelto: si alguien cae aquí sin scrollear
  // (o con el observer aún sin disparar) ve un teléfono con resultado, no uno en
  // blanco que parece roto. La animación lo reescribe cuando entra en viewport.
  const [typed, setTyped] = useState(DEMO_CASES[0].query);
  const [showResult, setShowResult] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const actual = DEMO_CASES[index];
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (reduced) {
      setTyped(actual.query);
      setShowResult(true);
      timers.push(setTimeout(() => setIndex((i) => (i + 1) % DEMO_CASES.length), LECTURA_MS * 2));
      return () => timers.forEach(clearTimeout);
    }

    setTyped("");
    setShowResult(false);

    actual.query.split("").forEach((_, i) => {
      timers.push(
        setTimeout(() => setTyped(actual.query.slice(0, i + 1)), TYPE_MS * (i + 1))
      );
    });

    const escrito = TYPE_MS * actual.query.length;
    timers.push(setTimeout(() => setShowResult(true), escrito + PAUSE_ANTES_DE_RESULTADO));
    timers.push(
      setTimeout(
        () => setIndex((i) => (i + 1) % DEMO_CASES.length),
        escrito + PAUSE_ANTES_DE_RESULTADO + LECTURA_MS
      )
    );

    return () => timers.forEach(clearTimeout);
  }, [index, visible]);

  const actual = DEMO_CASES[index];

  return (
    <section className={`${s.section} ${s.onOrange}`}>
      <div className={s.inner}>
        <h2 className={s.h2}>Así funciona la búsqueda.</h2>
        <p className={s.lead}>
          Se escribe lo que se necesita. <strong>Si tu negocio tiene eso en su lista,
          aparece.</strong> Así de simple.
        </p>

        <div className={s.phoneWrap} ref={ref}>
          <div className={s.phone}>
            <div className={s.phoneScreen}>
              <div className={s.searchBar}>
                <SearchIcon />
                <span>
                  {typed}
                  <span className={s.caret} />
                </span>
              </div>

              <div className={s.results}>
                {showResult && (
                  <>
                    <p className={s.resultsLabel}>1 resultado</p>
                    <div className={s.card} key={actual.name}>
                      <p className={s.cardName}>{actual.name}</p>
                      <p className={s.cardMeta}>
                        {actual.categoria} · {actual.municipio}
                      </p>
                      <div className={s.offerings}>
                        {actual.offerings.map((o) => (
                          <span
                            key={o}
                            className={`${s.offering} ${o === actual.hit ? s.offeringHit : ""}`}
                          >
                            {o}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className={s.demoCaption}>
          Ninguno de estos negocios tiene esa palabra en su nombre. Aparecen porque{" "}
          <strong>la tienen en su lista de lo que venden</strong>. Eso es justo lo que le falta
          a la mayoría.
        </p>
      </div>
    </section>
  );
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a93a6" strokeWidth={2} aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
  </svg>
);
