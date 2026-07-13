"use client";

import { useActionState, useEffect, useState } from "react";
import s from "./landing.module.css";
import { registrarNegocio, type CampoError, type RegistroState } from "../../app/actions/registro";
import { GIROS, MAX_MUNICIPIO_LEN, MUNICIPIO_OTRO, MUNICIPIOS, type Giro } from "./data";
import { useNegocioSeleccionado } from "./NegocioSeleccionado";
import OfferingsInput from "./OfferingsInput";

const inicial: RegistroState = { status: "idle" };

// 6181234567 -> "618 123 4567". Se formatea mientras escribe y se corta en 10
// dígitos, así el teléfono no puede quedar mal: la validación deja de existir
// para el dueño en vez de rebotarlo después de darle a enviar.
function formatearTelefono(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export default function RegistroForm() {
  const [state, formAction, pending] = useActionState(registrarNegocio, inicial);
  const { negocio } = useNegocioSeleccionado();

  // Al negocio que ya existe no le preguntamos su giro: se deduce de la categoría
  // que ya tiene en la base. Igual puede corregirlo si le pusimos mal la categoría.
  const [giro, setGiro] = useState<Giro | null>(negocio?.giro ?? null);
  const [telefono, setTelefono] = useState("");
  const [municipio, setMunicipio] = useState("");

  const error = state.status === "error" ? state : null;
  const errorEn = (campo: CampoError) => (error?.campo === campo ? error.message : null);

  // El botón está hasta abajo: si el mensaje sale arriba y la página no se mueve,
  // el dueño ve que "no pasó nada" y le vuelve a dar. Lo llevamos al campo.
  useEffect(() => {
    if (!error || error.campo === "general") return;
    const el = document.getElementById(error.campo);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    (el as HTMLInputElement | null)?.focus?.({ preventScroll: true });
  }, [error]);

  if (state.status === "ok") {
    return (
      <section id="registro" className={`${s.section} ${s.onWhite}`}>
        <div className={s.inner}>
          <div className={s.success}>
            <CheckCircle />
            {/* Al de fuera de cobertura no se le puede prometer el alta: en su
                municipio todavía no hay nada donde publicarlo. Se le dice la
                verdad — queda apuntado y es lo que decide adónde abrimos. */}
            <p className={s.successTitle}>Listo, ya lo recibimos.</p>
            {state.cubierto ? (
              <p className={s.successBody}>
                Te hablamos al teléfono que nos dejaste para confirmar los datos y terminar tu
                perfil: fotos, horarios y ubicación. <strong>Nosotros lo subimos</strong> — tú ya
                no tienes que hacer nada.
              </p>
            ) : (
              <p className={s.successBody}>
                Tu municipio todavía no está en Vichente App, pero <strong>ya quedó apuntado</strong>
                : los negocios que se registran son los que deciden a dónde abrimos. En cuanto
                lleguemos, <strong>te hablamos</strong> y te subimos.
              </p>
            )}
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

        <form action={formAction} className={s.form} key={negocio?.id ?? "nuevo"} noValidate>
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
                maxLength={120}
                autoComplete="organization"
                placeholder="Taquería Los Amigos"
                aria-invalid={errorEn("business_name") ? true : undefined}
              />
              <CampoInvalido mensaje={errorEn("business_name")} />
            </div>
          )}

          <fieldset className={s.field} id="giro">
            <legend className={s.label}>¿Qué tipo de negocio tienes?</legend>
            <div className={s.giros}>
              {(Object.keys(GIROS) as Giro[]).map((g) => (
                <label key={g} className={s.radio}>
                  <input
                    type="radio"
                    name="giro"
                    value={g}
                    checked={giro === g}
                    onChange={() => setGiro(g)}
                  />
                  <span>{GIROS[g].label}</span>
                </label>
              ))}
            </div>
            <CampoInvalido mensaje={errorEn("giro")} />
          </fieldset>

          {/* El campo de offerings solo tiene sentido con el giro ya elegido: sus
              ejemplos y sugerencias son lo que le enseña al dueño qué escribir. */}
          {giro && (
            <OfferingsInput
              giro={giro}
              inicial={negocio?.offerings ?? []}
              error={errorEn("offerings")}
            />
          )}

          <div className={s.field}>
            <label className={s.label} htmlFor="phone">
              Teléfono o WhatsApp
            </label>
            <input
              className={s.input}
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="618 123 4567"
              value={telefono}
              onChange={(e) => setTelefono(formatearTelefono(e.target.value))}
              aria-invalid={errorEn("phone") ? true : undefined}
            />
            <CampoInvalido mensaje={errorEn("phone")} />
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
              maxLength={120}
              autoComplete="name"
              placeholder="Tu nombre"
              aria-invalid={errorEn("contact_name") ? true : undefined}
            />
            <CampoInvalido mensaje={errorEn("contact_name")} />
          </div>

          {/* Fuera de los tres municipios el registro NO se bloquea: hay negocios
              pegados a la frontera (La Joya, Suchil) que se quedaban sin opción y
              abandonaban ahí. Se les toma el dato igual; es la mejor señal que
              tenemos de dónde abrir después. */}
          {!esCompletar && (
            <fieldset className={s.field} id="municipio">
              <legend className={s.label}>Municipio</legend>
              <div className={s.radios}>
                {MUNICIPIOS.map((m) => (
                  <label key={m} className={s.radio}>
                    <input
                      type="radio"
                      name="municipio"
                      value={m}
                      checked={municipio === m}
                      onChange={() => setMunicipio(m)}
                    />
                    <span>{m}</span>
                  </label>
                ))}
                <label className={s.radio}>
                  <input
                    type="radio"
                    name="municipio"
                    value={MUNICIPIO_OTRO}
                    checked={municipio === MUNICIPIO_OTRO}
                    onChange={() => setMunicipio(MUNICIPIO_OTRO)}
                  />
                  <span>Otro</span>
                </label>
              </div>

              {municipio === MUNICIPIO_OTRO && (
                <>
                  <input
                    className={s.input}
                    name="municipio_otro"
                    type="text"
                    maxLength={MAX_MUNICIPIO_LEN}
                    placeholder="Suchil, La Joya…"
                    aria-label="¿Cuál es tu municipio?"
                    autoFocus
                  />
                  <p className={s.hint}>
                    Todavía no estamos ahí, pero registra tu negocio igual: los que se apuntan son
                    los que deciden a dónde abrimos, y te avisamos en cuanto lleguemos.
                  </p>
                </>
              )}

              <CampoInvalido mensaje={errorEn("municipio")} />
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

          {/* El error general (falló el guardado, el negocio ya no existe) sí va
              junto al botón: no hay campo al que mandar al dueño. */}
          {errorEn("general") && (
            <p className={s.formError} role="alert">
              {errorEn("general")}
            </p>
          )}

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

// El mensaje vive pegado al campo que lo causó, no en un banner arriba del form.
function CampoInvalido({ mensaje }: { mensaje: string | null }) {
  if (!mensaje) return null;
  return (
    <p className={s.campoError} role="alert">
      {mensaje}
    </p>
  );
}

const CheckCircle = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F07A2C" strokeWidth={2} aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l2.5 2.5L16 9" />
  </svg>
);
