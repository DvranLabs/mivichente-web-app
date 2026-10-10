// Lo que abre el QR del acrílico de opiniones. La URL está impresa y no cambia:
//
//   https://vichente.com/<slug>/opinion?src=opinion-qr
//
// El servidor resuelve el negocio y registra el scan. Qué se pinta (formulario
// o el descuento que este celular ya tiene) lo decide el cliente, porque el
// token del descuento vive en `localStorage`.

import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import FormularioDeOpinion, {
  type NegocioDeOpinion,
} from "../../../components/opinion/FormularioDeOpinion";
import { logScan } from "../../../lib/log-scan";
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
  feedback_reward_active: boolean;
  feedback_reward_benefit: string | null;
}

// Anon solo ve negocios activos (policy `businesses_public_read`), así que un
// negocio inactivo cae aquí como inexistente. Sin caché: apagar el interruptor
// tiene que dejar de ofrecer el formulario en ese momento.
async function getNegocio(slug: string): Promise<FilaNegocio | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?slug=eq.${encodeURIComponent(slug)}` +
        `&select=id,slug,name,feedback_reward_active,feedback_reward_benefit&limit=1`,
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
  title: "Tu opinión — Vichente App",
  robots: { index: false, follow: false },
};

export default async function OpinionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { src } = await searchParams;
  const negocio = await getNegocio(slug);

  if (!negocio) {
    // El slug impreso pudo quedar viejo si el negocio se renombró. Se conserva
    // `src` para que el scan se registre en el destino.
    const slugActual = await resolveSlugFromHistory(slug);
    if (slugActual) {
      redirect(`/${slugActual}/opinion${src ? `?src=${encodeURIComponent(src)}` : ""}`);
    }
    notFound();
  }

  if (src) {
    // Igual que el menú de mesa: solo cuenta como scan si trae `?src=`, que es
    // lo que lleva el QR impreso. El canal (`opinion-qr`) lo deriva la DB.
    const userAgent = (await headers()).get("user-agent") ?? "";
    await logScan(src, userAgent, { business_id: negocio.id, slug_at_scan: slug });
  }

  const datos: NegocioDeOpinion = {
    id: negocio.id,
    slug: negocio.slug,
    name: negocio.name,
    benefit: negocio.feedback_reward_active ? negocio.feedback_reward_benefit : null,
  };

  return <FormularioDeOpinion negocio={datos} />;
}
