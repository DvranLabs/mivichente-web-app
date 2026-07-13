import s from "./landing.module.css";
import { PREGUNTAS_GRUPO } from "./data";

export default function ProblemaSection() {
  return (
    <section className={`${s.section} ${s.onWhite}`}>
      <div className={s.inner}>
        <h2 className={s.h2}>Así te buscan hoy.</h2>

        <p className={s.lead}>En los grupos del municipio, todos los días:</p>

        <ul className={s.posts}>
          {PREGUNTAS_GRUPO.map((p) => (
            <li key={p} className={s.post}>
              {p}
            </li>
          ))}
        </ul>

        <p className={s.punch}>
          Cada una de esas preguntas es <strong>un cliente con el dinero en la mano</strong>,
          sin saber a quién llamarle. Si nadie contesta con tu nombre,{" "}
          <strong>para él no existes</strong>.
        </p>

        <p className={s.punchAccent}>
          <span className={s.accent}>Ahí entra Vichente App.</span>
        </p>
      </div>
    </section>
  );
}
