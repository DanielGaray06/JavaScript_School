/**
 * Utilidades de presentación seguras.
 * Todo dato proveniente del usuario se escapa antes de insertarse como HTML.
 */

const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

const numberFormatter = new Intl.NumberFormat('es-CO', {
  maximumFractionDigits: 6,
});

/** Formatea números con separadores locales sin notación científica. */
export function formatNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return String(value);
  }
  return numberFormatter.format(value);
}

/** Duración legible para el panel de ejecución. */
export function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    return '—';
  }
  if (milliseconds < 1) {
    return '< 1 ms';
  }
  if (milliseconds < 1000) {
    return `${milliseconds.toFixed(1)} ms`;
  }
  return `${(milliseconds / 1000).toFixed(2)} s`;
}

export function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}
