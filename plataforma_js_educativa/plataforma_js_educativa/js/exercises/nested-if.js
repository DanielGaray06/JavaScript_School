export const nestedIf = {
  id:"03", title:"Condicional anidado", category:"Condicional anidado",
  short:"Valida primero la edad y después la nacionalidad requerida.",
  description:"Un segundo if se ejecuta solamente cuando se cumple la primera condición.",
  theory:"Un condicional anidado es una estructura if ubicada dentro de otro bloque condicional. Permite evaluar reglas por niveles, donde una decisión depende del resultado de otra.",
  objective:"Organizar decisiones jerárquicas y comunicar cuál requisito no se cumple.",
  statement:"Verifica si la persona tiene 18 años o más. Solo si cumple la edad, comprueba si su nacionalidad es colombiana. El acceso se permite únicamente si ambas condiciones se cumplen.",
  fields:[{name:"age",label:"Edad",type:"number",min:0,max:120,placeholder:"Ej. 20",required:true},{name:"nationality",label:"Nacionalidad",type:"select",options:[["colombiana","Colombiana"],["otra","Otra nacionalidad"]],required:true}],
  code:`if (age >= 18) {
  if (nationality === "colombiana") {
    message = "Acceso permitido.";
  } else {
    message = "No cumples: nacionalidad requerida.";
  }
} else {
  message = "No cumples: debes tener 18 años.";
}`,
  run:(v)=>{
    const age=Number(v.age);
    if(!Number.isInteger(age)||age<0||age>120) throw new Error("Ingresa una edad entera entre 0 y 120.");
    let message,steps=["Se reciben la edad y la nacionalidad.", "Se evalúa primero si la edad es mayor o igual a 18."];
    if(age>=18){steps.push("La primera condición es verdadera; se ingresa al bloque exterior.");steps.push("Dentro del primer if se evalúa si la nacionalidad es colombiana.");if(v.nationality==="colombiana"){message="Acceso permitido. Cumples ambos requisitos.";steps.push("La segunda condición también es verdadera: se permite el acceso.");}else{message="Acceso denegado: se requiere nacionalidad colombiana.";steps.push("La segunda condición es falsa: se informa el requisito que falta.");}}
    else{message="Acceso denegado: debes tener al menos 18 años.";steps.push("La primera condición es falsa; no se evalúa el if interno.");steps.push("Se informa que no se cumple la edad mínima.");}
    return {output:message,steps};
  }
};
