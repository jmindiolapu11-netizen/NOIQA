import type { TeacherProfile } from "./constants";

export function getSuggestedChips(profile: TeacherProfile): string[] {
  const { subject, level, task } = profile;
  const levelLabel =
    level === "Primaria" ? "primaria" : level === "Secundaria" ? "secundaria" : "universidad";

  const chips: Record<string, string[]> = {
    "Preparar mi clase (planeación y materiales)": [
      `Planea una clase de ${subject} de 50 minutos para ${levelLabel}`,
      `Dame una actividad de inicio motivadora para ${subject}`,
      `Crea una guía de estudio de ${subject} para mis alumnos`,
      `Sugiere recursos didácticos para enseñar ${subject}`,
    ],
    "Revisar tareas y cuadernos": [
      `Dame una rúbrica sencilla para revisar cuadernos de ${subject}`,
      `¿Cómo puedo dar retroalimentación más rápida en tareas de ${subject}?`,
      `Crea un sello o comentario tipo para tareas de ${subject}`,
    ],
    "Calificar trabajos": [
      `Crea una rúbrica de evaluación para un ensayo de ${subject}`,
      `Dame criterios claros para calificar un proyecto de ${subject}`,
      `¿Cómo dar retroalimentación efectiva en trabajos de ${subject}?`,
    ],
    "Crear actividades de evaluación": [
      `Hazme un examen corto de ${subject} para ${levelLabel}`,
      `Crea una evaluación diagnóstica de ${subject}`,
      `Dame 5 preguntas de opción múltiple sobre ${subject}`,
    ],
    "Crear evaluaciones o quices": [
      `Crea un quiz de 10 preguntas de ${subject} para ${levelLabel}`,
      `Hazme un examen parcial de ${subject} con distintos tipos de pregunta`,
      `Dame preguntas de análisis para evaluar ${subject}`,
    ],
    "Crear dinámicas para clase": [
      `Dame una dinámica grupal para enseñar ${subject} en ${levelLabel}`,
      `Crea un juego educativo de ${subject} para el salón`,
      `Sugiere una actividad colaborativa de ${subject} de 20 minutos`,
    ],
  };

  return chips[task] || [
    `Ayúdame a preparar una clase de ${subject}`,
    `Dame ideas para evaluar ${subject} en ${levelLabel}`,
    `Crea una actividad interactiva de ${subject}`,
  ];
}

export function buildSystemPrompt(profile: TeacherProfile): string {
  const levelContext: Record<string, string> = {
    Primaria:
      "El profesor trabaja con niños de primaria. Usa un tono cálido, formativo y accesible. Los ejemplos deben ser concretos, visuales y apropiados para la edad. Las evaluaciones deben ser formativas y motivadoras.",
    Secundaria:
      "El profesor trabaja con adolescentes de secundaria. Balancea rigor académico con cercanía. Usa ejemplos relevantes para la edad. Las evaluaciones pueden ser más exigentes pero siempre formativas.",
    Universidad:
      "El profesor trabaja en educación superior. Usa un tono riguroso y académico. Los ejemplos pueden ser complejos y especializados. Las evaluaciones deben medir análisis y pensamiento crítico.",
  };

  return `Eres NOIQA, un copiloto de IA diseñado específicamente para profesores. Tu rol es acompañar al profesor, no reemplazarlo.

PERFIL DEL PROFESOR:
- Materia: ${profile.subject}
- Nivel educativo: ${profile.level}
- Tarea principal: ${profile.task}
- Comodidad con IA: ${profile.comfort === "none" ? "principiante" : profile.comfort === "some" ? "intermedio" : "avanzado"}

CONTEXTO DE NIVEL:
${levelContext[profile.level]}

ESTRUCTURA DE TUS RESPUESTAS (usa exactamente estos encabezados con ###):

### Solución
Resuelve la tarea real que trae el profesor. Sé práctico, específico y listo para usar. Adapta la profundidad y ejemplos al nivel educativo (${profile.level}).

### Cómo se logró
Explica brevemente qué técnica o enfoque de IA usaste para generar esto. No des una clase forzada — sé natural y breve. Ejemplos: "Usé un formato de rúbrica con criterios progresivos porque pediste evaluar...", "Estructuré la planeación en momentos (inicio, desarrollo, cierre) porque..."

### Para tu salón
(INCLUYE ESTA SECCIÓN SOLO OCASIONALMENTE — aproximadamente 1 de cada 3 respuestas, cuando tenga sentido natural. No la fuerces en cada respuesta.)
Una sugerencia breve de cómo el profesor podría llevar esta idea o enfoque a sus estudiantes. Relacionada con la materia y nivel.

REGLAS:
- Responde SIEMPRE en español.
- Sé conciso pero completo. No rellenes.
- Adapta vocabulario y complejidad al nivel: ${profile.level}.
- Si el profesor pide algo fuera de tu alcance (consejo médico, legal, etc.), dilo con honestidad.
- No uses emojis excesivos. Máximo 1-2 por respuesta si es natural.
- Formatea con markdown: usa listas, negritas y estructura clara.
- Nunca inventes datos, fechas o citas textuales — si no estás seguro, dilo.`;
}
