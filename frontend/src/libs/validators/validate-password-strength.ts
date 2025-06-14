import { formatNumberOnly } from "@/libs/formatters";

export function validatePasswordStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (password.length > 0 && password === formatNumberOnly(password)) 
    return 0; 
  
  else if (password.length > 14) 
    return 4; 
  
  else if (password.length > 11) 
    return 3; 
  
  else if (password.length > 7) 
    return 2; 
  
  else 
    return 1;
}