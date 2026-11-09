export const syncAsyncCombined = {
  id:"08", title:"Funciones síncronas y asíncronas", category:"Flujo combinado",
  short:"Valida datos de forma síncrona y luego simula guardar un registro.",
  description:"Combina una función normal para validar y calcular con una función async para simular una operación remota.",
  theory:"En una aplicación real se combinan ambos tipos de funciones: las síncronas resuelven tareas inmediatas y las asíncronas gestionan operaciones que pueden tardar, como consultar o guardar información en un servidor.",
  objective:"Distinguir responsabilidades síncronas y asíncronas dentro de un mismo flujo de trabajo.",
  statement:"Ingresa el nombre de un producto y su precio. Una función síncrona valida y calcula un impuesto del 19 %; después, una función asíncrona simula guardar el registro.",
  fields:[{name:"product",label:"Nombre del producto",type:"text",placeholder:"Ej. Teclado",required:true},{name:"price",label:"Precio (COP)",type:"number",min:1,max:100000000,placeholder:"Ej. 85000",required:true}],
  code:`function prepareRecord(name, price) {
  if (!name.trim() || price <= 0) throw Error("Datos inválidos");
  return { name, total: price * 1.19 };
}

async function saveRecord(record) {
  await wait(900);
  return { ...record, saved: true };
}

const record = prepareRecord(name, price);
const saved = await saveRecord(record);`,
  run:async(v)=>{
    const name=v.product.trim(),price=Number(v.price);
    function prepareRecord(productName,productPrice){if(!productName||!Number.isFinite(productPrice)||productPrice<=0)throw new Error("Datos inválidos.");return {productName,total:productPrice*1.19};}
    const record=prepareRecord(name,price);
    const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    async function saveRecord(data){await wait(900);return {...data,saved:true};}
    const saved=await saveRecord(record);
    const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);
    return {output:`Registro guardado correctamente.\nProducto: ${saved.productName}\nTotal con IVA: ${money(saved.total)}\nEstado: ${saved.saved?"Guardado (simulado)":"Pendiente"}`,steps:["La función síncrona prepareRecord recibe y valida los datos inmediatamente.", "La misma función calcula el total con IVA y retorna un objeto.", "Se invoca saveRecord, una función async que devuelve una Promise.", "await espera la finalización de la simulación de guardado.", "Se recibe la confirmación y se muestra el resultado. El guardado es simulado: no se conecta a una base de datos."]};
  }
};
