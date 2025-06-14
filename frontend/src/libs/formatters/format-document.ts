export function formatCpf(value: string) : string {
  let cpf = value.replace(/\D/g, "");
  
  if (cpf.length > 9)
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
  
  else if (cpf.length > 6)
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3}).*/, "$1.$2.$3");
  
  else
    cpf = cpf.replace(/(\d{3})(\d{1,3})/g, "$1.$2");
  
  return cpf;
}

export function formatCnpj(value: string) {
  let cnpj = value.replace(/\D/g, "");

  if (cnpj.length > 12)
    cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2}).*/, "$1.$2.$3/$4-$5");

  else if (cnpj.length > 8)
    cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4}).*/, "$1.$2.$3/$4");

  else if (cnpj.length > 5)
    cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3");
  
  else
    cnpj = cnpj.replace(/^(\d{2})(\d{1,3})/, "$1.$2");

  return cnpj;
}