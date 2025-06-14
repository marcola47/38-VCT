export function formatCurrency(value: string | number) {
  if (value === "" || value === undefined || value === null) 
    return "";
  
  value = String(value);
  value = parseInt(value.replace(/[\D]+/g,""));

  if (value > 2147483647)
    value = 2147483647
  
  value = value + "";
  value = value.replace(/([0-9]{2})$/g, "$1");

  if (value.length === 11) 
    value = value.slice(0, -1).replace(/([0-9]{3})([0-9]{3})([0-9]{2}$)/g, ".$1.$2,$3")

  else if (value.length >= 9) 
    value = value.replace(/([0-9]{3})([0-9]{3})([0-9]{2}$)/g, ".$1.$2,$3")

  else if (value.length >= 6) 
    value = value.replace(/([0-9]{3})([0-9]{2}$)/g, ".$1,$2");

  else if (value.length === 5)
    value = value.replace(/([0-9]{3})([0-9]{2})$/g, "$1,$2");

  else if (value.length === 4)
    value = value.replace(/([0-9]{2})([0-9]{2})$/g, "$1,$2");

  else if (value.length === 3)
    value = value.replace(/([0-9]{1})([0-9]{2})$/g, "$1,$2");

  else if (value.length === 2)
    value = value.replace(/([0-9]{2})$/g, "0,$1");

  else if (value.length === 1)
    value = value.replace(/([0-9]{1})$/g, "0,0$1");

  else if (value.length <= 0)
    return "";

  return value;
}