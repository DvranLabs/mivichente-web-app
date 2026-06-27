import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal - Vichente App",
  description:
    "Términos y condiciones, política de privacidad y documentos legales",
};

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
