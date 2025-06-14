export function formatPhone(value: string): string {
  let phone = value.replace(/\D/g, "");
  phone = phone.replace(/^0/, "");
  
  if (phone.length > 10) 
    phone = phone.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
  
  else if (phone.length > 5) 
    phone = phone.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  
  else if (phone.length > 2) 
    phone = phone.replace(/^(\d\d)(\d{0,5})/, "($1) $2");

  else 
    phone = phone.replace(/^(\d*)/, "$1");
  
  return phone;
}