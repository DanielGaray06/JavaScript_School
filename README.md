# CodeLab JS

Plataforma educativa interactiva para aprender las **ocho estructuras fundamentales de programación en JavaScript** escribiendo datos en formularios HTML y ejecutando código real en el navegador.

Cada ejercicio muestra el código fuente que se va a ejecutar, valida la entrada, ejecuta la lógica y explica paso a paso qué ocurrió. No hay ejercicios "de mentira": la misma función que ves en pantalla es la que produce el resultado.

---

## 1. Objetivos

- Enseñar **estructura secuencial, condicional simple, condicional anidado, ciclo `for`, ciclo `while`, funciones síncronas, funciones asíncronas y combinación de ambas**.
- Reemplazar `prompt()` y `alert()` por formularios HTML reales con validación accesible.
- Garantizar que el código mostrado y el código ejecutado sean **exactamente el mismo**.
- Ofrecer una experiencia responsive (320 px – 1920 px), accesible y sin dependencias de frameworks.

## 2. Stack

| Capa | Tecnología |
| --- | --- |
| Estructura | HTML5 semántico |
| Estilos | Tailwind CSS 3.4 compilado localmente + CSS propio |
| Lógica | JavaScript ES2022 con módulos nativos (`type="module"`) |
| Build | Tailwind CLI |
| Servidor local | `http-server` |
| Pruebas | `node:test` (sin frameworks) |
| Gestor de paquetes | `pnpm` |

Sin React, Vue, Angular, jQuery, Bootstrap ni Tailwind por CDN. El único recurso externo opcional son las tipografías de Google Fonts; si no hay red, el navegador usa las fuentes del sistema definidas en `tailwind.config.cjs`.

## 3. Requisitos

- Node.js 18 o superior (probado con Node 24).
- pnpm 8 o superior (probado con pnpm 12).

## 4. Instalación y ejecución

```bash
# 1. Instalar dependencias
pnpm install

# 2. Compilar Tailwind y levantar el servidor en http://localhost:5173
pnpm start
```

Para desarrollo con recarga de CSS:

```bash
pnpm dev
```

| Comando | Qué hace |
| --- | --- |
| `pnpm build` | Compila `assets/css/styles.css` a `assets/css/build.css` minificado. |
| `pnpm dev` | Ejecuta Tailwind en modo `--watch` y el servidor en paralelo. |
| `pnpm dev:css` | Solo Tailwind en modo vigilancia. |
| `pnpm dev:web` | Solo servidor estático en el puerto 5173. |
| `pnpm start` | Compila una vez y sirve el proyecto. |
| `pnpm test` | Ejecuta las pruebas de lógica y validación. |

> `build.css` está versionado para que el sitio funcione aunque no se ejecute el build. Si modificas clases de Tailwind en el HTML o en los módulos JS, vuelve a ejecutar `pnpm build`.

## 5. Estructura del proyecto

```text
.
├── index.html                     # Página única: hero, catálogo, taller, conceptos y proyecto
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.cjs            # Contenido escaneado, tema y animaciones
├── README.md
├── assets/
│   ├── css/
│   │   ├── styles.css             # Fuente: @tailwind + componentes y utilidades propias
│   │   └── build.css              # Salida compilada y minificada (la que enlaza el HTML)
│   ├── images/
│   │   └── favicon.svg
│   └── js/
│       ├── main.js                # Arranque, catálogo, conceptos, progreso y navegación
│       ├── exercises/             # Un archivo por ejercicio (lógica pura + metadatos)
│       │   ├── sequential.js
│       │   ├── conditional-simple.js
│       │   ├── conditional-nested.js
│       │   ├── for-loop.js
│       │   ├── while-loop.js
│       │   ├── async-function.js
│       │   ├── sync-function.js
│       │   └── combined-functions.js
│       ├── ui/
│       │   ├── workspace.js       # Formularios, validación, ejecución y renderizado
│       │   ├── code-block.js      # Resaltado, numeración y botón de copiar
│       │   ├── navigation.js      # Menú móvil y navegación activa
│       │   ├── progress.js        # Progreso en localStorage
│       │   └── icons.js           # Iconos SVG reutilizables
│       └── utils/
│           ├── validation.js      # Reglas declarativas reutilizables
│           ├── source.js          # toSource(): código mostrado = código ejecutado
│           └── html.js            # escapeHtml() y formatNumber()
└── tests/
    └── exercises.test.js          # 11 pruebas con node:test
```

Las carpetas `plataforma_js_educativa/` y `opencode_JS/` que ya existían en el directorio se dejaron intactas.

## 6. Los ocho ejercicios

| # | Ejercicio | Estructura | Nivel | Entrada principal |
| --- | --- | --- | --- | --- |
| 01 | Ficha personal y año en que cumplirás 100 | Secuencial | Básico | Nombre, edad, año de nacimiento |
| 02 | Mayoría de edad con un condicional simple | `if` | Básico | Edad |
| 03 | Control de acceso con condicionales anidados | `if` anidado | Intermedio | Edad y nacionalidad |
| 04 | Tabla de multiplicar con un ciclo `for` | Repetitiva `for` | Básico | Número del 1 al 20 |
| 05 | Suma de una secuencia con `while` | Repetitiva `while` | Intermedio | Lista de números separados por comas (0 = centinela) |
| 06 | Consulta asíncrona de un estudiante | `async` / `await` | Intermedio | Nombre y código estudiantil |
| 07 | Calculadora con función síncrona | Función síncrona | Básico | Dos números y operación |
| 08 | Registro de usuario: validar y luego enviar | Síncrona + asíncrona | Avanzado | Nombre, edad y correo |

### Teoría resumida

1. **Secuencial**: las instrucciones se ejecutan una sola vez, en orden, de arriba abajo. Cada cálculo usa los resultados del anterior.
2. **Condicional simple**: un bloque `if` se ejecuta solo cuando la condición es verdadera; si es falsa, el flujo continúa sin ejecutarlo.
3. **Condicional anidado**: una decisión contiene otra. La segunda condición solo se evalúa si la primera se cumplió, lo que permite jerarquizar reglas.
4. **Ciclo `for`**: se usa cuando se conoce el número de repeticiones. Inicialización, condición y actualización viven en la cabecera.
5. **Ciclo `while`**: se repite mientras la condición sea verdadera. Es ideal cuando no se sabe cuántas iteraciones habrá; aquí termina con el centinela `0` o al agotar la lista.
6. **Función asíncrona**: `async` devuelve una `Promise`; `await` suspende la función (no el hilo principal) hasta que la promesa se resuelve. La interfaz sigue respondiendo mientras espera.
7. **Función síncrona**: devuelve el resultado de inmediato con `return`. El código que la llama se bloquea hasta obtenerlo.
8. **Combinación sync + async**: primero se valida de forma inmediata y barata; solo si los datos son válidos se lanza la operación asíncrona. Este orden evita llamadas innecesarias al servidor.

## 7. Cómo funciona el taller

### Lógica separada de la interfaz

Cada módulo de `assets/js/exercises/` exporta un objeto con esta forma:

```js
export const ejemplo = {
  meta,        // id, número, título, nivel, modo, descripción
  fields,      // campos del formulario y reglas de validación
  logic,       // función pura: recibe datos y devuelve un resultado
  toResult,    // convierte el resultado en bloques visuales
  explain,     // explicación didáctica a partir del resultado
  code,        // código fuente que se muestra
};
```

La función `logic` no toca el DOM: recibe un objeto con los datos ya validados y devuelve datos. Eso permite probarla con `node:test` y reutilizarla sin navegador.

### Código mostrado = código ejecutado

`assets/js/utils/source.js` usa `Function.prototype.toString()` para generar el bloque de código a partir de la propia función. No existe una copia del código en el HTML que pueda quedar desactualizada.

Por eso las funciones reciben **un objeto** (`{ edad }`, `{ numeros }`, etc.): la firma mostrada coincide con la forma en que el taller invoca la lógica.

### Validación

`assets/js/utils/validation.js` implementa reglas declarativas: obligatorio, mínimo, máximo, longitud, patrón, número entero, etc. Cada campo declara sus reglas en `fields` y, si hace falta una comprobación cruzada, el ejercicio define `validate()` (por ejemplo, edad coherente con el año de nacimiento o división entre cero).

Cuando hay errores:

- Se muestran junto al campo correspondiente.
- El campo recibe `aria-invalid="true"` y se enlaza con el mensaje mediante `aria-describedby`.
- La lógica **no se ejecuta**.
- El foco se mueve al primer campo inválido.

### Estados de ejecución

- **Reposo**: mensaje inicial en la zona de ejecución.
- **Cargando** (solo ejercicios asíncronos): botón deshabilitado, `aria-busy="true"` y texto «Consultando…».
- **Resultado**: bloques con los valores calculados.
- **Explicación**: pasos numerados generados a partir del resultado real.
- **Error controlado**: por ejemplo, división entre cero.

### Progreso

Al completar un ejercicio se guarda su `id` en `localStorage` con la clave `codelab.js:progress:v1`. El contador del hero y las marcas del catálogo se actualizan al instante. Si `localStorage` no está disponible, el progreso funciona solo en memoria sin romper la página.

## 8. Pruebas

```bash
pnpm test
```

Salida esperada: **11 pruebas aprobadas, 0 fallidas**. Cubren:

- Metadatos: ocho `id` y números únicos.
- Validación: campos obligatorios, correo y números.
- Ejercicio 01: cálculos y detección de edad incoherente con el año.
- Ejercicio 02: ejecución del bloque `if` con y sin mayoría de edad.
- Ejercicio 03: evaluación jerárquica de edad y nacionalidad.
- Ejercicio 04: diez filas y último producto correcto.
- Ejercicio 05: suma, conteo y respeto del centinela `0`.
- Ejercicio 06: espera real de la promesa y datos devueltos.
- Ejercicio 07: cuatro operaciones y protección de la división entre cero.
- Ejercicio 08: validación síncrona y envío asíncrono.

Las pruebas asíncronas tardan alrededor de 1,6 segundos cada una porque el ejercicio simula deliberadamente la latencia de un servidor.

## 9. Guía de prueba manual

1. Abre `http://localhost:5173`.
2. Pulsa una tarjeta del catálogo o un enlace del menú lateral del taller.
3. Pulsa **Usar datos de ejemplo** y luego **Ejecutar ejercicio**.
4. Comprueba que aparecen resultado y explicación, y que el contador de progreso sube.
5. Prueba casos límite:
   - Dejar campos vacíos y verificar que el error aparece junto al campo.
   - En el ejercicio 01, usar una edad incoherente con el año de nacimiento.
   - En el ejercicio 05, dejar la lista vacía.
   - En el ejercicio 07, dividir entre cero.
   - En el ejercicio 08, escribir un correo inválido.
6. En el ejercicio 06 observa el estado «Consultando…»: el botón se deshabilita y la interfaz sigue respondiendo.
7. Redimensiona la ventana entre 320 px y 1920 px: no debe aparecer scroll horizontal.
8. Navega solo con teclado (`Tab`, `Enter`, `Espacio`) y comprueba el enlace «Saltar al contenido principal».

## 10. Accesibilidad y responsive

- HTML semántico con `header`, `nav`, `main`, `section`, `footer` y jerarquía de encabezados.
- Enlace de salto al contenido, foco visible y navegación completa por teclado.
- Mensajes de error asociados con `aria-describedby`; regiones de resultado con `aria-live="polite"`.
- Menú móvil con `aria-expanded` y cierre con `Escape`.
- Contraste conforme a WCAG AA (Lighthouse: Accesibilidad **1.0**, Best Practices **1.0**, SEO **1.0**).
- Soporte de `prefers-reduced-motion`: se desactivan animaciones y transiciones.
- Diseño fluido verificado de 320 a 1920 px, sin desbordamiento horizontal.

## 11. Agregar un ejercicio nuevo

1. Crea `assets/js/exercises/mi-ejercicio.js` con la estructura `meta / fields / logic / toResult / explain / code`.
2. Exporta la función de lógica y envuélvela con `toSource()` para el bloque de código.
3. Impórtala en `assets/js/main.js` y agrégala al arreglo `EXERCISES` y al mapa `EXERCISE_ICONS`.
4. Añade una prueba en `tests/exercises.test.js`.
5. Ejecuta `pnpm test` y `pnpm build`.

El catálogo, el menú lateral, el progreso y el formulario se generan automáticamente a partir de los metadatos.

## 12. Decisiones técnicas

- **Tailwind compilado** en lugar de CDN: menos peso, sin parpadeo de estilos y clases purgadas.
- **Módulos ES nativos**: no hace falta bundler; el navegador carga los módulos directamente.
- **Lógica pura + adaptadores de UI**: facilita pruebas y mantiene el código didáctico.
- **`toSource()`**: elimina el riesgo de mostrar un código distinto al que se ejecuta.
- **`localStorage` con degradación elegante**: el progreso es una mejora, no un requisito para usar la plataforma.

## 13. Licencia

MIT. Autor: Daniel Garay.
