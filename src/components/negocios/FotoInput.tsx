"use client";

import { useEffect, useRef, useState } from "react";
import s from "./landing.module.css";
import { MAX_FOTOS } from "./data";
import { comprimirImagen } from "../../lib/comprimir-imagen";

/**
 * Fotos del negocio en el registro. Hasta `MAX_FOTOS`; la primera es la portada.
 *
 * Al dueño no se le pide NADA: ni tamaño, ni resolución, ni formato. Entra lo
 * que traiga su celular y el sistema lo acomoda — se reescala y recomprime aquí
 * mismo, en el navegador, antes de que salga. Eso resuelve dos cosas a la vez:
 * la subida sobre datos móviles (3-6 MB pasan a 200-400 KB) y el límite de body
 * que traen los Server Actions de Next.
 *
 * Los archivos comprimidos se meten de vuelta al `<input type="file">` con
 * `DataTransfer`, así el form los manda como cualquier otro campo y no hay que
 * envolver la action. Si el navegador no soporta `DataTransfer` (o la
 * compresión falla, ej. HEIC en Safari viejo), no se agregan: el registro se
 * manda sin ellas antes que perderse entero.
 */

/**
 * Techo de lo que se manda al Server Action, sumando TODAS las fotos. Debajo
 * del `bodySizeLimit` de 4 MB de `next.config.ts`, con holgura para el resto de
 * los campos.
 *
 * Lo que no quepa se descarta EN EL CLIENTE, no se manda a que truene: si el
 * body se pasa, Next rechaza el request entero y el registro se pierde. Perder
 * una foto es el mal menor; perder el alta es el problema que esta pantalla
 * existe para evitar.
 */
const MAX_BYTES_ENVIO = 3.5 * 1024 * 1024;

type Foto = { archivo: File; previewUrl: string };

export default function FotoInput({
  onOcupado,
}: {
  /** Avisa al form que no debe enviarse todavía: hay fotos comprimiéndose. */
  onOcupado: (ocupado: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [comprimiendo, setComprimiendo] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    onOcupado(comprimiendo);
  }, [comprimiendo, onOcupado]);

  // Los object URLs viven mientras se ven los previews; soltarlos al desmontar
  // evita dejar los blobs colgados en memoria.
  useEffect(() => {
    return () => {
      for (const f of fotos) URL.revokeObjectURL(f.previewUrl);
    };
    // Solo al desmontar: `quitar` ya revoca la que saca.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincroniza el input con el estado después de CADA render. Hace dos cosas:
  // mantiene el input al día cuando se quita una foto, y lo repone cuando React
  // resetea el form al terminar la action — sin esto, un registro rebotado por
  // otro campo se reenvía sin las fotos que el dueño ya había elegido, y él no
  // tiene cómo notarlo.
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (input.files?.length === fotos.length) return;
    try {
      const dt = new DataTransfer();
      for (const f of fotos) dt.items.add(f.archivo);
      input.files = dt.files;
    } catch {
      // Navegador sin DataTransfer: se manda lo que el input tenga.
    }
  });

  async function alElegir(e: React.ChangeEvent<HTMLInputElement>) {
    const elegidas = [...(e.target.files ?? [])];
    if (elegidas.length === 0) return;

    setAviso(null);
    setComprimiendo(true);

    const espacio = MAX_FOTOS - fotos.length;
    const sobran = elegidas.length > espacio;
    const nuevas: Foto[] = [];
    let pesoActual = fotos.reduce((t, f) => t + f.archivo.size, 0);
    let algunaPesada = false;

    for (const file of elegidas.slice(0, espacio)) {
      let listo: File;
      try {
        const c = await comprimirImagen(file);
        listo = new File([c.blob], `negocio.${c.extension}`, { type: c.type });
      } catch {
        listo = file;
      }
      if (pesoActual + listo.size > MAX_BYTES_ENVIO) {
        algunaPesada = true;
        continue;
      }
      pesoActual += listo.size;
      nuevas.push({ archivo: listo, previewUrl: URL.createObjectURL(listo) });
    }

    setFotos((previas) => [...previas, ...nuevas]);
    setComprimiendo(false);

    if (algunaPesada) {
      setAviso("Alguna foto pesaba de más y no se pudo agregar. Prueba con otra.");
    } else if (sobran) {
      setAviso(`Solo caben ${MAX_FOTOS}. Nos quedamos con las primeras.`);
    }
  }

  function quitar(index: number) {
    setAviso(null);
    setFotos((previas) => {
      const fuera = previas[index];
      if (fuera) URL.revokeObjectURL(fuera.previewUrl);
      return previas.filter((_, i) => i !== index);
    });
  }

  const lleno = fotos.length >= MAX_FOTOS;

  return (
    <div className={s.field}>
      <label className={s.label} htmlFor="foto">
        Fotos de tu negocio <span className={s.optional}>(opcional)</span>
      </label>

      <input
        ref={inputRef}
        className={s.fotoInput}
        id="foto"
        name="foto"
        type="file"
        accept="image/*"
        multiple
        onChange={alElegir}
      />

      {fotos.length > 0 && (
        <ul className={s.fotoLista}>
          {fotos.map((f, i) => (
            <li key={f.previewUrl} className={s.fotoItem}>
              {/* next/image no aplica: es un blob local del navegador, no una
                  URL remota que se pueda optimizar. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={s.fotoPreviewImg} src={f.previewUrl} alt={`Foto ${i + 1}`} />
              {/* La primera es la que se ve en el perfil y en la tarjeta, así
                  que se dice cuál es en vez de dejarlo al azar del orden. */}
              {i === 0 && <span className={s.fotoPortada}>Principal</span>}
              <button
                className={s.fotoQuitar}
                type="button"
                onClick={() => quitar(i)}
                aria-label={`Quitar foto ${i + 1}`}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      {!lleno && (
        <label className={s.fotoBtn} htmlFor="foto">
          <Camara />
          {fotos.length === 0 ? "Subir fotos" : "Agregar otra"}
        </label>
      )}

      {/* Internamente, la primera foto es la que acaba en la tarjeta "Ya estamos
          en Vichente App" que el negocio publica en sus redes — sin ella, esa
          pieza sale con el isotipo de Vichente en vez de su logo. Pero eso NO se
          le promete aquí: entregarle la tarjeta depende de que haya contacto, y
          el contacto no está garantizado. Se le dice lo único que siempre es
          cierto (sale en su perfil) y para qué sirve, no cómo debe ser. */}
      <p className={s.hint}>
        {comprimiendo
          ? "Preparando tus fotos…"
          : (aviso ??
            (lleno
              ? "Ya tienes las 3. La primera es la que se ve en tu perfil."
              : `Hasta ${MAX_FOTOS}. La primera es la que se ve en tu perfil. Cualquiera sirve: tu fachada, tu logo o lo que vendes.`))}
      </p>
    </div>
  );
}

const Camara = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2a1.5 1.5 0 0 0 1.25-.67l.6-.9A1.5 1.5 0 0 1 9.8 4.75h4.4a1.5 1.5 0 0 1 1.25.68l.6.9A1.5 1.5 0 0 0 17.3 7h2.2A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
    <circle cx="12" cy="12.75" r="3.25" />
  </svg>
);
