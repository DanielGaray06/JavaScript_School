/**
 * Laboratorio interactivo.
 *
 * Responsabilidades:
 *  - Renderizar el panel de un ejercicio (concepto, enunciado, formulario, código).
 *  - Leer y validar entradas.
 *  - Ejecutar la lógica pura del ejercicio (sync o async).
 *  - Mostrar ejecución, resultado y explicación de forma accesible.
 *
 * La lógica de negocio vive en assets/js/exercises/*.js y no toca el DOM.
 */

import { parseNumber, validateValues } from '../utils/validation.js';
import { escapeHtml, formatDuration, formatNumber } from '../utils/html.js';
import { icon } from './icons.js';
import { renderCodeBlock } from './code-block.js';

const MODE_LABELS = {
  sync: { pill: 'Ejecución síncrona', card: 'Síncrona' },
  async: { pill: 'Ejecución asíncrona', card: 'Asíncrona' },
  mixed: { pill: 'Síncrona + asíncrona', card: 'Mixta' },
};

function displayValue(value) {
  if (typeof value === 'number') {
    return formatNumber(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }
  if (value === null || value === undefined) {
    return '—';
  }
  return String(value);
}

function renderDetails(details) {
  if (!Array.isArray(details) || details.length === 0) {
    return '';
  }

  return `
    <div class="result-grid">
      ${details
        .map(
          (detail) => `
            <div class="result-item">
              <p class="result-item__label">${escapeHtml(detail.label)}</p>
              <p class="result-item__value">${escapeHtml(displayValue(detail.value))}</p>
            </div>`,
        )
        .join('')}
    </div>
  `;
}

function renderTable(table) {
  if (!table || !Array.isArray(table.rows) || table.rows.length === 0) {
    return '';
  }

  return `
    <div class="result-table-wrap">
      <table class="result-table">
        <caption class="sr-only">${escapeHtml(table.caption ?? 'Resultados del ejercicio')}</caption>
        <thead>
          <tr>${table.headers.map((header) => `<th scope="col">${escapeHtml(header)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${table.rows
            .map(
              (row) =>
                `<tr>${row.map((cell) => `<td>${escapeHtml(displayValue(cell))}</td>`).join('')}</tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderNotes(notes) {
  if (!Array.isArray(notes) || notes.length === 0) {
    return '';
  }

  return notes
    .map(
      (note) => `
        <p class="result-note">
          ${icon('alert', 'mt-0.5 h-3.5 w-3.5 shrink-0')}
          <span>${escapeHtml(note)}</span>
        </p>`,
    )
    .join('');
}

function idleResult() {
  return `
    <div class="result-zone result-zone--idle">
      <span class="result-badge bg-white/5 text-slate-400">${icon('play', 'h-3 w-3')} En espera</span>
      <p class="result-headline">Todavía no hay resultados</p>
      <p class="mt-2 text-sm leading-relaxed text-slate-400">
        Completa los datos y pulsa <strong class="text-slate-200">Ejecutar ejercicio</strong>. El resultado aparecerá
        aquí, junto con la explicación del procedimiento.
      </p>
    </div>
  `;
}

function idleExplanation() {
  return `
    <p class="text-sm leading-relaxed text-slate-400">
      La explicación paso a paso se genera después de cada ejecución correcta, usando los valores reales de esta corrida.
    </p>
  `;
}

function executionIdle(exercise) {
  return `
    <div class="execution-card">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="text-xs font-semibold text-slate-300">Estado de la ejecución</p>
        <span class="result-badge bg-white/5 text-slate-400">Pendiente</span>
      </div>
      <div class="execution-grid">
        <div class="execution-metric">
          <p class="execution-metric__label">Modo</p>
          <p class="execution-metric__value">${MODE_LABELS[exercise.mode].card}</p>
        </div>
        <div class="execution-metric">
          <p class="execution-metric__label">Tiempo</p>
          <p class="execution-metric__value" data-execution-time>—</p>
        </div>
        <div class="execution-metric">
          <p class="execution-metric__label">Validación</p>
          <p class="execution-metric__value" data-execution-validation>Sin ejecutar</p>
        </div>
      </div>
      <p class="mt-3 text-xs leading-relaxed text-slate-400">
        Al ejecutar verás la lectura de datos, la validación, la llamada a la función y el render del resultado.
      </p>
    </div>
  `;
}

function buildFieldId(exercise, field) {
  return `${exercise.id}-${field.name}`;
}

function renderFieldControl(exercise, field) {
  const id = buildFieldId(exercise, field);
  const describedBy = [`${id}-help`, `${id}-error`].join(' ');
  const required = field.required !== false;
  const common = [
    `id="${id}"`,
    `name="${field.name}"`,
    `class="field-control"`,
    `aria-describedby="${describedBy}"`,
    required ? 'required aria-required="true"' : 'aria-required="false"',
  ];

  if (field.type === 'select') {
    const options = (field.options ?? [])
      .map(
        (option) =>
          `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`,
      )
      .join('');

    return `<select ${common.join(' ')}>
      <option value="">Selecciona una opción…</option>
      ${options}
    </select>`;
  }

  const placeholder = field.placeholder ? `placeholder="${escapeHtml(field.placeholder)}"` : '';

  if (field.type === 'number') {
    const min = field.min !== undefined ? `min="${field.min}"` : '';
    const max = field.max !== undefined ? `max="${field.max}"` : '';
    const step = field.step ?? (field.integer ? '1' : 'any');
    const inputMode = field.integer ? 'numeric' : 'decimal';

    return `<input type="number" ${common.join(' ')} ${placeholder} ${min} ${max} step="${step}" inputmode="${inputMode}" autocomplete="off" />`;
  }

  if (field.type === 'email') {
    return `<input type="email" ${common.join(' ')} ${placeholder} autocomplete="${field.autocomplete ?? 'email'}" inputmode="email" spellcheck="false" />`;
  }

  return `<input type="text" ${common.join(' ')} ${placeholder} autocomplete="${field.autocomplete ?? 'off'}" ${
    field.maxLength ? `maxlength="${field.maxLength}"` : ''
  } />`;
}

function renderStandardField(exercise, field) {
  const id = buildFieldId(exercise, field);
  const required = field.required !== false;
  const fullWidth = field.fullWidth ? 'field--full' : '';

  return `
    <div class="field ${fullWidth}">
      <label class="field-label" for="${id}">
        <span>${escapeHtml(field.label)}${required ? ' <span class="text-rose-400" aria-hidden="true">*</span>' : ''}</span>
        ${required ? '' : '<span class="field-optional">Opcional</span>'}
      </label>
      ${renderFieldControl(exercise, field)}
      ${field.help ? `<p class="field-help" id="${id}-help">${escapeHtml(field.help)}</p>` : `<span id="${id}-help" class="sr-only">Campo ${escapeHtml(field.label)}</span>`}
      <p class="field-error" id="${id}-error" data-error-for="${field.name}" hidden></p>
    </div>
  `;
}

function renderNumberListField(exercise, field) {
  const id = buildFieldId(exercise, field);
  const min = field.min !== undefined ? `min="${field.min}"` : '';
  const max = field.max !== undefined ? `max="${field.max}"` : '';

  return `
    <div class="field field--full">
      <label class="field-label" for="${id}-input">
        <span>${escapeHtml(field.label)} <span class="text-rose-400" aria-hidden="true">*</span></span>
        <span class="field-optional">Se procesan en orden</span>
      </label>
      <div class="number-list">
        <div class="number-list__row">
          <input
            type="number"
            id="${id}-input"
            class="field-control"
            data-number-input
            ${min}
            ${max}
            step="${field.step ?? '1'}"
            inputmode="numeric"
            autocomplete="off"
            placeholder="${escapeHtml(field.placeholder ?? 'Escribe un número')}"
            aria-describedby="${id}-help ${id}-error"
          />
          <button type="button" class="btn btn-secondary shrink-0" data-add-number>
            ${icon('plus', 'h-4 w-4')}
            Agregar número
          </button>
        </div>
        <p class="field-help" id="${id}-help">${escapeHtml(field.help ?? '')}</p>
        <div class="number-chips" data-number-chips aria-live="polite"></div>
        <p class="field-error" id="${id}-error" data-error-for="${field.name}" hidden></p>
      </div>
    </div>
  `;
}

function renderFields(exercise) {
  return exercise.fields
    .map((field) =>
      field.type === 'number-list'
        ? renderNumberListField(exercise, field)
        : renderStandardField(exercise, field),
    )
    .join('');
}

function renderRules(rules) {
  if (!Array.isArray(rules) || rules.length === 0) {
    return '';
  }

  return `
    <ul class="rule-list mt-4">
      ${rules.map((rule) => `<li><span>${escapeHtml(rule)}</span></li>`).join('')}
    </ul>
  `;
}

function buildWorkspace(exercise) {
  const number = String(exercise.number).padStart(2, '0');
  const mode = MODE_LABELS[exercise.mode];
  const hasExample = Boolean(exercise.example);

  return `
    <article class="workspace-panel scroll-mt-24" aria-labelledby="workspace-title">
      <header class="workspace-header">
        <p class="workspace-kicker">
          <span>Ejercicio ${number}</span>
          <span aria-hidden="true">·</span>
          <span>${escapeHtml(exercise.structure)}</span>
        </p>
        <h3 class="workspace-title focus-ring" id="workspace-title" tabindex="-1">${escapeHtml(exercise.title)}</h3>
        <p class="workspace-subtitle">${escapeHtml(exercise.shortDescription)}</p>
        <div class="mt-4 flex flex-wrap items-center gap-2">
          <span class="meta-pill ${exercise.mode === 'sync' ? 'meta-pill--sync' : 'meta-pill--async'}">
            ${icon(exercise.mode === 'sync' ? 'calculator' : 'clock', 'h-3 w-3')}
            ${mode.pill}
          </span>
          <span class="meta-pill">${icon('book', 'h-3 w-3')} ${escapeHtml(exercise.level ?? 'Básico')}</span>
          <span class="meta-pill">${icon('spark', 'h-3 w-3')} Código real ejecutado</span>
        </div>
      </header>

      <section class="block" aria-labelledby="block-concepto">
        <p class="block-label" id="block-concepto"><span class="block-number">01</span>Concepto</p>
        <h4 class="block-title">${escapeHtml(exercise.concept.title)}</h4>
        <p class="block-body">${escapeHtml(exercise.concept.text)}</p>
        <ul class="rule-list mt-3">
          ${exercise.concept.bullets.map((bullet) => `<li><span>${escapeHtml(bullet)}</span></li>`).join('')}
        </ul>
        ${
          exercise.concept.syntax
            ? `<pre class="concept-syntax" tabindex="0" aria-label="Sintaxis de referencia"><code>${escapeHtml(exercise.concept.syntax)}</code></pre>`
            : ''
        }
      </section>

      <section class="block" aria-labelledby="block-enunciado">
        <p class="block-label" id="block-enunciado"><span class="block-number">02</span>Enunciado y objetivo</p>
        <p class="block-body">${escapeHtml(exercise.statement)}</p>

        <div class="objective-box mt-4">
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-mint-300">Objetivo de aprendizaje</p>
          <p class="mt-1.5 text-sm leading-relaxed text-slate-300">${escapeHtml(exercise.objective)}</p>
        </div>

        ${renderRules(exercise.rules)}

        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Datos de entrada</p>
            <ul class="mt-2 space-y-1 text-xs leading-relaxed text-slate-400">
              ${exercise.inputs.map((input) => `<li class="flex gap-2"><span class="text-brand-400" aria-hidden="true">•</span><span>${escapeHtml(input)}</span></li>`).join('')}
            </ul>
          </div>
          <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Salida esperada</p>
            <p class="mt-2 text-xs leading-relaxed text-slate-400">${escapeHtml(exercise.output)}</p>
          </div>
        </div>
      </section>

      <div class="grid min-w-0 xl:grid-cols-2">
        <section class="block border-b xl:border-b-0 xl:border-r" aria-labelledby="block-entrada">
          <p class="block-label" id="block-entrada"><span class="block-number">03</span>Entrada de datos</p>
          <p class="mt-2 text-xs text-slate-400">
            Formulario HTML real, sin <code class="inline-code">prompt()</code>. Los mensajes de error se muestran junto a cada campo.
          </p>

          <form id="exercise-form" class="mt-4" novalidate>
            <div class="form-grid">
              ${renderFields(exercise)}
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" data-submit>
                ${icon('play', 'h-4 w-4')}
                <span data-submit-label>Ejecutar ejercicio</span>
              </button>
              ${
                hasExample
                  ? `<button type="button" class="btn btn-secondary" data-fill-example>
                      ${icon('spark', 'h-4 w-4')}
                      Usar datos de ejemplo
                    </button>`
                  : ''
              }
              <button type="reset" class="btn btn-ghost" data-reset>
                ${icon('reset', 'h-4 w-4')}
                Limpiar
              </button>
            </div>
            <p class="mt-3 text-[11px] leading-relaxed text-slate-400">
              Los campos marcados con <span class="text-rose-400">*</span> son obligatorios. No se ejecuta la lógica
              si queda algún dato inválido.
            </p>
          </form>
        </section>

        <section class="block" aria-labelledby="block-codigo">
          <p class="block-label" id="block-codigo"><span class="block-number">04</span>Código fuente</p>
          <p class="mt-2 text-xs leading-relaxed text-slate-400">
            Este bloque se genera con <code class="inline-code">Function.prototype.toString()</code> de la función
            que se ejecuta: no existe una copia separada que pueda desincronizarse.
          </p>
          <div class="mt-3">
            ${renderCodeBlock(exercise.code)}
          </div>
        </section>
      </div>

      <section class="block" aria-labelledby="block-ejecucion">
        <p class="block-label" id="block-ejecucion"><span class="block-number">05</span>Ejecución</p>
        <div class="mt-3" id="execution-region">${executionIdle(exercise)}</div>
      </section>

      <section class="block" aria-labelledby="block-resultado">
        <p class="block-label" id="block-resultado"><span class="block-number">06</span>Resultado</p>
        <div class="mt-3" id="result-region" aria-live="polite" aria-atomic="true">${idleResult()}</div>
      </section>

      <section class="block" aria-labelledby="block-explicacion">
        <p class="block-label" id="block-explicacion"><span class="block-number">07</span>Explicación del procedimiento</p>
        <div class="mt-3" id="explanation-region">${idleExplanation()}</div>
      </section>
    </article>
  `;
}

export class ExerciseWorkspace {
  constructor({ panel, switcher, exercises, onComplete }) {
    this.panel = panel;
    this.switcher = switcher;
    this.exercises = exercises;
    this.onComplete = onComplete ?? (() => {});
    this.current = null;
    this.numberValues = [];
    this.completed = new Set();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitcherClick = this.handleSwitcherClick.bind(this);

    this.switcher.addEventListener('click', this.handleSwitcherClick);
    this.renderSwitcher();
  }

  renderSwitcher() {
    this.switcher.innerHTML = this.exercises
      .map(
        (exercise) => `
          <button type="button" class="switcher-item" data-switch-exercise="${exercise.id}" aria-pressed="false">
            <span class="switcher-item__num" aria-hidden="true">${String(exercise.number).padStart(2, '0')}</span>
            <span class="truncate">${escapeHtml(exercise.navTitle)}</span>
            <span class="ml-auto hidden shrink-0 text-mint-400" data-done-mark>${icon('check-circle', 'h-3.5 w-3.5')}</span>
          </button>`,
      )
      .join('');

    this.syncSwitcherState();
  }

  handleSwitcherClick(event) {
    const button = event.target.closest('[data-switch-exercise]');
    if (!button) {
      return;
    }
    this.open(button.dataset.switchExercise);
  }

  setCompleted(ids) {
    this.completed = new Set(ids);
    this.syncSwitcherState();
  }

  syncSwitcherState() {
    this.switcher.querySelectorAll('[data-switch-exercise]').forEach((button) => {
      const id = button.dataset.switchExercise;
      const active = this.current?.id === id;
      const done = this.completed.has(id);
      button.classList.toggle('is-active', active);
      button.classList.toggle('is-done', done);
      button.setAttribute('aria-pressed', String(active));
      const mark = button.querySelector('[data-done-mark]');
      if (mark) {
        mark.classList.toggle('hidden', !done);
      }
    });
  }

  open(id, { scroll = false, focus = false } = {}) {
    const exercise = this.exercises.find((item) => item.id === id);
    if (!exercise) {
      return;
    }

    this.current = exercise;
    this.numberValues = [];
    this.panel.innerHTML = buildWorkspace(exercise);
    this.bindForm(exercise);
    this.renderChips();
    this.syncSwitcherState();

    if (scroll) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }

    if (focus) {
      const title = this.panel.querySelector('#workspace-title');
      title?.focus({ preventScroll: true });
    }
  }

  bindForm(exercise) {
    const form = this.panel.querySelector('#exercise-form');
    if (!form) {
      return;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      void this.handleSubmit();
    });

    form.addEventListener('reset', () => {
      window.setTimeout(() => this.resetUi(), 0);
    });

    this.panel.querySelector('[data-fill-example]')?.addEventListener('click', () => {
      this.fillExample(exercise);
    });

    this.panel.querySelector('[data-add-number]')?.addEventListener('click', () => {
      this.addNumber(exercise);
    });

    this.panel.querySelector('[data-number-input]')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.addNumber(exercise);
      }
    });

    this.panel.querySelector('[data-number-chips]')?.addEventListener('click', (event) => {
      const removeButton = event.target.closest('[data-remove-number]');
      if (!removeButton) {
        return;
      }
      const index = Number(removeButton.dataset.removeNumber);
      this.numberValues.splice(index, 1);
      this.renderChips();
      this.clearNumberError(exercise);
    });
  }

  renderChips() {
    const container = this.panel.querySelector('[data-number-chips]');
    if (!container) {
      return;
    }

    if (this.numberValues.length === 0) {
      container.innerHTML = '<p class="number-empty">Todavía no has agregado números.</p>';
      return;
    }

    container.innerHTML = this.numberValues
      .map(
        (value, index) => `
          <span class="number-chip">
            ${formatNumber(value)}
            <button type="button" class="number-chip__remove" data-remove-number="${index}" aria-label="Quitar el número ${formatNumber(value)}">
              ${icon('close', 'h-3 w-3')}
            </button>
          </span>`,
      )
      .join('');
  }

  clearNumberError(exercise) {
    const field = exercise.fields.find((item) => item.type === 'number-list');
    if (!field) {
      return;
    }
    const error = this.panel.querySelector(`[data-error-for="${field.name}"]`);
    if (error) {
      error.textContent = '';
      error.hidden = true;
    }
    this.panel.querySelector('[data-number-input]')?.removeAttribute('aria-invalid');
  }

  addNumber(exercise) {
    const field = exercise.fields.find((item) => item.type === 'number-list');
    const input = this.panel.querySelector('[data-number-input]');
    const error = field ? this.panel.querySelector(`[data-error-for="${field.name}"]`) : null;
    if (!field || !input) {
      return;
    }

    const raw = input.value.trim();
    const value = parseNumber(raw);

    const fail = (message) => {
      if (error) {
        error.textContent = message;
        error.hidden = false;
      }
      input.setAttribute('aria-invalid', 'true');
      input.focus();
    };

    if (raw === '') {
      fail('Escribe un número antes de agregarlo a la lista.');
      return;
    }
    if (!Number.isFinite(value)) {
      fail('El valor debe ser un número válido.');
      return;
    }
    if (field.integer && !Number.isInteger(value)) {
      fail('Solo se permiten números enteros.');
      return;
    }
    if (field.min !== undefined && value < field.min) {
      fail(`El número debe ser mayor o igual que ${field.min}.`);
      return;
    }
    if (field.max !== undefined && value > field.max) {
      fail(`El número debe ser menor o igual que ${field.max}.`);
      return;
    }
    if (field.maxItems && this.numberValues.length >= field.maxItems) {
      fail(`Puedes agregar como máximo ${field.maxItems} números.`);
      return;
    }

    this.numberValues.push(value);
    input.value = '';
    input.removeAttribute('aria-invalid');
    if (error) {
      error.textContent = '';
      error.hidden = true;
    }
    this.renderChips();
    input.focus();
  }

  fillExample(exercise) {
    const form = this.panel.querySelector('#exercise-form');
    const example = exercise.example;
    if (!form || !example) {
      return;
    }

    this.clearErrors();

    for (const field of exercise.fields) {
      if (field.type === 'number-list') {
        this.numberValues = Array.isArray(example[field.name]) ? [...example[field.name]] : [];
        this.renderChips();
        continue;
      }

      const control = form.elements.namedItem(field.name);
      if (control && example[field.name] !== undefined) {
        control.value = String(example[field.name]);
      }
    }

    this.resetOutput();
    form.elements.namedItem(exercise.fields[0]?.name)?.focus?.();
  }

  resetUi() {
    this.numberValues = [];
    this.renderChips();
    this.clearErrors();
    this.resetOutput();
  }

  resetOutput() {
    const exercise = this.current;
    if (!exercise) {
      return;
    }

    this.panel.querySelector('#result-region').innerHTML = idleResult();
    this.panel.querySelector('#execution-region').innerHTML = executionIdle(exercise);
    this.panel.querySelector('#explanation-region').innerHTML = idleExplanation();
    this.panel.querySelector('#exercise-form')?.removeAttribute('aria-busy');
  }

  clearErrors() {
    this.panel.querySelectorAll('[data-error-for]').forEach((element) => {
      element.textContent = '';
      element.hidden = true;
    });
    this.panel.querySelectorAll('[aria-invalid="true"]').forEach((element) => {
      element.removeAttribute('aria-invalid');
    });
  }

  setFieldError(name, message) {
    const error = this.panel.querySelector(`[data-error-for="${name}"]`);
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }

    const field = this.current?.fields.find((item) => item.name === name);
    const control =
      field?.type === 'number-list'
        ? this.panel.querySelector('[data-number-input]')
        : this.panel.querySelector(`[name="${name}"]`);

    control?.setAttribute('aria-invalid', 'true');
    return control;
  }

  readValues(exercise) {
    const form = this.panel.querySelector('#exercise-form');
    const rawValues = {};

    for (const field of exercise.fields) {
      if (field.type === 'number-list') {
        rawValues[field.name] = [...this.numberValues];
      } else {
        rawValues[field.name] = form.elements.namedItem(field.name)?.value ?? '';
      }
    }

    return rawValues;
  }

  async handleSubmit() {
    const exercise = this.current;
    if (!exercise) {
      return;
    }

    this.clearErrors();

    const rawValues = this.readValues(exercise);
    const { errors, values } = validateValues(exercise.fields, rawValues);

    if (typeof exercise.validate === 'function') {
      const extraErrors = exercise.validate(values, rawValues) ?? {};
      for (const [name, message] of Object.entries(extraErrors)) {
        if (!errors[name]) {
          errors[name] = message;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      this.showValidationErrors(errors);
      return;
    }

    const isAsync = exercise.mode !== 'sync';
    this.setBusy(true, isAsync);
    this.renderExecutionRunning(exercise);
    if (isAsync) {
      this.renderLoading(exercise);
    }

    const startedAt = performance.now();

    try {
      const rawResult = await exercise.logic(values);
      const elapsed = performance.now() - startedAt;
      const result = typeof exercise.toResult === 'function' ? exercise.toResult(rawResult) : rawResult;

      this.renderResult(result);
      this.renderExecutionResult(exercise, result, elapsed);
      this.renderExplanation(exercise, rawResult);

      if (result.ok !== false) {
        this.onComplete(exercise.id);
      }
    } catch (error) {
      const elapsed = performance.now() - startedAt;
      this.renderThrownError(error);
      this.renderExecutionError(exercise, elapsed);
      this.panel.querySelector('#explanation-region').innerHTML = `
        <p class="text-sm leading-relaxed text-slate-400">
          La ejecución se detuvo antes de completarse, por eso no hay una explicación del resultado.
          Corrige el dato señalado e inténtalo de nuevo.
        </p>
      `;
    } finally {
      this.setBusy(false, isAsync);
    }
  }

  showValidationErrors(errors) {
    const exercise = this.current;
    if (!exercise) {
      return;
    }

    const entries = Object.entries(errors);
    let firstControl = null;

    for (const [name, message] of entries) {
      const control = this.setFieldError(name, message);
      if (!firstControl && control) {
        firstControl = control;
      }
    }

    const region = this.panel.querySelector('#result-region');
    region.innerHTML = `
      <div class="result-zone result-zone--error">
        <span class="result-badge result-badge--error">${icon('alert', 'h-3 w-3')} Validación</span>
        <p class="result-headline">El ejercicio no se ejecutó</p>
        <p class="mt-2 text-sm leading-relaxed text-rose-100/80">
          Se encontraron ${entries.length} ${entries.length === 1 ? 'dato que necesita corrección' : 'datos que necesitan corrección'}.
          Revisa los mensajes junto a cada campo.
        </p>
        <ul class="result-error-list">
          ${entries.map(([, message]) => `<li>• ${escapeHtml(message)}</li>`).join('')}
        </ul>
      </div>
    `;

    this.panel.querySelector('#execution-region').innerHTML = `
      <div class="execution-card">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-xs font-semibold text-slate-300">Estado de la ejecución</p>
          <span class="result-badge bg-rose-400/15 text-rose-300">${icon('alert', 'h-3 w-3')} Detenido</span>
        </div>
        <div class="execution-grid">
          <div class="execution-metric">
            <p class="execution-metric__label">Modo</p>
            <p class="execution-metric__value">${MODE_LABELS[exercise.mode].card}</p>
          </div>
          <div class="execution-metric">
            <p class="execution-metric__label">Tiempo</p>
            <p class="execution-metric__value">—</p>
          </div>
          <div class="execution-metric">
            <p class="execution-metric__label">Validación</p>
            <p class="execution-metric__value text-rose-300">Fallida</p>
          </div>
        </div>
        <ol class="execution-log">
          <li class="execution-step is-done"><span class="execution-step__dot"></span><span>Se leyeron los datos del formulario.</span></li>
          <li class="execution-step"><span class="execution-step__dot bg-rose-400"></span><span>La validación encontró errores: la lógica no se ejecutó.</span></li>
        </ol>
      </div>
    `;

    this.panel.querySelector('#explanation-region').innerHTML = `
      <p class="text-sm leading-relaxed text-slate-400">
        La explicación aparecerá cuando los datos sean válidos y la ejecución finalice correctamente.
      </p>
    `;

    firstControl?.focus();
  }

  renderLoading(exercise) {
    const seconds = ((exercise.delayMs ?? 1500) / 1000).toFixed(1).replace('.', ',');

    this.panel.querySelector('#result-region').innerHTML = `
      <div class="result-zone result-zone--loading">
        <span class="result-badge result-badge--loading">
          <span class="spinner h-3 w-3" aria-hidden="true"></span>
          Promesa pendiente
        </span>
        <p class="result-headline">Operación asíncrona en curso…</p>
        <p class="mt-2 text-sm leading-relaxed text-slate-300">
          La función <code class="inline-code">async</code> está esperando con <code class="inline-code">await</code>
          una respuesta simulada de ${seconds} s. El hilo principal sigue libre: la interfaz no se congeló.
        </p>
        <div class="mt-4 space-y-2" aria-hidden="true">
          <div class="h-2.5 w-3/4 animate-pulse rounded-full bg-brand-400/20"></div>
          <div class="h-2.5 w-1/2 animate-pulse rounded-full bg-brand-400/10"></div>
        </div>
      </div>
    `;
  }

  renderResult(result) {
    const isError = result.ok === false;
    const zoneClass = isError ? 'result-zone--error' : 'result-zone--success';
    const badgeClass = isError ? 'result-badge--error' : 'result-badge--success';
    const badgeIcon = isError ? 'alert' : 'check';
    const badgeLabel = isError ? 'Revisión' : 'Completado';
    const notes = renderNotes(result.notes);
    const errors = Array.isArray(result.errores) && result.errores.length > 0
      ? `<ul class="result-error-list">${result.errores.map((item) => `<li>• ${escapeHtml(item)}</li>`).join('')}</ul>`
      : '';

    this.panel.querySelector('#result-region').innerHTML = `
      <div class="result-zone ${zoneClass}">
        <span class="result-badge ${badgeClass}">${icon(badgeIcon, 'h-3 w-3')} ${badgeLabel}</span>
        <p class="result-headline">${escapeHtml(result.headline ?? 'Resultado de la ejecución')}</p>
        ${renderDetails(result.details)}
        ${renderTable(result.table)}
        ${notes}
        ${errors}
      </div>
    `;
  }

  renderThrownError(error) {
    const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';

    this.panel.querySelector('#result-region').innerHTML = `
      <div class="result-zone result-zone--error">
        <span class="result-badge result-badge--error">${icon('alert', 'h-3 w-3')} Error</span>
        <p class="result-headline">La función lanzó una excepción controlada</p>
        <p class="mt-2 text-sm leading-relaxed text-rose-100/80">${escapeHtml(message)}</p>
      </div>
    `;
  }

  renderExecutionRunning(exercise) {
    this.panel.querySelector('#execution-region').innerHTML = `
      <div class="execution-card" aria-busy="true">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-xs font-semibold text-slate-300">Estado de la ejecución</p>
          <span class="result-badge result-badge--loading">
            <span class="spinner h-3 w-3" aria-hidden="true"></span>
            En curso
          </span>
        </div>
        <div class="execution-grid">
          <div class="execution-metric">
            <p class="execution-metric__label">Modo</p>
            <p class="execution-metric__value">${MODE_LABELS[exercise.mode].card}</p>
          </div>
          <div class="execution-metric">
            <p class="execution-metric__label">Tiempo</p>
            <p class="execution-metric__value" data-execution-time>…</p>
          </div>
          <div class="execution-metric">
            <p class="execution-metric__label">Validación</p>
            <p class="execution-metric__value text-mint-300">Superada</p>
          </div>
        </div>
        <ol class="execution-log">
          <li class="execution-step is-done"><span class="execution-step__dot"></span><span>Se leyeron los datos del formulario.</span></li>
          <li class="execution-step is-done"><span class="execution-step__dot"></span><span>Las entradas superaron la validación declarativa.</span></li>
          <li class="execution-step"><span class="execution-step__dot animate-pulse-soft"></span><span>${
            exercise.mode === 'sync'
              ? 'Ejecutando la función síncrona en el hilo principal…'
              : 'Esperando la resolución de la Promise con await…'
          }</span></li>
        </ol>
      </div>
    `;
  }

  renderExecutionResult(exercise, result, elapsed) {
    const isError = result.ok === false;
    const badgeClass = isError ? 'bg-rose-400/15 text-rose-300' : 'bg-mint-400/15 text-mint-300';
    const badgeIcon = isError ? 'alert' : 'check';
    const badgeLabel = isError ? 'Con observaciones' : 'Completado';

    const thirdStep =
      exercise.mode === 'sync'
        ? 'Se ejecutó la función síncrona y se capturó su valor de retorno.'
        : exercise.mode === 'async'
          ? 'La Promise se resolvió y await devolvió el valor sin bloquear la interfaz.'
          : 'La validación síncrona dio paso al envío asíncrono, resuelto con await.';

    this.panel.querySelector('#execution-region').innerHTML = `
      <div class="execution-card">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-xs font-semibold text-slate-300">Estado de la ejecución</p>
          <span class="result-badge ${badgeClass}">${icon(badgeIcon, 'h-3 w-3')} ${badgeLabel}</span>
        </div>
        <div class="execution-grid">
          <div class="execution-metric">
            <p class="execution-metric__label">Modo</p>
            <p class="execution-metric__value">${MODE_LABELS[exercise.mode].card}</p>
          </div>
          <div class="execution-metric">
            <p class="execution-metric__label">Tiempo</p>
            <p class="execution-metric__value">${formatDuration(elapsed)}</p>
          </div>
          <div class="execution-metric">
            <p class="execution-metric__label">Validación</p>
            <p class="execution-metric__value text-mint-300">Superada</p>
          </div>
        </div>
        <ol class="execution-log">
          <li class="execution-step is-done"><span class="execution-step__dot"></span><span>Se leyeron los datos del formulario.</span></li>
          <li class="execution-step is-done"><span class="execution-step__dot"></span><span>Las entradas superaron la validación declarativa.</span></li>
          <li class="execution-step is-done"><span class="execution-step__dot"></span><span>${thirdStep}</span></li>
          <li class="execution-step is-done"><span class="execution-step__dot"></span><span>Se renderizaron el resultado y la explicación.</span></li>
        </ol>
      </div>
    `;
  }

  renderExecutionError(exercise, elapsed) {
    this.panel.querySelector('#execution-region').innerHTML = `
      <div class="execution-card">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-xs font-semibold text-slate-300">Estado de la ejecución</p>
          <span class="result-badge bg-rose-400/15 text-rose-300">${icon('alert', 'h-3 w-3')} Error</span>
        </div>
        <div class="execution-grid">
          <div class="execution-metric">
            <p class="execution-metric__label">Modo</p>
            <p class="execution-metric__value">${MODE_LABELS[exercise.mode].card}</p>
          </div>
          <div class="execution-metric">
            <p class="execution-metric__label">Tiempo</p>
            <p class="execution-metric__value">${formatDuration(elapsed)}</p>
          </div>
          <div class="execution-metric">
            <p class="execution-metric__label">Validación</p>
            <p class="execution-metric__value text-mint-300">Superada</p>
          </div>
        </div>
        <p class="mt-3 text-xs leading-relaxed text-rose-200">
          La lógica lanzó una excepción controlada. El mensaje se muestra en el bloque de resultado.
        </p>
      </div>
    `;
  }

  renderExplanation(exercise, result) {
    const steps = typeof exercise.explain === 'function' ? exercise.explain(result) : [];
    const region = this.panel.querySelector('#explanation-region');

    if (!Array.isArray(steps) || steps.length === 0) {
      region.innerHTML = `
        <p class="text-sm leading-relaxed text-slate-400">No hay una explicación disponible para esta ejecución.</p>
      `;
      return;
    }

    region.innerHTML = `
      <ol class="explanation-list">
        ${steps
          .map(
            (step, index) => `
              <li class="explanation-item">
                <span class="explanation-number" aria-hidden="true">${index + 1}</span>
                <div>
                  <p class="explanation-title">${escapeHtml(step.title)}</p>
                  <p class="explanation-text">${escapeHtml(step.text)}</p>
                </div>
              </li>`,
          )
          .join('')}
      </ol>
    `;
  }

  setBusy(isBusy, isAsync) {
    const submit = this.panel.querySelector('[data-submit]');
    const form = this.panel.querySelector('#exercise-form');

    if (!submit) {
      return;
    }

    submit.disabled = isBusy;
    this.panel.querySelectorAll('[data-fill-example], [data-reset]').forEach((button) => {
      button.disabled = isBusy;
    });

    if (isBusy) {
      submit.innerHTML = `
        <span class="spinner" aria-hidden="true"></span>
        <span>${isAsync ? 'Consultando…' : 'Ejecutando…'}</span>
      `;
      form?.setAttribute('aria-busy', 'true');
    } else {
      submit.innerHTML = `
        ${icon('play', 'h-4 w-4')}
        <span data-submit-label>Ejecutar ejercicio</span>
      `;
      form?.removeAttribute('aria-busy');
    }
  }
}
