import { exercises } from "./exercises/index.js";

const $ = (selector) => document.querySelector(selector);
const grid = $("#exercise-grid");
const workspace = $("#exercise-workspace");
const emptyWorkspace = $("#empty-workspace");
const form = $("#exercise-form");
const runButton = $("#run-button");
let activeExercise = null;

function renderCards() {
  grid.innerHTML = exercises.map((exercise) => `
    <button class="exercise-card ${activeExercise?.id === exercise.id ? "active" : ""}" type="button" data-exercise="${exercise.id}">
      <div class="flex items-center justify-between"><span class="exercise-number">EJERCICIO ${exercise.id}</span><span class="text-slate-500">↗</span></div>
      <h3 class="font-semibold text-white mt-5">${escapeHTML(exercise.title)}</h3>
      <p class="text-sm text-slate-400 mt-2 leading-relaxed min-h-[60px]">${escapeHTML(exercise.short)}</p>
      <div class="mt-4"><span class="tag">${escapeHTML(exercise.category)}</span></div>
    </button>`).join("");
  grid.querySelectorAll("[data-exercise]").forEach(button => {
    button.addEventListener("click", () => selectExercise(button.dataset.exercise));
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

function selectExercise(id) {
  activeExercise = exercises.find(exercise => exercise.id === id);
  if (!activeExercise) return;
  $("#exercise-number").textContent = `EJERCICIO ${activeExercise.id}`;
  $("#exercise-title").textContent = activeExercise.title;
  $("#exercise-description").textContent = activeExercise.description;
  $("#exercise-category").textContent = activeExercise.category;
  $("#exercise-theory").textContent = activeExercise.theory;
  $("#exercise-objective").textContent = activeExercise.objective;
  $("#exercise-statement").textContent = activeExercise.statement;
  $("#exercise-code").textContent = activeExercise.code;
  $("#result-output").textContent = "Completa los datos y ejecuta el ejercicio para ver el resultado.";
  $("#step-explanation").innerHTML = "<li>La explicación aparecerá después de ejecutar el ejercicio.</li>";
  $("#validation-message").classList.add("hidden");
  renderForm(activeExercise.fields);
  workspace.classList.remove("hidden");
  emptyWorkspace.classList.add("hidden");
  renderCards();
  $("#laboratorio").scrollIntoView({behavior:"smooth",block:"start"});
}

function renderForm(fields) {
  form.innerHTML = fields.map(field => {
    const id = `field-${field.name}`;
    let control;
    if (field.type === "select") {
      control = `<select class="field-select" id="${id}" name="${field.name}" ${field.required ? "required" : ""}>
        ${field.options.map(([value,label]) => `<option value="${escapeHTML(value)}">${escapeHTML(label)}</option>`).join("")}
      </select>`;
    } else {
      control = `<input class="field-input" id="${id}" name="${field.name}" type="${field.type}" ${field.min !== undefined ? `min="${field.min}"` : ""} ${field.max !== undefined ? `max="${field.max}"` : ""} placeholder="${escapeHTML(field.placeholder || "")}" ${field.required ? "required" : ""} ${field.type === "number" ? 'step="any"' : ""}>`;
    }
    return `<div><label class="field-label" for="${id}">${escapeHTML(field.label)}</label>${control}</div>`;
  }).join("");
}

function readForm() {
  const values = Object.fromEntries(new FormData(form).entries());
  return values;
}

function showSteps(steps) {
  $("#step-explanation").innerHTML = steps.map((step,index) =>
    `<li class="step-item" data-step="${index+1}">${escapeHTML(step)}</li>`
  ).join("");
}

async function executeExercise() {
  if (!activeExercise) return;
  const validation = $("#validation-message");
  validation.classList.add("hidden");
  const output = $("#result-output");
  runButton.disabled = true;
  runButton.textContent = "Ejecutando...";
  output.textContent = "Procesando ejercicio...";
  try {
    const result = await activeExercise.run(readForm());
    output.textContent = result.output;
    showSteps(result.steps);
  } catch (error) {
    validation.textContent = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
    validation.classList.remove("hidden");
    output.textContent = "No fue posible completar el ejercicio. Revisa los datos e inténtalo nuevamente.";
    $("#step-explanation").innerHTML = "<li>Corrige los datos indicados en el mensaje de validación y vuelve a ejecutar.</li>";
  } finally {
    runButton.disabled = false;
    runButton.textContent = "▶ Ejecutar ejercicio";
  }
}

runButton.addEventListener("click", executeExercise);
form.addEventListener("submit", event => { event.preventDefault(); executeExercise(); });
$("#mobile-menu-button").addEventListener("click", () => {
  const menu = $("#mobile-menu"), button = $("#mobile-menu-button");
  const isOpen = !menu.classList.contains("hidden");
  menu.classList.toggle("hidden", isOpen);
  button.setAttribute("aria-expanded", String(!isOpen));
});
$("#mobile-menu").querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  $("#mobile-menu").classList.add("hidden");
  $("#mobile-menu-button").setAttribute("aria-expanded","false");
}));

renderCards();
