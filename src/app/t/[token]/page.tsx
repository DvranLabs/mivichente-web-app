// La tarjeta del cliente: lo que abre el QR de una tarjeta impresa, el link que
// el cliente se manda por WhatsApp y a donde lleva el QR del mostrador. Sirve
// igual para el token de la digital y para el de una impresa:
//
//   https://vichente.com/t/<token>
//
// El token es el secreto: quien lo tiene ve la tarjeta y se la enseña al dueño.
// Por eso la página no lo filtra a otros sitios (`referrer`, también como header
// en next.config.ts), no se indexa y se lee de la DB en cada visita.
//
// Esta página solo lee. Activar una impresa pasa al tocar el botón, por server
// action: las vistas previas de WhatsApp y los antivirus también abren el link.

import type { Metadata } from "next";
import { leerEntrada, leerTarjeta } from "../../actions/tarjeta";
import ActivarTarjeta from "../../../components/sellos/ActivarTarjeta";
import { ProgramaApagado, TarjetaQueNoSirve } from "../../../components/sellos/piezas";
import TarjetaDelCliente from "../../../components/sellos/TarjetaDelCliente";
import { logoDelNegocio } from "../../../lib/logo-del-negocio";
import { qrDeLaTarjeta } from "../../../lib/qr-de-la-tarjeta";
import { pareceToken } from "../../../lib/tarjeta";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

interface Props {
  params: Promise<{ token: string }>;
}

export const metadata: Metadata = {
  title: "Tu tarjeta — Vichente App",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

/**
 * El id del negocio, para guardar el token en el celular con la misma clave que
 * usa el QR del mostrador. `get_card_entry` no lo regresa. Anon solo ve
 * negocios activos: con uno inactivo regresa null y no se guarda nada.
 */
async function idDelNegocio(slug: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?slug=eq.${encodeURIComponent(slug)}&select=id&limit=1`,
      {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        // El id no cambia; el slug sí, pero entonces la clave sigue siendo la misma.
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    return ((await res.json()) as { id: string }[])[0]?.id ?? null;
  } catch {
    return null;
  }
}

export default async function TarjetaPage({ params }: Props) {
  const { token } = await params;
  if (!pareceToken(token)) return <TarjetaQueNoSirve />;

  // Si la DB no responde, lanza y sale error.tsx: un error pasajero no puede
  // verse como «esta tarjeta ya no se puede usar».
  const entrada = await leerEntrada(token);
  // Revocada o inexistente: la misma pantalla, sin decir cuál de las dos.
  if (!entrada) return <TarjetaQueNoSirve />;

  const slug = entrada.business_slug;
  const [negocioId, logo, qr] = await Promise.all([
    idDelNegocio(slug),
    logoDelNegocio(slug),
    qrDeLaTarjeta(token),
  ]);

  if (entrada.status === "unlinked") {
    // Sin nada activo en el negocio no hay qué activar: la salida es su ficha.
    if (!entrada.active_mechanic) {
      return <ProgramaApagado negocio={entrada.business_name} slug={slug} logo={logo} />;
    }
    return (
      <ActivarTarjeta
        token={token}
        negocio={{ id: negocioId, nombre: entrada.business_name, slug }}
        logo={logo}
        qr={qr}
      />
    );
  }

  const tarjeta = await leerTarjeta(token);
  if (!tarjeta) return <TarjetaQueNoSirve />;

  return <TarjetaDelCliente token={token} negocioId={negocioId} logo={logo} qr={qr} inicial={tarjeta} />;
}
