// Subida de la foto que manda el dueño en el formulario de registro.
//
// ⚠️ ESTE ARCHIVO USA LA SERVICE ROLE KEY. Es la credencial que se salta TODO
// el RLS de Supabase. Reglas para no convertir eso en un incidente:
//
//   1. Sólo se importa desde un archivo `'use server'`. Nunca desde un
//      componente cliente. La variable no lleva prefijo NEXT_PUBLIC_, así que
//      Next jamás la inyecta al bundle del navegador — si algún día alguien la
//      renombra con ese prefijo, la key queda publicada en el JS de la landing.
//   2. Este módulo hace UNA cosa: subir un archivo al bucket de staging. No
//      exporta el cliente, no exporta la key, y no se usa para leer ni escribir
//      ninguna tabla. Si hace falta hablar con la base, se usa la anon key como
//      en el resto de la landing.
//   3. La key nunca se loguea. Los errores de aquí van a consola con el status
//      y el cuerpo de la respuesta, nada más.
//
// El bucket `registration-photos` es PRIVADO: lo que cae aquí no se ve en
// ningún lado hasta que un admin aprueba la solicitud y la copia al bucket
// público. Esa es la moderación — una foto de un formulario abierto puede ser
// de un tercero o contenido inapropiado y no debe poder publicarse sola.

const SUPABASE_URL = process.env.SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const BUCKET = "registration-photos"

/** Mismos valores que el bucket y que el Zod del admin. */
const MIMES_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"] as const
const MAX_BYTES = 5 * 1024 * 1024

function extensionDe(mime: string): string {
  if (mime === "image/webp") return "webp"
  if (mime === "image/png") return "png"
  return "jpg"
}

/**
 * Sube varias fotos y devuelve los paths que sí entraron, **en el mismo orden**
 * en que llegaron: el primero es la portada del negocio.
 *
 * Las que fallen se saltan en silencio. Subir 2 de 3 es mejor que no subir
 * ninguna, y muchísimo mejor que rebotar el registro completo.
 */
export async function subirFotosRegistro(files: File[]): Promise<string[]> {
  const paths: string[] = []
  for (const file of files) {
    const path = await subirFotoRegistro(file)
    if (path) paths.push(path)
  }
  return paths
}

/**
 * Sube una foto y devuelve su path dentro del bucket, o `null` si no se pudo.
 *
 * NUNCA lanza. Un fallo de la foto no puede costar el alta: el negocio que se
 * registra vale más que la imagen, así que quien llama guarda la solicitud sin
 * fotos y sigue. Son opcionales de punta a punta.
 *
 * La landing ya comprime en el navegador (200-400 KB típico), así que estas
 * validaciones casi nunca disparan: son para lo que llegue por otro camino o
 * con la compresión fallida (HEIC en un navegador viejo sale sin tocar).
 */
async function subirFotoRegistro(file: File): Promise<string | null> {
  if (!SERVICE_ROLE_KEY) {
    console.error("SUPABASE_SERVICE_ROLE_KEY no configurada: la foto no se sube")
    return null
  }
  if (file.size === 0 || file.size > MAX_BYTES) return null
  if (!(MIMES_PERMITIDOS as readonly string[]).includes(file.type)) return null

  const path = `${crypto.randomUUID()}.${extensionDe(file.type)}`

  try {
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`,
      {
        method: "POST",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": file.type,
          "x-upsert": "false",
        },
        body: file,
        cache: "no-store",
      }
    )

    if (!res.ok) {
      console.error("subida de foto de registro falló", res.status, await res.text())
      return null
    }

    return path
  } catch (e) {
    console.error("subida de foto de registro reventó", e)
    return null
  }
}
