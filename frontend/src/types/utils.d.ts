import React from "react";

declare global {
  type RequireOnly<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;  
  type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

  type OptionCustom = Option & {
    customValue?: string | number,
  }
  
  type OptionStateless = Option & {
    parameterName?: string,
    hasIcon?: boolean,
  }


  type User = {
    id: string,
    name: string,
    email: string,
    password: string | null
  }
}

export {};