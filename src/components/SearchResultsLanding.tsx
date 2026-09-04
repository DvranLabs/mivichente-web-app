// Página que ve quien abre un link de búsqueda compartido
// (vichente.com/buscar/<termino>). Estilos inline y sin 'use client', igual
// que BusinessLandingCard: son Server Components y así se quedan.
//
// En la práctica ESTA es la experiencia principal, no la app: el link se pega
// en comentarios de Facebook y FB los abre en su propio webview, que no
// dispara App Links. Por eso la página muestra los negocios de verdad en vez
// de ser un interstitial de "descarga la app".

import { conteoLegible, urlDeNegocio, type NegocioResultado } from "../lib/buscar";

const ORANGE = "#F07A2C";
const NAVY = "#14213D";

// Arriba de esto la página se vuelve un scroll interminable en el webview de
// Facebook. El resto se ofrece en la app, que es justo a donde queremos mandar
// a quien de verdad está buscando.
const MAX_VISIBLES = 12;

interface SearchResultsLandingProps {
  termino: string;
  negocios: NegocioResultado[];
  webAppUrl: string;
  playStoreUrl: string;
  isAndroid: boolean;
}

const VerifiedBadge = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path
      fill="#2563eb"
      d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
    />
    <path fill="#fff" d="M9.64 15.95l-3.55-3.46 1.32-1.35 2.23 2.17 5.4-5.55 1.32 1.35z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <circle cx="11" cy="11" r="7" strokeLinecap="round" />
    <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D8CFC5" strokeWidth={2} style={{ flexShrink: 0 }}>
    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Skyline = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/skyline-strip.png"
    alt=""
    style={{
      display: "block",
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(820px, 122%)",
      opacity: 0.35,
      zIndex: 0,
      pointerEvents: "none",
    }}
  />
);

function FilaNegocio({ negocio }: { negocio: NegocioResultado }) {
  return (
    <a
      href={urlDeNegocio(negocio)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 14px",
        borderRadius: "16px",
        background: "#fff",
        border: "1px solid #F0EBE5",
        textDecoration: "none",
      }}
    >
      <span
        style={{
          width: "48px",
          height: "48px",
          flexShrink: 0,
          borderRadius: "14px",
          background: "#FFF1E6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {negocio.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={negocio.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/vichente-isotipo.png" alt="" style={{ width: "62%", height: "62%", objectFit: "contain" }} />
        )}
      </span>

      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: NAVY,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {negocio.name}
          </span>
          {negocio.is_verified && <VerifiedBadge />}
        </span>
        <span
          style={{
            fontSize: "13px",
            color: "#6b7280",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {negocio.categories?.name ?? negocio.address ?? "Negocio local"}
          {negocio.has_delivery && " · Envío a domicilio"}
        </span>
      </span>

      <ChevronIcon />
    </a>
  );
}

export default function SearchResultsLanding({
  termino,
  negocios,
  webAppUrl,
  playStoreUrl,
  isAndroid,
}: SearchResultsLandingProps) {
  const visibles = negocios.slice(0, MAX_VISIBLES);
  const restantes = negocios.length - visibles.length;
  const vacio = negocios.length === 0;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #FDF3EA 0%, #FCE9D8 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <Skyline />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "460px",
          padding: "36px 20px 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vichente-isotipo.png" alt="Vichente" style={{ width: "26px", height: "26px", objectFit: "contain" }} />
          <span style={{ fontWeight: 800, fontSize: "16px", color: NAVY }}>Vichente</span>
        </div>

        <div
          style={{
            width: "100%",
            background: "#fff",
            borderRadius: "20px",
            padding: "18px 18px 16px",
            boxShadow: "0 10px 32px rgba(20,33,61,0.10)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "9px", color: ORANGE }}>
            <SearchIcon />
            <span style={{ fontSize: "19px", fontWeight: 800, color: NAVY, letterSpacing: "-0.3px" }}>{termino}</span>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7280" }}>
            {vacio ? "Todavía no hay nada así en Vichente" : `${conteoLegible(negocios.length)} en tu rancho`}
          </p>
        </div>

        {!vacio && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
            {visibles.map((negocio) => (
              <FilaNegocio key={negocio.id} negocio={negocio} />
            ))}
          </div>
        )}

        <div style={{ width: "100%", marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <a
            href={webAppUrl}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "9px",
              background: ORANGE,
              color: "#fff",
              borderRadius: "14px",
              padding: "15px",
              fontWeight: 700,
              fontSize: "15px",
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(240,122,44,0.3)",
            }}
          >
            <SearchIcon />
            {restantes > 0
              ? `Ver los otros ${restantes} en Vichente App`
              : vacio
                ? "Buscar otra cosa en Vichente App"
                : "Abrir en Vichente App"}
          </a>
          {isAndroid && (
            <a
              href={playStoreUrl}
              style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 600, textDecoration: "none", textAlign: "center" }}
            >
              Descubre la nueva app de tu pueblo →
            </a>
          )}
        </div>

        {/* Texto oscuro, no blanco como en BusinessLandingCard: allá el pie cae
            sobre el skyline a pantalla completa, aquí el fondo es la crema
            clara del gradiente y el blanco desaparece. */}
        <p
          style={{
            marginTop: "26px",
            fontSize: "13px",
            color: "#A08A74",
            lineHeight: 1.4,
            textAlign: "center",
          }}
        >
          Directorio de negocios de Nombre de Dios, Vicente Guerrero y Villa Unión
        </p>
      </div>
    </div>
  );
}
