/**
 * Punto de entrada de CodeLab.js.
 *
 * Orquesta el catálogo, el acordeón de conceptos, el laboratorio y el
 * progreso persistido. Cada ejercicio vive en su propio módulo.
 */

import { sequential } from './exercises/sequential.js';
import { conditionalSimple } from './exercises/conditional-simple.js';
import { conditionalNested } from './exercises/conditional-nested.js';
import { forLoop } from './exercises/for-loop.js';
import { whileLoop } from './exercises/while-loop.js';
import { asyncFunction } from './exercises/async-function.js';
import { syncFunction } from './exercises/sync-function.js';
import { combinedFunctions } from './exercises/combined-functions.js';

import { ExerciseWorkspace } from './ui/workspace.js';
import { initCopyHandlers } from './ui/code-block.js';
import { initNavigation } from './ui/navigation.js';
import { loadProgress, markCompleted } from './ui/progress.js';
import { icon } from './ui/icons.js';
import { escapeHtml } from './utils/html.js';

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

const EXERCISE_ICONS = {
  sequential: 'arrow-right',
  'conditional-simple': 'branch',
  'conditional-nested': 'layers',
  'for-loop': 'repeat',
  'while-loop': 'rotate',
  'async-function': 'clock',
  'sync-function': 'calculator',
  'combined-functions': 'workflow',
};

const MODE_LABELS = {
  sync: 'Síncrona',
  async: 'Asíncrona',
  mixed: 'Mixta',
};

function renderCatalogCard(exercise) {
  const number = String(exercise.number).padStart(2, '0');

  return `
    <a class="catalog-card" href="#taller" data-open-exercise="${exercise.id}" data-exercise-card="${exercise.id}">
      <span class="flex items-start justify-between gap-2">
        <span class="icon-chip" aria-hidden="true">${icon(EXERCISE_ICONS[exercise.id] ?? 'code', 'h-5 w-5')}</span>
        <span class="catalog-card__number" aria-hidden="true">${number}</span>
      </span>

      <div class="mt-4 flex flex-wrap items-center gap-2">
        <span class="catalog-card__badge">${escapeHtml(exercise.structure)}</span>
        <span class="catalog-card__done" data-done-badge hidden>${icon('check', 'h-3 w-3')} Completado</span>
      </div>

      <h3 class="catalog-card__title">${escapeHtml(exercise.title)}</h3>
      <p class="catalog-card__desc">${escapeHtml(exercise.shortDescription)}</p>

      <div class="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <span class="catalog-card__cta">
          <span data-card-cta>Abrir ejercicio</span>
          ${icon('arrow-right', 'catalog-card__arrow h-3.5 w-3.5')}
        </span>
        <span class="font-mono text-[10px] uppercase tracking-wider text-slate-400">${MODE_LABELS[exercise.mode] ?? ''}</span>
      </div>
    </a>
  `;
}

function renderCatalog(container) {
  container.innerHTML = EXERCISES.map(renderCatalogCard).join('');
}

function renderConcepts(container) {
  container.innerHTML = EXERCISES.map(
    (exercise) => `
      <details class="concept-item">
        <summary class="concept-summary">
          <span class="concept-summary__num" aria-hidden="true">${String(exercise.number).padStart(2, '0')}</span>
          <span class="min-w-0">
            <span class="block text-sm font-semibold text-slate-100">${escapeHtml(exercise.concept.title)}</span>
            <span class="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">${escapeHtml(exercise.structure)}</span>
          </span>
          ${icon('chevron-down', 'concept-chevron')}
        </summary>
        <div class="concept-content">
          <p class="text-[13px] leading-relaxed text-slate-400">${escapeHtml(exercise.concept.text)}</p>
          <pre class="concept-syntax" tabindex="0" aria-label="Ejemplo de sintaxis"><code>${escapeHtml(exercise.concept.syntax)}</code></pre>
          <button type="button" class="btn btn-secondary btn-sm mt-3" data-open-exercise="${exercise.id}">
            Practicar este concepto
            ${icon('arrow-right', 'h-3.5 w-3.5')}
          </button>
        </div>
      </details>
    `,
  ).join('');
}

function init() {
  const catalog = document.getElementById('exercise-grid');
  const conceptContainer = document.getElementById('concept-accordion');
  const panel = document.getElementById('exercise-panel');
  const switcher = document.getElementById('exercise-switcher');

  if (!catalog || !conceptContainer || !panel || !switcher) {
    console.error('No se encontraron los contenedores principales del laboratorio.');
    return;
  }

  renderCatalog(catalog);
  renderConcepts(conceptContainer);

  const ids = EXERCISES.map((exercise) => exercise.id);
  const completed = loadProgress(ids);

  const progressCount = document.getElementById('progress-count');
  const progressBar = document.getElementById('progress-bar');
  const progressTrack = document.getElementById('progress-track');
  const progressLabel = document.getElementById('progress-label');

  const refreshProgress = () => {
    const total = EXERCISES.length;
    const done = completed.size;

    if (progressCount) {
      progressCount.textContent = String(done);
    }
    if (progressBar) {
      progressBar.style.width = `${(done / total) * 100}%`;
    }
    if (progressTrack) {
      progressTrack.setAttribute('aria-valuenow', String(done));
    }
    if (progressLabel) {
      progressLabel.textContent =
        done === 0
          ? 'Ejecuta un ejercicio para registrarlo.'
          : done === total
            ? '¡Ruta completada! Repasa cualquier ejercicio cuando quieras.'
            : `${done} de ${total} ejercicios completados.`;
    }

    for (const card of catalog.querySelectorAll('[data-exercise-card]')) {
      const isDone = completed.has(card.dataset.exerciseCard);
      card.classList.toggle('is-completed', isDone);

      const badge = card.querySelector('[data-done-badge]');
      if (badge) {
        badge.hidden = !isDone;
      }

      const cta = card.querySelector('[data-card-cta]');
      if (cta) {
        cta.textContent = isDone ? 'Repasar ejercicio' : 'Abrir ejercicio';
      }
    }

    workspace.setCompleted(completed);
  };

  const workspace = new ExerciseWorkspace({
    panel,
    switcher,
    exercises: EXERCISES,
    onComplete: (id) => {
      if (markCompleted(id, ids)) {
        completed.add(id);
        refreshProgress();
      }
    },
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-exercise]');
    if (!trigger) {
      return;
    }

    event.preventDefault();
    workspace.open(trigger.dataset.openExercise, { scroll: true, focus: true });
  });

  initCopyHandlers();
  initNavigation();
  refreshProgress();
}

init();
