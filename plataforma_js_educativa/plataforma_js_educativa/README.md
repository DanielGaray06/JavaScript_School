# CodeLab — Plataforma educativa de JavaScript

Plataforma web educativa para practicar ocho estructuras fundamentales de programación con HTML5, Tailwind CSS y JavaScript nativo.

## Requisitos

- Navegador moderno (Chrome, Edge, Firefox o Safari).
- Conexión a internet para cargar Tailwind CSS desde CDN y las fuentes de Google Fonts.
- No requiere Node.js para ejecutar esta versión.

## Cómo ejecutar

1. Descomprime el archivo ZIP.
2. Abre la carpeta `plataforma_js_educativa`.
3. Abre `index.html` en el navegador.

Si el navegador restringe módulos ES al abrir el archivo directamente, ejecuta un servidor local desde la carpeta del proyecto:

```bash
python -m http.server 8000
```

Después visita `http://localhost:8000`.

También puedes usar la extensión **Live Server** de Visual Studio Code.

## Estructura del proyecto

```text
plataforma_js_educativa/
├── index.html
├── README.md
├── css/
│   └── styles.css
└── js/
    ├── app.js
    └── exercises/
        ├── index.js
        ├── sequential.js
        ├── simple-if.js
        ├── nested-if.js
        ├── for-loop.js
        ├── while-loop.js
        ├── async-await.js
        ├── sync-function.js
        └── sync-async-combined.js
```

## Ejercicios incluidos

1. Estructura secuencial: resumen personal y cálculo aproximado de los 100 años.
2. Condicional simple: mayoría de edad.
3. Condicional anidado: edad y nacionalidad requerida.
4. Ciclo `for`: tabla de multiplicar del 1 al 10.
5. Ciclo `while`: contador desde un inicio hasta un límite.
6. `async/await`: consulta simulada de perfil de estudiante.
7. Funciones síncronas: subtotal, IVA del 19 % y total de una compra.
8. Funciones síncronas y asíncronas: validación/cálculo y guardado simulado.

## Decisiones y límites

- Los ejercicios 1, 2 y 3 siguen los enunciados proporcionados.
- En el documento recibido no aparecían los enunciados completos de los ejercicios 4 al 8. Para entregar una plataforma completa, se propusieron ejercicios didácticos coherentes con cada estructura solicitada. Se pueden reemplazar cuando se comparta el enunciado original.
- El año en que se cumplirán 100 años es una estimación basada en la edad y el año actual; no conoce la fecha exacta de cumpleaños.
- El ejercicio 6 simula una consulta asíncrona.
- El ejercicio 8 simula el guardado; no utiliza una API ni una base de datos.
- Tailwind CSS se carga mediante Play CDN para facilitar la puesta en marcha. Para producción se recomienda compilar Tailwind con CLI y servir los archivos CSS localmente.

## Arquitectura

- `index.html`: estructura semántica y puntos de montaje de la interfaz.
- `css/styles.css`: estilos personalizados, estados visuales y ajustes responsive.
- `js/app.js`: navegación, renderizado de formularios, validación visual y ejecución.
- `js/exercises/`: cada ejercicio contiene sus metadatos, campos, código de referencia y función `run()` independiente.
- `js/exercises/index.js`: registro central de ejercicios.

## Seguridad

Los resultados se muestran como texto mediante `textContent`; el código de los ejercicios no se evalúa con `eval()` ni `new Function()`. Los ejercicios ejecutan funciones JavaScript definidas en módulos.
