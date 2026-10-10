// El link del descuento: lo que abre el cliente en caja, o al reescanear el QR
// de opiniones desde el mismo celular. El token es el secreto: quien lo tiene
// ve y usa el descuento, así que la página no lo filtra a otros sitios
// (`referrer`) ni se indexa.
//
// El estado se lee de la DB en cada visita, sin caché.

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { leerDescuento } from "../../../actions/opinion";
import PantallaDeDescuento from "../../../../components/opinion/PantallaDeDescuento";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string; token: string }>;
}

export const metadata: Metadata = {
  title: "Tu descuento — Vichente App",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function DescuentoPage({ params }: Props) {
  const { slug, token } = await params;
  const cupon = await leerDescuento(token);
  if (!cupon) notFound();

  // El slug de la URL es decorativo: el token decide el negocio. Si el negocio
  // se renombró, se corrige la URL para que el link compartido no mienta.
  if (cupon.business_slug !== slug) {
    redirect(`/${cupon.business_slug}/descuento/${token}`);
  }

  return <PantallaDeDescuento token={token} inicial={cupon} />;
}
