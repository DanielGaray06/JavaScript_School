/**
 * Pruebas de la capa de lógica y validación (sin DOM).
 * Ejecutar con: pnpm test
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { isValidEmail, parseNumber, validateValues } from '../assets/js/utils/validation.js';

import { sequential } from '../assets/js/exercises/sequential.js';
import { conditionalSimple } from '../assets/js/exercises/conditional-simple.js';
import { conditionalNested } from '../assets/js/exercises/conditional-nested.js';
import { forLoop } from '../assets/js/exercises/for-loop.js';
import { whileLoop } from '../assets/js/exercises/while-loop.js';
import { asyncFunction } from '../assets/js/exercises/async-function.js';
import { syncFunction } from '../assets/js/exercises/sync-function.js';
import { combinedFunctions } from '../assets/js/exercises/combined-functions.js';

const EXERCISES = [
  sequential,
  conditionalSimple,
  conditionalNested,
  forLoop,
  whileLoop,
  asyncFunction,
  syncFunction,
  combinedFunctions,
];

test('metadatos: ocho ejercicios con ids y números únicos', () => {
  assert.equal(EXERCISES.length, 8);

  const ids = EXERCISES.map((exercise) => exercise.id);
  const numbers = EXERCISES.map((exercise) => exercise.number);

  assert.equal(new Set(ids).size, 8);
  assert.deepEqual(numbers, [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(new Set(numbers).size, 8);

  for (const exercise of EXERCISES) {
    assert.ok(exercise.title.length > 0);
    assert.ok(exercise.code.includes('function'), `${exercise.id} debe exponer código real de función`);
    assert.ok(Array.isArray(exercise.fields) && exercise.fields.length > 0);
    assert.equal(typeof exercise.logic, 'function');
    assert.equal(typeof exercise.toResult, 'function');
    assert.equal(typeof exercise.explain, 'function');
  }
});

test('validación: campos obligatorios, correo y números', () => {
  assert.equal(parseNumber('12,5'), 12.5);
  assert.equal(parseNumber('  8 '), 8);
  assert.ok(Number.isNaN(parseNumber('abc')));
  assert.ok(Number.isNaN(parseNumber('')));

  assert.equal(isValidEmail('ana@ejemplo.com'), true);
  assert.equal(isValidEmail('ana@ejemplo'), false);
  assert.equal(isValidEmail('ana ejemplo.com'), false);

  const { valid, errors } = validateValues(conditionalSimple.fields, { edad: '' });
  assert.equal(valid, false);
  assert.match(errors.edad, /Completa el campo/);

  const numberList = validateValues(whileLoop.fields, { numeros: [] });
  assert.equal(numberList.valid, false);
  assert.match(numberList.errors.numeros, /al menos un número/);

  const range = validateValues(conditionalSimple.fields, { edad: '121' });
  assert.equal(range.valid, false);
  assert.match(range.errors.edad, /menor o igual/);
});

test('01 secuencial: cálculos y resultado personalizado', () => {
  const raw = sequential.logic({
    nombre: 'Ana',
    edad: 28,
    anioNacimiento: 1998,
    anioActual: 2026,
  });

  assert.equal(raw.aniosParaCien, 72);
  assert.equal(raw.anioCumpleCien, 2098);
  assert.equal(raw.anioSegunEdad, 2098);
  assert.equal(raw.diferencia, 0);

  const result = sequential.toResult(raw);
  assert.equal(result.ok, true);
  assert.match(result.headline, /Ana/);
  assert.match(result.headline, /72/);
  assert.ok(sequential.explain(raw).length >= 4);
});

test('01 secuencial: edad incoherente con el año de nacimiento', () => {
  const currentYear = new Date().getFullYear();
  const { values } = validateValues(sequential.fields, {
    nombre: 'Ana',
    edad: '28',
    anioNacimiento: String(currentYear - 40),
  });

  const errors = sequential.validate(values);
  assert.match(errors.edad, /no coincide/);
});

test('02 condicional simple: ejecuta el bloque solo con edad suficiente', () => {
  const mayor = conditionalSimple.logic({ edad: 18 });
  assert.equal(mayor.condicion, true);
  assert.equal(mayor.bloqueIfEjecutado, true);
  assert.match(mayor.mensaje, /mayor de edad/);

  const menor = conditionalSimple.logic({ edad: 17 });
  assert.equal(menor.condicion, false);
  assert.equal(menor.bloqueIfEjecutado, false);
  assert.match(menor.mensaje, /no cumples/);
});

test('03 condicional anidado: evalúa edad y luego nacionalidad', () => {
  const permitido = conditionalNested.logic({ edad: 22, nacionalidad: 'colombiana' });
  assert.equal(permitido.acceso, true);

  const edadInsuficiente = conditionalNested.logic({ edad: 17, nacionalidad: 'colombiana' });
  assert.equal(edadInsuficiente.acceso, false);
  assert.match(edadInsuficiente.motivo, /18 años/);
  assert.equal(edadInsuficiente.nivelEvaluado, 'primera condición');

  const nacionalidadIncorrecta = conditionalNested.logic({ edad: 22, nacionalidad: 'venezolana' });
  assert.equal(nacionalidadIncorrecta.acceso, false);
  assert.match(nacionalidadIncorrecta.motivo, /nacionalidad/);
  assert.match(nacionalidadIncorrecta.nivelEvaluado, /anidada/);
});

test('04 for: genera diez filas y la última es el número por diez', () => {
  const raw = forLoop.logic({ numero: 7 });
  assert.equal(raw.iteraciones, 10);
  assert.equal(raw.filas.length, 10);
  assert.equal(raw.filas[0].producto, 7);
  assert.equal(raw.filas[9].producto, 70);

  const result = forLoop.toResult(raw);
  assert.equal(result.table.rows.length, 10);
  assert.deepEqual(result.table.rows[9], [10, '7 × 10', 70]);
});

test('05 while: suma, cuenta y respeta el centinela 0', () => {
  const raw = whileLoop.logic({ numeros: [12, 7, 0, 99] });
  assert.equal(raw.suma, 19);
  assert.equal(raw.contador, 2);
  assert.equal(raw.encontroCero, true);
  assert.equal(raw.restantes, 1);
  assert.equal(raw.recorrido.length, 2);

  const sinCero = whileLoop.logic({ numeros: [1, 2, 3] });
  assert.equal(sinCero.suma, 6);
  assert.equal(sinCero.contador, 3);
  assert.equal(sinCero.encontroCero, false);

  const ceroInicial = whileLoop.logic({ numeros: [0, 5] });
  assert.equal(ceroInicial.contador, 0);
  assert.equal(ceroInicial.suma, 0);

  const result = whileLoop.toResult(raw);
  assert.match(result.headline, /19/);
  assert.equal(result.table.rows.length, 2);
});

test('06 async: espera la promesa y devuelve los datos del estudiante', async () => {
  const raw = await asyncFunction.logic({ nombre: 'Laura', codigo: '2026-0042' });

  assert.equal(raw.finalizado, true);
  assert.equal(raw.estudiante.nombre, 'Laura');
  assert.equal(raw.estudiante.codigo, '2026-0042');
  assert.match(raw.mensaje, /finalizada/);

  const result = asyncFunction.toResult(raw);
  assert.equal(result.ok, true);
  assert.equal(result.details.length, 6);
  assert.ok(asyncFunction.explain(raw).some((step) => /await/.test(step.text)));
});

test('07 sync: calcula las cuatro operaciones y protege la división', () => {
  assert.equal(
    syncFunction.logic({ primerNumero: 24, segundoNumero: 6, operacion: 'division' }).resultado,
    4,
  );
  assert.equal(syncFunction.logic({ primerNumero: 8, segundoNumero: 5, operacion: 'suma' }).resultado, 13);
  assert.equal(syncFunction.logic({ primerNumero: 8, segundoNumero: 5, operacion: 'resta' }).resultado, 3);
  assert.equal(
    syncFunction.logic({ primerNumero: 8, segundoNumero: 5, operacion: 'multiplicacion' }).resultado,
    40,
  );

  assert.throws(
    () => syncFunction.logic({ primerNumero: 1, segundoNumero: 0, operacion: 'division' }),
    /dividir entre cero/,
  );
  assert.throws(
    () => syncFunction.logic({ primerNumero: 1, segundoNumero: 2, operacion: 'potencia' }),
    /no está soportada/,
  );

  const errors = syncFunction.validate({
    primerNumero: 10,
    segundoNumero: 0,
    operacion: 'division',
  });
  assert.match(errors.segundoNumero, /dividir entre cero/);
});

test('08 combinada: valida de forma síncrona y luego envía de forma asíncrona', async () => {
  const raw = await combinedFunctions.logic({
    nombre: 'Ana Gómez',
    edad: 28,
    correo: 'ana.gomez@example.com',
  });

  assert.equal(raw.exito, true);
  assert.equal(raw.fase, 'envio-asincrono');
  assert.match(raw.registro.id, /^USR-\d{4}$/);
  assert.equal(raw.registro.correo, 'ana.gomez@example.com');

  const result = combinedFunctions.toResult(raw);
  assert.equal(result.ok, true);
  assert.match(result.headline, /Registro exitoso/);
  assert.ok(combinedFunctions.explain(raw).some((step) => /síncrona/i.test(step.title)));

  const invalid = await combinedFunctions.logic({
    nombre: 'Al',
    edad: 0,
    correo: 'correo-invalido',
  });

  assert.equal(invalid.exito, false);
  assert.equal(invalid.fase, 'validacion-sincrona');
  assert.equal(invalid.errores.length, 3);

  const invalidResult = combinedFunctions.toResult(invalid);
  assert.equal(invalidResult.ok, false);
  assert.equal(invalidResult.errores.length, 3);
});
