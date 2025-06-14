"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/libs/supabase/server"

type LoginProps = {
  email: string,
  password: string,
}

export async function login(props: LoginProps) {
  const { email, password } = props;
  const supabase = await createClient()

  const { error, data } = await supabase.auth.signInWithPassword({ email, password })
  const accessToken = data.session?.access_token;

  if (error)
    return { error };

  if (accessToken) {
    supabase.auth.setSession({ access_token: accessToken, refresh_token: data.session?.refresh_token });
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log(error);

    redirect("/error")
  }

  revalidatePath("/", "layout")
  redirect("/")
}