/**
 * Ejercicio 02 — Condicional simple (if).
 * La lógica no usa else: el mensaje negativo vive fuera del if.
 */

import { toSource } from '../utils/source.js';

function evaluarMayoriaDeEdad({ edad }) {
  // Mensaje que se muestra cuando la condición del if NO se cumple.
  let mensaje = 'Con ' + edad + ' años no cumples la condición (edad >= 18).';
  let bloqueIfEjecutado = false;

  // Condicional simple: el bloque solo se ejecuta si la condición es verdadera.
  if (edad >= 18) {
    bloqueIfEjecutado = true;
    mensaje = 'Con ' + edad + ' años eres mayor de edad.';
  }

  return {
    edad,
    condicion: edad >= 18,
    bloqueIfEjecutado,
    mensaje,
  };
}

export const conditionalSimple = {
  id: 'conditional-simple',
  number: 2,
  title: 'Mayoría de edad con un condicional simple',
  navTitle: 'Condicional simple',
  structure: 'Condicional if',
  level: 'Básico',
  mode: 'sync',
  shortDescription:
    'Evalúa una única condición (edad >= 18) y ejecuta el bloque if solamente cuando el resultado es verdadero.',

  concept: {
    title: 'Ejecutar solo si se cumple',
    text:
      'Un condicional simple utiliza la palabra reservada if para ejecutar un bloque de instrucciones únicamente cuando una condición es verdadera. Si la condición es falsa, el bloque se omite y el programa continúa con la instrucción siguiente.',
    bullets: [
      'La condición es una expresión que JavaScript evalúa como true o false.',
      'Las llaves { } delimitan el bloque que puede ejecutarse o no.',
      'Si la condición es falsa, el bloque if no se ejecuta en absoluto.',
      'Un mensaje de "no cumple" puede estar fuera del if, como en este ejercicio.',
    ],
    syntax: 'if (edad >= 18) {\n  // solo se ejecuta si edad >= 18 es true\n  console.log("Mayor de edad");\n}',
  },

  statement:
    'Solicitar al usuario su edad y determinar si es mayor o igual a 18 años. Si la condición se cumple, mostrar que es mayor de edad. Si no se cumple, el bloque del if no debe ejecutarse y se debe mostrar un mensaje indicando que la condición no se cumplió.',
  objective:
    'Interpretar el flujo de un if, comprobar el valor booleano de una condición y distinguir entre código que se ejecuta siempre y código que depende de la condición.',
  rules: [
    'La edad debe ser un número entero entre 0 y 120.',
    'El bloque if solo se ejecuta con edades de 18 años o más.',
    'El mensaje negativo se construye antes del if y se muestra aunque el bloque no se ejecute.',
  ],
  inputs: ['Edad de la persona'],
  output:
    'Un mensaje que indica si se ejecutó el bloque if y cuál es la conclusión sobre la mayoría de edad.',

  fields: [
    {
      name: 'edad',
      label: 'Edad (años)',
      type: 'number',
      placeholder: 'Ej. 17',
      min: 0,
      max: 120,
      integer: true,
      required: true,
      fullWidth: true,
      help: 'Prueba con 17 y con 18 para comparar ambos caminos.',
    },
  ],

  example: { edad: 20 },

  logic: evaluarMayoriaDeEdad,

  toResult(datos) {
    return {
      ok: true,
      headline: datos.mensaje,
      details: [
        { label: 'Edad ingresada', value: `${datos.edad} años` },
        { label: 'Condición evaluada', value: `${datos.edad} >= 18` },
        { label: 'Resultado de la condición', value: datos.condicion },
        { label: '¿Se ejecutó el bloque if?', value: datos.bloqueIfEjecutado },
      ],
      notes: [
        datos.bloqueIfEjecutado
          ? 'La condición fue verdadera, por lo que las instrucciones dentro del if se ejecutaron y reemplazaron el mensaje inicial.'
          : 'La condición fue falsa: JavaScript omitió por completo el bloque if y conservó el mensaje que estaba definido antes.',
      ],
    };
  },

  explain(datos) {
    return [
      {
        title: 'Valor inicial y condición',
        text: `La variable mensaje comenzó con el texto negativo. Luego se evaluó la expresión ${datos.edad} >= 18, que produjo ${datos.condicion}.`,
      },
      {
        title: datos.bloqueIfEjecutado ? 'La condición se cumplió' : 'La condición no se cumplió',
        text: datos.bloqueIfEjecutado
          ? `Como el resultado fue true, se entró al bloque if, se marcó bloqueIfEjecutado = true y se reemplazó el mensaje por la versión de mayor de edad.`
          : `Como el resultado fue false, el bloque if se ignoró por completo. Ninguna de sus instrucciones se ejecutó y el mensaje negativo siguió intacto.`,
      },
      {
        title: 'Una sola decisión',
        text: 'No hay un else ni un segundo if: únicamente existe una condición. Esto hace que el flujo sea fácil de leer y de predecir.',
      },
      {
        title: 'Salida',
        text: `La función devolvió el mensaje junto con el detalle de la condición (${datos.condicion}) y del bloque (${datos.bloqueIfEjecutado}), para que puedas verificar qué camino tomó el programa.`,
      },
    ];
  },

  code: toSource(evaluarMayoriaDeEdad),
};
