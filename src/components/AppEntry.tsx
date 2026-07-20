"use client";

// Micro-experiencia de entrada para vichente.com/app (stickers/QR).
// La tesis: el buscador explica la app mejor que un párrafo. Por eso el
// placeholder rota ("Buscar tacos...", "Buscar taxi...") en vez de haber copy.
//
// La barra BUSCA de verdad: escribir + enter abre la web app en esa búsqueda.
// Un buscador decorativo invita a teclear y no hacer nada — peor que no ponerlo.
// Idem los chips: son atajos reales, no adorno.
//
// El tema es oscuro porque esta pantalla es el primer contacto de alguien que no
// conoce la app: el navy con glow naranja lee "producto serio" y además se
// escanea bien de noche, que es cuando la gente mira los stickers en la calle.

import { useEffect, useRef, useState } from "react";

const ORANGE = "#F07A2C";
const ORANGE_HI = "#FF9D4D";
const TEXT = "#F2F5FA";
const MUTED = "#8C97AD";

const WEB_APP_URL = "https://app.vichente.com";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.dvrancorp.vichente";

// Lo que la gente realmente ocupa en el pueblo. Doble función: enseñan el rango
// de la app (comida, servicios, salud, refacciones) sin explicarlo.
const SEARCH_TERMS = ["molletes", "jardinero", "tacos", "ferretería", "farmacias", "arquitectos"];
const CHIPS = ["Musicos", "Camiones", "Doctores", "Mandaditos"];

const ROTATE_MS = 2200;

export type Platform = "android" | "ios" | "other";

// El deep link `#/search?q=` lo resuelve GoRoute('/search') en el Flutter
// (lee state.uri.queryParameters['q']). Sin query, entra al home.
function webAppUrlFor(query: string): string {
  const q = query.trim();
  return q ? `${WEB_APP_URL}/#/search?q=${encodeURIComponent(q)}` : WEB_APP_URL;
}

const SearchIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
  </svg>
);

const AndroidIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.5 9.5v6a1 1 0 001 1h.5v3a1.5 1.5 0 003 0v-3h2v3a1.5 1.5 0 003 0v-3h.5a1 1 0 001-1v-6h-11zM5.5 9.5a1 1 0 00-1 1V17a1.5 1.5 0 003 0v-6.5a1 1 0 00-1-1h-1zM18.5 9.5a1 1 0 00-1 1V17a1.5 1.5 0 003 0v-6.5a1 1 0 00-1-1h-1zM16.9 5.4l1.05-1.82a.35.35 0 10-.61-.35l-1.07 1.85a6.4 6.4 0 00-4.77 0L10.43 3.23a.35.35 0 10-.61.35L10.87 5.4A6.02 6.02 0 007.5 10.5h9a6.02 6.02 0 00-3.6-5.1zM9.9 8.3a.6.6 0 11.6-.6.6.6 0 01-.6.6zm4.2 0a.6.6 0 11.6-.6.6.6 0 01-.6.6z" />
  </svg>
);

// Todas las animaciones viven aquí (los estilos inline no pueden keyframes ni
// media queries). prefers-reduced-motion las apaga: el contenido queda en su
// estado final, nunca invisible.
const styles = `
@keyframes va-fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
@keyframes va-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-3px); }
}
@keyframes va-term-in {
  from { opacity: 0; transform: translateY(7px); }
  to   { opacity: 1; transform: none; }
}
@keyframes va-glow {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%      { opacity: 0.85; transform: scale(1.06); }
}
/* Barrido de luz sobre el CTA. Se dispara una sola vez al entrar: en loop
   infinito el botón parpadea y deja de leerse como botón. */
@keyframes va-sheen {
  from { transform: translateX(-120%) skewX(-18deg); }
  to   { transform: translateX(320%)  skewX(-18deg); }
}

.va-reveal { animation: va-fade-up 620ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.va-chip   { animation: va-float 3.6s ease-in-out infinite; }
.va-term   { animation: va-term-in 320ms ease-out; }
.va-glow   { animation: va-glow 6s ease-in-out infinite; }
.va-sheen  { animation: va-sheen 1400ms cubic-bezier(0.4, 0, 0.2, 1) 900ms both; }

.va-chip-btn { transition: transform 160ms ease, background-color 160ms ease, border-color 160ms ease; }
.va-chip-btn:hover {
  transform: translateY(-2px);
  background-color: rgba(255,255,255,0.10);
  border-color: rgba(240,122,44,0.45);
}
/* Un chip que flota es un blanco en movimiento: se congela en cuanto lo apuntas
   o lo enfocas con teclado, para no pedirle puntería a nadie. */
.va-chip:hover, .va-chip:focus-within { animation-play-state: paused; }

.va-cta { transition: transform 160ms ease, box-shadow 160ms ease; }
.va-cta:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(240,122,44,0.45); }
.va-cta:active { transform: translateY(0); }

.va-link { transition: color 160ms ease, border-color 160ms ease; }
.va-link:hover { color: ${TEXT}; border-color: rgba(240,122,44,0.7); }

/* Foco visible en oscuro: el outline del navegador casi no se ve sobre navy. */
.va-chip-btn:focus-visible, .va-cta:focus-visible, .va-link:focus-visible, .va-submit:focus-visible {
  outline: 2px solid ${ORANGE_HI};
  outline-offset: 3px;
}

.va-input::placeholder { color: transparent; }

@media (prefers-reduced-motion: reduce) {
  .va-reveal, .va-chip, .va-term, .va-chip-btn, .va-cta, .va-glow, .va-sheen {
    animation: none !important;
    transition: none !important;
  }
  .va-sheen { display: none; }
}
`;

export default function AppEntry({ platform }: { platform: Platform }) {
  const [query, setQuery] = useState("");
  const [termIndex, setTermIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEmpty = query.trim() === "";
  // Rotar mientras el usuario escribe sería ruido: el placeholder ya no le sirve.
  const rotating = isEmpty && !focused;

  useEffect(() => {
    if (!rotating) return;
    // Respetar reduced-motion: sin rotación, se queda en el primer término.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setTermIndex((i) => (i + 1) % SEARCH_TERMS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [rotating]);

  const go = (q: string) => {
    window.location.href = webAppUrlFor(q);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div style={{ width: "100%", maxWidth: "440px", textAlign: "center" }}>
        <div className="va-reveal" style={{ animationDelay: "0ms" }}>
          {/* El logo va sobre su propio halo: aislado en el navy se ve recortado,
              con el halo se integra con el glow del fondo. */}
          <div
            style={{
              position: "relative",
              width: "84px",
              height: "84px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              aria-hidden="true"
              className="va-glow"
              style={{
                position: "absolute",
                inset: "-28%",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(240,122,44,0.42) 0%, transparent 68%)",
                filter: "blur(14px)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/vichente-logo-moderno.png"
              alt=""
              style={{
                position: "relative",
                width: "84px",
                height: "84px",
                objectFit: "contain",
              }}
            />
          </div>

          <h1
            style={{
              fontSize: "42px",
              fontWeight: 700,
              margin: "14px 0 0",
              color: TEXT,
              letterSpacing: "-1.4px",
              lineHeight: 1.05,
            }}
          >
            Vichente
          </h1>
          <p
            style={{
              fontSize: "17px",
              color: MUTED,
              margin: "10px 0 0",
              lineHeight: 1.45,
              fontWeight: 400,
            }}
          >
            Todo tu pueblo, en una búsqueda
          </p>

          {/* Quien escanea el sticker no sabe qué es Vichente ni si le toca. Los
              tres pueblos lo resuelven mejor que cualquier eslogan, y por eso van
              arriba del buscador: primero "¿es para mí?", luego "úsalo".
              Abajo no caben — ahí el skyline les pasa por detrás y no se leen. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              margin: "16px 0 0",
            }}
          >
            <span style={{ height: "1px", width: "22px", background: "rgba(255,255,255,0.16)" }} />
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 500,
                letterSpacing: "1.3px",
                textTransform: "uppercase",
                color: "rgba(140,151,173,0.8)",
                whiteSpace: "nowrap",
              }}
            >
              Nombre de Dios · Vicente Guerrero · Villa Unión
            </span>
            <span style={{ height: "1px", width: "22px", background: "rgba(255,255,255,0.16)" }} />
          </div>
        </div>

        {/* El buscador es el pitch. Es un <form> real: enter navega a la web app. */}
        <form
          className="va-reveal"
          style={{ animationDelay: "110ms", marginTop: "26px" }}
          onSubmit={(e) => {
            e.preventDefault();
            go(query);
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              // Glass: el fondo translúcido deja pasar el glow naranja de atrás,
              // que es lo que separa esto de "un input gris sobre negro".
              background: focused ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.055)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: `1px solid ${focused ? "rgba(240,122,44,0.75)" : "rgba(255,255,255,0.13)"}`,
              borderRadius: "18px",
              padding: "0 7px 0 16px",
              boxShadow: focused
                ? "0 0 0 4px rgba(240,122,44,0.14), 0 18px 44px rgba(0,0,0,0.45)"
                : "inset 0 1px 0 rgba(255,255,255,0.09), 0 14px 36px rgba(0,0,0,0.4)",
              transition: "border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
            }}
          >
            <span style={{ color: focused ? ORANGE_HI : MUTED, display: "flex", flexShrink: 0 }}>
              <SearchIcon />
            </span>

            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <input
                ref={inputRef}
                className="va-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-label="Buscar negocios en Vichente"
                enterKeyHint="search"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  padding: "18px 0",
                  fontSize: "16px", // <16px hace que iOS Safari zoomee al enfocar
                  color: TEXT,
                  fontFamily: "inherit",
                  fontWeight: 500,
                }}
              />
              {/* Placeholder propio (no el nativo) para poder animar el término. */}
              {isEmpty && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none",
                    fontSize: "16px",
                    color: MUTED,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ flexShrink: 0 }}>Buscar&nbsp;</span>
                  <span key={termIndex} className="va-term" style={{ color: "#C9A183", fontWeight: 600 }}>
                    {SEARCH_TERMS[termIndex]}...
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              aria-label="Buscar"
              className="va-submit"
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                border: "none",
                borderRadius: "13px",
                background: `linear-gradient(140deg, ${ORANGE_HI} 0%, ${ORANGE} 100%)`,
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(240,122,44,0.38)",
              }}
            >
              <SearchIcon size={19} />
            </button>
          </div>
        </form>

        {/* Prueba visual de que hay negocios, y atajos reales a la vez. */}
        <div
          className="va-reveal"
          style={{
            animationDelay: "210ms",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
            marginTop: "14px",
          }}
        >
          {CHIPS.map((chip, i) => (
            <span key={chip} className="va-chip" style={{ animationDelay: `${i * 260}ms`, display: "inline-flex" }}>
              <button
                type="button"
                onClick={() => go(chip)}
                className="va-chip-btn"
                style={{
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  borderRadius: "999px",
                  padding: "9px 16px",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  color: "#C2CBDB",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {chip}
              </button>
            </span>
          ))}
        </div>

        <div className="va-reveal" style={{ animationDelay: "320ms", marginTop: "28px" }}>
          <a
            href={WEB_APP_URL}
            className="va-cta"
            style={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${ORANGE_HI} 0%, ${ORANGE} 55%, #DE6A1E 100%)`,
              color: "#fff",
              borderRadius: "17px",
              padding: "18px",
              fontWeight: 600,
              fontSize: "16.5px",
              letterSpacing: "-0.2px",
              textDecoration: "none",
              boxShadow: "0 12px 32px rgba(240,122,44,0.36), inset 0 1px 0 rgba(255,255,255,0.28)",
            }}
          >
            <span style={{ position: "relative", zIndex: 1 }}>Abrir Vichente</span>
            <span
              aria-hidden="true"
              className="va-sheen"
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "34%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.34), transparent)",
                pointerEvents: "none",
              }}
            />
          </a>

          {/* Secundario. En Android quien llega aquí NO tiene la app (si la tuviera,
              el App Link ya la habría abierto), así que el Play Store sí le sirve. */}
          {platform !== "ios" && (
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
              <a
                href={PLAY_STORE_URL}
                className="va-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  color: MUTED,
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.18)",
                  paddingBottom: "3px",
                }}
              >
                <AndroidIcon />
                Descargar app Android
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
