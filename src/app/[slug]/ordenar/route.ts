import { NextResponse } from "next/server";
import { getMenuBySlug, resolveSlugFromHistory } from "../../../lib/menu-de-mesa";

export const dynamic = "force-dynamic";

interface Context {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Context) {
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

  // Este enlace sale impreso: el destino debe poder cambiar sin que un 308
  // quede guardado para siempre en el navegador del cliente.
  return NextResponse.redirect(
    `https://app.vichente.com/#/business/${encodeURIComponent(business.slug)}`,
    { status: 307, headers: { "Cache-Control": "no-store" } },
  );
}
