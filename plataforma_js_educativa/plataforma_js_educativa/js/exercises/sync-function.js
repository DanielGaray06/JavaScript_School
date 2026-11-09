export const syncFunction = {
  id:"07", title:"Funciones síncronas", category:"Funciones",
  short:"Calcula el total de una compra mediante funciones que retornan resultados.",
  description:"Una función síncrona ejecuta sus instrucciones y devuelve el resultado antes de continuar con la siguiente instrucción.",
  theory:"Las funciones síncronas se ejecutan en el flujo normal del programa. Cuando se invocan, JavaScript ejecuta su cuerpo y continúa después de obtener el retorno.",
  objective:"Practicar parámetros, retorno de valores y reutilización de funciones.",
  statement:"Ingresa el precio de un producto y la cantidad. Calcula subtotal, IVA del 19 % y total utilizando funciones síncronas.",
  fields:[{name:"price",label:"Precio unitario (COP)",type:"number",min:0,max:100000000,placeholder:"Ej. 25000",required:true},{name:"quantity",label:"Cantidad",type:"number",min:1,max:10000,placeholder:"Ej. 3",required:true}],
  code:`function calculateSubtotal(price, quantity) {
  return price * quantity;
}
function calculateTax(subtotal) {
  return subtotal * 0.19;
}
function calculateTotal(subtotal, tax) {
  return subtotal + tax;
}`,
  run:(v)=>{
    const price=Number(v.price),quantity=Number(v.quantity);
    if(!Number.isFinite(price)||price<0||price>100000000)throw new Error("Ingresa un precio válido.");
    if(!Number.isInteger(quantity)||quantity<1||quantity>10000)throw new Error("La cantidad debe ser un entero entre 1 y 10.000.");
    function calculateSubtotal(p,q){return p*q;}function calculateTax(s){return s*.19;}function calculateTotal(s,t){return s+t;}
    const subtotal=calculateSubtotal(price,quantity),tax=calculateTax(subtotal),total=calculateTotal(subtotal,tax);
    const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);
    return {output:`Subtotal: ${money(subtotal)}\nIVA (19 %): ${money(tax)}\nTOTAL: ${money(total)}`,steps:["Se reciben el precio unitario y la cantidad.", "calculateSubtotal recibe ambos parámetros y retorna precio × cantidad.", "calculateTax recibe el subtotal y retorna el 19 %.", "calculateTotal suma el subtotal y el impuesto.", "Cada función termina su cálculo antes de que la siguiente instrucción continúe."]};
  }
};
