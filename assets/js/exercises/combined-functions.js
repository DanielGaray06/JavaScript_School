/**
 * Ejercicio 08 — Combinación de funciones síncronas y asíncronas.
 *
 * Flujo: validar (síncrono) -> enviar (asíncrono) -> confirmar.
 */

import { toSource } from '../utils/source.js';

function validarRegistroUsuario({ nombre, edad, correo }) {
  const errores = [];

  if (nombre.trim().length < 3) {
    errores.push('El nombre debe tener al menos 3 caracteres.');
  }

  if (!Number.isInteger(edad) || edad < 1 || edad > 120) {
    errores.push('La edad debe ser un número entero entre 1 y 120 años.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    errores.push('El correo electrónico no tiene un formato válido.');
  }

  return {
    valido: errores.length === 0,
    errores,
    datos: {
      nombre: nombre.trim(),
      edad,
      correo: correo.trim().toLowerCase(),
    },
  };
}

function enviarRegistroAlServidor(datos) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const identificador = 'USR-' + Math.floor(Math.random() * 9000 + 1000);

      resolve({
        ...datos,
        id: identificador,
        estado: 'Registrado',
        registradoEn: new Date().toLocaleString('es-CO'),
      });
    }, 1500);
  });
}

async function registrarUsuario(entrada) {
  // Fase 1: validación síncrona, inmediata, sin await.
  const validacion = validarRegistroUsuario(entrada);

  if (!validacion.valido) {
    return {
      exito: false,
      fase: 'validacion-sincrona',
      errores: validacion.errores,
      validacion,
    };
  }

  // Fase 2: solo si los datos son correctos, se llama a la función asíncrona.
  const registro = await enviarRegistroAlServidor(validacion.datos);

  return {
    exito: true,
    fase: 'envio-asincrono',
    registro,
    validacion,
  };
}

export const combinedFunctions = {
  id: 'combined-functions',
  number: 8,
  title: 'Registro de usuario: validar y luego enviar',
  navTitle: 'Sync + async',
  structure: 'Síncrona + asíncrona',
  level: 'Avanzado',
  mode: 'mixed',
  delayMs: 1500,
  shortDescription:
    'Una función síncrona valida los datos; solo si son correctos, una función async simula el envío al servidor con await.',

  concept: {
    title: 'Dos ritmos de ejecución en un mismo flujo',
    text:
      'Las funciones síncronas realizan cálculos o validaciones inmediatas; las asíncronas permiten esperar operaciones externas. Combinarlas es una práctica habitual: primero se valida localmente (rápido) y solo después se envía la información a un servidor (lento).',
    bullets: [
      'La validación síncrona devuelve un objeto con valido y errores en el mismo instante.',
      'Si hay errores, la función asíncrona nunca se invoca: se evita una petición innecesaria.',
      'Si los datos son válidos, la función async crea una Promise con setTimeout y usa await.',
      'La interfaz muestra dos fases claramente separadas: validación inmediata y envío con espera.',
    ],
    syntax:
      'const validacion = validar(datos);\nif (!validacion.valido) return validacion;\nconst registro = await enviar(validacion.datos);',
  },

  statement:
    'Crear un sistema de registro y consulta de usuarios. Solicitar nombre, edad y correo electrónico. Una función síncrona debe validar los datos; si son incorrectos, devolver los errores. Si son correctos, llamar a una función async que simule el envío al servidor con Promise y setTimeout, espere la respuesta con await y devuelva una confirmación de registro exitoso.',
  objective:
    'Integrar validación síncrona y operaciones asíncronas en un flujo coherente, entendiendo qué parte se ejecuta de inmediato y qué parte queda pendiente de una promesa.',
  rules: [
    'El nombre debe tener al menos 3 caracteres.',
    'La edad debe ser un entero entre 1 y 120 años.',
    'El correo debe tener un formato válido (nombre@dominio.com).',
    'La validación síncrona es la que decide si se llama o no a la función async.',
    'El envío simulado tarda 1.5 segundos y muestra un estado de carga.',
  ],
  inputs: ['Nombre completo', 'Edad', 'Correo electrónico'],
  output:
    'Los datos validados y el resultado del registro: identificador, estado y confirmación de la operación asíncrona.',

  fields: [
    {
      name: 'nombre',
      label: 'Nombre completo',
      type: 'text',
      placeholder: 'Ej. Ana Gómez',
      autocomplete: 'name',
      required: true,
      minLength: 3,
      maxLength: 60,
      fullWidth: true,
      help: 'La validación síncrona exige mínimo 3 caracteres.',
    },
    {
      name: 'edad',
      label: 'Edad (años)',
      type: 'number',
      placeholder: 'Ej. 28',
      min: 1,
      max: 120,
      integer: true,
      required: true,
      help: 'Entero entre 1 y 120.',
    },
    {
      name: 'correo',
      label: 'Correo electrónico',
      type: 'email',
      placeholder: 'Ej. ana@ejemplo.com',
      autocomplete: 'email',
      required: true,
      help: 'Se normaliza a minúsculas antes del envío.',
    },
  ],

  example: { nombre: 'Ana Gómez', edad: 28, correo: 'ana.gomez@example.com' },

  logic: registrarUsuario,

  toResult(resultado) {
    if (!resultado.exito) {
      return {
        ok: false,
        headline: 'La validación síncrona rechazó el registro.',
        details: [
          { label: 'Fase ejecutada', value: 'Validación síncrona (inmediata)' },
          { label: 'Fase asíncrona', value: 'No se ejecutó' },
        ],
        errores: resultado.errores,
        notes: [
          'La función async nunca se llamó porque la validación encontró errores. Esto evita enviar datos inválidos a un servidor.',
        ],
      };
    }

    const { registro, validacion } = resultado;

    return {
      ok: true,
      headline: `Registro exitoso con el identificador ${registro.id}.`,
      details: [
        { label: 'Fase 1 · validación síncrona', value: 'Superada' },
        { label: 'Fase 2 · envío asíncrono', value: 'Completado' },
        { label: 'Identificador', value: registro.id },
        { label: 'Nombre validado', value: validacion.datos.nombre },
        { label: 'Edad', value: validacion.datos.edad },
        { label: 'Correo', value: validacion.datos.correo },
        { label: 'Estado', value: registro.estado },
        { label: 'Fecha de registro', value: registro.registradoEn },
      ],
      notes: [
        'La validación síncrona se ejecutó en el mismo instante de la llamada y devolvió valido: true.',
        'Solo después se invocó la función async; el await esperó aproximadamente 1.5 segundos sin bloquear la interfaz.',
        'El identificador se genera en el servidor simulado, por eso aparece únicamente en la respuesta final.',
      ],
    };
  },

  explain(resultado) {
    if (!resultado.exito) {
      return [
        {
          title: 'Validación síncrona inmediata',
          text: `validarRegistroUsuario se ejecutó sin await y devolvió valido: false con ${resultado.errores.length} error(es). La función recorrió las reglas y acumuló los mensajes en un arreglo.`,
        },
        {
          title: 'La fase asíncrona no se inició',
          text: 'El if (!validacion.valido) hizo un return anticipado. Como la validación falló, enviarRegistroAlServidor nunca se llamó y no se creó ninguna promesa.',
        },
        {
          title: 'Ventaja del orden',
          text: 'Validar primero es más eficiente y seguro: se evita una petición de red y se informa al usuario de inmediato, sin esperar.',
        },
      ];
    }

    return [
      {
        title: 'Fase 1: la función síncrona valida',
        text: `validarRegistroUsuario se ejecutó de inmediato. Revisó el nombre (${resultado.validacion.datos.nombre}), la edad (${resultado.validacion.datos.edad}) y el correo (${resultado.validacion.datos.correo}), y devolvió valido: true. No hubo await porque todo el trabajo ocurrió en la misma pila de llamadas.`,
      },
      {
        title: 'Decisión y preparación',
        text: 'Al ser válido, el flujo continuó y llamó a enviarRegistroAlServidor con los datos ya normalizados (nombre sin espacios extremos, correo en minúsculas).',
      },
      {
        title: 'Fase 2: la función async espera',
        text: 'enviarRegistroAlServidor devolvió una Promise y programó un setTimeout de 1500 ms. El await suspendió registrarUsuario, no la página: la interfaz pudo mostrar el estado de carga mientras la promesa estaba pendiente.',
      },
      {
        title: 'Respuesta del servidor simulado',
        text: `La promesa se resolvió con id ${resultado.registro.id} y estado "${resultado.registro.estado}". El await recuperó ese objeto y registrarUsuario devolvió exito: true junto con la validación.`,
      },
      {
        title: 'Diferencia entre ambos mundos',
        text: 'La validación síncrona bloquea la ejecución solo el tiempo que tardan las comparaciones (microsegundos). La operación asíncrona no bloquea: deja la función pausada y permite que el event loop atienda otras tareas hasta que la promesa se resuelve.',
      },
    ];
  },

  code: toSource(validarRegistroUsuario, enviarRegistroAlServidor, registrarUsuario),
};
