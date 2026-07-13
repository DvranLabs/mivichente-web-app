export const MUNICIPIOS = ["Vicente Guerrero", "Villa Unión", "Nombre de Dios"] as const;

// Los tres municipios son la cobertura de hoy, no la de siempre: hay negocios
// pegados a la frontera (La Joya, Suchil) que se registrarían si pudieran. Antes
// el radio los dejaba sin opción y ahí se acababa el flujo. Con "otro" escriben
// su municipio, la solicitud entra igual a la cola y queda como demanda medida
// del siguiente lugar a abrir. El valor es un centinela, no un municipio: por eso
// va en minúscula y no puede chocar con uno real.
export const MUNICIPIO_OTRO = "otro";
export const MAX_MUNICIPIO_LEN = 60;

export function esMunicipioCubierto(municipio: string): boolean {
  return MUNICIPIOS.includes(municipio as (typeof MUNICIPIOS)[number]);
}

// Dos giros, no más: lo que cambia entre un puesto de tacos y una ferretería no
// es el formulario, son los ejemplos. Un taquero que lee "cemento, pintura" no
// entiende qué escribir; uno que lee "boneless, alitas" lo entiende solo.
export type Giro = "comida" | "comercial";

// Las categorías de la base son 28 y muy granulares. Aquí solo se agrupan para
// decidir qué ejemplos enseñar — no es una taxonomía nueva.
const CATEGORIAS_COMIDA = [
  "Comida Mexicana",
  "Antojitos",
  "Taqueria",
  "Bares",
  "Snacks",
  "Hamburguesas",
];

export function giroDeCategoria(categoria: string | null | undefined): Giro {
  return categoria && CATEGORIAS_COMIDA.includes(categoria) ? "comida" : "comercial";
}

export interface GiroConfig {
  label: string;
  pregunta: string;
  hint: string;
  placeholder: string;
  sugerencias: string[];
}

// La pregunta se hace desde el lado del cliente, no del dueño: pensar "qué
// escribe la gente" saca palabras específicas solas, mientras que "qué vendes"
// saca el rubro. Y el rubro no gana búsquedas: "tacos" lo tiene medio pueblo,
// "tacos de barbacoa" trae al cliente que quiere justo eso.
//
// El hint pide lo que más le piden y lo que lo distingue, NO el catálogo
// completo: si el dueño se siente obligado a listar todo el menú, abandona.
//
// Las sugerencias son tap-to-add: para un dueño que teclea lento en el celular,
// tocar cuatro chips es la diferencia entre llenar esto y abandonarlo.
export const GIROS: Record<Giro, GiroConfig> = {
  comida: {
    label: "Vendo comida",
    pregunta: "¿Qué escribe la gente cuando busca lo tuyo?",
    hint: "Lo que más te piden y lo que te distingue, no todo el menú. Si tu fuerte es la barbacoa: «tacos de barbacoa», «consomé». Con «tacos» te pierdes entre todos.",
    placeholder: "tacos de barbacoa",
    sugerencias: [
      "tacos de barbacoa",
      "consomé",
      "boneless",
      "alitas",
      "hamburguesas",
      "mariscos",
      "pastel de tres leches",
      "pizza",
    ],
  },
  comercial: {
    label: "Vendo productos o servicios",
    pregunta: "¿Qué escribe la gente cuando busca lo tuyo?",
    hint: "Lo que más te piden y lo que te distingue, no todo el catálogo. Si eres la ferretería del pueblo: «copias de llaves», «cemento», «tubo de cobre». Con «ferretería» te pierdes entre todas.",
    placeholder: "renta de sillas",
    sugerencias: [
      "renta de sillas",
      "reparación de lavadoras",
      "uñas acrílicas",
      "copias de llaves",
      "plomería",
      "cemento",
      "fletes",
      "corte de cabello",
    ],
  },
};

// Casos reales del directorio: en los tres, la palabra buscada NO está en el
// nombre del negocio — solo en sus offerings. Ese es justo el pitch de la
// landing, así que la demo no inventa nada.
export interface DemoCase {
  query: string;
  name: string;
  municipio: string;
  categoria: string;
  offerings: string[];
  hit: string;
}

export const DEMO_CASES: DemoCase[] = [
  {
    query: "reparar lavadora",
    name: "Reparaciones Mateo",
    municipio: "Vicente Guerrero",
    categoria: "Reparaciones",
    offerings: ["reparaciones de lavadoras", "reparaciones de refrigeradores", "reparaciones de microondas"],
    hit: "reparaciones de lavadoras",
  },
  {
    query: "ultrasonido",
    name: "Dr. Mena",
    municipio: "Vicente Guerrero",
    categoria: "Salud",
    offerings: ["Ultrasonido"],
    hit: "Ultrasonido",
  },
  {
    query: "boneless",
    name: "RAPS Food",
    municipio: "Nombre de Dios",
    categoria: "Comida",
    offerings: ["boneless", "alitas", "paninis", "ensaladas"],
    hit: "boneless",
  },
];

// Así se busca hoy en la región: preguntando en los grupos de Facebook del
// municipio. Cada frase es un cliente con dinero en la mano y sin saber a quién
// llamar — que es justo el hueco que llena Vichente. Giros distintos a propósito
// (comida, oficios, eventos, belleza) para que cualquier dueño se vea reflejado.
export const PREGUNTAS_GRUPO = [
  "Alguien sabe dónde vendan boneless por aquí? 🙏",
  "Buenas, alguien tiene el número de un plomero de confianza? Que me lo pase porfa",
  "Dónde rentan sillas y mesas para una fiesta el sábado?",
  "Alguien repara lavadoras en Vicente? La mía ya no centrifuga",
  "Quién hace uñas a domicilio?",
];

