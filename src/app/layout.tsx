import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mivichente Eats",
  description: "Catálogo de negocios de comida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
