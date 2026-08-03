// Ruta canónica del menú de mesa — esto es lo que se imprime en el QR:
//
//   https://vichente.com/<slug>/menu?src=menu-qr
//
// Slug y nunca UUID: medido con `qrencode -l Q`, la URL con slug son 51
// caracteres → QR de 37 módulos; con UUID son 89 → 49 módulos. Los mismos 10 cm
// de papel repartidos en un tercio más de cuadritos se leen peor a distancia y
// con luz mala. Aparte, el slug se puede dictar por teléfono.
//
// El `src` NO lleva el nombre del negocio: el negocio ya viaja en la ruta, así
// que el servidor lo resuelve y lo guarda en `qr_scans.business_id`. Meterlo
// también en el parámetro impreso repetiría el dato en un papel que ya no se
// puede corregir.

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import MenuDeMesa from "../../../components/menu/MenuDeMesa";
import { getMenuBySlug, resolveSlugFromHistory } from "../../../lib/menu-de-mesa";
import { logScan } from "../../../lib/log-scan";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ src?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const business = await getMenuBySlug(slug);
  if (!business) return { title: "Menú no encontrado — Vichente App" };

  const title = `Menú de ${business.name} — Vichente App`;
  const description = `El menú de ${business.name}, con fotos y precios. En Vichente App.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: business.photo_url ? [{ url: business.photo_url }] : [],
    },
  };
}

export default async function MenuPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const business = await getMenuBySlug(slug);

  if (!business) {
    // El negocio pudo haberse renombrado después de imprimir el QR. Redirect
    // temporal y no permanente: un 308 se queda cacheado en el navegador para
    // siempre y un slug puede volver a cambiar de dueño.
    const slugActual = await resolveSlugFromHistory(slug);
    if (slugActual) redirect(`/${slugActual}/menu`);
    notFound();
  }

  const { src } = await searchParams;
  if (src) {
    // Solo se registra cuando viene `?src=`: eso es lo que trae el QR impreso.
    // Un link compartido a secas no debe contar como scan, o la señal "0 scans
    // en 3 semanas → hay papel en la mesa, no impresiones" deja de significar.
    const userAgent = (await headers()).get("user-agent") ?? "";
    await logScan(src, userAgent, {
      channel: "menu-qr",
      business_id: business.id,
      slug_at_scan: slug,
    });
  }

  return <MenuDeMesa business={business} />;
}
