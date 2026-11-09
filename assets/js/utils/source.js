/**
 * Extrae el código fuente real de una o varias funciones.
 * Se usa para mostrar exactamente la lógica que se ejecuta, sin copias
 * que puedan quedar desincronizadas.
 */
export function toSource(...functions) {
  return functions.map((fn) => fn.toString().trim()).join('\n\n');
}
