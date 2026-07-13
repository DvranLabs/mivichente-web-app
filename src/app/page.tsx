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

// Negocios reales con foto: es lo único de la página que no es texto, y lo que
// hace que se lea como producto vivo y no como documento.
async function getNegociosConFoto(): Promise<NegocioConFoto[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?photo_url=not.is.null&select=id,name,municipio,photo_url&limit=12`,
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

    // Cuatro, no seis: el mosaico es de dos columnas y así queda cuadrado.
    return candidatos.filter((_, i) => vivas[i]).slice(0, 4);
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
