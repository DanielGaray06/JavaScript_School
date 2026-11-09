export const forLoop = {
  id:"04", title:"Estructura repetitiva (for)", category:"Ciclo for",
  short:"Genera la tabla de multiplicar de un número usando un ciclo for.",
  description:"Repite una operación un número conocido de veces y muestra cada resultado.",
  theory:"El ciclo for se utiliza cuando conocemos o podemos establecer cuántas iteraciones necesitamos. Tiene inicialización, condición y actualización.",
  objective:"Reconocer las tres partes de un for y controlar la cantidad de repeticiones.",
  statement:"Solicita un número y muestra su tabla de multiplicar desde el 1 hasta el 10 utilizando for.",
  fields:[{name:"number",label:"Número para la tabla",type:"number",min:-1000,max:1000,placeholder:"Ej. 7",required:true}],
  code:`for (let i = 1; i <= 10; i++) {
  const result = number * i;
  lines.push(\`\${number} x \${i} = \${result}\`);
}`,
  run:(v)=>{
    const n=Number(v.number);if(!Number.isFinite(n)||n < -1000||n>1000)throw new Error("Ingresa un número entre -1000 y 1000.");
    const lines=[];for(let i=1;i<=10;i++)lines.push(`${n} × ${i} = ${n*i}`);
    return {output:lines.join("\n"),steps:["Se recibe el número base.", "Se inicializa i en 1.", "Se comprueba la condición i <= 10.", "Se multiplica el número base por i y se agrega la línea al resultado.", "Se incrementa i en una unidad y se repite hasta que la condición sea falsa."]};
  }
};
