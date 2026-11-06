import { Nunito } from "next/font/google";

// La tipografía del mockup aprobado de la tarjeta de sellos. Lleva el 900 de los
// títulos, que la de opiniones no carga; por eso es una instancia aparte.
export const nunitoSellos = Nunito({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-nunito-sellos",
  display: "swap",
});
