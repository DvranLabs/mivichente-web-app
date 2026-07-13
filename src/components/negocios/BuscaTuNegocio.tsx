"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import s from "./landing.module.css";
import { buscarNegocio, type NegocioEncontrado } from "../../app/actions/buscar";
import { useNegocioSeleccionado } from "./NegocioSeleccionado";
import { fotoUsable } from "./fotos";

export default function BuscaTuNegocio() {
  const [q, setQ] = useState("");
  const [resultados, setResultados] = useState<NegocioEncontrado[] | null>(null);
  const [pending, startTransition] = useTransition();
  const { seleccionar } = useNegocioSeleccionado();

  useEffect(() => {
    if (q.trim().length < 3) {
      setResultados(null);
      return;
    }
    const t = setTimeout(() => {
      startTransition(async () => setResultados(await buscarNegocio(q)));
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const elegir = (n: NegocioEncontrado) => {
    seleccionar(n);
    document.querySelector("#registro")?.scrollIntoView({ behavior: "smooth" });
  };

  const registrarNuevo = () => {
    seleccionar(null);
    document.querySelector("#registro")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="buscar" className={`${s.section} ${s.onCream}`}>
      <div className={s.inner}>
        <h2 className={s.h2}>Busca tu negocio. Quizá ya está.</h2>
        <p className={s.lead}>
          Cargamos cientos de negocios de la región nosotros mismos. Lo que casi ninguno tiene
          es <strong>la lista de lo que vende</strong> — y sin esa lista,{" "}
          <strong>no aparece cuando alguien la busca</strong>.
        </p>

        <div className={s.buscador}>
          <SearchIcon />
          <input
            className={s.buscadorInput}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Escribe el nombre de tu negocio"
            aria-label="Nombre de tu negocio"
          />
        </div>

        <div className={s.buscadorResultados} aria-live="polite">
          {pending && <p className={s.hint}>Buscando…</p>}

          {!pending &&
            resultados?.map((n) => (
              <div key={n.id} className={s.hallazgo}>
                {fotoUsable(n.photo_url) ? (
                  <Image
                    src={fotoUsable(n.photo_url)!}
                    alt=""
                    width={48}
                    height={48}
                    className={s.hallazgoFoto}
                  />
                ) : (
                  <span className={s.hallazgoSinFoto} aria-hidden>
                    🏪
                  </span>
                )}
                <div className={s.hallazgoTexto}>
                  <p className={s.cardName}>{n.name}</p>
                  <p className={s.cardMeta}>
                    {n.municipio} ·{" "}
                    <a
                      className={s.linkSubrayado}
                      href={`/${n.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ver su ficha
                    </a>
                  </p>
                </div>
                <button type="button" className={s.btnChico} onClick={() => elegir(n)}>
                  Es el mío
                </button>

                {/* El hueco de offerings es la conversión real de esta landing: para
                    la mayoría de los negocios ya cargados, esto es lo único que falta. */}
                {n.offerings.length === 0 && (
                  <p className={s.hallazgoAviso}>
                    Todavía no tiene lista de lo que vende. Hoy no aparece en ninguna
                    búsqueda.
                  </p>
                )}
              </div>
            ))}

          {!pending && resultados?.length === 0 && (
            <p className={s.hint}>
              No encontramos ese nombre. Puedes registrarlo tú mismo, es gratis.
            </p>
          )}

          {resultados !== null && !pending && (
            <button type="button" className={s.linkBtn} onClick={registrarNuevo}>
              Mi negocio no aparece → registrarlo gratis
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a93a6" strokeWidth={2} aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
  </svg>
);
