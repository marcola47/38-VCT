export function formatCep(value: string): string {
  let cep = value.replace(/\D/g, "");
  
  if (cep.length > 5)
    cep = cep.replace(/(\d{5})(\d{1,3}).*/, "$1-$2");
  
  else
    cep = cep.replace(/(\d{1,5})/g, "$1");
  
  return cep;
}

export function formatUf(value: string): string {
  return value.slice(0, 2).replace(/[^a-zA-Z]/g, "").toUpperCase();
}