import { Nunito } from "next/font/google";

// La tipografía del mockup aprobado. Solo la cargan las pantallas de opinión y
// descuento: el resto de la landing no la necesita.
export const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});
