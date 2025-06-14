"use client"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { AuthError } from "@supabase/supabase-js"
import { toast } from "sonner"

import { createClient } from "@/libs/supabase/client"
import { Btn, Input } from "@/app/components"

import s from "./style.module.scss"

export function Form() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const loginMutation = useMutation<void, AuthError>({
    mutationFn: handleLogin,
  });
  
  return (
    <form 
      className={ s.form }
      onSubmit={
        e => {
          e.preventDefault();
          loginMutation.mutate();
        }
      }
    >      
      <Input
        type="email"
        name="email"
        id={ s.email }
        value={ email }
        setValue={ setEmail }
        label="Email"
        color="blue"
      />

      <Input
        type="password"
        name="password"
        id={ s.password }
        value={ password }
        setValue={ setPassword }
        label="Senha"
        color="blue"
      />

      <Btn
        type="submit"
        loading={ loginMutation.isPending }
        disabled={ loginMutation.isSuccess }
        color="white"
        bgColor="blue"
        text="ENTRAR"
      />      
    </form>
  )

  async function handleLogin() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Email ou senha inválidos. Verifique seus dados e tente novamente.")
      throw new AuthError(error.message);
    } else {
      window.location.href = "/";
    }
  }
}