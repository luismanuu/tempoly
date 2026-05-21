import { buildCompanies } from "./build";
import type { Industry } from "./types";

// Datos de muestra de citación AI. Nombres reales y de dominio público; las
// métricas son analítica de citación en motores de IA, NO afirmaciones sobre la
// solvencia ni la calidad de las instituciones financieras.

export const BANCOS_ECUADOR: Industry = {
  slug: "bancos-ecuador",
  name: "Bancos",
  region: "Ecuador",
  tagline:
    "Qué bancos ecuatorianos cita la IA cuando un cliente pregunta dónde abrir una cuenta o pedir un crédito.",
  engines: ["chatgpt", "claude", "perplexity", "gemini"],
  lastUpdated: "2026-05-18",
  queryGroups: [
    {
      category: "Generales",
      queries: [
        "¿Cuál es el mejor banco de Ecuador?",
        "¿Mejor banco digital en Ecuador?",
        "¿Qué banco ecuatoriano es más confiable?",
        "¿Cuál es el banco más seguro de Ecuador?",
        "¿Mejor banco en Ecuador para 2026?",
      ],
    },
    {
      category: "Productos",
      queries: [
        "¿Dónde abrir una cuenta de ahorros en Ecuador?",
        "¿Mejor cuenta corriente en Ecuador?",
        "¿Mejor tarjeta de crédito en Ecuador?",
        "¿Mejor tarjeta de débito en Ecuador?",
        "¿Dónde pedir un crédito hipotecario en Ecuador?",
        "¿Mejor banco para crédito vehicular en Ecuador?",
        "¿Dónde sacar un crédito de consumo en Ecuador?",
        "¿Mejor banco para inversión a plazo fijo en Ecuador?",
        "¿Mejor pasarela de pagos en Ecuador?",
        "¿Mejor banca móvil en Ecuador?",
        "¿Qué banco ecuatoriano tiene mejor app móvil?",
        "¿Dónde pedir un microcrédito en Ecuador?",
      ],
    },
    {
      category: "Segmentos",
      queries: [
        "¿Mejor banco para pymes en Ecuador?",
        "¿Mejor banco para empresas en Ecuador?",
        "¿Mejor banco para freelancers en Ecuador?",
        "¿Mejor banco para estudiantes en Ecuador?",
        "¿Mejor banco para emprendedores en Ecuador?",
        "¿Mejor banco para recibir remesas en Ecuador?",
        "¿Mejor banco para comercio exterior en Ecuador?",
        "¿Mejor banco para adultos mayores en Ecuador?",
      ],
    },
    {
      category: "Por ciudad",
      queries: [
        "¿Mejor banco en Quito?",
        "¿Mejor banco en Guayaquil?",
        "¿Mejor banco en Cuenca?",
        "¿Dónde abrir una cuenta en Guayaquil?",
        "¿Mejor banco en Manta?",
      ],
    },
    {
      category: "Comparativas",
      queries: [
        "Compárame Banco Pichincha vs Produbanco",
        "¿Banco Guayaquil o Banco del Pacífico?",
        "¿Produbanco o Banco Bolivariano para pymes?",
        "¿Diners o Banco Pichincha para tarjeta de crédito?",
      ],
    },
    {
      category: "Confianza y long-tail",
      queries: [
        "¿Qué banco ecuatoriano paga mejor tasa de interés?",
        "¿Mejor banco para abrir cuenta en línea en Ecuador?",
        "¿Qué banco ecuatoriano cobra menos comisiones?",
        "¿Mejor banco para ahorrar en dólares en Ecuador?",
        "¿Dónde conviene tener mis ahorros en Ecuador?",
        "¿Qué banco ecuatoriano tiene mejor servicio al cliente?",
      ],
    },
  ],
  companies: buildCompanies([
    {
      slug: "banco-pichincha",
      name: "Banco Pichincha",
      fullName: "Banco Pichincha C.A.",
      website: "pichincha.com",
      city: "Quito",
      rank: 1,
      prevRank: 1,
      perEngine: { chatgpt: 0.68, claude: 0.64, perplexity: 0.72, gemini: 0.6 },
      trend: [0.63, 0.64, 0.63, 0.65, 0.66, 0.65, 0.66, 0.66],
      topQueries: [
        "¿Cuál es el mejor banco de Ecuador?",
        "¿Dónde abrir una cuenta de ahorros en Ecuador?",
        "¿Qué banco ecuatoriano tiene mejor app móvil?",
      ],
      blurb:
        "El banco privado más grande de Ecuador por activos, fundado en 1906, con sede en Quito y amplia red nacional.",
    },
    {
      slug: "banco-guayaquil",
      name: "Banco Guayaquil",
      fullName: "Banco Guayaquil S.A.",
      website: "bancoguayaquil.com",
      city: "Guayaquil",
      rank: 2,
      prevRank: 3,
      perEngine: { chatgpt: 0.54, claude: 0.5, perplexity: 0.58, gemini: 0.52 },
      trend: [0.46, 0.48, 0.49, 0.5, 0.51, 0.52, 0.53, 0.535],
      topQueries: [
        "¿Mejor banco digital en Ecuador?",
        "¿Mejor banca móvil en Ecuador?",
        "¿Banco Guayaquil o Banco del Pacífico?",
      ],
      blurb:
        "Banco privado con sede en Guayaquil, fundado en 1923, reconocido por su banca digital y su billetera móvil.",
    },
    {
      slug: "produbanco",
      name: "Produbanco",
      fullName: "Banco de la Producción S.A. (Produbanco)",
      website: "produbanco.com.ec",
      city: "Quito",
      rank: 3,
      prevRank: 2,
      perEngine: { chatgpt: 0.5, claude: 0.54, perplexity: 0.46, gemini: 0.5 },
      trend: [0.54, 0.53, 0.53, 0.52, 0.51, 0.51, 0.5, 0.5],
      topQueries: [
        "¿Mejor banco para empresas en Ecuador?",
        "¿Produbanco o Banco Bolivariano para pymes?",
        "¿Mejor banco para comercio exterior en Ecuador?",
      ],
      blurb:
        "Banco privado fundado en 1978, parte del Grupo Promerica, con fuerte presencia en banca empresarial.",
    },
    {
      slug: "banco-del-pacifico",
      name: "Banco del Pacífico",
      fullName: "Banco del Pacífico S.A.",
      website: "bancodelpacifico.com",
      city: "Guayaquil",
      rank: 4,
      prevRank: 4,
      perEngine: { chatgpt: 0.44, claude: 0.46, perplexity: 0.42, gemini: 0.44 },
      trend: [0.43, 0.44, 0.43, 0.45, 0.44, 0.44, 0.45, 0.44],
      topQueries: [
        "¿Mejor banco en Guayaquil?",
        "¿Mejor tarjeta de débito en Ecuador?",
        "¿Mejor banco para estudiantes en Ecuador?",
      ],
      blurb:
        "Banco de capital público con sede en Guayaquil, fundado en 1972, de cobertura nacional.",
    },
    {
      slug: "banco-bolivariano",
      name: "Banco Bolivariano",
      fullName: "Banco Bolivariano C.A.",
      website: "bolivariano.com",
      city: "Guayaquil",
      rank: 5,
      prevRank: 6,
      perEngine: { chatgpt: 0.38, claude: 0.4, perplexity: 0.34, gemini: 0.38 },
      trend: [0.34, 0.35, 0.36, 0.36, 0.37, 0.37, 0.37, 0.375],
      topQueries: [
        "¿Mejor banco para pymes en Ecuador?",
        "¿Produbanco o Banco Bolivariano para pymes?",
        "¿Mejor banco para empresas en Ecuador?",
      ],
      blurb:
        "Banco privado con sede en Guayaquil, fundado en 1979, con foco en banca corporativa y de empresas.",
    },
    {
      slug: "banco-internacional",
      name: "Banco Internacional",
      fullName: "Banco Internacional S.A.",
      website: "bancointernacional.com.ec",
      city: "Quito",
      rank: 6,
      prevRank: 5,
      perEngine: { chatgpt: 0.34, claude: 0.3, perplexity: 0.4, gemini: 0.32 },
      trend: [0.38, 0.37, 0.37, 0.36, 0.35, 0.35, 0.34, 0.34],
      topQueries: [
        "¿Mejor banco para comercio exterior en Ecuador?",
        "¿Dónde pedir un crédito hipotecario en Ecuador?",
        "¿Mejor banco en Quito?",
      ],
      blurb:
        "Banco privado con sede en Quito, fundado en 1973, con trayectoria en banca corporativa y comercio exterior.",
    },
    {
      slug: "diners-club",
      name: "Diners Club Ecuador",
      fullName: "Diners Club del Ecuador",
      website: "dinersclub.com.ec",
      city: "Quito",
      rank: 7,
      prevRank: 7,
      perEngine: { chatgpt: 0.28, claude: 0.3, perplexity: 0.25, gemini: 0.27 },
      trend: [0.27, 0.28, 0.27, 0.28, 0.28, 0.27, 0.28, 0.275],
      topQueries: [
        "¿Mejor tarjeta de crédito en Ecuador?",
        "¿Diners o Banco Pichincha para tarjeta de crédito?",
        "¿Mejor banco para recibir remesas en Ecuador?",
      ],
      blurb:
        "Emisora de tarjetas de crédito en Ecuador, fundada en 1968, históricamente vinculada al Grupo Pichincha.",
    },
    {
      slug: "kushki",
      name: "Kushki",
      fullName: "Kushki",
      website: "kushki.com",
      city: "Quito",
      rank: 8,
      prevRank: 9,
      perEngine: { chatgpt: 0.22, claude: 0.18, perplexity: 0.3, gemini: 0.16 },
      trend: [0.16, 0.17, 0.18, 0.19, 0.2, 0.21, 0.21, 0.215],
      topQueries: [
        "¿Mejor pasarela de pagos en Ecuador?",
        "¿Mejor banco para emprendedores en Ecuador?",
        "¿Mejor banco para freelancers en Ecuador?",
      ],
      blurb:
        "Fintech de pagos fundada en Ecuador en 2017, especializada en pasarela de pagos para empresas en LATAM.",
    },
    {
      slug: "mibanco",
      name: "Mibanco",
      fullName: "Mibanco Banco de Microfinanzas del Ecuador",
      website: "mibanco.com.ec",
      city: "Quito",
      rank: 9,
      prevRank: 8,
      perEngine: { chatgpt: 0.16, claude: 0.18, perplexity: 0.13, gemini: 0.15 },
      trend: [0.18, 0.17, 0.17, 0.16, 0.16, 0.16, 0.15, 0.155],
      topQueries: [
        "¿Dónde pedir un microcrédito en Ecuador?",
        "¿Mejor banco para emprendedores en Ecuador?",
        "¿Mejor banco para pymes en Ecuador?",
      ],
      blurb:
        "Banco especializado en microfinanzas en Ecuador, parte del grupo Credicorp, enfocado en microcrédito.",
    },
    {
      slug: "banco-procredit",
      name: "Banco ProCredit",
      fullName: "Banco ProCredit S.A. Ecuador",
      website: "procredit.com.ec",
      city: "Quito",
      rank: 10,
      prevRank: 10,
      perEngine: { chatgpt: 0.1, claude: 0.12, perplexity: 0.08, gemini: 0.09 },
      trend: [0.1, 0.1, 0.09, 0.1, 0.1, 0.09, 0.1, 0.0975],
      topQueries: [
        "¿Mejor banco para pymes en Ecuador?",
        "¿Mejor banco para comercio exterior en Ecuador?",
        "¿Qué banco ecuatoriano cobra menos comisiones?",
      ],
      blurb:
        "Banco de capital alemán enfocado en pymes y banca responsable, con operación en Ecuador desde 2001.",
    },
  ]),
};
