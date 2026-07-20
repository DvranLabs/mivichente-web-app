import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Se expone como variable y NO como fontFamily del body: hoy solo /app la usa.
// Aplicarla global cambiaría la tipografía de todo el landing sin pedirlo.
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vichente App | Descubre negocios de la región",
  description: "Descubre y conecta con los mejores negocios locales de Nombre de Dios, Vicente Guerrero y Villa Unión. Encuentra servicios, productos y comercios cerca de ti.",
  keywords: ["Nombre de Dios", "Vicente Guerrero", "Villa Unión", "negocios locales", "servicios", "productos", "comercios", "directorio", "app"],
  authors: [{ name: "Vichente Team" }],
  creator: "Vichente Team",
  publisher: "Vichente App",
  robots: "index, follow",
  metadataBase: new URL("https://landing.vichente.com"),
  openGraph: {
    title: "Vichente App | Descubre negocios de la región",
    description: "Descubre y conecta con los mejores negocios locales de Nombre de Dios, Vicente Guerrero y Villa Unión. Encuentra servicios, productos y comercios cerca de ti.",
    url: "https://landing.vichente.com",
    siteName: "Vichente App",
    images: [
      {
        url: "/logo-grande.png",
        width: 1200,
        height: 630,
        alt: "Vichente App - Descubre negocios locales",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vichente App | Descubre negocios de la región",
    description: "Descubre y conecta con los mejores negocios locales de Nombre de Dios, Vicente Guerrero y Villa Unión. Encuentra servicios, productos y comercios cerca de ti.",
    images: ["/logo-grande.png"],
  },
  icons: {
    icon: [
      { url: "/logo-vichenteapp-48.png", sizes: "48x48", type: "image/png" },
      { url: "/logo-vichenteapp-96.png", sizes: "96x96", type: "image/png" },
      { url: "/logo-vichenteapp-144.png", sizes: "144x144", type: "image/png" },
      { url: "/logo-vichenteapp-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-vichenteapp-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo-vichenteapp-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
