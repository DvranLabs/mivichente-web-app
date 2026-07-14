"use client";

// Micro-experiencia de entrada para vichente.com/app (stickers/QR).
// La tesis: el buscador explica la app mejor que un párrafo. Por eso el
// placeholder rota ("Buscar tacos...", "Buscar taxi...") en vez de haber copy.
//
// La barra BUSCA de verdad: escribir + enter abre la web app en esa búsqueda.
// Un buscador decorativo invita a teclear y no hacer nada — peor que no ponerlo.
// Idem los chips: son atajos reales, no adorno.

import { useEffect, useRef, useState } from "react";

const ORANGE = "#F07A2C";
const NAVY = "#14213D";

const WEB_APP_URL = "https://app.vichente.com";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.dvrancorp.vichente";

// Lo que la gente realmente ocupa en el pueblo. Doble función: enseñan el rango
// de la app (comida, servicios, salud, refacciones) sin explicarlo.
const SEARCH_TERMS = ["tacos", "taxi", "doctor", "ferretería", "farmacia", "tortillas"];
const CHIPS = ["Tacos", "Taxi", "Farmacia", "Ferretería"];

const ROTATE_MS = 2200;

export type Platform = "android" | "ios" | "other";

// El deep link `#/search?q=` lo resuelve GoRoute('/search') en el Flutter
// (lee state.uri.queryParameters['q']). Sin query, entra al home.
function webAppUrlFor(query: string): string {
  const q = query.trim();
  return q ? `${WEB_APP_URL}/#/search?q=${encodeURIComponent(q)}` : WEB_APP_URL;
}

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
  </svg>
);

const AndroidIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.5 9.5v6a1 1 0 001 1h.5v3a1.5 1.5 0 003 0v-3h2v3a1.5 1.5 0 003 0v-3h.5a1 1 0 001-1v-6h-11zM5.5 9.5a1 1 0 00-1 1V17a1.5 1.5 0 003 0v-6.5a1 1 0 00-1-1h-1zM18.5 9.5a1 1 0 00-1 1V17a1.5 1.5 0 003 0v-6.5a1 1 0 00-1-1h-1zM16.9 5.4l1.05-1.82a.35.35 0 10-.61-.35l-1.07 1.85a6.4 6.4 0 00-4.77 0L10.43 3.23a.35.35 0 10-.61.35L10.87 5.4A6.02 6.02 0 007.5 10.5h9a6.02 6.02 0 00-3.6-5.1zM9.9 8.3a.6.6 0 11.6-.6.6.6 0 01-.6.6zm4.2 0a.6.6 0 11.6-.6.6.6 0 01-.6.6z" />
  </svg>
);

// Todas las animaciones viven aquí (los estilos inline no pueden keyframes ni
// media queries). prefers-reduced-motion las apaga: el contenido queda en su
// estado final, nunca invisible.
const styles = `
@keyframes va-fade-up {
  from { opacity: 0; transform: translateY(10px); }
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
.va-reveal { animation: va-fade-up 520ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.va-chip   { animation: va-float 3.6s ease-in-out infinite; }
.va-term   { animation: va-term-in 320ms ease-out; }
.va-chip-btn { transition: transform 140ms ease, box-shadow 140ms ease; }
.va-chip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(20,33,61,0.12); }
.va-cta:hover { transform: translateY(-1px); }
.va-cta { transition: transform 140ms ease; }

@media (prefers-reduced-motion: reduce) {
  .va-reveal, .va-chip, .va-term, .va-chip-btn, .va-cta {
    animation: none !important;
    transition: none !important;
  }
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/vichente-isotipo.png"
            alt=""
            style={{ width: "64px", height: "64px", objectFit: "contain", margin: "0 auto" }}
          />
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 800,
              margin: "12px 0 0",
              color: NAVY,
              letterSpacing: "-1px",
            }}
          >
            Vichente
          </h1>
          <p style={{ fontSize: "17px", color: "#6b7280", margin: "8px 0 0", lineHeight: 1.4 }}>
            Encuentra lo que ocupas en tu pueblo
          </p>
        </div>

        {/* El buscador es el pitch. Es un <form> real: enter navega a la web app. */}
        <form
          className="va-reveal"
          style={{ animationDelay: "90ms", marginTop: "28px" }}
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
              background: "#fff",
              border: `1.5px solid ${focused ? ORANGE : "#EADFD3"}`,
              borderRadius: "16px",
              padding: "0 8px 0 16px",
              boxShadow: focused
                ? "0 10px 30px rgba(240,122,44,0.18)"
                : "0 6px 22px rgba(20,33,61,0.08)",
              transition: "border-color 160ms ease, box-shadow 160ms ease",
            }}
          >
            <span style={{ color: focused ? ORANGE : "#B9A895", display: "flex", flexShrink: 0 }}>
              <SearchIcon />
            </span>

            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <input
                ref={inputRef}
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
                  padding: "17px 0",
                  fontSize: "16px", // <16px hace que iOS Safari zoomee al enfocar
                  color: NAVY,
                  fontFamily: "inherit",
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
                    color: "#A99B8C",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ flexShrink: 0 }}>Buscar&nbsp;</span>
                  <span key={termIndex} className="va-term" style={{ color: "#8C7B69", fontWeight: 600 }}>
                    {SEARCH_TERMS[termIndex]}...
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              aria-label="Buscar"
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "42px",
                height: "42px",
                border: "none",
                borderRadius: "11px",
                background: ORANGE,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <SearchIcon />
            </button>
          </div>
        </form>

        {/* Prueba visual de que hay negocios, y atajos reales a la vez. */}
        <div
          className="va-reveal"
          style={{
            animationDelay: "180ms",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          {CHIPS.map((chip, i) => (
            <span key={chip} className="va-chip" style={{ animationDelay: `${i * 260}ms`, display: "inline-flex" }}>
              <button
                type="button"
                onClick={() => go(chip)}
                className="va-chip-btn"
                style={{
                  border: "1px solid #EFE1D2",
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: "999px",
                  padding: "8px 15px",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "#7A6857",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 2px 8px rgba(20,33,61,0.05)",
                }}
              >
                {chip}
              </button>
            </span>
          ))}
        </div>

        <div className="va-reveal" style={{ animationDelay: "280ms", marginTop: "30px" }}>
          <a
            href={WEB_APP_URL}
            className="va-cta"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: ORANGE,
              color: "#fff",
              borderRadius: "15px",
              padding: "17px",
              fontWeight: 700,
              fontSize: "16px",
              textDecoration: "none",
              boxShadow: "0 10px 26px rgba(240,122,44,0.32)",
            }}
          >
            Abrir Vichente
          </a>

          {/* Secundario. En Android quien llega aquí NO tiene la app (si la tuviera,
              el App Link ya la habría abierto), así que el Play Store sí le sirve. */}
          <div
            style={{
              marginTop: "14px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {platform !== "ios" && (
              <a
                href={PLAY_STORE_URL}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  color: "#7A6857",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: "1px solid #DFCDB9",
                  paddingBottom: "2px",
                }}
              >
                <AndroidIcon />
                Descargar app Android
              </a>
            )}
            {platform !== "android" && (
              <p style={{ fontSize: "13px", color: "#A99B8C", margin: 0 }}>
                iPhone: usa la versión web
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
