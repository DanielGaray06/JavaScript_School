/**
 * Ejercicio 05 — Estructura repetitiva while.
 *
 * La interfaz captura números sucesivos (como si respondieras varios prompt)
 * y la lógica los procesa con while hasta encontrar el centinela 0.
 */

import { toSource } from '../utils/source.js';

function procesarSecuenciaDeNumeros({ numeros }) {
  let indice = 0;
  let suma = 0;
  let contador = 0;
  let encontroCero = false;
  const recorrido = [];

  // while: se repite mientras haya números y no se haya encontrado el centinela.
  while (indice < numeros.length) {
    const actual = numeros[indice];
    indice = indice + 1;

    if (actual === 0) {
      encontroCero = true;
      break;
    }

    suma = suma + actual;
    contador = contador + 1;
    recorrido.push({ numero: actual, suma, contador });
  }

  return {
    suma,
    contador,
    encontroCero,
    recorrido,
    restantes: numeros.length - indice,
  };
}

export const whileLoop = {
  id: 'while-loop',
  number: 5,
  title: 'Suma acumulada hasta ingresar cero',
  navTitle: 'Ciclo while',
  structure: 'Repetitiva while',
  level: 'Intermedio',
  mode: 'sync',
  shortDescription:
    'Acumula números y cuenta cuántos se ingresaron. El ciclo termina cuando aparece el 0 o cuando se agotan los datos.',

  concept: {
    title: 'Repetir mientras se cumpla una condición',
    text:
      'La estructura while ejecuta un bloque de instrucciones mientras una condición sea verdadera. Es útil cuando no se sabe de antemano cuántas repeticiones serán necesarias y la salida depende de los datos, como ocurre con un valor centinela.',
    bullets: [
      'La condición se evalúa antes de cada iteración.',
      'Si la condición es falsa desde el inicio, el bloque no se ejecuta nunca.',
      'Un break permite abandonar el ciclo antes de que la condición se vuelva falsa.',
      'El 0 actúa como centinela: indica el final de la entrada y no se suma ni se cuenta.',
      'La lista de números del formulario simula las respuestas sucesivas: el while las recorre en orden.',
    ],
    syntax: 'let suma = 0;\nwhile (numero !== 0) {\n  suma = suma + numero;\n  // pedir el siguiente número\n}',
  },

  statement:
    'Crear un programa que solicite números hasta que la persona ingrese 0. Debe acumular la suma de los números ingresados, contar cuántos fueron (sin contar el cero) y finalizar el ciclo al recibir el 0. Al terminar, debe mostrar la cantidad y la suma total.',
  objective:
    'Diseñar un ciclo controlado por datos, usar un valor centinela para terminarlo y mantener variables acumuladoras correctamente inicializadas.',
  rules: [
    'Agrega los números uno por uno; cada uno representa una respuesta del usuario.',
    'El 0 detiene el ciclo y no se suma ni se cuenta.',
    'Los números posteriores al 0 no se procesan.',
    'Si la lista termina sin 0, el ciclo finaliza porque ya no hay datos.',
  ],
  inputs: ['Secuencia de números enteros (uno por uno)'],
  output:
    'Cantidad de números procesados, suma total y el detalle de cada iteración del while.',

  fields: [
    {
      name: 'numeros',
      label: 'Números ingresados',
      type: 'number-list',
      placeholder: 'Ej. 12',
      min: -1000,
      max: 1000,
      integer: true,
      maxItems: 50,
      help: 'Agrega varios números y escribe 0 para simular el final del ciclo.',
    },
  ],

  example: { numeros: [12, 7, 5, 0, 99] },

  logic: procesarSecuenciaDeNumeros,

  toResult(datos) {
    const notes = [
      'El 0 funciona como centinela: se detecta dentro del while, activa break y nunca entra a la suma ni al contador.',
    ];

    if (!datos.encontroCero) {
      notes.push(
        'La secuencia terminó sin un 0. El while se detuvo porque el índice alcanzó el final de la lista de datos.',
      );
    } else if (datos.restantes > 0) {
      notes.push(
        `Quedaron ${datos.restantes} número(s) después del 0: no se procesaron porque el break salió del ciclo inmediatamente.`,
      );
    }

    const headline =
      datos.contador === 0
        ? 'El ciclo terminó de inmediato: el primer número fue 0.'
        : `Se procesaron ${datos.contador} número(s) y la suma total fue ${datos.suma}.`;

    return {
      ok: true,
      headline,
      details: [
        { label: 'Números procesados (sin contar el 0)', value: datos.contador },
        { label: 'Suma total', value: datos.suma },
        { label: '¿Se ingresó el centinela 0?', value: datos.encontroCero },
        { label: 'Números ignorados después del 0', value: datos.restantes },
      ],
      table: {
        caption: 'Recorrido del ciclo while',
        headers: ['Iteración', 'Número', 'Suma acumulada', 'Contador'],
        rows: datos.recorrido.map((paso, index) => [index + 1, paso.numero, paso.suma, paso.contador]),
      },
      notes,
    };
  },

  explain(datos) {
    const pasos = [
      {
        title: 'Inicialización antes del while',
        text: 'Se crearon cuatro variables: indice = 0, suma = 0, contador = 0 y encontroCero = false. El arreglo recorrido quedó vacío. Sin esta inicialización, acumular sería imposible.',
      },
      {
        title: 'Condición del ciclo',
        text: 'Antes de cada vuelta se comprobó indice < numeros.length. Mientras hubo un número pendiente, el bloque se ejecutó; cuando el índice llegó al final, la condición fue falsa y el while terminó.',
      },
      {
        title: 'Acumulación y centinela',
        text: `Se procesaron ${datos.contador} número(s) y la suma llegó a ${datos.suma}. ${
          datos.encontroCero
            ? 'Al encontrar el 0 se activó break: ese valor no se sumó ni aumentó el contador, y el ciclo se abandonó de inmediato.'
            : 'No se encontró un 0, así que el ciclo se agotó al recorrer toda la lista de datos.'
        }`,
      },
      {
        title: 'Por qué while y no for',
        text: 'No sabíamos cuántas vueltas serían necesarias: la salida depende del valor centinela. El while expresa esa idea de forma natural, mientras que un for se usa cuando la cantidad de repeticiones se conoce de antemano.',
      },
    ];

    return pasos;
  },

  code: toSource(procesarSecuenciaDeNumeros),
};
