/**
 * Persistencia del progreso en localStorage con degradación elegante:
 * si el almacenamiento no está disponible, se conserva en memoria.
 */

const STORAGE_KEY = 'codelab.js:progress:v1';

const memory = new Set();

function readStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeStorage(ids) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Modo privado o almacenamiento bloqueado: se mantiene solo en memoria.
  }
}

export function loadProgress(validIds) {
  const allowed = new Set(validIds);
  const stored = readStorage().filter((id) => allowed.has(id));
  stored.forEach((id) => memory.add(id));
  return new Set([...memory].filter((id) => allowed.has(id)));
}

export function markCompleted(id, validIds) {
  if (memory.has(id)) {
    return false;
  }
  memory.add(id);
  writeStorage([...memory].filter((item) => validIds.includes(item)));
  return true;
}

export function resetProgress() {
  memory.clear();
  writeStorage([]);
}
