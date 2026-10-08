import s from "./landing.module.css";
import { APP_STORE_URL, PLAY_STORE_URL } from "../../lib/tiendas";

const WEB_APP = "https://app.vichente.com";

// Un dueño escéptico no se registra en algo que no puede ver. La web app es la
// salida principal porque abre en cualquier celular sin instalar nada; las
// tiendas quedan como segunda opción.
export default function VerLaApp() {
  return (
    <section className={`${s.section} ${s.onNavy}`}>
      <div className={s.inner}>
        <h2 className={s.h2}>¿Quieres verla antes?</h2>

        <p className={s.lead}>
          Ábrela y busca algo tú mismo. No necesitas instalar nada ni crear cuenta.
        </p>

        <div className={s.ctaBlock}>
          <a
            className={s.btnOrange}
            href={WEB_APP}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir Vichente App
          </a>
          <p className={s.heroFoot}>
            Abre en cualquier celular. O bájala de{" "}
            <a className={s.linkSubrayado} href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
              Play Store
            </a>{" "}
            o de{" "}
            <a className={s.linkSubrayado} href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              App Store
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
