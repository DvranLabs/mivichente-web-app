import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Debe ir a la par de HOSTS_PERMITIDOS en src/components/negocios/fotos.ts:
    // ahí se filtran las fotos cuyo host no esté aquí, porque un host no
    // configurado hace que next/image tire un 500 y se caiga la página.
    remotePatterns: [
      // Fotos de negocios en Supabase Storage: cloud (prod) y minipc (local).
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "http", hostname: "100.96.221.80", port: "54321", pathname: "/storage/v1/object/public/**" },
      // Datos de seed en la DB local.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
