export const sequential = {
  id: "01", title: "Estructura secuencial", category: "Secuencial",
  short: "Ejecuta instrucciones en orden y procesa datos de una persona.",
  description: "Construye un resumen personal y calcula el año aproximado en que la persona cumplirá 100 años.",
  theory: "Una estructura secuencial ejecuta las instrucciones en el orden en que están escritas. No necesita tomar decisiones ni repetir bloques para realizar su procesamiento principal.",
  objective: "Identificar la ejecución ordenada de instrucciones, el uso de variables y las operaciones aritméticas básicas.",
  statement: "Ingresa nombre, edad y año de nacimiento. El programa mostrará un resumen y calculará cuántos años faltan para cumplir 100, además del año aproximado en que ocurrirá.",
  fields: [
    {name:"name",label:"Nombre",type:"text",placeholder:"Ej. Laura",required:true},
    {name:"age",label:"Edad",type:"number",min:0,max:99,placeholder:"Ej. 22",required:true},
    {name:"birthYear",label:"Año de nacimiento",type:"number",min:1900,max:2100,placeholder:"Ej. 2004",required:true}
  ],
  code: `const yearsLeft = 100 - age;
const yearTurns100 = currentYear + yearsLeft;

const summary = \`Hola, \${name}.
Edad: \${age} años.
Año de nacimiento: \${birthYear}.
Faltan \${yearsLeft} años para cumplir 100.
Año aproximado: \${yearTurns100}.\`;`,
  run: (v) => {
    const age = Number(v.age), birthYear = Number(v.birthYear);
    if (!v.name.trim()) throw new Error("Escribe tu nombre.");
    if (!Number.isInteger(age) || age < 0 || age >= 100) throw new Error("La edad debe ser un número entero entre 0 y 99.");
    if (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > new Date().getFullYear()) throw new Error("Ingresa un año de nacimiento válido.");
    const currentYear = new Date().getFullYear();
    const yearsLeft = 100 - age;
    const yearTurns100 = currentYear + yearsLeft;
    return {
      output: `Hola, ${v.name.trim()}.\nEdad: ${age} años.\nAño de nacimiento: ${birthYear}.\nFaltan ${yearsLeft} años para cumplir 100.\nAño aproximado: ${yearTurns100}.`,
      steps: ["Se reciben el nombre, la edad y el año de nacimiento.", "Se convierten los datos numéricos para realizar operaciones.", "Se calcula 100 - edad para conocer los años restantes.", "Se suma el resultado al año actual para estimar cuándo cumplirá 100 años.", "Se construye y muestra el resumen. Esta estimación no considera si ya cumplió años en el año actual."]
    };
  }
};
