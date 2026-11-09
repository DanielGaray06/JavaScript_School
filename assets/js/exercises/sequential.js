/**
 * Ejercicio 01 — Estructura secuencial.
 *
 * Lógica pura: recibe datos ya validados y devuelve cálculos.
 * No conoce el DOM ni los mensajes de la interfaz.
 */

import { toSource } from '../utils/source.js';

function analizarDatosPersonales({ nombre, edad, anioNacimiento, anioActual = new Date().getFullYear() }) {
  // Estructura secuencial: cada instrucción se ejecuta una sola vez, de arriba hacia abajo.
  const aniosParaCien = 100 - edad;
  const anioCumpleCien = anioNacimiento + 100;
  const anioSegunEdad = anioActual + aniosParaCien;
  const diferencia = Math.abs(anioCumpleCien - anioSegunEdad);
  const mensaje = 'Hola, ' + nombre + '. Te faltan ' + aniosParaCien + ' años para cumplir 100.';

  return {
    nombre,
    edad,
    anioNacimiento,
    anioActual,
    aniosParaCien,
    anioCumpleCien,
    anioSegunEdad,
    diferencia,
    mensaje,
  };
}

export const sequential = {
  id: 'sequential',
  number: 1,
  title: 'Ficha personal y año en que cumplirás 100',
  navTitle: 'Estructura secuencial',
  structure: 'Secuencial',
  level: 'Básico',
  mode: 'sync',
  shortDescription:
    'Lee nombre, edad y año de nacimiento; calcula los años que faltan para los 100 y el año aproximado en que llegarás.',

  concept: {
    title: 'Una instrucción detrás de otra',
    text:
      'Una estructura secuencial ejecuta las instrucciones en el orden en que aparecen, de arriba hacia abajo. No hay decisiones ni repeticiones: cada paso se realiza exactamente una vez y utiliza los resultados de los pasos anteriores.',
    bullets: [
      'Las variables guardan los datos de entrada y los cálculos intermedios.',
      'Cada expresión se evalúa una sola vez, en el orden escrito.',
      'El resultado final depende de que todas las instrucciones anteriores se hayan ejecutado.',
      'Si cambia el orden de los cálculos, cambia el resultado.',
    ],
    syntax: 'const nombre = "Ana";\nconst edad = 28;\nconst faltan = 100 - edad;\nconst anio = 2026 + faltan;',
  },

  statement:
    'Crear un programa que solicite el nombre, la edad y el año de nacimiento de una persona. Luego debe mostrar un resumen de los datos, calcular cuántos años faltan para cumplir 100 y obtener el año aproximado en que los cumplirá.',
  objective:
    'Comprender cómo se encadenan instrucciones y cálculos en JavaScript, identificando entradas, procesamiento y salida dentro de un flujo lineal.',
  rules: [
    'La edad debe ser un entero entre 1 y 100 años.',
    'El año de nacimiento debe ser coherente con la edad (margen de un año).',
    'Todos los cálculos usan los datos del formulario, sin valores fijos.',
  ],
  inputs: ['Nombre completo', 'Edad actual en años', 'Año de nacimiento'],
  output:
    'Un mensaje personalizado con los años que faltan para cumplir 100 y el año aproximado del centésimo cumpleaños.',

  fields: [
    {
      name: 'nombre',
      label: 'Nombre completo',
      type: 'text',
      placeholder: 'Ej. Ana Gómez',
      autocomplete: 'name',
      required: true,
      minLength: 2,
      maxLength: 60,
      fullWidth: true,
      help: 'Se usa para personalizar el mensaje final.',
    },
    {
      name: 'edad',
      label: 'Edad actual (años)',
      type: 'number',
      placeholder: 'Ej. 28',
      min: 1,
      max: 100,
      integer: true,
      required: true,
      help: 'Valor entre 1 y 100.',
    },
    {
      name: 'anioNacimiento',
      label: 'Año de nacimiento',
      type: 'number',
      placeholder: 'Ej. 1998',
      min: 1900,
      max: 2100,
      integer: true,
      required: true,
      help: 'Debe coincidir con la edad (margen de 1 año).',
    },
  ],

  example: (() => {
    const anioActual = new Date().getFullYear();
    return { nombre: 'Ana Gómez', edad: 28, anioNacimiento: anioActual - 28 };
  })(),

  validate(values) {
    const errors = {};
    const anioActual = new Date().getFullYear();
    const { edad, anioNacimiento } = values;

    if (!Number.isFinite(edad) || !Number.isFinite(anioNacimiento)) {
      return errors;
    }

    if (anioNacimiento > anioActual) {
      errors.anioNacimiento = `El año de nacimiento no puede ser posterior a ${anioActual}.`;
      return errors;
    }

    const edadCalculada = anioActual - anioNacimiento;
    if (Math.abs(edadCalculada - edad) > 1) {
      errors.edad = `La edad no coincide con el año ${anioNacimiento}: en ${anioActual} tendrías ${edadCalculada} años. Corrige uno de los dos datos.`;
    }

    return errors;
  },

  logic: analizarDatosPersonales,

  toResult(datos) {
    const notes = [
      'El año se obtiene sumando los años restantes al año actual; puede variar en uno según la fecha de cumpleaños.',
    ];

    if (datos.diferencia > 0) {
      notes.push(
        `La verificación con el año de nacimiento produce ${datos.anioSegunEdad}; la diferencia de ${datos.diferencia} año(s) es normal por la aproximación de la edad.`,
      );
    }

    return {
      ok: true,
      headline: datos.mensaje,
      details: [
        { label: 'Nombre', value: datos.nombre },
        { label: 'Edad actual', value: `${datos.edad} años` },
        { label: 'Año de nacimiento', value: String(datos.anioNacimiento) },
        { label: 'Año actual de referencia', value: String(datos.anioActual) },
        { label: 'Años que faltan para 100', value: datos.aniosParaCien },
        { label: 'Año en que cumplirás 100', value: `${datos.anioCumpleCien} (aprox.)` },
      ],
      notes,
    };
  },

  explain(datos) {
    return [
      {
        title: 'Lectura de datos en orden',
        text: `El formulario entregó nombre = "${datos.nombre}", edad = ${datos.edad} y año de nacimiento = ${datos.anioNacimiento}. La función los recibió como un objeto y los usó tal cual, sin decidir ni repetir nada.`,
      },
      {
        title: 'Primer cálculo: los años restantes',
        text: `Se evaluó 100 - ${datos.edad} = ${datos.aniosParaCien}. Este valor se guardó en la constante aniosParaCien y queda disponible para los pasos siguientes.`,
      },
      {
        title: 'Segundo cálculo: el año del centésimo cumpleaños',
        text: `Se sumó el año de nacimiento más 100: ${datos.anioNacimiento} + 100 = ${datos.anioCumpleCien}. Además, como verificación, se sumaron los años restantes al año actual: ${datos.anioActual} + ${datos.aniosParaCien} = ${datos.anioSegunEdad}.`,
      },
      {
        title: 'Salida y por qué es secuencial',
        text: `Los cálculos se devolvieron en un objeto y la interfaz compuso el mensaje final. No hubo if ni ciclos: cada línea se ejecutó una vez, en el orden escrito, y el resultado depende de esa secuencia.`,
      },
    ];
  },

  code: toSource(analizarDatosPersonales),
};
