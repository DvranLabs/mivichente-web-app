import Image from "next/image";
import Link from "next/link";
import s from "./landing.module.css";
import { APP_STORE_URL, PLAY_STORE_URL } from "../../lib/tiendas";

export default function FooterNegocios() {
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <div className={s.footerLogo}>
          <Image src="/vichente-isotipo-white.png" alt="Vichente App" width={32} height={32} />
          <span>Vichente App</span>
        </div>
        <p>El directorio de negocios de Vicente Guerrero, Villa Unión y Nombre de Dios.</p>
        <div className={s.footerLinks}>
          <a href="https://app.vichente.com">Abrir la app</a>
          <a href={PLAY_STORE_URL}>Play Store</a>
          <a href={APP_STORE_URL}>App Store</a>
          <Link href="/legal/terms">Términos</Link>
          <Link href="/legal/privacy">Privacidad</Link>
          <a href="mailto:vichenteapp@gmail.com">Contacto</a>
        </div>
        <p>© {new Date().getFullYear()} Vichente App. Hecho en Durango.</p>
      </div>
      <div className={s.stickySpacer} />
    </footer>
  );
}
