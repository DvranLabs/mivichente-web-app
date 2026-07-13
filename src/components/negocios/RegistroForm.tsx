"use client";

import { useActionState, useState } from "react";
import s from "./landing.module.css";
import { registrarNegocio, type RegistroState } from "../../app/actions/registro";
import { GIROS, MUNICIPIOS, type Giro } from "./data";
import { useNegocioSeleccionado } from "./NegocioSeleccionado";
import OfferingsInput from "./OfferingsInput";

const inicial: RegistroState = { status: "idle" };

export default function RegistroForm() {
  const [state, formAction, pending] = useActionState(registrarNegocio, inicial);
  const { negocio } = useNegocioSeleccionado();

  // Al negocio que ya existe no le preguntamos su giro: se deduce de la categoría
  // que ya tiene en la base. Igual puede corregirlo si le pusimos mal la categoría.
  const [giro, setGiro] = useState<Giro | null>(negocio?.giro ?? null);

  if (state.status === "ok") {
    return (
      <section id="registro" className={`${s.section} ${s.onWhite}`}>
        <div className={s.inner}>
          <div className={s.success}>
            <CheckCircle />
            <p className={s.successTitle}>Listo, ya lo recibimos.</p>
            <p className={s.successBody}>
              Te hablamos al teléfono que nos dejaste para confirmar los datos y terminar tu
              perfil: fotos, horarios y ubicación. <strong>Nosotros lo subimos</strong> — tú ya
              no tienes que hacer nada.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // El mismo form sirve para dar de alta y para completar un negocio que ya
  // cargamos nosotros. Cuando el negocio ya existe no le volvemos a pedir nombre
  // ni municipio: ya los tenemos, y el server los lee de la base.
  const esCompletar = negocio !== null;

  return (
    <section id="registro" className={`${s.section} ${s.onWhite}`}>
      <div className={s.inner}>
        <h2 className={s.h2}>
          {esCompletar ? `Completa ${negocio.name}.` : "Registra tu negocio gratis."}
        </h2>

        <p className={s.lead}>
          {esCompletar
            ? "Dinos por qué te buscan y con eso te hacemos aparecer en las búsquedas."
            : "Dinos por qué te buscan y cómo contactarte. Es gratis."}
        </p>

        {/* Hoy el negocio no se publica solo: la solicitud entra a una cola,
            alguien del equipo la revisa y la sube. Va antes del form, no después. */}
        <p className={s.avisoContacto}>
          <strong>Esto no se publica solo.</strong> Nos llega tu solicitud,{" "}
          <strong>te hablamos</strong> para confirmar, y <strong>nosotros lo subimos</strong> a
          Vichente App. Tú no tienes que hacer nada más.
        </p>

        <form action={formAction} className={s.form} key={negocio?.id ?? "nuevo"}>
          {state.status === "error" && (
            <p className={s.formError} role="alert">
              {state.message}
            </p>
          )}

          {esCompletar ? (
            <input type="hidden" name="business_id" value={negocio.id} />
          ) : (
            <div className={s.field}>
              <label className={s.label} htmlFor="business_name">
                Nombre del negocio
              </label>
              <input
                className={s.input}
                id="business_name"
                name="business_name"
                type="text"
                required
                maxLength={120}
                autoComplete="organization"
                placeholder="Taquería Los Amigos"
              />
            </div>
          )}

          <fieldset className={s.field}>
            <legend className={s.label}>¿Qué tipo de negocio tienes?</legend>
            <div className={s.giros}>
              {(Object.keys(GIROS) as Giro[]).map((g) => (
                <label key={g} className={s.radio}>
                  <input
                    type="radio"
                    name="giro"
                    value={g}
                    required
                    checked={giro === g}
                    onChange={() => setGiro(g)}
                  />
                  <span>{GIROS[g].label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* El campo de offerings solo tiene sentido con el giro ya elegido: sus
              ejemplos y sugerencias son lo que le enseña al dueño qué escribir. */}
          {giro && <OfferingsInput giro={giro} inicial={negocio?.offerings ?? []} />}

          <div className={s.field}>
            <label className={s.label} htmlFor="phone">
              Teléfono o WhatsApp
            </label>
            <input
              className={s.input}
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              placeholder="618 123 4567"
            />
            <p className={s.hint}>Por ahí te hablamos, y es el que verán tus clientes.</p>
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="contact_name">
              ¿Con quién hablamos?
            </label>
            <input
              className={s.input}
              id="contact_name"
              name="contact_name"
              type="text"
              required
              maxLength={120}
              autoComplete="name"
              placeholder="Tu nombre"
            />
          </div>

          {!esCompletar && (
            <fieldset className={s.field}>
              <legend className={s.label}>Municipio</legend>
              <div className={s.radios}>
                {MUNICIPIOS.map((m) => (
                  <label key={m} className={s.radio}>
                    <input type="radio" name="municipio" value={m} required />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className={s.field}>
            <label className={s.label} htmlFor="description">
              ¿Algo más que debamos saber? <span className={s.optional}>(opcional)</span>
            </label>
            <textarea
              className={s.textarea}
              id="description"
              name="description"
              maxLength={600}
              placeholder={
                esCompletar
                  ? "Mi teléfono cambió. Abrimos de 9 a 6, cerrado los domingos."
                  : "Servicio a domicilio los fines de semana. Abrimos de 9 a 6."
              }
            />
          </div>

          <div className={s.honey} aria-hidden>
            <label htmlFor="website">No llenes este campo</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <button className={s.btnOrange} type="submit" disabled={pending}>
            {pending ? "Enviando…" : esCompletar ? "Enviar mis datos" : "Registrar mi negocio"}
          </button>

          {/* Cuando algo es gratis, la duda es dónde está el gato encerrado. Se
              contesta una vez, en corto y junto al botón. */}
          <p className={s.nota}>
            <strong>¿Por qué es gratis?</strong> Porque una app de negocios no sirve si los
            negocios no están. Primero llenamos el directorio; ya después vemos cómo se
            sostiene. No te vamos a cobrar por estar.
          </p>
        </form>
      </div>
    </section>
  );
}

const CheckCircle = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F07A2C" strokeWidth={2} aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l2.5 2.5L16 9" />
  </svg>
);
