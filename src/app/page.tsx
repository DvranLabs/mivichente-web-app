import type { Metadata } from "next";

import HeroNegocios from "../components/negocios/HeroNegocios";
import BuscaTuNegocio from "../components/negocios/BuscaTuNegocio";
import ProblemaSection from "../components/negocios/ProblemaSection";
import DemoBusqueda from "../components/negocios/DemoBusqueda";
import PruebaSocial from "../components/negocios/PruebaSocial";
import ObjecionSection from "../components/negocios/ObjecionSection";
import VerLaApp from "../components/negocios/VerLaApp";
import RegistroForm from "../components/negocios/RegistroForm";
import StickyCta from "../components/negocios/StickyCta";
import FooterNegocios from "../components/negocios/FooterNegocios";
import { NegocioProvider } from "../components/negocios/NegocioSeleccionado";
import { fotoUsable } from "../components/negocios/fotos";
import s from "../components/negocios/landing.module.css";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Registra tu negocio gratis — Vichente App",
  description:
    "Vichente App es la app de negocios de Vicente Guerrero, Villa Unión y Nombre de Dios. Aparece cuando busquen lo que tú vendes. Registro gratis, sin comisiones.",
  openGraph: {
    title: "Registra tu negocio gratis — Vichente App",
    description:
      "Aparece cuando alguien de tu municipio busca lo que tú vendes. Directorio de negocios de Vicente Guerrero, Villa Unión y Nombre de Dios.",
    url: "https://vichente.com",
    siteName: "Vichente App",
    locale: "es_MX",
    type: "website",
    images: [{ url: "/vichente-logo-completo.png", alt: "Vichente App" }],
  },
};

export interface NegocioConFoto {
  id: string;
  name: string;
  municipio: string;
  photo_url: string;
}

// `fotoUsable` solo valida el host contra la allowlist de next/image: una URL de
// Supabase que ya no existe la pasa igual y aterriza como icono de imagen rota.
// Aquí confirmamos que la foto responda antes de mandarla al mosaico.
async function fotoViva(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", next: { revalidate: 3600 } });
    return res.ok;
  } catch {
    return false;
  }
}

// Los cuatro del mosaico van elegidos a mano: son negocios conocidos en los tres
// municipios, y con foto que se ve bien. Si se toman los primeros que devuelva la
// base, el mosaico cambia solo y puede caer cualquier cosa.
const MOSAICO_IDS = [
  "40386c85-e737-408f-8ac5-4b4e84053b8b", // Banda La Colmena
  "49dca9ee-8d97-42b8-a614-81420e47ac40", // Berracos
  "d3bbb66d-723c-4667-8324-474d6d084894", // El Túnel Delicias & Más
  "7261966e-8b48-41cd-903d-f57cce44f3cd", // Snacky
];

async function consultarNegocios(query: string): Promise<NegocioConFoto[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/businesses?select=id,name,municipio,photo_url&${query}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) return [];

  const negocios: NegocioConFoto[] = await res.json();
  const candidatos = negocios.filter((n) => fotoUsable(n.photo_url) !== null);
  const vivas = await Promise.all(candidatos.map((n) => fotoViva(n.photo_url)));
  return candidatos.filter((_, i) => vivas[i]);
}

// Negocios reales con foto: es lo único de la página que no es texto, y lo que
// hace que se lea como producto vivo y no como documento.
async function getNegociosConFoto(): Promise<NegocioConFoto[]> {
  try {
    const curados = await consultarNegocios(`id=in.(${MOSAICO_IDS.join(",")})`);
    const enOrden = MOSAICO_IDS.map((id) => curados.find((n) => n.id === id)).filter(
      (n): n is NegocioConFoto => n !== undefined
    );
    if (enOrden.length === MOSAICO_IDS.length) return enOrden;

    // Si alguno de los curados se borró o se le cayó la foto, se completa con
    // cualquier otro antes que enseñar un mosaico chueco de tres.
    const relleno = await consultarNegocios("photo_url=not.is.null&limit=12");
    const yaEstan = new Set(enOrden.map((n) => n.id));
    // Cuatro, no seis: el mosaico es de dos columnas y así queda cuadrado.
    return [...enOrden, ...relleno.filter((n) => !yaEstan.has(n.id))].slice(0, 4);
  } catch {
    return [];
  }
}

// El número de negocios se muestra tal cual está en la base: si la cuenta falla,
// la sección cae a un texto sin cifra en vez de inventar una.
async function getBusinessCount(): Promise<number | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/businesses?select=id`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "count=exact",
        Range: "0-0",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const total = res.headers.get("content-range")?.split("/")[1];
    const parsed = Number(total);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [businessCount, negociosConFoto] = await Promise.all([
    getBusinessCount(),
    getNegociosConFoto(),
  ]);

  return (
    <div className={s.page}>
      <NegocioProvider>
        <main>
          {/* Dolor → cómo se resuelve → ahora búscate → esto es real → objeción →
              conversión. El buscador va DESPUÉS del mockup: si llega antes, el
              dueño teclea su nombre sin saber todavía qué es la app. */}
          <HeroNegocios businessCount={businessCount} />
          <ProblemaSection />
          <DemoBusqueda />
          <BuscaTuNegocio />
          <PruebaSocial businessCount={businessCount} negocios={negociosConFoto} />
          <ObjecionSection />
          <VerLaApp />
          <RegistroForm />
        </main>
        <FooterNegocios />
        <StickyCta />
      </NegocioProvider>
    </div>
  );
}
