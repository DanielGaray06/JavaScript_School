export const whileLoop = {
  id:"05", title:"Estructura repetitiva (while)", category:"Ciclo while",
  short:"Cuenta desde un número inicial hasta alcanzar el límite indicado.",
  description:"Repite un bloque mientras una condición continúe siendo verdadera.",
  theory:"El ciclo while evalúa su condición antes de cada iteración. Si es verdadera ejecuta el bloque; si es falsa, termina. Es importante modificar la variable de control para evitar ciclos infinitos.",
  objective:"Comprender cómo una condición controla la repetición y cómo actualizar una variable de control.",
  statement:"Solicita un número inicial y un límite. Muestra los números desde el inicio hasta el límite usando while. El inicio debe ser menor o igual al límite.",
  fields:[{name:"start",label:"Número inicial",type:"number",min:0,max:100,placeholder:"Ej. 2",required:true},{name:"limit",label:"Límite",type:"number",min:0,max:100,placeholder:"Ej. 8",required:true}],
  code:`let counter = start;
while (counter <= limit) {
  values.push(counter);
  counter++;
}`,
  run:(v)=>{
    const start=Number(v.start),limit=Number(v.limit);
    if(!Number.isInteger(start)||!Number.isInteger(limit)||start<0||limit>100||start>limit)throw new Error("Ingresa enteros entre 0 y 100; el inicio debe ser menor o igual al límite.");
    let counter=start;const values=[];while(counter<=limit){values.push(counter);counter++;}
    return {output:values.join("  →  "),steps:["Se inicializa counter con el número de inicio.", "while comprueba si counter es menor o igual al límite.", "Como la condición es verdadera, se agrega el valor actual al resultado.", "counter aumenta en uno para avanzar.", "El ciclo termina cuando counter supera el límite."]};
  }
};
