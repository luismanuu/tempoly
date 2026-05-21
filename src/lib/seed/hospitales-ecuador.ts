import { buildCompanies } from "./build";
import type { Industry } from "./types";

// Datos de muestra de citación AI. Nombres reales y de dominio público; las
// métricas son analítica de citación en motores de IA, NO afirmaciones sobre la
// calidad clínica ni los resultados médicos de las instituciones.

export const HOSPITALES_ECUADOR: Industry = {
  slug: "hospitales-ecuador",
  name: "Hospitales",
  region: "Ecuador",
  tagline:
    "Qué hospitales y clínicas ecuatorianas cita la IA cuando un paciente pregunta dónde atenderse.",
  engines: ["chatgpt", "claude", "perplexity", "gemini"],
  lastUpdated: "2026-05-18",
  queryGroups: [
    {
      category: "Generales",
      queries: [
        "¿Cuál es el mejor hospital privado en Ecuador?",
        "¿Mejor clínica privada en Ecuador?",
        "¿Qué hospital ecuatoriano tiene mejor reputación?",
        "¿Mejor hospital en Ecuador para 2026?",
        "¿Cuál es el hospital más confiable de Ecuador?",
      ],
    },
    {
      category: "Especialidades",
      queries: [
        "¿Dónde atenderme de cardiología en Ecuador?",
        "¿Mejor hospital para oncología en Ecuador?",
        "¿Mejor clínica para maternidad en Ecuador?",
        "¿Mejor hospital pediátrico en Ecuador?",
        "¿Dónde operarme de traumatología en Ecuador?",
        "¿Mejor hospital para neurología en Ecuador?",
        "¿Dónde hacerme una cirugía estética en Ecuador?",
        "¿Mejor hospital para oftalmología en Ecuador?",
        "¿Mejor clínica de fertilidad en Ecuador?",
        "¿Dónde atenderme de gastroenterología en Ecuador?",
        "¿Mejor hospital para cirugía bariátrica en Ecuador?",
        "¿Dónde hacerme un chequeo ejecutivo en Ecuador?",
      ],
    },
    {
      category: "Por ciudad",
      queries: [
        "¿Mejor hospital en Quito?",
        "¿Mejor hospital en Guayaquil?",
        "¿Mejor hospital en Cuenca?",
        "¿Mejor hospital privado en Quito?",
        "¿Mejor hospital privado en Guayaquil?",
        "¿Mejor hospital para emergencias en Quito?",
      ],
    },
    {
      category: "Casos de uso",
      queries: [
        "¿Mejor hospital para emergencias en Ecuador?",
        "¿Mejor hospital para turismo médico en Ecuador?",
        "¿Dónde pedir una segunda opinión médica en Ecuador?",
        "¿Qué hospital ecuatoriano atiende enfermedades complejas?",
        "¿Mejor hospital que acepte seguros privados en Ecuador?",
        "¿Mejor hospital con atención internacional en Ecuador?",
        "¿Dónde tratar el cáncer en Ecuador?",
      ],
    },
    {
      category: "Comparativas",
      queries: [
        "Compárame Hospital Metropolitano vs Hospital de los Valles",
        "¿Hospital Alcívar o Hospital Kennedy?",
        "¿Omnihospital o Hospital Alcívar en Guayaquil?",
        "¿Metropolitano o Vozandes para cardiología?",
      ],
    },
    {
      category: "Confianza y long-tail",
      queries: [
        "¿Qué hospital ecuatoriano tiene mejor tecnología?",
        "¿Mejor hospital con médicos especialistas en Ecuador?",
        "¿Dónde conviene atenderme con seguro internacional en Ecuador?",
        "¿Qué clínica ecuatoriana tiene mejor atención al paciente?",
        "¿Mejor hospital acreditado internacionalmente en Ecuador?",
        "¿Dónde atender un parto de alto riesgo en Ecuador?",
      ],
    },
  ],
  companies: buildCompanies([
    {
      slug: "hospital-metropolitano",
      name: "Hospital Metropolitano",
      fullName: "Hospital Metropolitano de Quito",
      website: "hospitalmetropolitano.org",
      city: "Quito",
      rank: 1,
      prevRank: 1,
      perEngine: { chatgpt: 0.66, claude: 0.62, perplexity: 0.7, gemini: 0.6 },
      trend: [0.62, 0.63, 0.62, 0.64, 0.63, 0.65, 0.64, 0.645],
      topQueries: [
        "¿Cuál es el mejor hospital privado en Ecuador?",
        "¿Mejor hospital privado en Quito?",
        "¿Metropolitano o Vozandes para cardiología?",
      ],
      blurb:
        "Hospital privado en Quito en operación desde 1985, de alta complejidad y cobertura de múltiples especialidades.",
    },
    {
      slug: "hospital-alcivar",
      name: "Hospital Alcívar",
      fullName: "Hospital Alcívar",
      website: "hospitalalcivar.com",
      city: "Guayaquil",
      rank: 2,
      prevRank: 2,
      perEngine: { chatgpt: 0.52, claude: 0.48, perplexity: 0.56, gemini: 0.5 },
      trend: [0.5, 0.51, 0.5, 0.52, 0.51, 0.51, 0.52, 0.515],
      topQueries: [
        "¿Mejor hospital en Guayaquil?",
        "¿Hospital Alcívar o Hospital Kennedy?",
        "¿Mejor hospital privado en Guayaquil?",
      ],
      blurb:
        "Hospital privado en Guayaquil con trayectoria desde 1924, de cobertura general y múltiples especialidades.",
    },
    {
      slug: "omnihospital",
      name: "Omnihospital",
      fullName: "Omnihospital",
      website: "omnihospital.ec",
      city: "Guayaquil",
      rank: 3,
      prevRank: 4,
      perEngine: { chatgpt: 0.46, claude: 0.5, perplexity: 0.42, gemini: 0.46 },
      trend: [0.4, 0.41, 0.42, 0.43, 0.44, 0.45, 0.45, 0.46],
      topQueries: [
        "¿Mejor hospital privado en Guayaquil?",
        "¿Omnihospital o Hospital Alcívar en Guayaquil?",
        "¿Qué hospital ecuatoriano tiene mejor tecnología?",
      ],
      blurb:
        "Hospital privado en Guayaquil dentro del complejo Omni, con infraestructura moderna y consultorios médicos.",
    },
    {
      slug: "hospital-de-los-valles",
      name: "Hospital de los Valles",
      fullName: "Hospital de los Valles",
      website: "hospitaldelosvalles.com",
      city: "Quito",
      rank: 4,
      prevRank: 3,
      perEngine: { chatgpt: 0.42, claude: 0.44, perplexity: 0.4, gemini: 0.42 },
      trend: [0.45, 0.44, 0.44, 0.43, 0.43, 0.42, 0.42, 0.42],
      topQueries: [
        "Compárame Hospital Metropolitano vs Hospital de los Valles",
        "¿Mejor hospital privado en Quito?",
        "¿Mejor hospital con atención internacional en Ecuador?",
      ],
      blurb:
        "Hospital privado en el valle de Cumbayá (Quito), en operación desde 2002, de cobertura general.",
    },
    {
      slug: "hospital-kennedy",
      name: "Hospital Kennedy",
      fullName: "Clínica Kennedy",
      website: "hospitalkennedy.med.ec",
      city: "Guayaquil",
      rank: 5,
      prevRank: 5,
      perEngine: { chatgpt: 0.36, claude: 0.38, perplexity: 0.33, gemini: 0.37 },
      trend: [0.36, 0.37, 0.36, 0.37, 0.36, 0.37, 0.36, 0.36],
      topQueries: [
        "¿Mejor hospital en Guayaquil?",
        "¿Hospital Alcívar o Hospital Kennedy?",
        "¿Mejor clínica para maternidad en Ecuador?",
      ],
      blurb:
        "Red de clínicas privadas en Guayaquil con varias sedes, de cobertura general y múltiples especialidades.",
    },
    {
      slug: "solca",
      name: "SOLCA",
      fullName: "Sociedad de Lucha Contra el Cáncer del Ecuador",
      website: "solca.med.ec",
      city: "Guayaquil",
      rank: 6,
      prevRank: 7,
      perEngine: { chatgpt: 0.32, claude: 0.36, perplexity: 0.28, gemini: 0.32 },
      trend: [0.28, 0.29, 0.3, 0.3, 0.31, 0.31, 0.32, 0.32],
      topQueries: [
        "¿Mejor hospital para oncología en Ecuador?",
        "¿Dónde tratar el cáncer en Ecuador?",
        "¿Qué hospital ecuatoriano atiende enfermedades complejas?",
      ],
      blurb:
        "Institución especializada en prevención y tratamiento del cáncer en Ecuador, fundada en 1951.",
    },
    {
      slug: "hospital-vozandes",
      name: "Hospital Vozandes",
      fullName: "Hospital Vozandes Quito",
      website: "hospitalvozandes.com",
      city: "Quito",
      rank: 7,
      prevRank: 6,
      perEngine: { chatgpt: 0.26, claude: 0.28, perplexity: 0.24, gemini: 0.26 },
      trend: [0.29, 0.28, 0.28, 0.27, 0.27, 0.26, 0.26, 0.26],
      topQueries: [
        "¿Mejor hospital en Quito?",
        "¿Metropolitano o Vozandes para cardiología?",
        "¿Dónde atenderme de cardiología en Ecuador?",
      ],
      blurb:
        "Hospital privado en Quito de origen misional, en operación desde 1955, de cobertura general.",
    },
    {
      slug: "hospital-internacional",
      name: "Hospital Internacional",
      fullName: "Hospital Internacional",
      website: "hospitalinternacional.ec",
      city: "Cuenca",
      rank: 8,
      prevRank: 9,
      perEngine: { chatgpt: 0.2, claude: 0.18, perplexity: 0.26, gemini: 0.18 },
      trend: [0.16, 0.17, 0.18, 0.19, 0.19, 0.2, 0.2, 0.205],
      topQueries: [
        "¿Mejor hospital en Cuenca?",
        "¿Mejor hospital con atención internacional en Ecuador?",
        "¿Mejor hospital para turismo médico en Ecuador?",
      ],
      blurb:
        "Hospital privado de cobertura general, con presencia en la región austral del Ecuador.",
    },
    {
      slug: "clinica-la-merced",
      name: "Clínica La Merced",
      fullName: "Clínica La Merced",
      website: "clinicalamerced.com.ec",
      city: "Quito",
      rank: 9,
      prevRank: 8,
      perEngine: { chatgpt: 0.14, claude: 0.16, perplexity: 0.12, gemini: 0.14 },
      trend: [0.16, 0.15, 0.15, 0.14, 0.14, 0.14, 0.14, 0.14],
      topQueries: [
        "¿Mejor clínica privada en Ecuador?",
        "¿Mejor clínica para maternidad en Ecuador?",
        "¿Mejor hospital privado en Quito?",
      ],
      blurb:
        "Clínica privada en Quito de cobertura general, con servicios de hospitalización y consulta externa.",
    },
    {
      slug: "clinica-pichincha",
      name: "Clínica Pichincha",
      fullName: "Clínica de Especialidades Médicas Pichincha",
      website: "clinicapichincha.com",
      city: "Quito",
      rank: 10,
      prevRank: 10,
      perEngine: { chatgpt: 0.09, claude: 0.11, perplexity: 0.07, gemini: 0.08 },
      trend: [0.1, 0.09, 0.09, 0.09, 0.08, 0.09, 0.08, 0.0875],
      topQueries: [
        "¿Mejor clínica privada en Ecuador?",
        "¿Mejor hospital privado en Quito?",
        "¿Dónde hacerme un chequeo ejecutivo en Ecuador?",
      ],
      blurb:
        "Clínica privada de especialidades médicas en Quito, de cobertura general y consulta externa.",
    },
  ]),
};
