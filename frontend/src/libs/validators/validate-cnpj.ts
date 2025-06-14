export function validateCnpj(value: string): boolean {
  let cnpj = value.replace(/[^\d]+/g, ''); 
  let a: number[] = [];
  let b: number = 0;
  const c = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4 , 3, 2];

  for (let i = 0; i < 12; i++) {
    a[i] = parseInt(cnpj.charAt(i));
    b += a[i] * c[i + 1];
  }
  
  let x: number;
  if ((x = b % 11) < 2) 
    a[12] = 0;
  else  
    a[12] = 11 - x;
  
  b = 0;

  for (let y = 0; y < 13; y++)
    b += (a[y] * c[y]);
  
  if ((x = b % 11) < 2)
    a[13] = 0;
  else 
    a[13] = 11 - x;

  if ((parseInt(cnpj.charAt(12)) !== a[12]) || (parseInt(cnpj.charAt(13)) !== a[13]))
    return false;
  
  return true
}