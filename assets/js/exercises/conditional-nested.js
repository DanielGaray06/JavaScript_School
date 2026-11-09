/**
 * Ejercicio 03 — Condicional anidado.
 * Primero se comprueba la edad; solo si se cumple, se comprueba la nacionalidad.
 */

import { toSource } from '../utils/source.js';

function verificarAcceso({ edad, nacionalidad }) {
  const nacionalidadRequerida = 'colombiana';
  const nacionalidadNormalizada = String(nacionalidad).trim().toLowerCase();
  let acceso = false;
  let motivo = '';
  let nivelEvaluado = 'primera condición';

  // Primera condición: la edad.
  if (edad >= 18) {
    nivelEvaluado = 'segunda condición (anidada)';

    // Condicional anidado: solo se evalúa si la edad fue suficiente.
    if (nacionalidadNormalizada === nacionalidadRequerida) {
      acceso = true;
      motivo = 'Cumples las dos condiciones: tienes al menos 18 años y la nacionalidad requerida.';
    } else {
      motivo = 'Cumples la edad, pero tu nacionalidad no coincide con la requerida (' + nacionalidadRequerida + ').';
    }
  } else {
    motivo = 'No cumples la primera condición: debes tener al menos 18 años.';
  }

  return {
    edad,
    nacionalidad: nacionalidadNormalizada,
    nacionalidadRequerida,
    acceso,
    motivo,
    nivelEvaluado,
  };
}

export const conditionalNested = {
  id: 'conditional-nested',
  number: 3,
  title: 'Control de acceso con condicionales anidados',
  navTitle: 'Condicional anidado',
  structure: 'Condicional anidado',
  level: 'Intermedio',
  mode: 'sync',
  shortDescription:
    'Verifica primero la edad y, solo si es suficiente, comprueba la nacionalidad dentro de un segundo if anidado.',

  concept: {
    title: 'Decisiones dentro de decisiones',
    text:
      'Un condicional anidado coloca una estructura if dentro de otra. La condición interna solamente se evalúa cuando la condición externa fue verdadera, lo que permite construir reglas jerárquicas y evitar comprobaciones innecesarias.',
    bullets: [
      'La condición externa actúa como un filtro previo.',
      'Si la condición externa es falsa, el bloque interno ni siquiera se evalúa.',
      'Cada nivel puede tener su propio camino de salida y su propio motivo.',
      'La indentación refleja la jerarquía de las reglas.',
    ],
    syntax:
      'if (edad >= 18) {\n  if (nacionalidad === "colombiana") {\n    // ambas condiciones se cumplen\n  }\n}',
  },

  statement:
    'Crear un programa que solicite la edad y la nacionalidad de una persona. Primero debe verificar si tiene 18 años o más; si cumple, debe verificar si tiene la nacionalidad requerida. Solo si ambas condiciones se cumplen se permite el acceso. En caso contrario, se debe mostrar el motivo exacto.',
  objective:
    'Diseñar reglas jerárquicas con if anidados, identificar en qué nivel falla una validación y explicar por qué el bloque interno depende del externo.',
  rules: [
    'La edad debe ser un entero entre 0 y 120.',
    'La nacionalidad se selecciona desde una lista (no se escribe a mano).',
    'La nacionalidad requerida para este ejercicio es colombiana.',
    'El motivo debe indicar cuál de las dos condiciones falló.',
  ],
  inputs: ['Edad', 'Nacionalidad'],
  output: 'Un veredicto de acceso y el motivo asociado al nivel de condición que falló.',

  fields: [
    {
      name: 'edad',
      label: 'Edad (años)',
      type: 'number',
      placeholder: 'Ej. 22',
      min: 0,
      max: 120,
      integer: true,
      required: true,
      help: 'Primera condición: edad >= 18.',
    },
    {
      name: 'nacionalidad',
      label: 'Nacionalidad',
      type: 'select',
      required: true,
      help: 'Segunda condición: debe ser colombiana.',
      options: [
        { value: 'colombiana', label: 'Colombiana' },
        { value: 'venezolana', label: 'Venezolana' },
        { value: 'ecuatoriana', label: 'Ecuatoriana' },
        { value: 'peruana', label: 'Peruana' },
        { value: 'argentina', label: 'Argentina' },
        { value: 'mexicana', label: 'Mexicana' },
        { value: 'espanola', label: 'Española' },
        { value: 'otra', label: 'Otra' },
      ],
    },
  ],

  example: { edad: 22, nacionalidad: 'colombiana' },

  logic: verificarAcceso,

  toResult(datos) {
    return {
      ok: true,
      headline: datos.acceso ? 'Acceso permitido' : 'Acceso denegado',
      details: [
        { label: 'Edad ingresada', value: `${datos.edad} años` },
        { label: 'Nacionalidad ingresada', value: datos.nacionalidad },
        { label: 'Nacionalidad requerida', value: datos.nacionalidadRequerida },
        { label: 'Nivel de condición evaluado', value: datos.nivelEvaluado },
        { label: 'Resultado', value: datos.acceso ? 'Acceso permitido' : 'Acceso denegado' },
      ],
      notes: [datos.motivo],
    };
  },

  explain(datos) {
    const pasos = [
      {
        title: 'Primera condición: la edad',
        text: `Se evaluó ${datos.edad} >= 18. ${
          datos.edad >= 18
            ? 'El resultado fue verdadero, así que el programa entró al bloque externo y pudo evaluar la condición interna.'
            : 'El resultado fue falso. Al no cumplirse la condición externa, el if anidado nunca se evaluó y el programa pasó directamente al bloque else externo.'
        }`,
      },
    ];

    if (datos.edad >= 18) {
      pasos.push({
        title: 'Segunda condición: la nacionalidad',
        text: `Dentro del primer if se comparó "${datos.nacionalidad}" con "${datos.nacionalidadRequerida}". La comparación fue ${datos.acceso ? 'verdadera' : 'falsa'}. ${
          datos.acceso
            ? 'Ambas condiciones se cumplieron y la variable acceso quedó en true.'
            : 'La edad sí era suficiente, pero la nacionalidad no coincidió; por eso se denegó el acceso.'
        }`,
      });
    }

    pasos.push({
      title: 'Jerarquía de las reglas',
      text: 'El segundo if está dentro del primero, de modo que solo tiene sentido comprobar la nacionalidad cuando la persona ya superó el filtro de edad. Esta jerarquía evita evaluar condiciones que dependen de la anterior.',
    });

    pasos.push({
      title: 'Resultado final',
      text: `El motivo registrado fue: "${datos.motivo}". El objeto devuelto incluye el nivel evaluado (${datos.nivelEvaluado}) para que la interfaz pueda explicar exactamente dónde se tomó la decisión.`,
    });

    return pasos;
  },

  code: toSource(verificarAcceso),
};
