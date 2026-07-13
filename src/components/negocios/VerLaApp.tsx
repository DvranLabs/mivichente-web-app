import s from "./landing.module.css";

const WEB_APP = "https://app.vichente.com";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.dvrancorp.vichente";

// Un dueño escéptico no se registra en algo que no puede ver. La web app es la
// salida principal porque abre en cualquier iPhone sin instalar nada (la nativa
// solo existe en Android); Play Store queda como segunda opción.
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
            Abre en cualquier celular.{" "}
            <a className={s.linkSubrayado} href={PLAY_STORE} target="_blank" rel="noopener noreferrer">
              O bájala de Play Store
            </a>{" "}
            si tienes Android.
          </p>
        </div>
      </div>
    </section>
  );
}
