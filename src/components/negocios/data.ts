export const MUNICIPIOS = ["Vicente Guerrero", "Villa Unión", "Nombre de Dios"] as const;

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

// Ni el catálogo ni lo genérico: lo que hace que te busquen A TI. "Tacos" lo
// tiene medio pueblo y no distingue a nadie; "tacos de barbacoa" y "consomé" son
// los que traen al cliente que quiere justo eso. La pregunta empuja a lo
// específico porque es lo único que gana una búsqueda.
//
// Las sugerencias son tap-to-add: para un dueño que teclea lento en el celular,
// tocar cuatro chips es la diferencia entre llenar esto y abandonarlo.
export const GIROS: Record<Giro, GiroConfig> = {
  comida: {
    label: "Vendo comida",
    pregunta: "¿Por qué te buscan a ti?",
    hint: "Lo que te distingue, no lo obvio. Si vendes tacos: ¿de qué? «Tacos de barbacoa» o «consomé» te traen al cliente que quiere eso; «tacos» lo tiene medio pueblo.",
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
    pregunta: "¿Por qué te buscan a ti?",
    hint: "Lo específico, no el rubro. «Ferretería» ya lo dice tu letrero; «cemento», «copias de llaves» o «tubo de cobre» es lo que la gente escribe cuando lo necesita.",
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

