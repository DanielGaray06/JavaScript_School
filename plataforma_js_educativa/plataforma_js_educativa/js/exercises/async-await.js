export const asyncAwait = {
  id:"06", title:"Funciones asíncronas (async/await)", category:"Asincronía",
  short:"Simula una consulta de datos que tarda en responder.",
  description:"Utiliza async y await para esperar una operación asíncrona sin bloquear la lectura del flujo.",
  theory:"Una función async siempre devuelve una Promise. await pausa la ejecución de esa función hasta que la Promise se resuelve o rechaza; no bloquea todo el navegador.",
  objective:"Identificar la diferencia entre iniciar una tarea asíncrona y esperar su resultado con await.",
  statement:"Ingresa el nombre de un estudiante. El programa simulará una consulta de perfil con una demora y mostrará los datos recibidos.",
  fields:[{name:"student",label:"Nombre del estudiante",type:"text",placeholder:"Ej. Andrés",required:true}],
  code:`async function loadStudent(name) {
  await wait(1000);
  return { name, status: "Perfil encontrado" };
}

const student = await loadStudent(name);`,
  run:async(v)=>{
    const name=v.student.trim();if(name.length<2)throw new Error("Escribe un nombre de al menos dos caracteres.");
    const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
    const timeline=["Se inicia la consulta del perfil..."];await wait(900);
    const student=await Promise.resolve({name,status:"Perfil encontrado",course:"Fundamentos de JavaScript"});
    return {output:`Consulta completada.\nNombre: ${student.name}\nEstado: ${student.status}\nCurso: ${student.course}`,steps:["Se llama a una función declarada con async.", "La función inicia una operación que devuelve una Promise.", "await espera a que la Promise se resuelva antes de continuar dentro de esa función.", "Se recibe el objeto con los datos del estudiante.", "La interfaz presenta el resultado cuando la función asíncrona termina."]};
  }
};
