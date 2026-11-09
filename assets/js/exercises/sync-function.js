/**
 * Ejercicio 07 — Función síncrona (sin async/await).
 * Calculadora con return inmediato y protección de la división entre cero.
 */

import { toSource } from '../utils/source.js';
import { formatNumber } from '../utils/html.js';

function calcularOperacion({ primerNumero, segundoNumero, operacion }) {
  const operacionesValidas = ['suma', 'resta', 'multiplicacion', 'division'];

  if (!operacionesValidas.includes(operacion)) {
    throw new Error('La operación "' + operacion + '" no está soportada.');
  }

  const operaciones = {
    suma: (a, b) => a + b,
    resta: (a, b) => a - b,
    multiplicacion: (a, b) => a * b,
    division: (a, b) => {
      if (b === 0) {
        throw new Error('No es posible dividir entre cero.');
      }
      return a / b;
    },
  };

  const resultado = operaciones[operacion](primerNumero, segundoNumero);

  return {
    primerNumero,
    segundoNumero,
    operacion,
    resultado,
  };
}

const ETIQUETAS = {
  suma: 'suma',
  resta: 'resta',
  multiplicacion: 'multiplicación',
  division: 'división',
};

const SIMBOLOS = {
  suma: '+',
  resta: '−',
  multiplicacion: '×',
  division: '÷',
};

export const syncFunction = {
  id: 'sync-function',
  number: 7,
  title: 'Calculadora con una función síncrona',
  navTitle: 'Función síncrona',
  structure: 'Síncrona (return)',
  level: 'Básico',
  mode: 'sync',
  shortDescription:
    'Una función normal recibe dos números y una operación, calcula con return inmediato y protege la división entre cero.',

  concept: {
    title: 'Resultado disponible de inmediato',
    text:
      'Una función síncrona ejecuta sus instrucciones de forma secuencial. Quien la llama espera a que termine y recibe el valor devuelto por return en la misma línea de ejecución. No hay promesas ni esperas: el resultado está listo antes de pasar a la siguiente instrucción.',
    bullets: [
      'Los parámetros son los datos que recibe la función.',
      'return entrega un valor y finaliza la ejecución de la función.',
      'Una función puede lanzar una excepción con throw cuando recibe datos inválidos.',
      'El resultado se obtiene sin await, porque no existe una operación pendiente.',
    ],
    syntax:
      'function sumar(a, b) {\n  return a + b;\n}\n\nconst total = sumar(2, 3); // 5, disponible de inmediato',
  },

  statement:
    'Crear una calculadora de operaciones matemáticas que reciba dos números y una operación (suma, resta, multiplicación o división). La función debe realizar el cálculo y devolver el resultado mediante return. Debe validarse que no se divida entre cero.',
  objective:
    'Escribir una función normal con parámetros y return, separar la selección de la operación del cálculo y proteger un caso límite con una excepción controlada.',
  rules: [
    'Se admiten números enteros y decimales (usa punto o coma).',
    'La división entre cero se bloquea antes de llamar a la función y también dentro de ella.',
    'El resultado se obtiene de forma inmediata: la función no es async.',
    'Cualquier operación fuera de la lista se rechaza con una excepción.',
  ],
  inputs: ['Primer número', 'Segundo número', 'Operación matemática'],
  output: 'El resultado numérico de la operación y la expresión completa que se evaluó.',

  fields: [
    {
      name: 'primerNumero',
      label: 'Primer número',
      type: 'number',
      placeholder: 'Ej. 24',
      step: 'any',
      min: -1000000,
      max: 1000000,
      required: true,
      help: 'Acepta decimales.',
    },
    {
      name: 'segundoNumero',
      label: 'Segundo número',
      type: 'number',
      placeholder: 'Ej. 6',
      step: 'any',
      min: -1000000,
      max: 1000000,
      required: true,
      help: 'No puede ser 0 si eliges división.',
    },
    {
      name: 'operacion',
      label: 'Operación',
      type: 'select',
      required: true,
      fullWidth: true,
      help: 'La función resuelve la operación mediante un mapa de funciones.',
      options: [
        { value: 'suma', label: 'Suma (+)' },
        { value: 'resta', label: 'Resta (−)' },
        { value: 'multiplicacion', label: 'Multiplicación (×)' },
        { value: 'division', label: 'División (÷)' },
      ],
    },
  ],

  example: { primerNumero: 24, segundoNumero: 6, operacion: 'division' },

  validate(values) {
    const errors = {};
    if (values.operacion === 'division' && values.segundoNumero === 0) {
      errors.segundoNumero = 'No se puede dividir entre cero. Cambia el segundo número o elige otra operación.';
    }
    return errors;
  },

  logic: calcularOperacion,

  toResult(datos) {
    const etiqueta = ETIQUETAS[datos.operacion] ?? datos.operacion;
    const simbolo = SIMBOLOS[datos.operacion] ?? '?';

    return {
      ok: true,
      headline: `El resultado de la ${etiqueta} es ${formatNumber(datos.resultado)}.`,
      details: [
        { label: 'Operación', value: etiqueta },
        { label: 'Expresión evaluada', value: `${datos.primerNumero} ${simbolo} ${datos.segundoNumero}` },
        { label: 'Resultado', value: datos.resultado },
        { label: 'Tipo de retorno', value: typeof datos.resultado },
        { label: 'Ejecución', value: 'Síncrona: valor disponible de inmediato' },
      ],
      notes: [
        'La función no devuelve una promesa: devuelve un número. Por eso la interfaz recibe el resultado sin usar await.',
        datos.operacion === 'division'
          ? 'La división comprobó b === 0 antes de dividir. Si el divisor fuera 0, la función lanzaría una excepción en lugar de producir Infinity.'
          : 'La operación se seleccionó desde un objeto de funciones; la estructura if del divisor solo se activa en la división.',
      ],
    };
  },

  explain(datos) {
    const etiqueta = ETIQUETAS[datos.operacion] ?? datos.operacion;
    const simbolo = SIMBOLOS[datos.operacion] ?? '?';

    return [
      {
        title: 'Recepción de parámetros',
        text: `La función recibió primerNumero = ${datos.primerNumero}, segundoNumero = ${datos.segundoNumero} y operacion = "${datos.operacion}". No hay await: los tres valores están disponibles desde el primer instante.`,
      },
      {
        title: 'Selección de la operación',
        text: `Primero se verificó que "${datos.operacion}" estuviera en la lista de operaciones válidas. Luego se eligió la función correspondiente dentro del objeto operaciones y se invocó con los dos números.`,
      },
      {
        title: 'Cálculo y return',
        text: `Se evaluó ${datos.primerNumero} ${simbolo} ${datos.segundoNumero} = ${datos.resultado}. Ese valor se guardó en resultado y se devolvió dentro de un objeto mediante return, junto con los datos originales.`,
      },
      {
        title: 'Por qué es síncrona',
        text: 'El flujo se ejecutó de principio a fin en la misma pila de llamadas. La instrucción que invoca la función recibe el valor de retorno inmediatamente, sin promesas ni callbacks. El tiempo medido en el panel es de fracciones de milisegundo porque no hay espera simulada.',
      },
      {
        title: 'Protección de la división',
        text: 'Si la operación era división, se ejecutó la comprobación if (b === 0) antes de dividir. Esa validación evita resultados infinitos y demuestra el uso de throw para errores controlados.',
      },
    ];
  },

  code: toSource(calcularOperacion),
};
