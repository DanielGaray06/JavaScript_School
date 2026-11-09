/**
 * Validación declarativa de formularios.
 *
 * Cada ejercicio describe sus campos y este módulo se encarga de comprobar
 * presencia, tipo, rangos y formato. No manipula el DOM: recibe valores y
 * devuelve un objeto con errores por campo.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/** Convierte texto numérico (con coma o punto decimal) a número. */
export function parseNumber(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : Number.NaN;
  }

  if (typeof value !== 'string') {
    return Number.NaN;
  }

  const normalized = value.trim().replace(',', '.');
  if (normalized === '') {
    return Number.NaN;
  }

  return Number(normalized);
}

export function isValidEmail(value) {
  return typeof value === 'string' && value.trim().length <= 254 && EMAIL_PATTERN.test(value.trim());
}

function isBlank(value) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

function labelOf(field) {
  return field.label ?? field.name;
}

/**
 * Valida los valores de un formulario según la definición de campos.
 *
 * @param {Array<object>} fields Definiciones de campo del ejercicio.
 * @param {Record<string, unknown>} rawValues Valores sin procesar.
 * @returns {{ valid: boolean, errors: Record<string, string>, values: Record<string, unknown> }}
 */
export function validateValues(fields, rawValues) {
  const errors = {};
  const values = {};

  for (const field of fields) {
    const raw = rawValues[field.name];
    const label = labelOf(field);

    if (field.type === 'number-list') {
      const list = Array.isArray(raw) ? raw : [];

      if (list.length === 0) {
        errors[field.name] = `Agrega al menos un número en «${label}» para poder ejecutar.`;
        continue;
      }

      if (field.maxItems && list.length > field.maxItems) {
        errors[field.name] = `«${label}» admite como máximo ${field.maxItems} números.`;
        continue;
      }

      let listError = '';
      for (const item of list) {
        const numeric = parseNumber(item);
        if (!Number.isFinite(numeric)) {
          listError = `Todos los valores de «${label}» deben ser números válidos.`;
          break;
        }
        if (field.integer && !Number.isInteger(numeric)) {
          listError = `«${label}» solo admite números enteros (sin decimales).`;
          break;
        }
        if (field.min !== undefined && numeric < field.min) {
          listError = `Cada número de «${label}» debe ser mayor o igual que ${field.min}.`;
          break;
        }
        if (field.max !== undefined && numeric > field.max) {
          listError = `Cada número de «${label}» debe ser menor o igual que ${field.max}.`;
          break;
        }
      }

      if (listError) {
        errors[field.name] = listError;
        continue;
      }

      values[field.name] = list.map((item) => parseNumber(item));
      continue;
    }

    if (isBlank(raw)) {
      if (field.required !== false) {
        errors[field.name] =
          field.type === 'select' ? `Selecciona una opción en «${label}».` : `Completa el campo «${label}».`;
      } else {
        values[field.name] = '';
      }
      continue;
    }

    if (typeof raw !== 'string') {
      errors[field.name] = `El valor de «${label}» no es válido.`;
      continue;
    }

    const text = raw.trim();

    if (field.type === 'email') {
      if (!isValidEmail(text)) {
        errors[field.name] = `«${label}» no tiene un formato de correo válido (ejemplo: nombre@dominio.com).`;
        continue;
      }
      values[field.name] = text;
      continue;
    }

    if (field.type === 'select') {
      const allowed = (field.options ?? []).map((option) => option.value);
      if (!allowed.includes(text)) {
        errors[field.name] = `Selecciona una opción válida en «${label}».`;
        continue;
      }
      values[field.name] = text;
      continue;
    }

    if (field.type === 'number') {
      const numeric = parseNumber(text);
      if (!Number.isFinite(numeric)) {
        errors[field.name] = `«${label}» debe ser un número válido.`;
        continue;
      }
      if (field.integer && !Number.isInteger(numeric)) {
        errors[field.name] = `«${label}» debe ser un número entero, sin decimales.`;
        continue;
      }
      if (field.min !== undefined && numeric < field.min) {
        errors[field.name] = `«${label}» debe ser mayor o igual que ${field.min}.`;
        continue;
      }
      if (field.max !== undefined && numeric > field.max) {
        errors[field.name] = `«${label}» debe ser menor o igual que ${field.max}.`;
        continue;
      }
      values[field.name] = numeric;
      continue;
    }

    // type: text (y cualquier tipo de texto no contemplado)
    if (field.minLength !== undefined && text.length < field.minLength) {
      errors[field.name] = `«${label}» debe tener al menos ${field.minLength} caracteres.`;
      continue;
    }
    if (field.maxLength !== undefined && text.length > field.maxLength) {
      errors[field.name] = `«${label}» no puede superar los ${field.maxLength} caracteres.`;
      continue;
    }
    if (field.pattern && !field.pattern.test(text)) {
      errors[field.name] = field.patternMessage ?? `«${label}» no tiene un formato válido.`;
      continue;
    }

    values[field.name] = text;
  }

  return { valid: Object.keys(errors).length === 0, errors, values };
}
