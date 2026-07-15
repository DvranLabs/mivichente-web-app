import { headers } from "next/headers";
import { notFound } from "next/navigation";
import BusinessLandingCard from "../../components/BusinessLandingCard";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

interface Business {
  id: string;
  slug: string;
  name: string;
  phone: string;
  phone_is_whatsapp: boolean;
  address: string | null;
  description: string | null;
  photo_url: string | null;
  is_verified: boolean;
  has_delivery: boolean;
  categories: { id: string; name: string } | null;
}

async function getBusinessBySlug(slug: string): Promise<Business | null> {
  // categories!businesses_category_id_fkey desambigua: existen dos relaciones
  // businesses↔categories (la FK directa category_id y la many-to-many
  // business_categories). Sin el hint, PostgREST responde 300 y esto devuelve null.
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/businesses?slug=eq.${encodeURIComponent(slug)}&select=id,slug,name,phone,phone_is_whatsapp,address,description,photo_url,is_verified,has_delivery,categories!businesses_category_id_fkey(id,name)&limit=1`,
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return { title: "Negocio no encontrado — Vichente App" };
  const title = business.categories?.name ? `${business.name} — ${business.categories.name}` : `${business.name} — Vichente App`;
  return {
    title,
    description: business.description ?? `${business.name} — en Vichente, directorio de Nombre de Dios, Vicente Guerrero y Villa Unión`,
    openGraph: {
      title,
      description: business.description ?? `${business.name} — en Vichente, directorio de Nombre de Dios, Vicente Guerrero y Villa Unión`,
      images: business.photo_url ? [{ url: business.photo_url }] : [],
    },
  };
}

export default async function BusinessSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  // Quien llega a esta página NO tiene la app nativa instalada: en Android con la app,
  // los App Links interceptan vichente.com/:slug y abren la app antes de renderizar.
  // Por eso el CTA principal empuja a la web app (app.vichente.com), que funciona en iPhone/web.
  const webAppUrl = `https://app.vichente.com/#/negocio/${business.slug}`;
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.dvrancorp.vichente";
  const telUrl = business.phone ? `tel:${business.phone}` : null;
  const userAgent = (await headers()).get("user-agent") ?? "";
  const isAndroid = /android/i.test(userAgent);
  const categoryUrl = business.categories ? `https://app.vichente.com/#/category/${business.categories.id}` : null;

  return (
    <BusinessLandingCard
      business={business}
      webAppUrl={webAppUrl}
      playStoreUrl={playStoreUrl}
      telUrl={telUrl}
      isAndroid={isAndroid}
      categoryUrl={categoryUrl}
    />
  );
}
