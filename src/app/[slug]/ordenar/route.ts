import { NextResponse } from "next/server";
import { logScan } from "../../../lib/log-scan";
import { getMenuBySlug, resolveSlugFromHistory } from "../../../lib/menu-de-mesa";

export const dynamic = "force-dynamic";

interface Context {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: Context) {
  const { slug } = await params;
  let business = await getMenuBySlug(slug);

  if (!business) {
    const currentSlug = await resolveSlugFromHistory(slug);
    if (currentSlug) business = await getMenuBySlug(currentSlug);
  }

  if (!business) {
    return new Response("Negocio no encontrado", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // Igual que el menú de mesa: solo cuenta si trae `?src=`. El link a secas se
  // comparte suelto, y contarlo mezclaría cualquier visita con los clics que se
  // quieren medir (hoy, «Pide en …» del cierre de la página de opinión).
  const src = new URL(request.url).searchParams.get("src");
  if (src) {
    await logScan(src, request.headers.get("user-agent") ?? "", {
      business_id: business.id,
      slug_at_scan: slug,
    });
  }

  // Este enlace sale impreso: el destino debe poder cambiar sin que un 308
  // quede guardado para siempre en el navegador del cliente.
  return NextResponse.redirect(
    `https://app.vichente.com/#/business/${encodeURIComponent(business.slug)}`,
    { status: 307, headers: { "Cache-Control": "no-store" } },
  );
}
