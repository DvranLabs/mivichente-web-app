// Compresión en el navegador antes de mandar la foto al Server Action.
//
// Portada del admin (`admin/src/lib/images/compress-image.ts`), donde nació
// para el modo campo. Aquí hace más trabajo que allá, porque resuelve dos
// problemas a la vez:
//
//   1. La restricción del producto: al dueño del negocio NO se le piden
//      requisitos. Nada de "mínimo 800px" ni "máximo 2 MB" ni rechazar su foto
//      por el formato. Si hace falta un mínimo técnico, lo resuelve el sistema.
//      Esto es ese sistema: entra lo que sea que traiga su celular y sale algo
//      que el bucket acepta.
//   2. El límite de 1 MB que traen los Server Actions de Next por default. Una
//      foto de celular pesa 3-6 MB y no pasaría. De aquí sale en 200-400 KB, o
//      sea ~15x menos tiempo de subida sobre datos móviles, que en el rancho no
//      es un detalle.
//
// Sin dependencias: `createImageBitmap` + canvas hacen todo.

/** Lado largo al que se reescala antes de subir. */
const LADO_LARGO_OBJETIVO = 1600

const CALIDAD_WEBP = 0.8
const CALIDAD_JPEG = 0.82

export type ImagenComprimida = {
  blob: Blob
  /** 'image/webp' o 'image/jpeg' — siempre uno que acepta el bucket. */
  type: string
  extension: "webp" | "jpg"
}

function extensionDe(mime: string): "webp" | "jpg" {
  return mime === "image/webp" ? "webp" : "jpg"
}

function canvasABlob(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  type: string,
  quality: number
): Promise<Blob | null> {
  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type, quality }).catch(() => null)
  }
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

/**
 * Reescala al lado largo objetivo y recomprime.
 *
 * Devuelve el original si recomprimir no ayuda (imagen ya optimizada) o si el
 * navegador no puede decodificar el archivo (pasa con HEIC en navegadores
 * viejos). En ese caso el archivo sale tal como entró y puede seguir pesando de
 * más — quien llama decide qué hacer, y en el registro la respuesta es guardar
 * la solicitud sin foto antes que perder el alta completa.
 */
export async function comprimirImagen(file: File): Promise<ImagenComprimida> {
  const original: ImagenComprimida = {
    blob: file,
    type: file.type,
    extension: extensionDe(file.type),
  }

  // `imageOrientation: 'from-image'` NO es opcional: sin él, las fotos verticales
  // tomadas con el celular llegan acostadas (el EXIF se pierde al rasterizar).
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  } catch {
    return original
  }

  try {
    const ladoLargo = Math.max(bitmap.width, bitmap.height)
    const escala = ladoLargo > LADO_LARGO_OBJETIVO ? LADO_LARGO_OBJETIVO / ladoLargo : 1
    const width = Math.round(bitmap.width * escala)
    const height = Math.round(bitmap.height * escala)

    const canvas: HTMLCanvasElement | OffscreenCanvas =
      typeof OffscreenCanvas !== "undefined"
        ? new OffscreenCanvas(width, height)
        : Object.assign(document.createElement("canvas"), { width, height })

    const ctx = canvas.getContext("2d") as
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D
      | null
    if (!ctx) return original
    ctx.drawImage(bitmap, 0, 0, width, height)

    // Safari viejo ignora webp y devuelve PNG: se detecta por el type real.
    let blob = await canvasABlob(canvas, "image/webp", CALIDAD_WEBP)
    if (!blob || blob.type !== "image/webp") {
      blob = await canvasABlob(canvas, "image/jpeg", CALIDAD_JPEG)
    }
    if (!blob) return original
    if (blob.size >= file.size) return original

    return { blob, type: blob.type, extension: extensionDe(blob.type) }
  } finally {
    bitmap.close()
  }
}
