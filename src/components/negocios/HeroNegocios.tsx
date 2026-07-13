import Image from "next/image";
import s from "./landing.module.css";

export default function HeroNegocios({ businessCount }: { businessCount: number | null }) {
  return (
    <section className={`${s.section} ${s.onNavy} ${s.hero}`} data-hero>
      <div className={s.inner} style={{ width: "100%" }}>
        <div className={s.heroLogo}>
          <Image
            src="/vichente-isotipo-white.png"
            alt="Vichente App"
            width={52}
            height={52}
            priority
          />
          <span>Vichente App</span>
        </div>

        <p className={s.eyebrow}>
          La app de negocios de Vicente Guerrero, Villa Unión y Nombre de Dios
        </p>

        <h1 className={s.h1}>
          Que te encuentren cuando buscan{" "}
          <span className={s.accent}>lo que tú vendes</span>.
        </h1>

        {/* El mecanismo, no el tráfico: la app funciona pero todavía no se anuncia
            al público, así que aquí no se afirma que ya haya gente buscando. */}
        <p className={s.lead}>
          En Vichente App la gente puede buscar cosas como{" "}
          <em className={s.termino}>boneless</em>, <em className={s.termino}>plomero</em> o{" "}
          <em className={s.termino}>renta de sillas</em>.
        </p>

        <p className={s.lead}>
          Si tu negocio ya aparece, revisa que tenga bien lo que vendes. Si todavía no aparece,
          puedes agregarlo gratis.
        </p>

        <div className={s.ctaBlock}>
          <a href="#buscar" className={s.btnOrange}>
            Buscar mi negocio
          </a>
          <p className={s.heroFoot}>
            {businessCount !== null
              ? `${businessCount.toLocaleString("es-MX")} negocios de la región ya están cargados. Quizá el tuyo también.`
              : "Cientos de negocios de la región ya están cargados. Quizá el tuyo también."}
          </p>
        </div>
      </div>
    </section>
  );
}
