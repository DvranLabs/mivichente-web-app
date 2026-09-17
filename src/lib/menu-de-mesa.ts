// Datos del menú de mesa: el negocio y sus platillos, resueltos por slug.
//
// Vive en la landing y no en la web app de Flutter a propósito: en la mesa el
// rival es la paciencia. El bundle de Flutter descarga ~2-3 MB antes de pintar
// el primer pixel, y "el menú por QR tardaba" es justo la mala experiencia que
// originó este piloto. Aquí sale HTML en el primer viaje.

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

/** Un tamaño del platillo, con su propio precio. */
export interface MenuVariant {
  name: string;
  /** PostgREST serializa `numeric` como string ("75.00"), no como number. */
  price: string | number;
  order_index: number;
}

/** Una opción elegible de un grupo: "Capuchino", "Shot de espresso". */
export interface MenuOption {
  name: string;
  /**
   * Lo que esta opción le SUMA al precio de la línea; 0 = sin costo.
   * PostgREST serializa `numeric` como string ("12.00"), no como number.
   */
  price_delta: string | number;
  order_index: number;
}

/**
 * Un grupo de opciones del platillo: "Sabor", "Leche", "Extra".
 *
 * La diferencia con `MenuVariant` es qué le hacen al precio: el tamaño lo FIJA,
 * el grupo le SUMA. Un mismo platillo usa los dos (el Café caliente de K-fféss
 * tiene tamaño Mediano/Grande Y extra de shot de espresso).
 */
export interface MenuOptionGroup {
  name: string;
  order_index: number;
  business_service_options?: MenuOption[] | null;
}

export interface MenuItem {
  name: string;
  /**
   * PostgREST serializa `numeric` como string ("75.00"), no como number.
   *
   * Con variantes esto es el MENOR de ellas, o sea un "desde" — no el precio
   * del platillo. Lo etiqueta `MenuDeMesa`.
   */
  price: string | number | null;
  description: string | null;
  image_url: string | null;
  section: string | null;
  order_index: number;
  updated_at: string;
  /**
   * Los tamaños vivían aplanados dentro de `description` como
   * "Tamaños: chica $90, mediana $220...". Desde el 2026-09-14 son filas y
   * llegan por acá; `variantesComoGrupo` las devuelve con la misma forma que
   * produce el parser para que el render no tenga que distinguirlas.
   */
  business_service_variants?: MenuVariant[] | null;
  /**
   * Sabor, leche, extras: lo que el cliente ELIGE además del tamaño. Vivían
   * aplanados dentro de `description` ("Sabores: capuchino, caramelo") y desde
   * el 2026-09-16 son filas. Mientras dure la recaptura el mismo platillo
   * puede tener las dos cosas, y `podarLoQueCubreLaEstructura` decide qué
   * pedazo del texto se sigue pintando.
   */
  business_service_option_groups?: MenuOptionGroup[] | null;
}

export interface MenuBusiness {
  id: string;
  slug: string;
  name: string;
  photo_url: string | null;
  business_services: MenuItem[];
}

// Los dos embeds anidados no necesitan hint de FK: hay una sola relación entre
// `business_services` y cada tabla hija. (El hint hace falta con `categories`,
// donde hay dos.) Verificado contra prod con la anon key antes de salir: 200 y
// `business_service_option_groups: []` en cada platillo. Importa porque si el
// select pide algo que PostgREST no puede resolver, `supabaseGet` se traga el
// error, la página no encuentra negocio y da 404 en TODOS los menús de mesa —
// los de los QR ya pegados en las mesas.
const SELECT =
  "id,slug,name,photo_url,business_services(name,price,description,image_url,section,order_index,updated_at," +
  "business_service_variants(name,price,order_index)," +
  "business_service_option_groups(name,order_index,business_service_options(name,price_delta,order_index)))";

async function supabaseGet<T>(path: string): Promise<T[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch {
    return null;
  }
}

export async function getMenuBySlug(slug: string): Promise<MenuBusiness | null> {
  const rows = await supabaseGet<MenuBusiness>(
    // Se ordena solo por `order_index`: es el orden curado del menú. Agrupar por
    // sección se hace después preservando ese orden, para no reordenar el menú
    // alfabéticamente por accidente.
    `businesses?slug=eq.${encodeURIComponent(slug)}&select=${SELECT}` +
      `&business_services.order=order_index.asc&limit=1`
  );
  return rows?.[0] ?? null;
}

// Un slug que ya salió impreso no se cambia — pero el trigger de `businesses`
// lo recalcula solo cuando el negocio se renombra, y a quien tiene el QR pegado
// en la mesa no hay forma de avisarle. `business_slug_history` guarda los slugs
// viejos para poder redirigir en vez de dar 404 sobre papel ya repartido.
export async function resolveSlugFromHistory(slug: string): Promise<string | null> {
  const rows = await supabaseGet<{ businesses: { slug: string } | null }>(
    `business_slug_history?slug=eq.${encodeURIComponent(slug)}&select=businesses(slug)&limit=1`
  );
  return rows?.[0]?.businesses?.slug ?? null;
}

/** Secciones en el orden en que vienen; los platillos sin sección van juntos al inicio. */
export interface MenuSection {
  /** null = el negocio no usa secciones (o este platillo no tiene). */
  name: string | null;
  anchor: string;
  items: MenuItem[];
}

export function agruparPorSeccion(items: MenuItem[]): MenuSection[] {
  const orden: string[] = [];
  const grupos = new Map<string, MenuItem[]>();

  for (const item of items) {
    const clave = item.section?.trim() || "";
    if (!grupos.has(clave)) {
      grupos.set(clave, []);
      orden.push(clave);
    }
    grupos.get(clave)!.push(item);
  }

  return orden.map((clave, i) => ({
    name: clave || null,
    anchor: `seccion-${i}`,
    items: grupos.get(clave)!,
  }));
}

/**
 * Un bloque listo para pintar. Los grupos del texto, los tamaños y las opciones
 * capturadas llegan todos con esta forma para que el render no tenga que saber
 * de dónde salió cada uno.
 */
export interface GrupoVisible {
  etiqueta: string;
  partes: string[];
}

export interface DescripcionParseada {
  grupos: GrupoVisible[];
  /** Texto que no encajó en ningún grupo; se muestra como párrafo. */
  parrafo: string | null;
  /**
   * Los mismos segmentos sueltos que forman `parrafo`, sin unir. Se exponen
   * porque podar el texto duplicado se hace renglón por renglón, y una vez
   * unidos el límite entre segmentos ya no se puede recuperar.
   */
  sueltos: string[];
}

// Para cortar el texto en segmentos se exige los dos puntos: es lo único que
// distingue una etiqueta de verdad de la palabra suelta a media frase.
//
// `Tamaños` y `Opciones` se agregaron el 2026-09-03 y NO son cosmética: la
// captura real las usa (23 y 1 ítems en prod), y sin estar acá sólo funcionaban
// cuando iban al principio del texto, por el reconocimiento de etiqueta de
// abajo. Al revés — "Contiene: jamón, piña. Tamaños: chica $90, mediana $220" —
// el corte nunca ocurría y la lista salía como
// ["jamón", "piña. Tamaños: chica $90", "mediana $220"]. Eso obligaba a pedirle
// al capturista "si usas Tamaños, ponlo primero", una regla del parser filtrada
// a la UI que nadie podía deducir. Si se agrega una etiqueta acá, se agrega
// también a la ayuda del formulario (admin, `menu-item-form.tsx`).
const CORTE_ETIQUETA =
  /(?=\b(?:Incluye|Contiene|Sabores|Sabor|Tamaños|Opciones|Con)\s*:)/i;

// Dentro de un segmento sí se acepta la etiqueta sin dos puntos, porque ahí ya
// va al principio y no hay ambigüedad: "Incluye 2 Sabritas a elegir, elote, …"
// es de la captura real de Snacky. "Con" queda fuera de esta forma a propósito
// — arrancaría con cosas como "Con leche" y partiría un nombre en pedazos.
const ETIQUETA_SIN_DOSPUNTOS = /^(Incluye|Contiene|Sabores|Sabor)\b\s*(.+)$/i;

// La etiqueta con dos puntos tiene que ser una de la lista, no cualquier palabra
// que anteceda a un ":". Hasta el 2026-09-16 esto era un `indexOf(":")` y agarraba
// el primer dos puntos del segmento viniera de donde viniera, así que una etiqueta
// inventada rompía el texto en vez de dejarlo pasar. Con "Elige fruta y base /
// Frutas: … / Bases: …" (captura real de K-ffess) salía un grupo con encabezado de
// dos renglones, "ELIGE FRUTA Y BASE FRUTAS", y un elemento que mezclaba las dos
// listas, "plátano o mango\nBases: almendra".
//
// Con la lista cerrada, lo que no se reconoce cae a párrafo — la regla de siempre:
// una captura con otro formato se lee raro, no se rompe. Los modificadores de
// platillo se van a modelar aparte, como ya pasó con los tamaños; esto solo evita
// que mientras tanto se vean mal.
const ETIQUETA_CON_DOSPUNTOS =
  /^(Incluye|Contiene|Sabores|Sabor|Tamaños|Opciones|Con)\s*:([\s\S]*)$/i;

/**
 * Lo que hoy es un párrafo cortado a dos líneas se vuelve una lista de qué trae.
 *
 * El formato de captura es texto libre y nadie lo valida ("Incluye: a, b, c",
 * "Sabores: x, y", o las dos juntas). Por eso: si el texto no trae una etiqueta
 * reconocible, se devuelve tal cual como párrafo en vez de inventar una lista
 * partiendo por comas — una captura con otro formato se lee raro, no se rompe.
 */
export function parseDescripcion(description: string | null): DescripcionParseada {
  const texto = description?.trim();
  if (!texto) return { grupos: [], parrafo: null, sueltos: [] };

  const segmentos = texto.split(CORTE_ETIQUETA).map((s) => s.trim()).filter(Boolean);
  const grupos: DescripcionParseada["grupos"] = [];
  const sueltos: string[] = [];

  for (const segmento of segmentos) {
    let etiqueta: string;
    let resto: string;

    const conDospuntos = segmento.match(ETIQUETA_CON_DOSPUNTOS);
    if (conDospuntos) {
      [, etiqueta, resto] = conDospuntos;
    } else {
      const m = segmento.match(ETIQUETA_SIN_DOSPUNTOS);
      if (!m) {
        sueltos.push(segmento);
        continue;
      }
      [, etiqueta, resto] = m;
    }

    const partes = separarLista(resto);
    if (partes.length) grupos.push({ etiqueta, partes });
    else sueltos.push(segmento);
  }

  return { grupos, parrafo: sueltos.join(" ") || null, sueltos };
}

function separarLista(texto: string): string[] {
  const partes = texto
    .replace(/\.\s*$/, "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  // El último elemento suele venir unido con " y " ("queso amarillo y queso
  // blanco"). Se parte solo ahí para no romper nombres que llevan "y" adentro.
  const ultimo = partes.pop();
  if (ultimo) {
    const mitades = ultimo.split(/\s+y\s+/i).map((p) => p.trim()).filter(Boolean);
    partes.push(...(mitades.length ? mitades : [ultimo]));
  }
  return partes;
}

// Dos formatos y no uno con `minimumFractionDigits: 0`: así un precio con
// centavos sale "$12.50" y no "$12.5", que es como se escribe el dinero. Los
// enteros —todo lo capturado hasta hoy— siguen saliendo sin decimales.
//
// El port a Dart de esto (`mobile/lib/core/utils/descripcion_servicio.dart`)
// tiene que dar el mismo string: el code review del 2026-09-17 encontró que
// divergían en las dos mitades del formato, y el separador de miles se ve hoy
// en prod (3 servicios de $1000 o más, el mayor de $1,900), así que el mismo
// precio salía "$1,900" en el menú de mesa y "$1900" en la ficha.
const PRECIO_ENTERO = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const PRECIO_CON_CENTAVOS = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatearPrecio(price: string | number | null): string | null {
  if (price === null || price === undefined || price === "") return null;
  const n = typeof price === "number" ? price : Number(price);
  if (!Number.isFinite(n)) return null;
  return Number.isInteger(n) ? PRECIO_ENTERO.format(n) : PRECIO_CON_CENTAVOS.format(n);
}

/**
 * Los tamaños del platillo con la MISMA forma que produce `parseDescripcion`,
 * para que el render los pinte como un grupo más y no tenga que saber que
 * vienen de otro lado.
 *
 * Hasta el 2026-09-14 estos mismos datos viajaban dentro de `description` como
 * "Tamaños: chica $90, mediana $220..." y el parser los cortaba por comas. La
 * lista se ve igual; lo que cambia es que ahora cada precio es un número
 * consultable y no un pedazo de texto, así que se formatea igual que el del
 * platillo en vez de salir crudo.
 */
export function variantesComoGrupo(item: MenuItem): GrupoVisible | null {
  const variantes = item.business_service_variants;
  if (!variantes || variantes.length === 0) return null;
  const partes = [...variantes]
    .sort((a, b) => a.order_index - b.order_index)
    .map((v) => {
      const precio = formatearPrecio(v.price);
      return precio ? `${v.name} ${precio}` : v.name;
    });
  return { etiqueta: "Tamaños", partes };
}

/**
 * Las opciones capturadas como estructura, con la MISMA forma que produce
 * `parseDescripcion` — igual que `variantesComoGrupo` hace con los tamaños.
 *
 * Una opción con costo se pinta con su "+": el precio grande de la card es el
 * "desde" y no lo incluye, así que el chip es lo único que avisa que el shot de
 * espresso cuesta $12. Las de `price_delta = 0` no anuncian nada — 16 de los 19
 * grupos que K-fféss necesita son elecciones sin costo, y un "+$0" en cada una
 * sería ruido.
 *
 * Un grupo sin opciones se ignora. La base lo permite a propósito (un grupo a
 * medio capturar es legítimo) y el editor del admin lo valida, pero esta
 * superficie no debe confiar en eso: puede haber datos previos a esa validación
 * o creados por SQL directo.
 */
export function gruposDeOpciones(item: MenuItem): GrupoVisible[] {
  const grupos = item.business_service_option_groups;
  if (!grupos || grupos.length === 0) return [];

  const visibles: GrupoVisible[] = [];
  // Se desempata por nombre porque `order_index` tiene default 0 en las dos
  // tablas: con varios grupos u opciones en 0, el orden dependería del que
  // devuelva PostgREST. `Array.sort` de JS es estable y `List.sort` de Dart no
  // lo garantiza, así que sin el desempate las dos superficies podrían pintar
  // el mismo platillo en orden distinto — y la app, entre corridas.
  for (const grupo of [...grupos].sort(porOrdenYNombre)) {
    const opciones = [...(grupo.business_service_options ?? [])].sort(porOrdenYNombre);
    const partes = opciones.map((opcion) => {
      const extra = Number(opcion.price_delta);
      const precio = Number.isFinite(extra) && extra > 0 ? formatearPrecio(extra) : null;
      return precio ? `${opcion.name} +${precio}` : opcion.name;
    });
    if (partes.length > 0) visibles.push({ etiqueta: grupo.name, partes });
  }
  return visibles;
}

function porOrdenYNombre(
  a: { order_index: number; name: string },
  b: { order_index: number; name: string },
): number {
  return a.order_index - b.order_index || a.name.localeCompare(b.name, "es");
}

// ── El mismo dato no se pinta dos veces ───────────────────────────────────
//
// Mientras dure la recaptura (`2d0ckbksx`) un platillo puede tener sus opciones
// en la estructura Y en el texto de la descripción. Cuando están en la
// estructura, la estructura manda: es la que sabe cuánto suma cada opción. Del
// texto se sigue pintando solo lo que la estructura no cubre.
//
// Comparar ENCABEZADOS no sirve, y está verificado con la captura real: el
// Brownie tiene el grupo "Nuez" y su descripción dice "Opciones: con nuez, sin
// nuez" — dos encabezados distintos para el mismo dato. Y hay renglones que ni
// llegan a grupo: "Leche entera o deslactosada" y "Extra: shot de espresso
// +$12" caen a párrafo, porque ninguna de las dos etiquetas está en la lista
// cerrada del parser. Así que lo que decide es el CONTENIDO: si las palabras de
// un renglón ya están en los grupos capturados, ese renglón es la misma
// información dicha de otra forma.

// Palabras que no dicen de qué habla un renglón, así que no cuentan para
// decidir si la estructura lo cubre.
const PALABRAS_DE_ENLACE = new Set([
  "a", "al", "con", "de", "del", "e", "el", "en", "la", "las", "lo", "los",
  "o", "para", "por", "sin", "su", "u", "un", "una", "y",
]);

// Qué fracción de las palabras de un renglón tiene que estar en la estructura
// para dejar de pintarlo.
//
// No es 1.0 porque la captura de texto trae palabras que ninguna columna
// guarda y que tampoco son información nueva: "Endulzantes: azúcar sin costo o
// miel +$10" tiene "costo" de sobra (3 de 4), y "Elige fruta y base" tiene
// "elige" (2 de 3). El piso lo fija el caso contrario, el del Café frío: "A las
// rocas" no tiene NINGUNA palabra en la estructura (0 de 1) y tiene que seguir
// viéndose, porque es información del platillo que no vive en otro lado.
const COBERTURA_MINIMA = 0.6;

function palabrasSignificativas(texto: string): string[] {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((p) => p.length > 1 && !/^\d+$/.test(p) && !PALABRAS_DE_ENLACE.has(p));
}

// Singular y plural cuentan como la misma palabra: el texto dice "Frutas:" y
// "Bases:" donde los grupos se llaman "Fruta" y "Base". Se prueban las dos
// formas en vez de reducir todo a una raíz porque ninguna regla simple acierta
// las dos ("bases" sin "es" queda en "bas", que no es "base").
function formas(palabra: string): string[] {
  const todas = [palabra];
  if (palabra.length > 3 && palabra.endsWith("s")) todas.push(palabra.slice(0, -1));
  if (palabra.length > 4 && palabra.endsWith("es")) todas.push(palabra.slice(0, -2));
  return todas;
}

/** Una opción capturada, reducida a lo que el dedupe necesita comparar. */
interface OpcionResumida {
  /** Sus palabras significativas, para saber si un pedazo de texto la nombra. */
  palabras: string[];
  /** Su `price_delta`. 0 es el caso normal: la mayoría de las opciones no cuesta. */
  monto: number;
  /** A qué grupo pertenece. Los precios se comparan dentro de un grupo, no entre todos. */
  grupo: number;
}

/** Lo que hay que saber de los grupos capturados para decidir qué poda. */
interface ResumenDeLaEstructura {
  /** Nombres de grupos y de opciones, en todas sus formas. */
  vocabulario: Set<string>;
  opciones: OpcionResumida[];
}

function resumenDeLaEstructura(item: MenuItem): ResumenDeLaEstructura | null {
  const grupos = item.business_service_option_groups;
  if (!grupos || grupos.length === 0) return null;

  const vocabulario = new Set<string>();
  const opciones: OpcionResumida[] = [];
  let numeroDeGrupo = 0;
  for (const grupo of grupos) {
    const suyas = grupo.business_service_options ?? [];
    // Un grupo sin opciones no aporta al vocabulario: si "Extra" quedó
    // capturado vacío, "Extra: shot de espresso +$12" en la descripción es lo
    // único que le avisa al cliente y no debe podarse.
    if (suyas.length === 0) continue;
    for (const texto of [grupo.name, ...suyas.map((o) => o.name)]) {
      for (const palabra of palabrasSignificativas(texto)) {
        for (const forma of formas(palabra)) vocabulario.add(forma);
      }
    }
    for (const opcion of suyas) {
      const extra = Number(opcion.price_delta);
      opciones.push({
        palabras: palabrasSignificativas(opcion.name),
        monto: Number.isFinite(extra) ? extra : 0,
        grupo: numeroDeGrupo,
      });
    }
    numeroDeGrupo += 1;
  }
  return vocabulario.size > 0 ? { vocabulario, opciones } : null;
}

// Solo los montos escritos con "$" cuentan como precio. Un número suelto puede
// ser parte del nombre del platillo ("Incluye 2 Sabritas", "6 oz") y tomarlo por
// precio dejaría renglones vivos sin razón.
const MONTO = /\$\s*(\d+(?:\.\d{1,2})?)/g;

// "sin costo" / "sin cargo" / "gratis" es un precio declarado, y vale 0. Sin
// esto, "Endulzantes: azúcar sin costo o miel +$10" (captura real de la Tisana)
// parecería declarar un solo precio cuando declara dos, y el ítem se quedaría
// vivo duplicando lo que los chips ya dicen.
//
// Pide las dos palabras juntas a propósito: "sin" suelto es lo que separa las
// dos opciones del Brownie ("con nuez, sin nuez") y no habla de dinero.
const SIN_COSTO = /\bsin\s+(?:costo|cargo)\b|\bgratis\b/i;

/** Los precios que un pedazo de texto declara, incluido el cero explícito. */
function montosDeclarados(texto: string): Set<number> {
  const montos = new Set<number>([...texto.matchAll(MONTO)].map((m) => Number(m[1])));
  if (SIN_COSTO.test(texto)) montos.add(0);
  return montos;
}

/**
 * Los precios de las opciones que este pedazo de texto nombra, acotados al
 * grupo al que el texto se refiere.
 *
 * Lo del grupo no es cosmética: sin eso, una opción de OTRO grupo se cuela por
 * compartir una palabra y desalinea la comparación de precios. Caso real del
 * Café frío: el ítem "cold foam de vainilla o caramelo +$13" nombra a los dos
 * cold foam del grupo `Extra`, pero también a la opción "Vainilla" del grupo
 * `Sabor`, que no cuesta — y entonces los precios capturados parecían ser
 * {$13, $0} contra un texto que declara solo $13.
 *
 * El grupo que manda es el que más opciones nombra. Si dos empatan, se unen sus
 * precios, que es el lado conservador: más precios distintos hacen menos
 * probable la poda, y no podar solo deja texto repetido mientras no podar de más
 * borra información.
 */
function montosQueNombra(
  texto: string,
  estructura: ResumenDeLaEstructura,
): Set<number> | null {
  const presentes = new Set(palabrasSignificativas(texto).flatMap(formas));
  const nombradas = estructura.opciones.filter(
    (opcion) =>
      opcion.palabras.length > 0 &&
      opcion.palabras.every((palabra) => formas(palabra).some((f) => presentes.has(f))),
  );
  if (nombradas.length === 0) return null;

  const porGrupo = new Map<number, OpcionResumida[]>();
  for (const opcion of nombradas) {
    const suyas = porGrupo.get(opcion.grupo) ?? [];
    suyas.push(opcion);
    porGrupo.set(opcion.grupo, suyas);
  }
  const mayor = Math.max(...[...porGrupo.values()].map((g) => g.length));
  const montos = new Set<number>();
  for (const suyas of porGrupo.values()) {
    if (suyas.length === mayor) for (const opcion of suyas) montos.add(opcion.monto);
  }
  return montos;
}

function laEstructuraLoCubre(
  texto: string,
  estructura: ResumenDeLaEstructura,
  minima = COBERTURA_MINIMA,
): boolean {
  const palabras = palabrasSignificativas(texto);
  if (palabras.length === 0) return false;
  const cubiertas = palabras.filter((p) =>
    formas(p).some((forma) => estructura.vocabulario.has(forma)),
  ).length;
  if (cubiertas / palabras.length < minima) return false;

  // Si el texto no habla de dinero, la cobertura de palabras decide sola. Es el
  // caso de 16 de los 19 grupos que K-fféss necesita.
  const declarados = montosDeclarados(texto);
  if (declarados.size === 0) return true;

  // Si el texto SÍ habla de dinero, los precios que declara tienen que ser
  // exactamente los de las opciones que nombra. `price_delta` tiene default 0,
  // así que una captura a medias es el caso normal: si el texto dice "+$12" y la
  // opción quedó en 0, podar el renglón pintaría "Shot de espresso" a secas y el
  // comensal vería gratis lo que cuesta $12.
  //
  // Se compara contra las opciones que el texto NOMBRA y no contra todos los
  // montos del platillo, porque un conjunto plano solo verifica "alguien cobra
  // $13" y no "esto cobra $13". Lo cazó el code review con el caso real del Café
  // frío: su grupo `Extra` tiene los dos cold foam a $13, y si uno de los dos se
  // captura en el default 0, el conjunto plano sigue conteniendo el 13 que trae
  // el otro — el renglón se podaba y el chip del caramelo quedaba sin precio.
  const capturados = montosQueNombra(texto, estructura);
  if (capturados === null) return false;
  return (
    capturados.size === declarados.size && [...capturados].every((m) => declarados.has(m))
  );
}

// Parte un renglón en encabezado y cola: "Bases: almendra, nuez" -> "Bases" y
// " almendra, nuez". Lo usa `podarRenglon` para distinguir una lista capturada
// de la prosa del platillo.
//
// El tope de 40 caracteres antes de los dos puntos es lo que mantiene el riesgo
// chico: sin él, cualquier prosa con dos puntos a media frase se trataría como
// lista. Aun así, una prosa corta con dos puntos entra por aquí y se le poda la
// cola, y medir por ítem volvió ese riesgo MAYOR, no menor: antes las palabras
// del encabezado diluían la cobertura y el renglón entero sobrevivía; ahora el
// encabezado sale de la medición y cada fragmento se juzga solo. El caso que lo
// muestra —lo construyó el code review— es "Nota: preparado al momento, pide tu
// leche entera o deslactosada", que antes se conservaba completo y ahora queda
// en "Nota: preparado al momento".
//
// No hay ningún encabezado así en las 25 descripciones capturadas, así que hoy
// no se lee mal en ningún menú. Si aparece, es este número el que hay que mover.
const TIENE_ENCABEZADO = /^([^\n:]{1,40}):([\s\S]*)$/;

// "Incluye:" / "Contiene:" / "Ingredientes:" nunca se poda. Es lo que el
// platillo TRAE, no lo que el cliente elige; la estructura no lo guarda en
// ninguna columna, así que podarlo por parecido de palabras (una pizza que
// "Contiene: piña" y tiene un grupo con esa fruta) lo perdería para siempre, no
// sólo durante la recaptura.
//
// Se prueba también contra el encabezado de un renglón suelto, no sólo contra
// la etiqueta de un grupo del parser: "Ingredientes:" no está en la lista
// cerrada de `parseDescripcion`, así que nunca llega a ser grupo y cae al
// párrafo, que es justo donde se podaría sin esta guarda.
const ETIQUETA_DE_INGREDIENTES = /^(Incluye|Contiene|Ingredientes)$/i;

/**
 * Un renglón del texto suelto sin los pedazos que la estructura ya dice, o
 * `null` si no queda nada que valga pintar.
 *
 * Un renglón CON encabezado ("Bases: almendra, nuez, …") se poda ítem por ítem,
 * igual que un grupo del parser y por el mismo motivo: un grupo a medio
 * capturar es legítimo, y podar el renglón entero se llevaría justo los ítems
 * que todavía no están capturados. Caso vivo en la captura de hoy: el grupo
 * `Base` de Mini hot cakes no tiene "Mermelada de fresa" (el de Crepa sí), así
 * que con la poda por renglón completo ese ingrediente desaparecía del menú.
 *
 * Un renglón SIN encabezado es prosa hasta que se demuestre lo contrario, así
 * que ahí se exige cobertura COMPLETA y se conserva o se va entero. Es la
 * diferencia entre "Leche entera o deslactosada" (3 de 3, el grupo Leche ya lo
 * dice, se va) y "Hamburguesa con queso, jamón y piña" contra un grupo de
 * extras con esos tres: "hamburguesa" es lo que el platillo ES, así que se
 * queda.
 */
function podarRenglon(renglon: string, estructura: ResumenDeLaEstructura): string | null {
  const conEncabezado = renglon.match(TIENE_ENCABEZADO);
  if (!conEncabezado) {
    return laEstructuraLoCubre(renglon, estructura, 1) ? null : renglon;
  }

  const [, encabezado, cola] = conEncabezado;
  if (ETIQUETA_DE_INGREDIENTES.test(encabezado.trim())) return renglon;

  // La granularidad llega hasta donde `separarLista` corta, y eso deja un
  // límite conocido: parte por comas y solo el último ítem por " y ", nunca por
  // " o ". En la captura real las 14 listas terminan en "X o Y" ("cajeta o
  // Nutella", "mango o cheesecake"), así que ese par se mide como un solo ítem
  // y la decisión vuelve a ser todo-o-nada sobre los dos.
  //
  // **Partir por " o " NO es el fix**, y está probado: "cold foam de vainilla o
  // caramelo +$13" daría ["cold foam de vainilla", "caramelo +$13"], y el
  // segundo fragmento ya no nombra a ninguna opción —el nombre capturado es
  // "Cold foam de caramelo" y se quedó sin su prefijo—, así que sobreviviría
  // como "Extra: caramelo +$13" al lado de los chips que dicen lo mismo. Partir
  // rompe los nombres compuestos que comparten prefijo, que es justo la forma
  // que tiene esta captura. Si algún día se cambia, se cambia en las dos
  // superficies: el gemelo en Dart replica el límite a propósito.
  const items = separarLista(cola);
  // Sin ítems que medir ("Opciones:" a secas, o una cola que no es lista) se
  // decide el renglón completo con el umbral laxo: el encabezado es texto de
  // captura y no tiene por qué existir en ninguna tabla.
  if (items.length === 0) {
    return laEstructuraLoCubre(renglon, estructura, COBERTURA_MINIMA) ? null : renglon;
  }

  const sobreviven = items.filter((item) => !laEstructuraLoCubre(item, estructura));
  if (sobreviven.length === 0) return null;
  // Si no se podó nada, se devuelve el renglón tal como lo capturaron. Volver a
  // armarlo es lossy y no habría ganado nada: `separarLista` quita el punto
  // final y parte por comas, así que un "+$1,200" saldría "+$1, 200" y un " y "
  // se volvería ", ". La regla del módulo es que una captura con otro formato se
  // lea raro, no que se rompa.
  if (sobreviven.length === items.length) return renglon;
  return `${encabezado}: ${sobreviven.join(", ")}`;
}

/**
 * La descripción sin los pedazos que los grupos capturados ya dicen.
 *
 * Sin grupos capturados devuelve la descripción intacta: un platillo sin
 * opciones estructuradas se ve exactamente igual que antes, que es la mayoría
 * del directorio y hoy —con las dos tablas vacías en prod— es todo.
 */
export function podarLoQueCubreLaEstructura(
  parseada: DescripcionParseada,
  item: MenuItem,
): DescripcionParseada {
  const estructura = resumenDeLaEstructura(item);
  if (!estructura) return parseada;

  const grupos: GrupoVisible[] = [];
  for (const grupo of parseada.grupos) {
    if (ETIQUETA_DE_INGREDIENTES.test(grupo.etiqueta.trim())) {
      grupos.push(grupo);
      continue;
    }
    // Opción por opción y no el grupo entero: un grupo a medio capturar es
    // legítimo (así lo dice la migración que creó las tablas), y podar el grupo
    // completo se llevaría justo las opciones que todavía no están capturadas.
    // Con "Sabores: capuchino, caramelo, moka" contra un grupo Sabor que sólo
    // tiene los dos primeros, "moka" se sigue viendo.
    const partes = grupo.partes.filter((parte) => !laEstructuraLoCubre(parte, estructura));
    if (partes.length > 0) grupos.push({ ...grupo, partes });
  }

  // Renglón por renglón y no el párrafo entero: el Café frío trae "A las rocas"
  // (que se queda) y "Leche entera o deslactosada" (que no) en el mismo bloque
  // de texto suelto.
  const sueltos = parseada.sueltos
    .flatMap((suelto) => suelto.split("\n"))
    .map((renglon) => renglon.trim())
    .filter((renglon) => renglon.length > 0)
    .map((renglon) => podarRenglon(renglon, estructura))
    .filter((renglon): renglon is string => renglon !== null);

  // Se unen con salto de línea y no con espacio: `.parrafo` se pinta con
  // `white-space: pre-line` a propósito (ver `menu.module.css`), porque la app
  // respeta los renglones de la captura y el mismo platillo se leía distinto en
  // cada superficie.
  return { grupos, sueltos, parrafo: sueltos.join("\n") || null };
}

/** Todo lo que se pinta debajo del nombre de un platillo, ya resuelto. */
export interface DetalleDelPlatillo {
  parrafo: string | null;
  grupos: GrupoVisible[];
  /** El platillo tiene tamaños, así que su precio es un "desde". */
  precioEsDesde: boolean;
}

/**
 * Los tres orígenes de los bloques de un platillo, en el orden en que se
 * pintan: los tamaños, lo que quede del texto, y las opciones capturadas.
 *
 * Los tamaños van PRIMERO porque es lo que el comensal busca cuando el platillo
 * tiene varias medidas. Lo que sobrevive del texto va antes que la estructura
 * porque lo que sobrevive es "Incluye:" / "Contiene:" —qué trae el platillo—, y
 * eso se lee antes de elegir.
 */
export function detalleDelPlatillo(item: MenuItem): DetalleDelPlatillo {
  const tamanos = variantesComoGrupo(item);
  const texto = podarLoQueCubreLaEstructura(parseDescripcion(item.description), item);
  return {
    parrafo: texto.parrafo,
    grupos: [...(tamanos ? [tamanos] : []), ...texto.grupos, ...gruposDeOpciones(item)],
    precioEsDesde: tamanos !== null,
  };
}

const FECHA = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Monterrey",
});

/** La fecha del menú es la del platillo editado más recientemente. */
export function fechaDeActualizacion(items: MenuItem[]): string | null {
  const fechas = items
    .map((i) => new Date(i.updated_at).getTime())
    .filter((t) => Number.isFinite(t));
  if (!fechas.length) return null;
  return FECHA.format(new Date(Math.max(...fechas)));
}
