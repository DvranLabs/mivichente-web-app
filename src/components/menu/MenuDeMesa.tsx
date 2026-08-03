// Vista del menú de mesa.
//
// El criterio que ordenó el diseño: quien escanea ya está sentado. Cada
// elemento heredado del perfil se volvió a justificar desde la mesa, y varios
// se cayeron por sobrar ahí — "abierto ahora" (está adentro del negocio),
// horarios y ubicación (cómo llegar a donde ya llegó), el botón de WhatsApp
// (quien atiende está a 3 metros), el buscador (nadie teclea en un menú) y el
// CTA a explorar el directorio.
//
// Server Component puro: no exporta interactividad y no manda JS al cliente.

import {
  agruparPorSeccion,
  fechaDeActualizacion,
  formatearPrecio,
  parseDescripcion,
  type MenuBusiness,
  type MenuItem,
} from "../../lib/menu-de-mesa";
import styles from "./menu.module.css";

/** Cuántos ingredientes se ven antes de plegar el resto. */
const INGREDIENTES_VISIBLES = 6;

export default function MenuDeMesa({ business }: { business: MenuBusiness }) {
  const items = business.business_services ?? [];
  const secciones = agruparPorSeccion(items);
  const conNombre = secciones.filter((s) => s.name);
  // Los chips solo valen si de verdad navegan a algo: con una sección (o
  // ninguna) serían un adorno que se come el alto de la primera pantalla.
  const mostrarChips = conNombre.length > 1;
  const actualizado = fechaDeActualizacion(items);

  return (
    <div className={styles.page}>
      <header className={styles.brandbar}>
        <span className={styles.bizName}>{business.name}</span>
        <span className={styles.wordmark}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vichente-isotipo-white.png" alt="" />
          Vichente
        </span>
      </header>

      {mostrarChips && (
        <nav className={styles.toolbar} aria-label="Secciones del menú">
          <div className={styles.chips}>
            {conNombre.map((s) => (
              <a key={s.anchor} href={`#${s.anchor}`} className={styles.chip}>
                {s.name}
              </a>
            ))}
          </div>
        </nav>
      )}

      {items.length === 0 ? (
        <div className={styles.vacio}>
          <h1>{business.name}</h1>
          <p>Estamos cargando el menú. Pregúntale a quien te atiende mientras tanto.</p>
        </div>
      ) : (
        <main className={styles.list}>
          {secciones.map((seccion) => (
            <Seccion
              key={seccion.anchor}
              anchor={seccion.anchor}
              nombre={mostrarChips ? seccion.name : null}
              items={seccion.items}
            />
          ))}
        </main>
      )}

      <footer className={styles.footer}>
        <span className={styles.footerMark}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vichente-isotipo.png" alt="" />
          Vichente App
        </span>
        <p>Directorio de negocios de Nombre de Dios, Vicente Guerrero y Villa Unión</p>
        {actualizado && <p className={styles.freshness}>Menú actualizado el {actualizado}</p>}
      </footer>
    </div>
  );
}

function Seccion({
  anchor,
  nombre,
  items,
}: {
  anchor: string;
  nombre: string | null;
  items: MenuItem[];
}) {
  return (
    <>
      {nombre && (
        <h2 id={anchor} className={styles.groupLabel}>
          {nombre}
        </h2>
      )}
      {items.map((item, i) => (
        <Platillo key={`${anchor}-${i}`} item={item} prioridad={i < 2} />
      ))}
    </>
  );
}

function Platillo({ item, prioridad }: { item: MenuItem; prioridad: boolean }) {
  const precio = formatearPrecio(item.price);
  const { grupos, parrafo } = parseDescripcion(item.description);

  return (
    <article className={styles.dish}>
      {/* <img> y no next/image a propósito: un host de imagen que no esté en
          next.config tira 500 y se lleva la página entera, y esta página vive
          detrás de un QR pegado en una mesa que ya no se puede corregir. */}
      {item.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image_url}
          alt={item.name}
          loading={prioridad ? "eager" : "lazy"}
          decoding="async"
        />
      )}
      <div className={styles.dishBody}>
        <div className={styles.dishTop}>
          <h3 className={styles.dishName}>{item.name}</h3>
          {precio && <span className={styles.price}>{precio}</span>}
        </div>

        {parrafo && <p className={styles.parrafo}>{parrafo}</p>}

        {grupos.map((grupo, i) => {
          const visibles = grupo.partes.slice(0, INGREDIENTES_VISIBLES);
          const ocultas = grupo.partes.slice(INGREDIENTES_VISIBLES);
          return (
            <div key={i} className={styles.grupo}>
              <div className={styles.grupoEtiqueta}>{grupo.etiqueta}</div>
              <ul className={styles.ings}>
                {visibles.map((parte, j) => (
                  <li key={j} className={styles.ing}>
                    {parte}
                  </li>
                ))}
              </ul>
              {ocultas.length > 0 && (
                <details className={styles.masDetalle}>
                  <summary>
                    {ocultas.length} {ocultas.length === 1 ? "opción más" : "opciones más"}
                  </summary>
                  <ul className={styles.ings}>
                    {ocultas.map((parte, j) => (
                      <li key={j} className={styles.ing}>
                        {parte}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}
