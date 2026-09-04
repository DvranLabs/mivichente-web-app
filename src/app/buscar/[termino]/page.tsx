// Resultado de búsqueda compartible: vichente.com/buscar/<termino>.
//
// Nace de que el grupo de Facebook del pueblo se usa como buscador ("¿quién
// hace zapatos?"): quien contesta necesita pegar UN link que resuelva justo lo
// preguntado. Antes sólo se podía compartir negocio por negocio.
//
// En Android /buscar/* es App Link, así que quien tiene la app instalada y
// abre el link desde WhatsApp cae directo en esos resultados dentro de la app
// y nunca ve esta página. Desde el webview de Facebook los App Links no se
// disparan, y ahí esta página ES la experiencia — por eso muestra los negocios
// de verdad, no un "descarga la app".

import { headers } from "next/headers";
import SearchResultsLanding from "../../../components/SearchResultsLanding";
import { buscarNegocios, conteoLegible, terminoDesdeRuta } from "../../../lib/buscar";
import { logScan } from "../../../lib/log-scan";

const DESCRIPCION_BASE =
  "Vichente, el directorio de negocios de Nombre de Dios, Vicente Guerrero y Villa Unión.";

export async function generateMetadata({ params }: { params: Promise<{ termino: string }> }) {
  const { termino: segmento } = await params;
  const termino = terminoDesdeRuta(segmento);
  const negocios = await buscarNegocios(termino);

  // El copy lleva el conteo real a propósito: pegado en un comentario de
  // Facebook, "8 negocios para zapatería" es lo que hace que valga la pena
  // abrirlo. Con cero resultados se dice tal cual — un preview que promete
  // negocios que no existen quema la confianza de la siguiente vez.
  const title =
    negocios.length === 0
      ? `Todavía no hay "${termino}" en Vichente`
      : `${conteoLegible(negocios.length)} para "${termino}" en tu rancho`;

  const description =
    negocios.length === 0
      ? `${DESCRIPCION_BASE} ¿Conoces uno? Regístralo gratis.`
      : `${negocios
          .slice(0, 3)
          .map((n) => n.name)
          .join(", ")} y más. ${DESCRIPCION_BASE}`;

  return {
    title: `${title} — Vichente`,
    description,
    openGraph: {
      title,
      description,
      url: `https://vichente.com/buscar/${segmento}`,
      type: "website",
    },
    // Sin imagen explícita: la toma opengraph-image.tsx, que es hermano de
    // este archivo y se arma con el mismo término y el mismo conteo.
  };
}

export default async function BuscarPage({
  params,
  searchParams,
}: {
  params: Promise<{ termino: string }>;
  searchParams: Promise<{ src?: string }>;
}) {
  const { termino: segmento } = await params;
  const termino = terminoDesdeRuta(segmento);
  const negocios = await buscarNegocios(termino);

  const userAgent = (await headers()).get("user-agent") ?? "";
  const { src } = await searchParams;
  // `channel` explícito: qr_scan_channel_from_src sólo mapea el valor exacto
  // 'share', así que sin esto 'share-busqueda' caería en el bucket 'otro'.
  if (src) await logScan(src, userAgent, { channel: "share" });

  // La web app resuelve /search por ?q= (ver app_router.dart), así que aquí se
  // manda el término con espacios, no el segmento con guiones.
  const webAppUrl = `https://app.vichente.com/#/search?q=${encodeURIComponent(termino)}`;

  return (
    <SearchResultsLanding
      termino={termino}
      negocios={negocios}
      webAppUrl={webAppUrl}
      playStoreUrl="https://play.google.com/store/apps/details?id=com.dvrancorp.vichente"
      isAndroid={/android/i.test(userAgent)}
    />
  );
}
