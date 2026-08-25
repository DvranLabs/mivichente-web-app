import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // El default son 1 MB y el registro ahora manda una foto. El navegador la
      // comprime antes (200-400 KB típico), así que este techo es sólo la red
      // para lo que la compresión no pueda tocar — HEIC en un Safari viejo sale
      // sin reescalar. Arriba de 4.5 MB Vercel corta el request de todos modos,
      // por eso 4: el cliente descarta la foto antes de llegar aquí y manda el
      // registro sin ella, que siempre es mejor que perder el alta.
      bodySizeLimit: "4mb",
    },
  },
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
