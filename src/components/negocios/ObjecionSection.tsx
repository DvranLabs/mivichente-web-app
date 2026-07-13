import s from "./landing.module.css";

export default function ObjecionSection() {
  return (
    <section className={`${s.section} ${s.onNavy}`}>
      <div className={s.inner}>
        <h2 className={s.h2}>&ldquo;Pero yo ya tengo Facebook.&rdquo;</h2>

        <p className={s.lead}>Está bien. No tienes que dejar de usarlo.</p>

        <div className={s.compare}>
          <div className={`${s.compareCard} ${s.compareOld}`}>
            <p className={s.compareTitle}>Facebook</p>
            <p className={s.compareLine}>Para publicar y hablar con tus clientes.</p>
            <p className={s.compareSub}>
              Fotos, promociones, historias. Ahí te encuentra{" "}
              <strong>quien ya sabe cómo te llamas</strong>.
            </p>
          </div>

          <div className={`${s.compareCard} ${s.compareNew}`}>
            <p className={s.compareTitle}>Vichente App</p>
            <p className={s.compareLine}>Para que te encuentre quien está buscando.</p>
            <p className={s.compareSub}>
              Alguien busca algo que tú vendes, y tu negocio aparece.{" "}
              <strong>Aunque todavía no te conozca.</strong>
            </p>
          </div>
        </div>

        <p className={s.punch}>
          Por eso no compiten.
          <br />
          <span className={s.accent}>Se complementan.</span>
        </p>
      </div>
    </section>
  );
}
