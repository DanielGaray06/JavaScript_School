export const simpleIf = {
  id:"02", title:"Condicional simple (if)", category:"Condicional",
  short:"Evalúa si una persona cumple el requisito de mayoría de edad.",
  description:"El programa evalúa la edad y muestra un mensaje según el resultado de la condición.",
  theory:"La sentencia if ejecuta un bloque cuando su condición se evalúa como verdadera. Si la condición es falsa, el bloque no se ejecuta. En este ejercicio se utiliza if y una salida alternativa.",
  objective:"Comprender una expresión relacional y cómo una condición controla el flujo del programa.",
  statement:"Solicita la edad de una persona. Si tiene 18 años o más, indica que es mayor de edad; de lo contrario, informa que no cumple el requisito.",
  fields:[{name:"age",label:"Edad",type:"number",min:0,max:120,placeholder:"Ej. 19",required:true}],
  code:`if (age >= 18) {
  message = "Eres mayor de edad.";
} else {
  message = "No cumples el requisito de edad.";
}`,
  run:(v)=>{
    const age=Number(v.age);
    if(!Number.isInteger(age)||age<0||age>120) throw new Error("Ingresa una edad entera entre 0 y 120.");
    const isAdult=age>=18;
    return {output:isAdult?"Eres mayor de edad. Cumples el requisito.":"No cumples el requisito: necesitas tener al menos 18 años.",steps:["Se recibe la edad ingresada.", "Se evalúa la condición edad >= 18.", isAdult?"La condición es verdadera, por eso se ejecuta el bloque del if.":"La condición es falsa, por eso se ejecuta el bloque alternativo else.", "Se muestra el mensaje correspondiente."]};
  }
};
