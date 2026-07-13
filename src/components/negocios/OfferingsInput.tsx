"use client";

import { useState } from "react";
import s from "./landing.module.css";
import { GIROS, type Giro } from "./data";

// El dato que hace aparecer al negocio en las búsquedas. Va como chips y no como
// textarea libre a propósito: el dueño ve lo que lleva, corrige uno sin borrar
// los otros, y aprende el formato (una cosa por chip) sin que se lo expliquen.
export default function OfferingsInput({
  giro,
  inicial = [],
  error = null,
}: {
  giro: Giro;
  inicial?: string[];
  error?: string | null;
}) {
  const [items, setItems] = useState<string[]>(inicial);
  const [borrador, setBorrador] = useState("");
  const cfg = GIROS[giro];

  const agregar = (texto: string) => {
    const limpio = texto.trim().slice(0, 80);
    if (!limpio) return;
    const repetido = items.some((i) => i.toLowerCase() === limpio.toLowerCase());
    if (!repetido && items.length < 30) setItems([...items, limpio]);
    setBorrador("");
  };

  const quitar = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const yaEsta = (v: string) => items.some((i) => i.toLowerCase() === v.toLowerCase());
  const sugerencias = cfg.sugerencias.filter((v) => !yaEsta(v));

  return (
    <div className={s.field}>
      <label className={s.label} htmlFor="offerings">
        {cfg.pregunta}
      </label>
      <p className={s.hint}>{cfg.hint}</p>

      <div className={s.offeringsInput}>
        <input
          className={s.input}
          /* name="offerings" a propósito: si el dueño escribe "boneless" y le da
             directo a enviar sin tocar "Agregar", su texto viaja igual. Antes se
             perdía y el server le contestaba "escribe al menos una cosa" mientras
             él la estaba viendo escrita en pantalla. El server deduplica. */
          name="offerings"
          id="offerings"
          type="text"
          value={borrador}
          maxLength={80}
          placeholder={cfg.placeholder}
          autoComplete="off"
          onChange={(e) => {
            // La coma también cierra el chip: mucha gente escribe listas así.
            if (e.target.value.includes(",")) agregar(e.target.value.replace(",", ""));
            else setBorrador(e.target.value);
          }}
          onBlur={() => agregar(borrador)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              agregar(borrador);
            }
          }}
          aria-invalid={error ? true : undefined}
        />
        <button
          type="button"
          className={s.btnAgregar}
          onClick={() => agregar(borrador)}
          disabled={!borrador.trim()}
        >
          Agregar
        </button>
      </div>

      {error && (
        <p className={s.campoError} role="alert">
          {error}
        </p>
      )}

      {items.length > 0 && (
        <ul className={s.offeringsLista}>
          {items.map((item, i) => (
            <li key={item} className={s.offeringChip}>
              <input type="hidden" name="offerings" value={item} />
              <span>{item}</span>
              <button
                type="button"
                className={s.offeringQuitar}
                onClick={() => quitar(i)}
                aria-label={`Quitar ${item}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Tap-to-add: para un dueño que teclea lento en el celular, tocar cuatro
          chips es la diferencia entre llenar esto y abandonarlo. */}
      {sugerencias.length > 0 && (
        <div className={s.sugerencias}>
          <p className={s.hint}>O toca los que más te pidan:</p>
          <ul className={s.sugerenciasLista}>
            {sugerencias.map((v) => (
              <li key={v}>
                <button
                  type="button"
                  className={s.sugerencia}
                  onClick={() => agregar(v)}
                >
                  + {v}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
