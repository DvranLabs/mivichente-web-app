import { notFound } from "next/navigation";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

interface Business {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  description: string | null;
  photo_url: string | null;
  is_verified: boolean;
  categories: { name: string } | null;
}

async function getBusiness(id: string): Promise<Business | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/businesses?id=eq.${id}&select=id,name,phone,address,description,photo_url,is_verified,categories(name)&limit=1`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data[0] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await getBusiness(id);
  if (!business) return { title: "Negocio no encontrado — Vichente App" };
  return {
    title: `${business.name} — Vichente App`,
    description: business.description ?? `${business.name} en Vicente Guerrero, Durango`,
    openGraph: {
      title: `${business.name} — Vichente App`,
      description: business.description ?? `${business.name} en Vicente Guerrero`,
      images: business.photo_url ? [{ url: business.photo_url }] : [],
    },
  };
}

export default async function NegocioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await getBusiness(id);
  if (!business) notFound();

  const deepLink = `https://vichente.com/negocio/${id}`;
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.dvrancorp.vichente";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "#f9fafb" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "32px 24px", maxWidth: "400px", width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", textAlign: "center" }}>
        {business.photo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.photo_url}
            alt={business.name}
            style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "12px", marginBottom: "20px" }}
          />
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>{business.name}</h1>
          {business.is_verified && (
            <span style={{ color: "#2563eb", fontSize: "18px" }} title="Verificado">✓</span>
          )}
        </div>
        {business.categories && (
          <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 12px" }}>{business.categories.name}</p>
        )}
        {business.address && (
          <p style={{ fontSize: "14px", margin: "0 0 8px" }}>📍 {business.address}</p>
        )}
        {business.description && (
          <p style={{ fontSize: "14px", color: "#374151", margin: "12px 0 0", lineHeight: 1.5 }}>{business.description}</p>
        )}

        <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <a
            href={deepLink}
            style={{
              display: "block",
              background: "#1d4ed8",
              color: "#fff",
              borderRadius: "10px",
              padding: "14px",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            Abrir en Vichente App
          </a>
          <a
            href={playStoreUrl}
            style={{
              display: "block",
              background: "#f3f4f6",
              color: "#1f2937",
              borderRadius: "10px",
              padding: "14px",
              fontWeight: 500,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            Descargar Vichente App
          </a>
        </div>
      </div>

      <p style={{ marginTop: "24px", fontSize: "13px", color: "#9ca3af" }}>
        Directorio de negocios de Vicente Guerrero, Durango
      </p>
    </div>
  );
}
