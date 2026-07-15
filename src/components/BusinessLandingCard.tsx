// Tarjeta "minilanding" para negocios: se usa tanto en /negocio/[id] como en /[slug].
// Estilos inline (sin cliente) para mantener estas páginas como Server Components rápidas.

const ORANGE = "#F07A2C";
const NAVY = "#14213D";

interface Business {
  name: string;
  phone: string;
  phone_is_whatsapp: boolean;
  address: string | null;
  description: string | null;
  photo_url: string | null;
  is_verified: boolean;
  has_delivery: boolean;
  categories: { name: string } | null;
}

interface BusinessLandingCardProps {
  business: Business;
  webAppUrl: string;
  playStoreUrl: string;
  telUrl: string | null;
  isAndroid: boolean;
  categoryUrl: string | null;
}

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 004.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.11h-.01a8.23 8.23 0 01-4.2-1.15l-.3-.18-3.14.82.84-3.06-.2-.31a8.2 8.2 0 01-1.26-4.4c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 012.41 5.82c0 4.53-3.69 8.22-8.19 8.22zm4.51-6.16c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.99-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01a.92.92 0 00-.67.31c-.23.25-.87.85-.87 2.08s.89 2.41 1.02 2.58c.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.66-1.17.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29z" />
  </svg>
);

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

const VerifiedBadge = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      fill="#2563eb"
      d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
    />
    <path fill="#fff" d="M9.64 15.95l-3.55-3.46 1.32-1.35 2.23 2.17 5.4-5.55 1.32 1.35z" />
  </svg>
);

const DeliveryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13h11V6H3v7zm0 0l2 5h2m7-5h4l3 4v1h-2m-9 0h4m-8 0a2 2 0 104 0m6 0a2 2 0 104 0"
    />
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

export default function BusinessLandingCard({ business, webAppUrl, playStoreUrl, telUrl, isAndroid, categoryUrl }: BusinessLandingCardProps) {
  const whatsappUrl = business.phone_is_whatsapp
    ? (() => {
        const digits = business.phone.replace(/\D/g, "");
        const full = digits.startsWith("52") ? digits : `52${digits}`;
        return `https://wa.me/${full}`;
      })()
    : null;

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
                <span title="Verificado" style={{ display: "inline-flex" }}>
                  <VerifiedBadge />
                </span>
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

            {business.has_delivery && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "6px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "#F3EEFC",
                  color: "#7c3aed",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                <DeliveryIcon />
                Envío a domicilio
              </span>
            )}

            {business.description && (
              <p style={{ fontSize: "14px", color: "#374151", margin: "12px 0 0", lineHeight: 1.5 }}>{business.description}</p>
            )}

            <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {(whatsappUrl ?? telUrl) && (
                <a
                  href={whatsappUrl ?? telUrl!}
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
                  {whatsappUrl ? <WhatsAppIcon /> : <PhoneIcon />}
                  {whatsappUrl ? "WhatsApp" : "Llamar"} {business.phone}
                </a>
              )}
              <a
                href={webAppUrl}
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
                <StorefrontIcon />
                Ver negocio en Vichente App
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", margin: "24px 0 16px" }}>
              <span style={{ flex: 1, height: "1px", background: "#F0EBE5" }} />
              <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: ORANGE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PinIcon />
              </span>
              <span style={{ flex: 1, height: "1px", background: "#F0EBE5" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a
                href={categoryUrl ?? "https://app.vichente.com"}
                style={{ color: ORANGE, fontSize: "14px", fontWeight: 700, textDecoration: "none" }}
              >
                {business.categories ? `Ver otros negocios de ${business.categories.name} →` : "Explorar más negocios →"}
              </a>
              {isAndroid && (
                <a
                  href={playStoreUrl}
                  style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
                >
                  Descubre la nueva app de tu pueblo →
                </a>
              )}
            </div>
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
