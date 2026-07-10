// Tarjeta "minilanding" para negocios: se usa tanto en /negocio/[id] como en /[slug].
// Estilos inline (sin cliente) para mantener estas páginas como Server Components rápidas.

const ORANGE = "#F07A2C";
const NAVY = "#14213D";

interface Business {
  name: string;
  phone: string;
  address: string | null;
  description: string | null;
  photo_url: string | null;
  is_verified: boolean;
  categories: { name: string } | null;
}

interface BusinessLandingCardProps {
  business: Business;
  webAppUrl: string;
  playStoreUrl: string;
  telUrl: string | null;
}

const StorefrontIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 9l1.5-5h13L20 9M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9M4 9h16M9 20v-6h6v6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const AndroidIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.5 9.5v6a1 1 0 001 1h.5v3a1.5 1.5 0 003 0v-3h2v3a1.5 1.5 0 003 0v-3h.5a1 1 0 001-1v-6h-11zM5.5 9.5a1 1 0 00-1 1V17a1.5 1.5 0 003 0v-6.5a1 1 0 00-1-1h-1zM18.5 9.5a1 1 0 00-1 1V17a1.5 1.5 0 003 0v-6.5a1 1 0 00-1-1h-1zM16.9 5.4l1.05-1.82a.35.35 0 10-.61-.35l-1.07 1.85a6.4 6.4 0 00-4.77 0L10.43 3.23a.35.35 0 10-.61.35L10.87 5.4A6.02 6.02 0 007.5 10.5h9a6.02 6.02 0 00-3.6-5.1zM9.9 8.3a.6.6 0 11.6-.6.6.6 0 01-.6.6zm4.2 0a.6.6 0 11.6-.6.6.6 0 01-.6.6z" />
  </svg>
);

const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1114.5 9 2.5 2.5 0 0112 11.5z" />
  </svg>
);

const DotGrid = () => (
  <svg width="90" height="90" viewBox="0 0 90 90" style={{ position: "absolute", top: 18, right: 18, opacity: 0.5 }}>
    {Array.from({ length: 6 }).map((_, row) =>
      Array.from({ length: 6 }).map((_, col) => (
        <circle key={`${row}-${col}`} cx={col * 15 + 6} cy={row * 15 + 6} r={2} fill={ORANGE} opacity={0.35} />
      ))
    )}
  </svg>
);

const Skyline = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/skyline.png"
    alt=""
    style={{
      display: "block",
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      objectFit: "cover",
      zIndex: 0,
      pointerEvents: "none",
    }}
  />
);

export default function BusinessLandingCard({ business, webAppUrl, playStoreUrl, telUrl }: BusinessLandingCardProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
          padding: "48px 20px 32px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            maxWidth: "420px",
            width: "100%",
            boxShadow: "0 12px 40px rgba(20,33,61,0.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              padding: "40px 24px 24px",
              background: "linear-gradient(135deg, #FFF3E9 0%, #FFFFFF 70%)",
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-40px",
                left: "-50px",
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FCD9BC, #FDF3EA)",
                opacity: 0.8,
              }}
            />
            <DotGrid />
            <div
              style={{
                position: "relative",
                width: "108px",
                height: "108px",
                margin: "0 auto",
                borderRadius: "50%",
                background: "#FFF1E6",
                border: "4px solid #fff",
                boxShadow: "0 6px 20px rgba(240,122,44,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {business.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={business.photo_url} alt={business.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/vichente-isotipo.png" alt={business.name} style={{ width: "68%", height: "68%", objectFit: "contain" }} />
              )}
            </div>
          </div>

          <div style={{ padding: "8px 28px 32px", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: 800, margin: 0, color: NAVY, letterSpacing: "-0.5px" }}>{business.name}</h1>
              {business.is_verified && (
                <span style={{ color: "#2563eb", fontSize: "18px" }} title="Verificado">✓</span>
              )}
            </div>

            {business.categories && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", margin: "10px 0" }}>
                <span style={{ flex: 1, maxWidth: "70px", height: "1px", background: "#F3D9BF" }} />
                <span style={{ color: ORANGE, fontWeight: 600, fontSize: "15px" }}>{business.categories.name}</span>
                <span style={{ flex: 1, maxWidth: "70px", height: "1px", background: "#F3D9BF" }} />
              </div>
            )}

            {business.address && (
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 4px" }}>{business.address}</p>
            )}

            {business.description && (
              <p style={{ fontSize: "14px", color: "#374151", margin: "12px 0 0", lineHeight: 1.5 }}>{business.description}</p>
            )}

            <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <a
                href={webAppUrl}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
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
                <StorefrontIcon />
                Ver negocio en Vichente App
              </a>
              {telUrl && (
                <a
                  href={telUrl}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    background: "#fff",
                    color: ORANGE,
                    border: `1.5px solid ${ORANGE}`,
                    borderRadius: "14px",
                    padding: "15px",
                    fontWeight: 700,
                    fontSize: "15px",
                    textDecoration: "none",
                  }}
                >
                  <PhoneIcon />
                  Llamar {business.phone}
                </a>
              )}
              <a
                href={playStoreUrl}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#F3F4F6",
                  color: "#6b7280",
                  borderRadius: "14px",
                  padding: "13px",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  textDecoration: "none",
                }}
              >
                <AndroidIcon />
                ¿Android? Descarga la app
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", margin: "24px 0 16px" }}>
              <span style={{ flex: 1, height: "1px", background: "#F0EBE5" }} />
              <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: ORANGE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PinIcon />
              </span>
              <span style={{ flex: 1, height: "1px", background: "#F0EBE5" }} />
            </div>

            <a href="https://app.vichente.com" style={{ color: ORANGE, fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
              Explorar más negocios →
            </a>
          </div>
        </div>

        <div
          style={{
            marginTop: "28px",
            maxWidth: "340px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/vichente-isotipo.png" alt="Vichente" style={{ width: "30px", height: "30px", objectFit: "contain" }} />
            <span style={{ fontWeight: 800, fontSize: "18px", color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>Vichente App</span>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.9)", lineHeight: 1.4, margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            Directorio de negocios de Nombre de Dios, Vicente Guerrero y Villa Unión
          </p>
        </div>
      </div>
    </div>
  );
}
