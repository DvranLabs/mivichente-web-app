import s from "./landing.module.css";

// vichente.com es la landing de captación de NEGOCIOS: todo el copy le habla al
// dueño. Pero también llega gente que solo quiere buscar algo en el pueblo —
// hasta ahora su única salida era teclear /app a mano, o leerse la página
// entera hasta "¿Quieres verla antes?".
//
// Va a /app y no a app.vichente.com directo: esa ruta ya resuelve plataforma
// (Play Store en Android, web app en iPhone) y en Android es App Link, así que
// quien ya tiene la app instalada la abre en vez de ver una web. El ?src marca
// la visita en qr_scans para saber cuánta gente entra por aquí.
//
// Sticky y no fixed: participa en el layout, así que no tapa el hero ni obliga a
// compensar con padding. Sin botón de cerrar a propósito — la barra es la única
// salida del usuario final y es más barata de ignorar que de administrar.
export default function BannerApp() {
  return (
    <aside className={s.bannerApp} aria-label="Acceso a la app">
      {/* <a> y no <Link>: la navegación client-side de Next nunca dispara el App
          Link de Android, así que quien ya tiene la app instalada acabaría en la
          web en vez de en su app. Además el prefetch de <Link> pediría /app sin
          que nadie lo toque y metería scans fantasma en qr_scans. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className={s.bannerAppLink} href="/app?src=landing-banner">
        <span className={s.bannerAppTexto}>¿Quieres usar la app?</span>
        <span className={s.bannerAppCta}>Abrir →</span>
      </a>
    </aside>
  );
}
