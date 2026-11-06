// Lo que abre el QR del mostrador de la tarjeta de cliente. La URL va impresa y
// no cambia (la arma el admin en `o3w5njyf0`):
//
//   https://vichente.com/<slug>/tarjeta?src=tarjeta-qr
//
// Hasta el 2026-11-06 era `/<slug>/sellos?src=sellos-qr`. Se cambió antes de
// imprimir ningún QR (mikitasks `m7r8es7op`), así que la vieja no redirige.
//
// El servidor resuelve el negocio y registra el scan. A qué tarjeta llevar lo
// decide el cliente, porque el token vive en `localStorage`; la tarjeta en sí
// vive en /t/<token>.

import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import EntradaDelMostrador from "../../../components/sellos/EntradaDelMostrador";
import { logScan } from "../../../lib/log-scan";
import { logoDelNegocio } from "../../../lib/logo-del-negocio";
import { resolveSlugFromHistory } from "../../../lib/menu-de-mesa";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ src?: string }>;
}

interface FilaNegocio {
  id: string;
  slug: string;
  name: string;
}

// Anon solo ve negocios activos (policy `businesses_public_read`), así que un
// negocio inactivo cae aquí como inexistente. Si el programa está apagado lo
// dice la DB al pedir la tarjeta, y se muestra C5.
async function getNegocio(slug: string): Promise<FilaNegocio | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?slug=eq.${encodeURIComponent(slug)}&select=id,slug,name&limit=1`,
      {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return ((await res.json()) as FilaNegocio[])[0] ?? null;
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "Tu tarjeta — Vichente App",
  robots: { index: false, follow: false },
};

export default async function TarjetaDelMostradorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { src } = await searchParams;
  const [negocio, logo] = await Promise.all([getNegocio(slug), logoDelNegocio(slug)]);

  if (!negocio) {
    // El slug impreso pudo quedar viejo si el negocio se renombró: el QR ya
    // está pegado en el mostrador. Se conserva `src` para que el scan se
    // registre en el destino.
    const slugActual = await resolveSlugFromHistory(slug);
    if (slugActual) {
      redirect(`/${slugActual}/tarjeta${src ? `?src=${encodeURIComponent(src)}` : ""}`);
    }
    notFound();
  }

  if (src) {
    // Solo cuenta como scan si trae `?src=`, que es lo que lleva el QR impreso.
    // El canal (`tarjeta-qr`) lo deriva la DB.
    const userAgent = (await headers()).get("user-agent") ?? "";
    await logScan(src, userAgent, { business_id: negocio.id, slug_at_scan: slug });
  }

  return (
    <EntradaDelMostrador negocio={{ id: negocio.id, slug: negocio.slug, nombre: negocio.name }} logo={logo} />
  );
}
