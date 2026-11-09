/**
 * Bloques de código con resaltado ligero, numeración y botón de copiar.
 * El resaltado se hace token por línea para evitar HTML anidado inválido.
 */

import { escapeHtml } from '../utils/html.js';
import { icon } from './icons.js';

const registry = new Map();
let sequence = 0;
let statusRegion = null;
let copyHandlerReady = false;

const TOKEN_PATTERN =
  /(\/\/[^\n]*)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|\b(async|await|function|return|const|let|var|if|else|for|while|do|break|continue|new|throw|try|catch|finally|typeof|instanceof|in|of|true|false|null|undefined|class|extends|switch|case|default|yield|delete|void|this)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(?=\s*\()|([=+\-*/%<>!&|?:;,.()[\]{}])/g;

const TOKEN_CLASSES = [
  'token-comment',
  'token-string',
  'token-keyword',
  'token-number',
  'token-function',
  'token-operator',
];

function highlightLine(line) {
  let html = '';
  let cursor = 0;
  TOKEN_PATTERN.lastIndex = 0;

  let match = TOKEN_PATTERN.exec(line);
  while (match !== null) {
    if (match.index > cursor) {
      html += escapeHtml(line.slice(cursor, match.index));
    }

    const groupIndex = match.findIndex((group, index) => index > 0 && group !== undefined);
    const className = TOKEN_CLASSES[groupIndex - 1] ?? 'token-operator';
    html += `<span class="${className}">${escapeHtml(match[0])}</span>`;

    cursor = match.index + match[0].length;
    match = TOKEN_PATTERN.exec(line);
  }

  if (cursor < line.length) {
    html += escapeHtml(line.slice(cursor));
  }

  return html === '' ? '&nbsp;' : html;
}

function buildCodeMarkup(code) {
  const lines = code.replace(/\r\n/g, '\n').replace(/\t/g, '  ').split('\n');

  return lines
    .map(
      (line, index) => `<span class="code-line"><span class="code-line__number" aria-hidden="true">${index + 1}</span><span class="code-line__content">${highlightLine(line)}</span></span>`,
    )
    .join('');
}

/**
 * Devuelve el HTML de un bloque de código y registra el texto original
 * para que el botón de copiar use exactamente el código ejecutado.
 */
export function renderCodeBlock(code, { label = 'JavaScript' } = {}) {
  sequence += 1;
  const codeId = `code-${sequence}`;
  registry.set(codeId, code);

  return `
    <div class="code-shell">
      <div class="code-toolbar">
        <span class="code-lang">
          <span class="h-2 w-2 rounded-full bg-mint-400/70" aria-hidden="true"></span>
          ${escapeHtml(label)}
        </span>
        <button type="button" class="code-copy" data-copy-code="${codeId}" aria-label="Copiar el código fuente del ejercicio">
          ${icon('copy', 'h-3.5 w-3.5')}
          <span data-copy-label>Copiar</span>
        </button>
      </div>
      <pre class="code-pre" tabindex="0" aria-label="Código fuente del ejercicio"><code class="block min-w-full">${buildCodeMarkup(code)}</code></pre>
    </div>
  `;
}

function ensureStatusRegion() {
  if (statusRegion) {
    return statusRegion;
  }

  statusRegion = document.createElement('p');
  statusRegion.className = 'sr-only';
  statusRegion.setAttribute('role', 'status');
  statusRegion.setAttribute('aria-live', 'polite');
  document.body.appendChild(statusRegion);

  return statusRegion;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback para navegadores o contextos sin permiso de Clipboard API.
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }

    textarea.remove();
    return copied;
  }
}

/** Delegación de eventos: se registra una sola vez por documento. */
export function initCopyHandlers() {
  if (copyHandlerReady) {
    return;
  }
  copyHandlerReady = true;

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-copy-code]');
    if (!button) {
      return;
    }

    const code = registry.get(button.dataset.copyCode);
    if (!code) {
      return;
    }

    const label = button.querySelector('[data-copy-label]');
    const original = label?.textContent ?? 'Copiar';
    const success = await copyText(code);

    if (label) {
      label.textContent = success ? 'Copiado' : 'No se pudo copiar';
    }

    const status = ensureStatusRegion();
    status.textContent = success ? 'Código copiado al portapapeles.' : 'No fue posible copiar el código.';

    window.setTimeout(() => {
      if (label) {
        label.textContent = original;
      }
    }, 2200);
  });
}
