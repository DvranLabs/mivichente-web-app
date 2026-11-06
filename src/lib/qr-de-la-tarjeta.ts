// El QR que el cliente enseña en caja y que escanea el panel del dueño. Se
// genera en el servidor como SVG: el token ya viene en la URL de la página, así
// que no se agrega ninguna llamada ni se manda la librería al navegador.

import QRCode from "qrcode";
import { urlDeLaTarjeta } from "./tarjeta";

/**
 * SVG del QR de la tarjeta. Fondo blanco y margen de 3 módulos: el mockup pide
 * margen alrededor para que la cámara del dueño lo lea bien con la pantalla
 * en mano.
 */
export async function qrDeLaTarjeta(token: string): Promise<string> {
  return QRCode.toString(urlDeLaTarjeta(token), {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 3,
    color: { dark: "#1F1A14", light: "#FFFFFF" },
  });
}
