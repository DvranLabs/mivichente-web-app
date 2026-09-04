// Imagen del preview cuando el link de búsqueda se pega en Facebook/WhatsApp.
// Se genera por término: lleva lo que se buscó y cuántos negocios hay, que es
// justo lo que hace que alguien lo abra desde un comentario. Un logo genérico
// igual para todos los links leería como spam.
//
// Dos restricciones que amarran el diseño:
//
//  1. Sin assets ni fuentes propias. `ImageResponse` no resuelve rutas
//     relativas, y leer de `public/` o traer un .ttf de Google Fonts mete un
//     modo de falla que sólo aparecería en producción, cuando el scraper de
//     Facebook ya cacheó una imagen rota. La marca se dibuja con cajas y
//     texto, que no puede fallar.
//  2. Un solo peso tipográfico: la fuente default de `next/og` no trae bold,
//     así que la jerarquía se hace con tamaño, color y letter-spacing — pedir
//     fontWeight 800 aquí no haría nada.

import { ImageResponse } from "next/og";
import { buscarNegocios, conteoLegible, terminoDesdeRuta } from "../../../lib/buscar";

export const alt = "Resultados de búsqueda en Vichente";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ORANGE = "#F07A2C";
const NAVY = "#0B1220";

// El término lo escribe el usuario y puede ser "taquerías" o "reparación de
// lavadoras a domicilio". Sin esto, el largo se sale del lienzo.
function tamanoDelTermino(termino: string): number {
  if (termino.length <= 14) return 104;
  if (termino.length <= 22) return 80;
  if (termino.length <= 34) return 60;
  return 46;
}

export default async function Image({ params }: { params: Promise<{ termino: string }> }) {
  const { termino: segmento } = await params;
  const termino = terminoDesdeRuta(segmento);
  const negocios = await buscarNegocios(termino);
  const vacio = negocios.length === 0;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `linear-gradient(135deg, ${NAVY} 0%, #14213D 60%, #1B2C4F 100%)`,
          color: "#fff",
        }}
      >
        {/* Retícula de puntos naranjas, el mismo recurso gráfico de
            BusinessLandingCard: da textura de marca sin depender de una
            imagen. Un disco translúcido sobre el navy se veía café sucio. */}
        <div style={{ position: "absolute", top: 56, right: 64, display: "flex", gap: 22 }}>
          {Array.from({ length: 6 }).map((_, col) => (
            <div key={col} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {Array.from({ length: 5 }).map((_, row) => (
                <div
                  key={row}
                  style={{ width: 6, height: 6, borderRadius: 3, background: ORANGE, opacity: 0.4 }}
                />
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 18,
              background: ORANGE,
              fontSize: 34,
              color: "#fff",
            }}
          >
            V
          </div>
          <div style={{ display: "flex", fontSize: 30, letterSpacing: 8, color: "rgba(255,255,255,0.92)" }}>
            VICHENTE
          </div>
        </div>

        {/* El bloque del término se centra en el hueco que queda: si no, un
            término corto deja la mitad de la tarjeta vacía y uno largo se
            amontona contra el lockup de arriba. */}
        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              fontSize: tamanoDelTermino(termino),
              letterSpacing: -1.5,
              color: "#fff",
            }}
          >
            {termino}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 44,
              color: vacio ? "rgba(255,255,255,0.72)" : ORANGE,
            }}
          >
            {vacio ? "Todavía no está en Vichente" : `${conteoLegible(negocios.length)} en tu rancho`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", width: 120, height: 5, borderRadius: 3, background: ORANGE }} />
          <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.62)" }}>
            Directorio de Nombre de Dios, Vicente Guerrero y Villa Unión
          </div>
        </div>
      </div>
    ),
    size
  );
}
