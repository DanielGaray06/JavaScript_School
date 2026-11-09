/**
 * Ejercicio 06 — Función asíncrona (async/await).
 * Simula una consulta a un servidor con Promise + setTimeout.
 */

import { toSource } from '../utils/source.js';

function consultarEstudiante({ nombre, codigo }) {
  // La función devuelve una Promise que se resolverá después de 1.6 segundos.
  return new Promise((resolve, reject) => {
    const esperaMs = 1600;

    setTimeout(() => {
      if (!codigo) {
        reject(new Error('El código estudiantil es obligatorio.'));
        return;
      }

      resolve({
        nombre,
        codigo,
        programa: 'Tecnología en Análisis y Desarrollo de Software',
        promedio: 4.6,
        estado: 'Activo',
        consultadoEn: new Date().toLocaleTimeString('es-CO'),
      });
    }, esperaMs);
  });
}

async function ejecutarConsultaEstudiante(datos) {
  console.log('Antes del await: la interfaz sigue disponible.');

  // await suspende esta función (no el hilo principal) hasta que la Promise se resuelva.
  const estudiante = await consultarEstudiante(datos);

  console.log('Después del await: la promesa se resolvió.');
  return {
    estudiante,
    finalizado: true,
    mensaje: 'Consulta finalizada correctamente.',
  };
}

export const asyncFunction = {
  id: 'async-function',
  number: 6,
  title: 'Consulta asíncrona de un estudiante',
  navTitle: 'Función async',
  structure: 'Asíncrona async/await',
  level: 'Intermedio',
  mode: 'async',
  delayMs: 1600,
  shortDescription:
    'Simula una consulta a un servidor con Promise y setTimeout, usando await y un estado de carga visible.',

  concept: {
    title: 'Esperar sin bloquear',
    text:
      'Una función asíncrona permite ejecutar operaciones que pueden tardar sin bloquear el hilo principal de JavaScript. La palabra async declara la función y hace que siempre devuelva una Promise; await pausa únicamente esa función hasta que la promesa se resuelva o se rechace.',
    bullets: [
      'Una Promise representa un valor que estará disponible ahora, más tarde o nunca.',
      'setTimeout simula el tiempo que tarda un servidor en responder.',
      'await no congela la página: el navegador puede atender clics, animaciones y otras tareas.',
      'Mientras se espera, la interfaz muestra un estado de carga y luego presenta la respuesta.',
      'Si la promesa se rechaza, el error puede capturarse con try/catch.',
    ],
    syntax:
      'async function consultar(codigo) {\n  const respuesta = await simularServidor(codigo);\n  return respuesta;\n}',
  },

  statement:
    'Crear un simulador de consulta de información de un estudiante. Solicitar el nombre y el código estudiantil, simular una consulta a un servidor mediante una Promise y setTimeout, esperar la respuesta con await y mostrar los datos obtenidos junto a un mensaje de finalización. La interfaz debe indicar visualmente que la consulta está en curso.',
  objective:
    'Comprender el ciclo de vida de una Promise, la diferencia entre esperar con await y bloquear el hilo principal, y cómo representar la espera en la interfaz.',
  rules: [
    'El nombre debe tener al menos 2 caracteres.',
    'El código estudiantil es obligatorio (mínimo 3 caracteres).',
    'La consulta simulada tarda 1.6 segundos; durante ese tiempo el botón queda bloqueado y se muestra el estado de carga.',
    'No se usa alert(): el resultado se presenta en el panel.',
  ],
  inputs: ['Nombre del estudiante', 'Código estudiantil'],
  output:
    'Los datos simulados del estudiante (programa, promedio, estado) y la confirmación de que la operación finalizó.',

  fields: [
    {
      name: 'nombre',
      label: 'Nombre del estudiante',
      type: 'text',
      placeholder: 'Ej. Laura Restrepo',
      autocomplete: 'name',
      required: true,
      minLength: 2,
      maxLength: 60,
      help: 'Se incluye en la respuesta simulada.',
    },
    {
      name: 'codigo',
      label: 'Código estudiantil',
      type: 'text',
      placeholder: 'Ej. 2026-0042',
      required: true,
      minLength: 3,
      maxLength: 20,
      help: 'Identificador usado para la consulta.',
    },
  ],

  example: { nombre: 'Laura Restrepo', codigo: '2026-0042' },

  logic: ejecutarConsultaEstudiante,

  toResult(datos) {
    const { estudiante } = datos;

    return {
      ok: true,
      headline: `Consulta finalizada: ${estudiante.nombre} (${estudiante.codigo}).`,
      details: [
        { label: 'Nombre', value: estudiante.nombre },
        { label: 'Código', value: estudiante.codigo },
        { label: 'Programa', value: estudiante.programa },
        { label: 'Promedio', value: estudiante.promedio },
        { label: 'Estado', value: estudiante.estado },
        { label: 'Hora de respuesta', value: estudiante.consultadoEn },
      ],
      notes: [
        'Durante aproximadamente 1.6 segundos la promesa estuvo pendiente. El await pausó la función, pero el navegador siguió respondiendo y mostró el estado de carga.',
        'La promesa se resolvió con resolve(datos) y el valor llegó a la variable estudiante; si el código faltara, se habría usado reject(...).',
      ],
    };
  },

  explain(datos) {
    const { estudiante } = datos;

    return [
      {
        title: 'async convierte el resultado en una Promise',
        text: 'Al declarar ejecutarConsultaEstudiante con async, JavaScript garantiza que siempre devuelva una Promise. Por eso la interfaz puede usar await al invocarla y esperar sin bloquearse.',
      },
      {
        title: 'La promesa y el temporizador',
        text: 'consultarEstudiante creó una Promise y programó un setTimeout de 1600 ms. La promesa quedó en estado pendiente mientras el navegador seguía atendiendo otras tareas.',
      },
      {
        title: 'Qué hace await exactamente',
        text: `await suspendió ejecutarConsultaEstudiante hasta que la promesa se resolvió. En ese momento la función continuó y recibió el objeto de ${estudiante.nombre}, con código ${estudiante.codigo}. El hilo principal nunca se bloqueó: por eso el spinner pudo animarse y el botón pudo deshabilitarse.`,
      },
      {
        title: 'Respuesta y cierre',
        text: `La promesa se resolvió con los datos del estudiante y la función devolvió finalizado: true. La interfaz reemplazó el estado de carga por el resultado: ${datos.mensaje}`,
      },
      {
        title: 'Diferencia con una función síncrona',
        text: 'Una función síncrona devuelve el valor de inmediato y quien la llama se queda esperando dentro de la pila de ejecución. Una función async devuelve una promesa de inmediato y el valor real llega después, cuando el event loop retoma la función en el punto del await.',
      },
    ];
  },

  code: toSource(consultarEstudiante, ejecutarConsultaEstudiante),
};
