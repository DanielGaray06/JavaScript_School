/**
 * Ejercicio 04 — Estructura repetitiva for.
 * Genera la tabla de multiplicar del 1 al 10.
 */

import { toSource } from '../utils/source.js';

function generarTablaMultiplicar({ numero }) {
  const filas = [];

  // for: inicialización, condición y actualización en una sola línea.
  for (let factor = 1; factor <= 10; factor = factor + 1) {
    const producto = numero * factor;
    filas.push({
      factor,
      producto,
      expresion: numero + ' × ' + factor + ' = ' + producto,
    });
  }

  return {
    numero,
    filas,
    iteraciones: filas.length,
  };
}

export const forLoop = {
  id: 'for-loop',
  number: 4,
  title: 'Tabla de multiplicar con un ciclo for',
  navTitle: 'Ciclo for',
  structure: 'Repetitiva for',
  level: 'Básico',
  mode: 'sync',
  shortDescription:
    'Repite exactamente diez veces un bloque para construir la tabla de multiplicar del número ingresado.',

  concept: {
    title: 'Repetir un número conocido de veces',
    text:
      'La estructura for permite repetir un bloque de instrucciones un número determinado de veces. Reúne en una sola línea la inicialización del contador, la condición que debe cumplirse para continuar y la actualización que se aplica al final de cada vuelta.',
    bullets: [
      'La inicialización ocurre una sola vez, antes de la primera iteración.',
      'La condición se evalúa antes de cada vuelta; si es falsa, el ciclo termina.',
      'La actualización se ejecuta después del cuerpo de cada iteración.',
      'Es ideal cuando se conoce de antemano la cantidad de repeticiones.',
    ],
    syntax: 'for (let i = 1; i <= 10; i++) {\n  console.log(numero * i);\n}',
  },

  statement:
    'Solicitar al usuario un número entero positivo y mostrar su tabla de multiplicar desde 1 hasta 10 utilizando un ciclo for que recorra exactamente ese rango.',
  objective:
    'Controlar las tres partes del for (inicio, condición y actualización), observar el valor del contador en cada iteración y acumular resultados en una colección.',
  rules: [
    'El número debe ser un entero positivo entre 1 y 1000.',
    'El ciclo debe recorrer los factores del 1 al 10, ambos incluidos.',
    'Cada fila de la tabla debe mostrar la operación y su resultado.',
  ],
  inputs: ['Número entero positivo'],
  output: 'La tabla de multiplicar completa, con una fila por cada factor del 1 al 10.',

  fields: [
    {
      name: 'numero',
      label: 'Número base',
      type: 'number',
      placeholder: 'Ej. 7',
      min: 1,
      max: 1000,
      integer: true,
      required: true,
      fullWidth: true,
      help: 'Se multiplicará por los factores del 1 al 10.',
    },
  ],

  example: { numero: 7 },

  logic: generarTablaMultiplicar,

  toResult(datos) {
    return {
      ok: true,
      headline: `Tabla del ${datos.numero} generada con ${datos.iteraciones} iteraciones del for.`,
      details: [
        { label: 'Número base', value: datos.numero },
        { label: 'Factor inicial', value: 1 },
        { label: 'Factor final', value: 10 },
        { label: 'Iteraciones ejecutadas', value: datos.iteraciones },
        { label: 'Último producto', value: datos.numero * 10 },
      ],
      table: {
        caption: `Tabla de multiplicar del ${datos.numero}`,
        headers: ['Factor', 'Operación', 'Resultado'],
        rows: datos.filas.map((fila) => [fila.factor, `${datos.numero} × ${fila.factor}`, fila.producto]),
      },
      notes: [
        'El contador factor tomó los valores 1, 2, 3… hasta 10. Al intentar valer 11, la condición factor <= 10 dejó de cumplirse y el ciclo terminó.',
      ],
    };
  },

  explain(datos) {
    return [
      {
        title: 'Inicialización del contador',
        text: 'Antes de la primera vuelta, el for ejecutó let factor = 1. Esa instrucción ocurre una sola vez y crea la variable que controla el ciclo.',
      },
      {
        title: 'Condición antes de cada iteración',
        text: 'En cada vuelta se comprobó factor <= 10. Mientras el contador estuvo entre 1 y 10, el bloque se ejecutó; cuando llegó a 11, la condición fue falsa y el ciclo se detuvo.',
      },
      {
        title: 'Cuerpo y acumulación',
        text: `Dentro del bloque se calculó ${datos.numero} × factor y se guardó un objeto con el factor, el producto y la expresión. Se acumularon ${datos.iteraciones} filas en el arreglo filas.`,
      },
      {
        title: 'Actualización y salida',
        text: 'Después de cada vuelta se ejecutó factor = factor + 1. El resultado se devuelve como una tabla lista para mostrar; el for no sabe nada de HTML, solo produce datos.',
      },
    ];
  },

  code: toSource(generarTablaMultiplicar),
};
