export const SUBJECTS = [
  "Matemáticas",
  "Lenguaje/Español",
  "Inglés",
  "Ciencias Sociales",
  "Ciencias Naturales/Biología",
  "Historia y Geografía",
  "Química",
  "Física",
  "Artística/Educación Artística",
  "Tecnología e Informática",
] as const;

export const LEVELS = ["Primaria", "Secundaria", "Universidad"] as const;

export type Level = (typeof LEVELS)[number];

export function getTaskOptions(level: Level) {
  const isPrimaria = level === "Primaria";
  return [
    "Preparar mi clase (planeación y materiales)",
    isPrimaria ? "Revisar tareas y cuadernos" : "Calificar trabajos",
    isPrimaria
      ? "Crear actividades de evaluación"
      : "Crear evaluaciones o quices",
    "Crear dinámicas para clase",
  ] as const;
}

export const COMFORT_LEVELS = [
  { value: "none", label: "Nada cómodo", description: "Nunca he usado IA o casi nada" },
  { value: "some", label: "Algo cómodo", description: "He probado ChatGPT u otras herramientas" },
  { value: "very", label: "Muy cómodo", description: "Uso IA regularmente en mi trabajo" },
] as const;

export const SKILLS = [
  {
    id: "specific",
    title: "Ser específico",
    subtitle: "qué, para quién, cuánto",
    description:
      'Aprende a dar instrucciones claras. No es lo mismo "hazme una actividad de matemáticas" que "...sobre fracciones, para 4to de primaria, de 15 minutos".',
    example: {
      bad: "Hazme una actividad de matemáticas",
      good: "Hazme una actividad sobre fracciones equivalentes para 4to de primaria, que dure 15 minutos y use material concreto",
    },
  },
  {
    id: "iterate",
    title: "Iterar en vez de reiniciar",
    subtitle: "ajustes puntuales",
    description:
      "En vez de empezar de cero cada vez, pide ajustes específicos sobre lo que ya tienes. Ahorras tiempo y llegas a mejores resultados.",
    example: {
      bad: "No me gustó, hazme otra actividad completamente diferente",
      good: "Me gusta la estructura, pero hazla más corta (10 min) y agrega un ejemplo resuelto al inicio",
    },
  },
  {
    id: "role",
    title: "Darle un rol a la IA",
    subtitle: "perspectiva y experiencia",
    description:
      'Cuando le das un rol, la IA ajusta su tono y profundidad. "Actúa como un profesor con 20 años de experiencia en primaria" cambia completamente la respuesta.',
    example: {
      bad: "Dame retroalimentación sobre este ensayo",
      good: "Actúa como un profesor de literatura con 20 años de experiencia. Dame retroalimentación constructiva sobre este ensayo de un alumno de 3ro de secundaria",
    },
  },
  {
    id: "verify",
    title: "Verificar antes de confiar",
    subtitle: "pensamiento crítico",
    description:
      "La IA puede generar información incorrecta con total confianza. Siempre revisa datos, fechas y conceptos clave antes de usar el material con tus estudiantes.",
    example: {
      bad: "Confiar en que todos los datos históricos son correctos",
      good: "Revisar las fechas y nombres propios, cruzar con tu libro de texto, y probar los ejercicios de matemáticas tú mismo",
    },
  },
  {
    id: "options",
    title: "Pedir varias opciones",
    subtitle: "comparar antes de elegir",
    description:
      "No te quedes con la primera respuesta. Pide 2 o 3 versiones diferentes y elige la que mejor se adapte a tu grupo.",
    example: {
      bad: "Hazme un examen de ciencias",
      good: "Dame 3 versiones diferentes de un examen de ciencias sobre el sistema solar: una con opción múltiple, una con preguntas abiertas, y una mixta",
    },
  },
  {
    id: "differentiate",
    title: "Diferenciar para tu grupo",
    subtitle: "múltiples ritmos",
    description:
      "Pide versiones de la misma actividad para distintos niveles dentro del mismo salón. Esto te ahorra horas de adaptación manual.",
    example: {
      bad: "Hazme una actividad para todos",
      good: "Hazme la misma actividad de lectura en 3 niveles: uno para alumnos que van adelantados, uno estándar, y uno con apoyo extra para quienes necesitan más andamiaje",
    },
  },
  {
    id: "when-not",
    title: "Saber cuándo NO usar IA",
    subtitle: "criterio propio",
    description:
      "Hay momentos donde tu experiencia y conocimiento de tus estudiantes es insustituible. Reconocer esos momentos es una habilidad clave.",
    example: {
      bad: "Pedirle a la IA que decida cómo manejar una situación emocional de un alumno",
      good: "Usar tu criterio profesional para situaciones socioemocionales, adaptaciones individuales que requieren conocer al alumno, y decisiones pedagógicas de fondo",
    },
  },
  {
    id: "future",
    title: "Mirar hacia dónde va la IA",
    subtitle: "reflexión y futuro",
    description:
      "La IA en educación evoluciona rápido. Mantente al día con cómo puede transformar específicamente tu materia, sin perder de vista lo esencial de enseñar.",
    example: {
      bad: "Ignorar los cambios o adoptarlos todos sin criterio",
      good: "Reflexionar periódicamente: ¿qué tareas de mi materia puede hacer mejor la IA? ¿Qué habilidades debo reforzar en mis alumnos porque la IA no las desarrolla?",
    },
  },
] as const;

export type TeacherProfile = {
  subject: string;
  level: Level;
  task: string;
  comfort: string;
};

export function isValidProfile(profile: TeacherProfile | null): profile is TeacherProfile {
  if (!profile) return false;
  const { subject, level, task, comfort } = profile;

  const validSubjects = [...SUBJECTS];
  const isValidSubject = validSubjects.includes(subject as typeof SUBJECTS[number]) || (subject && subject.length > 0);

  const isValidLevel = (LEVELS as readonly string[]).includes(level);
  if (!isValidLevel) return false;

  const validTasks = getTaskOptions(level as Level).map(String);
  const isValidTask = validTasks.includes(task);

  const isValidComfort = COMFORT_LEVELS.some((c) => c.value === comfort);

  return !!isValidSubject && isValidTask && isValidComfort;
}
