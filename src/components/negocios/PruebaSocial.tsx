import Image from "next/image";
import s from "./landing.module.css";
import type { NegocioConFoto } from "../../app/page";

// Sección deliberadamente compacta y sin titular grande: después de tres bloques
// con headline + lead, aquí el dato es el que habla.
export default function PruebaSocial({
  businessCount,
  negocios,
}: {
  businessCount: number | null;
  negocios: NegocioConFoto[];
}) {
  return (
    <section className={`${s.sectionCompacta} ${s.onWhite}`}>
      <div className={s.inner}>
        <p className={s.dato}>
          {businessCount !== null && (
            <span className={s.bigNumber}>{businessCount.toLocaleString("es-MX")}</span>
          )}
          <span className={s.datoTexto}>
            negocios de Vicente Guerrero, Villa Unión y Nombre de Dios{" "}
            <strong>ya están en Vichente App</strong>. Los cargamos nosotros, uno por uno. Si el
            tuyo no aparece, <strong>puedes registrarlo gratis</strong>.
          </span>
        </p>

        {negocios.length > 0 && (
          <ul className={s.mosaico}>
            {negocios.map((n) => (
              <li key={n.id} className={s.mosaicoItem}>
                <Image
                  src={n.photo_url}
                  alt={n.name}
                  fill
                  sizes="(min-width: 40rem) 21rem, 50vw"
                  className={s.mosaicoFoto}
                  loading="lazy"
                />
                <span className={s.mosaicoNombre}>{n.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
