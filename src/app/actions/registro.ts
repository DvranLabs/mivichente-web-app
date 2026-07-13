"use server";

// Registro de negocio desde la landing. Inserta en business_registrations, que
// tiene policy de INSERT para anon (misma ruta que usa la app mobile), así que
// basta la anon key. Va por Server Action y no desde el browser para no exponer
// la key en el bundle: el repo solo tiene SUPABASE_* server-side, sin NEXT_PUBLIC_.
//
// Nada de esto se publica solo: cae en la cola `pending` y un admin lo revisa,
// lo contacta y lo sube. La landing es una solicitud, no un alta.

import { GIROS, MUNICIPIOS, type Giro } from "../../components/negocios/data";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

const MAX_OFFERINGS = 30;
const MAX_OFFERING_LEN = 80;

/** El campo culpable viaja con el error para que el form pueda enfocarlo: un
 *  mensaje suelto arriba del form, con el botón hasta abajo, se lee como si el
 *  botón no hubiera hecho nada. */
export type CampoError =
  | "business_name"
  | "giro"
  | "offerings"
  | "phone"
  | "contact_name"
  | "municipio"
  | "general";

export type RegistroState =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "error"; message: string; campo: CampoError };

function clean(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function isPhone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 10;
}

function limpiarOfferings(valores: FormDataEntryValue[]): string[] {
  const vistos = new Set<string>();
  const salida: string[] = [];

  for (const v of valores) {
    const texto = clean(v).slice(0, MAX_OFFERING_LEN);
    if (!texto) continue;
    const llave = texto.toLowerCase();
    if (vistos.has(llave)) continue;
    vistos.add(llave);
    salida.push(texto);
    if (salida.length === MAX_OFFERINGS) break;
  }

  return salida;
}

// El nombre y el municipio de un negocio que YA existe se leen de la base, no
// del form: los campos ocultos del cliente son manipulables y aquí no hace falta
// confiar en ellos.
async function negocioExistente(
  id: string
): Promise<{ name: string; municipio: string } | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/businesses?id=eq.${encodeURIComponent(id)}&select=name,municipio&limit=1`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const filas: { name: string; municipio: string }[] = await res.json();
  return filas[0] ?? null;
}

export async function registrarNegocio(
  _prev: RegistroState,
  formData: FormData
): Promise<RegistroState> {
  // Honeypot: el campo va oculto por CSS, un humano nunca lo llena.
  if (clean(formData.get("website"))) return { status: "ok" };

  const offerings = limpiarOfferings(formData.getAll("offerings"));
  // El form lo muestra como "618 123 4567" para que se lea, pero se guarda en
  // dígitos pelones: así sale directo a un tel: o un wa.me sin romperse.
  const phone = clean(formData.get("phone")).replace(/\D/g, "");
  const contactName = clean(formData.get("contact_name"));
  const description = clean(formData.get("description"));
  const businessId = clean(formData.get("business_id"));
  const giroCrudo = clean(formData.get("giro"));
  const giro: Giro | null = giroCrudo in GIROS ? (giroCrudo as Giro) : null;

  if (!giro) {
    return { status: "error", message: "Dinos qué tipo de negocio tienes.", campo: "giro" };
  }
  if (offerings.length === 0) {
    return {
      status: "error",
      message: "Escribe al menos una cosa: es lo que te hace aparecer en las búsquedas.",
      campo: "offerings",
    };
  }
  if (!contactName) {
    return { status: "error", message: "Dinos con quién hablamos.", campo: "contact_name" };
  }
  if (!isPhone(phone)) {
    return {
      status: "error",
      message: "El teléfono va con 10 dígitos, con lada. Ejemplo: 618 123 4567.",
      campo: "phone",
    };
  }

  let businessName: string;
  let municipio: string;

  if (businessId) {
    const existente = await negocioExistente(businessId);
    if (!existente) {
      return {
        status: "error",
        message: "No encontramos ese negocio. Vuelve a buscarlo, por favor.",
        campo: "general",
      };
    }
    businessName = existente.name;
    municipio = existente.municipio;
  } else {
    businessName = clean(formData.get("business_name"));
    municipio = clean(formData.get("municipio"));

    if (!businessName) {
      return {
        status: "error",
        message: "Falta el nombre del negocio.",
        campo: "business_name",
      };
    }
    if (!MUNICIPIOS.includes(municipio as (typeof MUNICIPIOS)[number])) {
      return { status: "error", message: "Elige tu municipio.", campo: "municipio" };
    }
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/business_registrations`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      business_name: businessName,
      description: description || null,
      phone,
      contact_name: contactName,
      municipio,
      offerings,
      giro,
      business_id: businessId || null,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("business_registrations insert falló", res.status, await res.text());
    return {
      status: "error",
      message: "No pudimos guardar tus datos. Inténtalo otra vez en un momento.",
      campo: "general",
    };
  }

  return { status: "ok" };
}
